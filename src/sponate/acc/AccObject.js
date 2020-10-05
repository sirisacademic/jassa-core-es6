import forEach from 'lodash.foreach';
import Class from '../../ext/Class';
import Acc from './Acc';

var AccObject = Class.create(Acc, {
    classLabel: 'jassa.sponate.AccObject',

    /**
     * An aggregator factory must have already taken
     * care of initializing the attrToAggr map.
     *
     */
    initialize: function(attrToAcc) {
        this.attrToAcc = attrToAcc;
    },

    accumulate: function(binding) {
        forEach(this.attrToAcc, function(acc) {
            acc.accumulate(binding);
        });
    },

    getValue: function() {
        var result = {};

        forEach(this.attrToAcc, function(acc, attr) {
            var v = acc.getValue();
            result[attr] = v;
        });

        return result;
    },
    
    getSubAccs: function() {
        var result = [];

        forEach(this.attrToAcc, function(acc) {
            result.push(acc);
        });
        
        return result;
    },

});

export default AccObject;
