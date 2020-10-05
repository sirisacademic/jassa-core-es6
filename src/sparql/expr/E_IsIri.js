import Class from '../../ext/Class';
import ExprHelpers from '../ExprHelpers';

var E_IsIri = Class.create({
    initialize: function(expr) {
        this.expr = expr;
    },

    copySubstitute: function(fnNodeMap) {
        return new E_IsIri(this.expr.copySubstitute(fnNodeMap));
    },

    getArgs: function() {
        return [
            this.expr,
        ];
    },

    copy: function(args) {
        var result = ExprHelpers.newUnaryExpr(E_IsIri, args);
        return result;
    },

    toString: function() {
        return 'isIri(' + this.expr + ')';
    },

    getVarsMentioned: function() {
        return this.expr.getVarsMentioned();
    },
});

export default E_IsIri;
