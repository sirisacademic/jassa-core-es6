import Class from '../../ext/Class';

var ElementSupplier = Class.create({
    getElement: function() {
        throw new Error('Not overridden');
    },
});

export default ElementSupplier;
