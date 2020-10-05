import Class from '../../ext/Class';
import ExprUtils from '../ExprUtils';
import Element from './Element';

var ElementFilter = Class.create(Element, {
    classLabel: 'jassa.sparql.ElementFilter',
    initialize: function(expr) {
        if (Array.isArray(expr)) {
            throw new Error('[WARN] Array argument for filter is deprecated');
        }

        this.expr = expr;
    },

    getArgs: function() {
        return [];
    },

    copy: function(args) {
        if (args.length !== 0) {
            throw new Error('Invalid argument');
        }

        //  FIXME: Should we clone the attributes too?
        var result = new ElementFilter(this.expr);
        return result;
    },

    copySubstitute: function(fnNodeMap) {
        var newExpr = this.expr.copySubstitute(fnNodeMap);
        return new ElementFilter(newExpr);
    },

    getVarsMentioned: function() {
        return this.expr.getVarsMentioned();
    },

    flatten: function() {
        return this;
    },

    toString: function() {
        // var expr = ns.andify(this.exprs);
        return 'Filter(' + this.expr + ')';
    },
});

export default ElementFilter;
