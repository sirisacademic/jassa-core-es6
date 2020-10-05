import Class from '../../ext/Class';
import ExprFunction2 from './ExprFunction2';
import ExprHelpers from '../ExprHelpers';

var E_LogicalOr = Class.create(ExprFunction2, {
    initialize: function($super, left, right) {
        $super('||', left, right);
    },

    copySubstitute: function(fnNodeMap) {
        var a = this.left.copySubstitute(fnNodeMap);
        var b = this.right.copySubstitute(fnNodeMap);
        var result = new E_LogicalOr(a, b); 
        return result;
    },

    getArgs: function() {
        return [
            this.left,
            this.right,
        ];
    },

    copy: function(args) {
        return ExprHelpers.newBinaryExpr(E_LogicalOr, args);
    },

    toString: function() {
        return '(' + this.left + ' || ' + this.right + ')';
    },
});

export default E_LogicalOr;
