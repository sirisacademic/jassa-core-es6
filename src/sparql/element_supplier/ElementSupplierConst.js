import Class from '../../ext/Class';
import ElementSupplier from './ElementSupplier';

/**
 * Element factory returning an initially provided object
 */
var ElementSupplierConst = Class.create(ElementSupplier, {
    initialize: function(element) {
        this.element = element;
    },

    getElement: function() {
        return this.element;
    },

    setElement: function(element) {
        this.element = element;
    },

});

export default ElementSupplierConst;
