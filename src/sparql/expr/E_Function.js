import Class from '../../ext/Class';
import ExprFunctionN from './ExprFunctionN';

var E_Function = Class.create(ExprFunctionN, {
    initialize: function($super, name, args) {
        $super(name, args);
    },

    copy: function(newArgs) {
        var result = new E_Function(this.name, newArgs);
        return result;
    },

    toString: function() {
        var result = '<' + this.name + '>(' + this.getArgs().join(', ') + ')';
        return result;
    }
});

export default E_Function;
