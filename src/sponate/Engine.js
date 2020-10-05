import Class from '../ext/Class';
import ListServiceUtils from './ListServiceUtils';
import AccUtils from './AccUtils';
import HashMap from '../util/collection/HashMap';
import HashSet from '../util/collection/HashSet';
import LookupServiceUtils from './LookupServiceUtils';
import ListServiceUtils from './ListServiceUtils';
import ListServiceTransformItems from '../service/list_service/ListServiceTransformItems';
import ObjectUtils from '../util/ObjectUtils';
import Slot from '../util/Slot';

// var _ = require('lodash');
import forEach from 'lodash.foreach';

import shared from '../util/shared';
var Promise = shared.Promise;
import PromiseUtils from '../util/PromiseUtils';


var Engine = {
    indexAccMap : function(state, sourceName, nodeToAcc) {
        var map = state[sourceName];
        if (!map) {
            map = new HashMap();
            state[sourceName] = map;
        }

        map.putMap(nodeToAcc);
    },

    mergeRefs : function(open, refs) {
        refs.forEach(function(ref) {
            var refSpec = ref.getRefSpec();
            var sourceName = refSpec.getTarget();
            var refValue = ref.getRefValue();

            var set;
            if (!(sourceName in open)) {
                set = new HashSet();
                open[sourceName] = set;
            } else {
                set = open[sourceName];
            }

            set.add(refValue);
        });
    },

    // Return a new array of refs that are not already covered by the state
    // i.e. only return those refs which still need to be resolved
    filterRefs : function(state, refs) {
        var result = [];

        refs.forEach(function(ref) {
            var refSpec = ref.getRefSpec();
            var sourceName = refSpec.getTarget();
            var refValue = ref.getRefValue();

            var map = state[sourceName];

            var isResolved = map && map.containsKey(refValue);
            if (!isResolved) {
                result.push(ref);
            }
        });

        return result;
    },

    buildObjs : function(state) {
        var result = {};

        // Retrieve the value of each acc and extend the original object with it
        // At this point we do not resolve references yet
        forEach(state, function(srcMap, sourceName) {

            var objMap = new HashMap();
            result[sourceName] = objMap;

            srcMap.entries().forEach(function(entry) {
                var id = entry.key;
                var acc = entry.val;

                var val = acc.getValue();
                objMap.put(id, val);
            });
        });

        return result;
    },

    /**
     * For each object retrieve its lazy slots and reverse the order, so that
     * we can evaluate the lazy functions in a depth first manner (i.e. parent lazy transform
     * will only be executed after the child transforms have been applied)
     */

    // FIXME This is bugged, because the system does not descend into the lazy slots objects
    // So nested transformations break
    buildLazySlots: function(sourceToIdtoObj, attr, result, descend) {
        result = result || [];

        forEach(sourceToIdtoObj, function(srcMap, sourceName) {
            srcMap.values().forEach(function(obj) {
                var tmp = Engine.buildSlots(obj, attr, null, descend);
                tmp = tmp.reverse();
                result.push.apply(result, tmp);
            });
        });

        return result;
    },

    // descend: whether to descend into slots once they were found
    buildSlots: function(obj, attr, result, descend) {
        result = result || [];

        if (Array.isArray(obj)) {

            obj.forEach(function(item, index) {
                var isSlot = item && item[attr];
                if(isSlot) {
                    var slot = new Slot(obj, index, item[attr]);
                    result.push(slot);
                }

                if(!isSlot || descend) {
                    Engine.buildSlots(item, attr, result, descend);
                }
            });

        } else if (ObjectUtils.isObject(obj)) {

            forEach(obj, function(v, k) {
                var isSlot = v && v[attr];
                if (isSlot) {
                    var slot = new Slot(obj, k, v[attr]);
                    result.push(slot);
                }

                if(!isSlot || descend) {
                    Engine.buildSlots(v, attr, result, descend);
                }
            });

        } /*
             * else { // Nothing to do }
             */

        return result;
    },

    createLookupService : function(decls, sourceName) {
        var source = decls.getSource(sourceName);
        if (!source) {
            throw new Error('No source mapping with name ' + sourceName
                    + ' found');
        }

        var sparqlService = source.getSparqlService();
        var mappedConcept = source.getMappedConcept();
        var result = LookupServiceUtils.createLookupServiceMappedConceptAcc(
                sparqlService, mappedConcept);
        return result;
    },

    createListService : function(decls, sourceName, isLeftJoin) {

        // var sourceName = query.getSourceName();

        var source = decls.getSource(sourceName);
        if (!source) {
            throw new Error('No source mapping with name ' + sourceName
                    + ' found');
        }

        var sparqlService = source.getSparqlService();
        var mappedConcept = source.getMappedConcept();

        if(mappedConcept.getConcept().getVar().getName() === 'rowId') {
            throw new Error('rowId cannot be used as the root ID of a MappedConcept');
        }

        var listServiceAcc = ListServiceUtils.createListServiceAcc(
                sparqlService, mappedConcept, isLeftJoin);

        var self = this;

        var result = new ListServiceTransformItems(listServiceAcc, function(accEntries) {
            //var collectedState = self.collectState(decls, sourceName, accEntries);

            var r =
                self.collectState(decls, sourceName, accEntries)
                .spread(function(rootIds, state, p) {
                    var s = self.postProcess(state, sourceName, rootIds);
                    return s;
                });

            return r;
        });

        return result;
    },

    collectState : function(decls, sourceName, accEntries) {
        // Do the initial concept based lookup
        var state = {};

        // Get the initial ids
        var rootIds = accEntries.map(function(accEntry) { // TODO We could use
                                                            // _.pluck here
            return accEntry.key;
        });

        // Collect the accs
        var map = new HashMap();
        var open = {};

        accEntries.forEach(function(accEntry) {
            var acc = accEntry.val;

            // Note: We expect instances of AccMap here!
            var state = acc.getState();

            map.putMap(state);

            var refs = AccUtils.getRefs(acc);

            Engine.mergeRefs(open, refs);
        });

        // console.log('OPEN: ' + JSON.stringify(open, null, 4));

        state[sourceName] = map;
        var result = this.resolveRefs(decls, open, state).then(function(p) {
            var r = [ rootIds, state, p ];
            return r;
        });

        return result;
    },

    postProcess : function(state, sourceName, rootIds) {

        // Retain all references
        var accRefs = [];
        forEach(state, function(srcMap) {
            var accs = srcMap.values();
            var refs = AccUtils.getRefs(accs);

            accRefs.push.apply(accRefs, refs);
        });

        //console.log('AccRefs: ', accRefs);

        accRefs.forEach(function(accRef) {
            var refSpec = accRef.getRefSpec();
            var targetName = refSpec.getTarget();
            var refValue = accRef.getRefValue();

            accRef.setBaseValue({
                _ref : {
                    targetName : targetName,
                    refValue : refValue,
                    attr : refSpec.getAttr()
                }
            });
        });

        var sourceToIdToObj = Engine.buildObjs(state);

        //try {
        var refSlots = Engine.buildSlots(sourceToIdToObj, '_ref');

        var lazySlots = Engine.buildLazySlots(sourceToIdToObj, '_lazy', null, true);

//        } catch(err) {
//            console.log('err: ', err);
//        }
        //console.log('Got ' + slots.length + ' slots');

        refSlots.forEach(function(slot) {
            var meta = slot.getMeta();

            var idToObj = sourceToIdToObj[meta.targetName];
            var obj = idToObj.get(meta.refValue);

            var attr = meta.attr;
            obj = (obj != null && attr != null) ? obj[attr] : obj;

            //console.log('SLOT: ' + meta + ' ' + meta.attr + ' ' + obj);

            slot.setValue(obj);
        });


        lazySlots.forEach(function(slot) {
            var meta = slot.getMeta();

            var fn = meta.fn;
            var v = meta.value;

            var replacement = fn(v);
            slot.setValue(replacement);
        });

        // Apply lazy functions
       //var slots = Engine.buildSlots(sourceToIdToObj, '_lazy');

        // Prepare the result
        var result = rootIds.map(function(rootId) {
            var idToObj = sourceToIdToObj[sourceName];
            var obj = idToObj.get(rootId);
            var r = {
                key : rootId,
                val : obj
            };
            return r;
        });

        return result;
    },

    exec: function(decls, query) {
        var sourceName = query.getSourceName();
        var listService = this.createListService(decls, sourceName, query
                .isLeftJoin());

        var limit = query.getLimit();
        var offset = query.getOffset();
        var filterConcept = query.getFilterConcept();

        var result = listService.fetchItems(filterConcept, limit, offset);

        return result;
    },

    /**
     * open is a Map<SourceName, Set<ObjectId>> state is a Map<SourceName,
     * Map<ObjectId, Document>>
     */
    resolveRefs: function(decls, open, state) {

        var self = this;
        var sourceNames = Object.keys(open);

        // console.log('SOURCE NAMES: ', sourceNames);

        var subPromises = sourceNames.map(function(sourceName) {

            // console.log('XXXNAMES: ' + sourceName);

            var set = open[sourceName];

            var lookupService = self.createLookupService(decls, sourceName);
            var nodes = set.entries();

            var subPromise = lookupService.lookup(nodes).then(function(nodeToAcc) {
                var accs = nodeToAcc.values();
                // console.log('accs: ' + JSON.stringify(accs));
                // if(true) { throw new Error('foo'); }

                Engine.indexAccMap(state, sourceName, nodeToAcc);
                var refs = AccUtils.getRefs(accs);
                var openRefs = Engine.filterRefs(state, refs);
                var next = {};
                Engine.mergeRefs(next, openRefs);

                var r = self.resolveRefs(decls, next, state);
                return r;
            });

            return subPromise;
        });

        return PromiseUtils.all(subPromises);
    },

};

export default Engine;
