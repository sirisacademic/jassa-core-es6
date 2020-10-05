import Class from '../../ext/Class';
import ExprFunctionBase from './ExprFunctionBase';

var ExprFunction0 = Class.create(ExprFunctionBase, {
    initialize: function($super, name) {
        $super(name);
    },
    getArgs: function() {
        return [];
    },

    copy: function(args) {
        if (args && args.length > 0) {
            throw new Error('Invalid argument');
        }

        var result = this.$copy(args);
        return result;
    },
});

export default ExprFunction0;
