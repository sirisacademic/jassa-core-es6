import Class from '../../ext/Class';
import NodeFactory from '../../rdf/NodeFactory';
import AccTransformLazy from '../acc/AccTransformLazy';
import Agg from './Agg';

var AggTransformLazy = Class.create(Agg, {
    classLabel: 'jassa.sponate.AggTransformLazy',

    initialize: function(subAgg, fn) {
        this.subAgg = subAgg;
        this.fn = fn;
    },

    clone: function() {
        var result = new AggTransformLazy(this.subAgg.clone(), this.fn);
        return result;
    },

    getSubAgg: function() {
        return this.subAgg;
    },

    getSubAggs: function() {
        return [
            this.subAgg,
        ];
    },

    createAcc: function() {
        var subAcc = this.subAgg.createAcc();
        var result = new AccTransformLazy(subAcc, this.fn);
        return result;
    },

    toString: function() {
        return JSON.stringify(this);
    },

});

export default AggTransformLazy;
