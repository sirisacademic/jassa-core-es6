import Class from '../../ext/Class';
import Acc from './Acc';

var AccArrayStatic = Class.create(Acc, {
    classLabel: 'jassa.sponate.AccArrayStatic',

    initialize: function(subAccs) {
        this.subAccs = subAccs;
    },

    accumulate: function(binding) {
        this.subAccs.forEach(function(subAcc) {
            subAcc.accumulate(binding);
        });
    },

    getValue: function() {
        var result = this.subAccs.map(function(acc) {
           var r = acc.getValue();
           return r;
        });

        return result;
    },

    getSubAccs: function() {
        return this.subAccs;
    },

});

export default AccArrayStatic;
