import Class from '../../ext/Class';
import ExprFunctionBase from './ExprFunctionBase';

var ExprFunction2 = Class.create(ExprFunctionBase, {
    initialize: function($super, name, left, right) {
        $super(name);

        this.left = left;
        this.right = right;
    },

    getArgs: function() {
        return [
            this.left,
            this.right,
        ];
    },

    copySubstitute: function(fnNodeMap) {
        return new ExprFunction2(this.name, this.args);
    },

    copy: function(args) {
        if (args.length !== 2) {
            throw new Error('Invalid argument');
        }

        var result = new ExprFunction1(this.name, this.left, this.right); 
        return result;
    },

    getLeft: function() {
        return this.left;
    },

    getRight: function() {
        return this.right;
    },
});

export default ExprFunction2;
