import Class from '../ext/Class';
import ElementUtils from '../sparql/ElementUtils';

var ElementsAndExprs = Class.create({
    initialize: function(elements, exprs) {
        this.elements = elements;
        this.exprs = exprs;
    },

    getElements: function() {
        return this.elements;
    },

    getExprs: function() {
        return this.exprs;
    },

    toElements: function() {
        var result = [];

        var filterElements = ElementUtils.createFilterElements(this.exprs);

        result.push.apply(result, this.elements);
        result.push.apply(result, filterElements);

        return result;
    },

});

export default ElementsAndExprs;

