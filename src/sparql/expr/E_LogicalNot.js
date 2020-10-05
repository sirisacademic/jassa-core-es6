import Class from '../../ext/Class';
import ExprHelpers from '../ExprHelpers';
import ExprFunction1 from './ExprFunction1';

var E_LogicalNot = Class.create(ExprFunction1, {
    initialize: function(expr) {
        this.expr = expr;
    },

    copySubstitute: function(fnNodeMap) {
        return new E_LogicalNot(this.expr.copySubstitute(fnNodeMap));
    },

    getArgs: function() {
        return [
            this.expr,
        ];
    },

    copy: function(args) {
        var result = ExprHelpers.newUnaryExpr(E_LogicalNot, args);
        return result;
    },

    toString: function() {
        return '(!' + this.expr + ')';
    },
});

export default E_LogicalNot;
