import uniq from 'lodash.uniq';
import Class from '../ext/Class';
import ObjectUtils from '../util/ObjectUtils';
import NodeUtils from '../rdf/NodeUtils';
import Node from '../rdf/node/Node';
import Var from '../rdf/node/Var';
import NodeFactory from '../rdf/NodeFactory';
import Expr from '../sparql/expr/Expr';
import ExprVar from '../sparql/expr/ExprVar';
import NodeValue from '../sparql/expr/NodeValue';
import NodeValueUtils from '../sparql/NodeValueUtils';
import AggLiteral from './agg/AggLiteral';

//var AggObject = require('./agg/AggObject');
import AggObjectCustom from './agg/AggObjectCustom';

import AggMap from './agg/AggMap';
import AggCustomAgg from './agg/AggMap';
import AggRef from './agg/AggRef';
import AggArray from './agg/AggArray';
import AggArrayStatic from './agg/AggArrayStatic';
import AggTransform from './agg/AggTransform';
import AggTransformLazy from './agg/AggTransformLazy';
import AggUtils from './AggUtils';
import RefSpec from './RefSpec';
import BindingMapperExpr from './binding_mapper/BindingMapperExpr';

// var AccFactoryFn = require('./AccFactoryFn');

/**
 * A 'template' is a type of specification for an aggregator
 *
 */
var TemplateParser = Class.create({

    initialize: function() {
        this.attrs = {
            id: 'id',
            ref: '$ref',
        };
    },

    /**
     * An array can indicate each of the following meanings:
     *  - [ string ] If the argument is a string, we have an array of literals,
     * whereas the string will be interpreted as an expression.
     *  - [ object ]
     *
     * If the argument is an object, the following intepretation rules apply:
     *  - If there is an 'id' attribute, we interpret it as an array of objects,
     * with the id as the grouping key, and a subAgg corresponding to the object [{
     * id: '?s' }]
     *  - If there is a 'ref' attribute, we intepret the object as a
     * specification of a reference
     *
     *  - If neither 'id' nor 'ref' is specified ... TODO i think then the
     * object should be interpreted as some kind of *explicit* specification,
     * wich 'id' and 'ref' variants being syntactic sugar for them
     *
     */
    parseArray: function(val) {
        var self = this;

        // Check if the last argument of the array is function
        var lastItem = val[val.length - 1];
        var isFn = ObjectUtils.isFunction(lastItem);

        var result;
        if(isFn) {
            result = this.parseArrayTransform(val);
        } else {


            // If none of the elements in the array has an id or $ref attribute, then we have a static array
            // TODO We could support objects that have a static (variable-free) id attribute

            var isDynamic = val.some(function(item) {
                var r = item.id || item.$ref || ObjectUtils.isString(item);
                return r;
            });

            result = !isDynamic
                ? this.parseArrayStatic(val)
                : this.parseArrayDynamic(val);

    //        result = this.parseArrayDynamic(val);
        }

        return result;
    },

    parseArrayTransform: function(arr) {
        var l = arr.length - 1;
        var fn = arr[l];

        var self = this;
        var argArr = arr.slice(0, l);
        var subAggs = argArr.map(function(item) {
            var r = self.parseAgg(item);
            return r;
        });

        var arrayAgg = new AggArrayStatic(subAggs);

        var result = new AggTransformLazy(arrayAgg, function(args) {
            var r = fn.apply(null, args);
            return r;
        });

        return result;
    },

    parseArrayStatic: function(arr) {
        var self = this;

        // Assume a 'static' array
        var tmp = arr.map(function(item) {
            var r = self.parseAgg(item);
            return r;
        });

        var result = new AggArrayStatic(tmp);

        return result;
    },

    parseArrayDynamic: function(val) {

        if (val.length !== 1) {
            throw new Error('[ERROR] Arrays must have exactly one element that is either a string or an object', val);
        }

        var config = val[0];

        var result;
        if (ObjectUtils.isString(config)) {

            result = this.parseArrayLiteral(config);

        } else if (Array.isArray(config)) {
            if(config.length === 1) {
                var subConfig = config[0];
                // We encountered [[ ]], which indicates an associative array
                result = this.parseArrayConfig(subConfig);

                // If the subConfig only contains the elements id and $value, we
                // turn it into a 'plain' map

                var keys = Object.keys(subConfig);
                var isPlainMap = keys.length === 2 && keys.indexOf('id') >=0 && keys.indexOf('$value') >= 0;
                // console.log('IS PLAIN MAP', isPlainMap);
                result = new AggTransform(result, function(arr) {
                    var r = {};
                    arr.forEach(function(item) {
                        r[item.id] = isPlainMap
                            ? item.$value
                            : item;
                    });
                    return r;
                });

            } else {
                throw new Error('Not implemented');
            }

        } else if (ObjectUtils.isObject(config)) {

            result = this.parseArrayConfig(config);

        } else {
            throw new Error('Bailing out');
        }

        return result;
    },


    parseArrayConfig: function(config) {

        var idAttr = this.attrs.id;
        var refAttr = this.attrs.ref;

        var hasId = config[idAttr] != null;
        var hasRef = config[refAttr] != null;

        if (hasId && hasRef) {
            throw new Error('[ERROR] id and ref are mutually exclusive');
        }

        var result;
        if (hasId) {

            var subAgg = this.parseObject(config);
            // console.log(config, JSON.stringify(subAgg));

            // Expects a AggLiteral with a BindingMapperExpr
            var attrToAgg = subAgg.getAttrToAgg();
            var idAgg = attrToAgg[idAttr];

            // TODO This is more like a hack - we should ensure in advance that
            // ID attributes do not make use of transformations
            idAgg = AggUtils.unwrapAggTransform(idAgg);

            var idBm = idAgg.getBindingMapper();
            // var idExpr = bm.getExpr();
            result = new AggMap(idBm, subAgg);


            result = new AggTransform(result, function(map) {
                // var map = acc.getValue();
                return map.values();
            });


        } else if (hasRef) {
            result = this.parseArrayRef(config);
        } else {
            throw new Error('[ERROR] Not implemented');
        }

        return result;
    },

    /**
     * Here we only keep track that we encountered a reference. We cannot
     * validate it here, as we lack information
     *
     *
     */
    parseArrayRef: function(config) {
        var ref = config[this.attrs.ref];
        // We need to get the 'on' expr of the reference
        var aggRef = this.parseRef(ref);
        var idBm = aggRef.getBindingMapper();
        var result = new AggMap(idBm, aggRef);

        result = new AggTransform(result, function(map) {
            return map.values();
        });

        return result;
    },

    parseArrayLiteral: function(exprStr) {
        // var expr = this.parseExprString(exprStr);
        var aggLiteral = this.parseLiteral(exprStr);

        var result =
            new AggTransform(
                new AggArray(aggLiteral),
                function(arr) { return uniq(arr, function(x) { return '' + x; });});

        return result;
    },

    parseLiteral: function(val) {
        var items = val.split('|').map(function(item) { return item.trim(); });
        var exprStr = items[0];

        var expr = this.parseExprString(exprStr);

        var result = new AggLiteral(new BindingMapperExpr(expr));

        var options = items[1];
        if(options !== 'node') {
            result = new AggTransform(result, NodeUtils.getValue);
        }

        return result;
    },

    /**
     * An object is an entity having a set of fields, whereas fields can be of
     * different types
     *
     */
    parseObject: function(val) {

        var ref = val[this.attrs.ref];

        var result = ref != null
            ? this.parseRef(ref)
            : this.parseObjectData(val)
            ;

        return result;
    },

    parseRef: function(val) {
        var target = val.target;
        if(!target) {
            throw new Error('Missing target attribute in ref: ', val);
        }

        var refSpec = new RefSpec(target, val.attr);
        var onStr = val.on;

        var bindingMapper = null;
        if(onStr) {
            var joinExpr = this.parseExprString(onStr);
            bindingMapper = new BindingMapperExpr(joinExpr);
        }

        var result = new AggRef(bindingMapper, refSpec);
        // console.log('PARSED REF SPEC: ' + JSON.stringify(refSpec), val.attr);

        return result;
    },

    parseObjectData: function(val) {
        var attrToAgg = {};

        var self = this;
        var attrs = Object.keys(val);
        attrs.forEach(function(attr) {
            var v = val[attr];
            var subAgg = self.parseAgg(v);

            if(subAgg == null) {
                throw new Error('Failed to create aggregator for attribute [' + attr + '] in ' + JSON.stringify(val));
            }

            attrToAgg[attr] = subAgg;
        });

        var result = new AggObjectCustom(attrToAgg, this);

        return result;
    },

// parseAgg: function(fieldName, val) {
// // if the value is an array, create an array field
// // TODO An array field can be either an array of literals or of objects
// // How to represent them?
// // Maybe we could have Object and Literal Fields plus a flag whether these
// are arrays?
// // So then we wouldn't have a dedicated arrayfield.
// // if the value is an object, create an object reference field
//
// // friends: ArrayField(
// },

    parseAgg: function(val) {

        // console.log('PARSING: ' + JSON.stringify(val));

        var result;

        if (ObjectUtils.isString(val)) {
            result = this.parseLiteral(val);
        } else if (Array.isArray(val)) {
            result = this.parseArray(val);
        } else if (ObjectUtils.isFunction(val)) {
            //result = this.parseAggSupplier(val);
            throw new Error('Implement this case: ' + JSON.stringify(val));
            // result = new AggCustomAgg(new AccFactoryFn(val));
        } else if (val instanceof Node && val.isVariable()) {
            var expr = new ExprVar(val);
            result = new AggLiteral(new BindingMapperExpr(expr));
        } else if (val instanceof Expr) {
            result = new AggLiteral(new BindingMapperExpr(val));
        } else if (ObjectUtils.isObject(val)) {
            var fnCustomAggFactory = val.createAgg;
            if (fnCustomAggFactory) {
                result = new AggCustomAgg(val);
                // console.log('aggregator support not implemented');
                // throw 'Bailing out';
            } else {
                result = this.parseObject(val);
            }
        } else {
            console.log('[ERROR] Unknown item type: ', val);
            throw new Error('Unkown item type');
        }

        return result;
    },

    parseExpr: function(obj) {
        var result;

        if (ObjectUtils.isString(obj)) {
            result = this.parseExprString(obj);
        } else if(obj instanceof Node && obj.isVariable()) {
            result = new ExprVar(obj);
        } else {
            throw new Error('Could not parse expression: ', obj);
        }

        return result;
    },

    parseExprString: function(str) {
        var result;

        var c = str.charAt(0);

        if (c === '?') {
            var varName = str.substr(1);
            var v = NodeFactory.createVar(varName);
            result = new ExprVar(v);

        } else if(c === '"' || c === '\'') {
            // TODO Check for properly closed string
            result = str.substring(1, str.length - 1);

            result = NodeValueUtils.makeString(result);
        } else {
            result = NodeValueUtils.makeString(str);
            // TODO: This must be a node value
            // result = sparql.Node.plainLit(str);
        }

        // TODO Handle special strings, such as ?\tag

        // console.log('Parsed', str, 'to', result);

        return result;
    },

});

export default TemplateParser;
