import Class from '../../ext/Class';
import Agg from './Agg';

/**
 * Aggregator for custom functions.
 * 
 */
var AggCustomAgg = Class.create(Agg, {
    classLabel: 'jassa.sponate.AggCustomAgg',

    /**
     * 
     * @param 
     */
    initialize: function(fnAcc) {
        this.fnAcc = fnAcc;
    },

    getSubAggs: function() {
        return [];
    },

//    getVarsMentioned: function() {
//        var result = this.customAggFactory.getVarsMentioned();
//        return result;
//    },

});

export default AggCustomAgg;
