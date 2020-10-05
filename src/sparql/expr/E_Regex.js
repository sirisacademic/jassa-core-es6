import Class from '../../ext/Class';
import Expr from './Expr';

// TODO Should be ExprFunctionN
var E_Regex = Class.create(Expr, {
    initialize: function(expr, pattern, flags) {
        this.expr = expr;
        this.pattern = pattern;
        this.flags = flags;
    },

    copySubstitute: function(fnNodeMap) {
        return new E_Regex(this.expr.copySubstitute(fnNodeMap), this.pattern, this.flags);
    },

    getVarsMentioned: function() {
        return this.expr.getVarsMentioned();
    },

    getArgs: function() {
        return [
            this.expr,
        ];
    },

    copy: function(args) {
        if (args.length !== 1) {
            throw new Error('Invalid argument');
        }

        var newExpr = args[0];
        var result = new E_Regex(newExpr, this.pattern, this.flags);
        return result;
    },

    toString: function() {
        var patternStr = this.pattern.replace('\"', '\\\"');
        var flagsStr = this.flags ? ', "' + this.flags.replace('\"', '\\\"') + '"' : '';

        return 'regex(' + this.expr + ', "' + patternStr + '"' + flagsStr + ')';
    },
});

export default E_Regex;
