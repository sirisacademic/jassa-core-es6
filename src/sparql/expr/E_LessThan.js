import Class from '../../ext/Class';
import ExprFunction2 from './ExprFunction2';
import ExprHelpers from '../ExprHelpers';

var E_LessThan = Class.create(ExprFunction2, {
    initialize: function($super, left, right) {
        $super('<', left, right);
    },

    copySubstitute: function(fnNodeMap) {
        return new E_LessThan(this.left, this.right);
    },

    copy: function(args) {
        return ExprHelpers.newBinaryExpr(E_LessThan, args);
    },

    toString: function() {
        return '(' + this.left + ' < ' + this.right + ')';
    },
});

export default E_LessThan;
