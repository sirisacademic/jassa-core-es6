import Class from '../../ext/Class';
import Agg from './Agg';
import AccArray from '../acc/AccArray';


var AggArray = Class.create(Agg, {
    classLabel: 'jassa.sponate.AggArray',

    initialize: function(subAgg, indexBindingMapper) {
        this.subAgg = subAgg;
        this.indexBindingMapper = indexBindingMapper;
    },

    clone: function() {
        var result = new AggArray(this.subAgg.clone(), this.indexBindingMapper);
        return result;
    },

    createAcc: function() {
        var result = new AccArray(this.subAgg, this.indexBindingMapper);
        return result;
    },

    getSubAgg: function() {
        return this.subAgg;
    },

    getIndexBindingMapper: function() {
        return this.indexBindingMapper;
    },

    getSubAggs: function() {
        return [
            this.subAgg,
        ];
    },

    toString: function() {
        return this.expr.toString();
    },

});

export default AggArray;
