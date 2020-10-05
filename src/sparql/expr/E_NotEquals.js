import Class from '../../ext/Class';
import ExprFunction2 from './ExprFunction2';

var E_NotEquals = Class.create(ExprFunction2, {
    initialize: function($super, left, right) {
        $super('!=', left, right);
    },

    copySubstitute: function(fnNodeMap) {
        return new E_NotEquals(this.left.copySubstitute(fnNodeMap), this.right.copySubstitute(fnNodeMap));
    },

    $copy: function(left, right) {
        return new E_NotEquals(left, right);
    },

    toString: function() {
        return '(' + this.left + ' != ' + this.right + ')';
    },

    eval: function() { // binding) {
        // TODO Evaluate the expression
    },
});

export default E_NotEquals;
