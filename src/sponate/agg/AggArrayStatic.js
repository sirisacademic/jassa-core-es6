import Class from '../../ext/Class';
import Agg from './Agg';
import AccArrayStatic from '../acc/AccArrayStatic';


var AggArrayStatic = Class.create(Agg, {
    classLabel: 'jassa.sponate.AggArrayStatic',

    initialize: function(subAggs) {
        this.subAggs = subAggs;
    },

    clone: function() {
        var tmp = this.subAggs.map(function(subAgg) {
            return subAgg.clone();
        });

        var result = new AggArrayStatic(tmp);
        return result;
    },

    createAcc: function() {
        var subAccs = this.subAggs.map(function(subAgg) {
            return subAgg.createAcc();
        });


        var result = new AccArrayStatic(subAccs);
        return result;
    },

    getSubAggs: function() {
        return this.subAggs;
    },

    toString: function() {
        return 'implement me';
    },

});

export default AggArrayStatic;
