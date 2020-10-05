import Class from '../../ext/Class';
import ElementSupplier from './ElementSupplier';

/**
 * Element factory returning an element based on a function
 */
var ElementSupplierFn = Class.create(ElementSupplier, {
    initialize: function(elementFn) {
        this.elementFn = elementFn;
    },

    getElement: function() {
        return this.elementFn;
    },
});

export default ElementSupplierFn;
