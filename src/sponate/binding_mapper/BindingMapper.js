import Class from '../../ext/Class';

var BindingMapper = Class.create({
    map: function(binding, rowId) {
        throw new Error('Not overridden');
    }
});

export default BindingMapper;
