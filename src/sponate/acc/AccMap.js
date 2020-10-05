import Class from '../../ext/Class';
import HashMap from '../../util/collection/HashMap';
import Acc from './Acc';

var AccMap = Class.create(Acc, {
    classLabel: 'jassa.sponate.AccMap',

    initialize: function(keyBindingMapper, subAgg) {
        this.keyBindingMapper = keyBindingMapper;
        this.subAgg = subAgg;

        this.state = new HashMap();
    },

    getState: function() {
        return this.state;
    },

    accumulate: function(binding) {
        var k = this.keyBindingMapper.map(binding, 0);

        if(k != null) {
            var subAcc = this.state.get(k);
            if(!subAcc) {
                subAcc = this.subAgg.createAcc();
                this.state.put(k, subAcc);
            }
            subAcc.accumulate(binding);
        }
    },

    getValue: function() {
        var result = new HashMap();

        var entries = this.state.entries();
        entries.forEach(function(item) {
            var k = item.key;
            var acc = item.val;

            var v = acc.getValue();
            result.put(k, v);
        });

        return result;
    },

    getSubAccs: function() {

        var entries = this.state.entries();
        var result = entries.map(function(entry) {
            return entry.val;
        });

        return result;
    },

});

export default AccMap;
