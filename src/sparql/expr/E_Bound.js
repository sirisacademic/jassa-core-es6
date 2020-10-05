import Class from '../../ext/Class';
import ExprHelpers from '../ExprHelpers';

var E_Bound = Class.create({
    initialize: function(expr) {
        this.expr = expr;
    },

    copySubstitute: function(fnNodeMap) {
        return new E_Bound(this.expr.copySubstitute(fnNodeMap));
    },

    getVarsMentioned: function() {
        var result = this.expr.getVarsMentioned();
        return result;
    },
    
    getArgs: function() {
        return [
            this.expr,
        ];
    },

    copy: function(args) {
        var result = ExprHelpers.newUnaryExpr(E_Bound, args);
        return result;
    },

    toString: function() {
        return 'bound(' + this.expr + ')';
    },
});

export default E_Bound;
