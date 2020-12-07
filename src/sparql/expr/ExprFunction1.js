import Class from '../../ext/Class';
import ExprFunctionBase from './ExprFunctionBase';

var ExprFunction1 = Class.create(ExprFunctionBase, {
    initialize: function($super, name, subExpr) {
        $super(name);

        this.subExpr = subExpr;
    },

    getArgs: function() {
        return [
            this.subExpr,
        ];
    },

    copy: function(args) {
        if (args.length !== 1) {
            throw new Error('Invalid argument');
        }

        var result = new ExprFunction1(this.name, this.subExpr);
        return result;
    },

    getSubExpr: function() {
        return this.subExpr;
    },
});

export default ExprFunction1;
