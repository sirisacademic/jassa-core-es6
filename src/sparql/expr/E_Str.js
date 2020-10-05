import Class from '../../ext/Class';
import ExprFunction1 from './ExprFunction1';

var E_Str = Class.create(ExprFunction1, {
    initialize: function($super, subExpr) {
        $super('str', subExpr);
    },

    getVarsMentioned: function() {
        return this.subExpr.getVarsMentioned();
    },

    copy: function(args) {
        return new E_Str(args[0]);
    },

    toString: function() {
        return 'str(' + this.subExpr + ')';
    },
});

export default E_Str;
