import Class from '../../ext/Class';
import NodeFactory from '../../rdf/NodeFactory';
import AccTransform from '../acc/AccTransform';
import Agg from './Agg';

var AggTransform = Class.create(Agg, {
    classLabel: 'jassa.sponate.AggTransform',

    initialize: function(subAgg, fn) {
        this.subAgg = subAgg;
        this.fn = fn;
    },

    clone: function() {
        var result = new AggTransform(this.subAgg.clone(), this.fn);
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
        var result = new AccTransform(subAcc, this.fn);
        return result;
    },

    toString: function() {
        return JSON.stringify(this);
    },

});

export default AggTransform;
