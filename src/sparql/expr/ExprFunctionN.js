import Class from '../../ext/Class';
import ExprFunctionBase from './ExprFunctionBase';

var ExprFunctionN = Class.create(ExprFunctionBase, {
    initialize: function($super, name, args) {
        $super(name, args);

        this.args = args;
    },

    copySubstitute: function(fnNodeMap) {
        return new ExprFunctionN(this.name, this.args);
    },

    getArgs: function() {
        return this.args;
    },
});

export default ExprFunctionN;
