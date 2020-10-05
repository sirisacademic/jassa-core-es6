import Class from '../../ext/Class';
import ElementFactory from './ElementFactory';

/**
 * Element factory returning an initially provided object
 */
var ElementFactoryConst = Class.create(ElementFactory, {
    initialize: function(element) {
        this.element = element;
    },

    createElement: function() {
        return this.element;
    },
});

export default ElementFactoryConst;
