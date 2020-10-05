import NodeUtils from '../rdf/NodeUtils';
import HashMap from '../util/collection/HashMap';
import MappedConceptUtils from './MappedConceptUtils';
import BestLabelConfig from '../sparql/BestLabelConfig';
import StoreFacade from './facade/StoreFacade';
import LookupServiceListServiceSparql from '../service/lookup_service/LookupServiceListServiceSparql';


var RexUtils = {

    /**
     * TODO Probably not the best place to put this method, but it has to go
     * somewhere
     *
     * @param sparqlService
     * @returns {jassa.service.LookupServiceListServiceSparql}
     */
    createRexLookupService: function(sparqlService) {

        var store = new StoreFacade(sparqlService, {
//            'rdf': 'http://www.w3.org/1999/02/22-rdf-syntax-ns#',
//            'llo': 'http://www.linklion.org/ontology#'
        });

        var bestLiteralConfig = new BestLabelConfig(); //['ja', 'ko', 'en', '']);
        var mappedConcept = MappedConceptUtils.createMappedConceptBestLabel(bestLiteralConfig);


        var indexResource = function(map) {
            var result = {};

            var subjects = map.entries();
            subjects.forEach(function(entry) {
                var subjectIri = entry.key;
                var predicates = entry.val.predicates.entries();

                var s = result[subjectIri] = {};


                predicates.forEach(function(entry) {
                    var predicateIri = entry.key;

                    var p = s[predicateIri] = {};

                    var objects = entry.val.values.entries();
                    objects.forEach(function(entry) {
                        var node = entry.val.id;
                        var json = NodeUtils.toTalisRdfJson(node);
                        p.push(json);
                    });
                });
            });
        };

        var toMap = function(arr) {
            //console.log('ARGH', arr);
            var result = new HashMap();
            arr.forEach(function(item) {
                result.put(item.id, item);
            });
            return result;
        };

        var toTalisRdfJson = function(items) {
            var result = items.map(function(item) {
                var r = NodeUtils.toTalisRdfJson(item.id);
                return r;
            });
            return result;
        };


        /*
        store.addMap({
            name: 'spo',
            template: [{
                id: '?s',
                displayLabel: { $ref: { target: mappedConcept, attr: 'displayLabel' }},
                predicates: [[{
                    id: '?p',
                    displayLabel: { $ref: { target: mappedConcept, attr: 'displayLabel', on: '?p' }},
                    values: [[{
                        id: '?o | node',
                        displayLabel: { $ref: { target: mappedConcept, attr: 'displayLabel', on: '?o' }}
                    }], toTalisRdfJson],
                }], toMap],
            }],
            from: '?s ?p ?o',
        });
        */



        var changeIndex = function(triples) {
            var spToCount = {};

            var result = new HashMap();
            //var result = {};


            triples.forEach(function(triple) {
                var sp = triple.s + ' ' + triple.p;
                var i = spToCount[sp] = (spToCount[sp] || 0);
                ++spToCount[sp];

                var json = NodeUtils.toTalisRdfJson(triple.o);

                var attrs = Object.keys(json);
                attrs.forEach(function(attr) {
                    var key = {
                        s: triple.s,
                        p: triple.p,
                        i: i,
                        c: attr,
                    };

                    var val = json[attr];

                    result.put(key, val);
                });
            });

//             var assembled = assembleTalisRdfJson(result);
//             console.log('Assembled: ', assembled);

            return result;
        };


        store.addMap({
            name: 'spo',
            template: [{
                id: '?s',
                data: [[{
                    id: '?rowId',
                    s: '?s',
                    p: '?p',
                    o: '?o | node'
                }], changeIndex]
            }],
            from: '?s ?p ?o',
        });

        var ls = store.spo.getListService();

        var lookupService = new LookupServiceListServiceSparql(ls);

        return lookupService;
    }
};

export default RexUtils;
