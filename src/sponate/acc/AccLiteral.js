import Class from '../../ext/Class';
import ObjectUtils from '../../util/ObjectUtils';
import Acc from './Acc';

var AccLiteral = Class.create(Acc, {
    classLabel: 'jassa.sponate.AccLiteral',

    initialize: function(bindingMapper) {
        this.bindingMapper = bindingMapper;

        this.value = null;
    },

    accumulate: function(binding) {
        var newValue = this.bindingMapper.map(binding, 0);

        if (false) {
            if(this.value != null && !ObjectUtils.isEqual(this.value, newValue)) {
                console.log('[WARN] Reassigned value: Original', this.value, ' New: ', newValue);
            }
        }

        this.value = newValue;
    },

    getValue: function() {
        return this.value;
    },

    getSubAccs: function() {
        return [];
    },

});

export default AccLiteral;
