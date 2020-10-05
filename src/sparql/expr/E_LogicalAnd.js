import Class from '../../ext/Class';
import ExprHelpers from '../ExprHelpers';
import ExprFunction2 from './ExprFunction2';

var E_LogicalAnd = Class.create(ExprFunction2, {
    initialize: function($super, left, right) {
        $super('&&', left, right);
    },

    copySubstitute: function(fnNodeMap) {
        return new E_LogicalAnd(this.left.copySubstitute(fnNodeMap), this.right.copySubstitute(fnNodeMap));
    },

    copy: function(args) {
        return ExprHelpers.newBinaryExpr(E_LogicalAnd, args);
    },

    toString: function() {
        return '(' + this.left + ' && ' + this.right + ')';
    },
});

export default E_LogicalAnd;
