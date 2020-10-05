import Class from '../../ext/Class';
import ExprHelpers from '../ExprHelpers';
import PatternUtils from '../PatternUtils';

var E_LangMatches = Class.create({
    initialize: function(left, right) {
        this.left = left;
        this.right = right;
    },

    copySubstitute: function(fnNodeMap) {
        return new E_LangMatches(this.left.copySubstitute(fnNodeMap), this.right.copySubstitute(fnNodeMap));
    },

    getArgs: function() {
        return [
            this.left,
            this.right,
        ];
    },

    copy: function(args) {
        return ExprHelpers.newBinaryExpr(E_LangMatches, args);
    },

    toString: function() {
        return 'langMatches(' + this.left + ', ' + this.right + ')';
    },

    getVarsMentioned: function() {
        var result = PatternUtils.getVarsMentioned(this.getArgs());
        return result;
    },
});

export default E_LangMatches;
