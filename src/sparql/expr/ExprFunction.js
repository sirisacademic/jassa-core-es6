import Class from '../../ext/Class';
import Expr from './Expr';

var ExprFunction = Class.create(Expr, {
    getName: function() {
        throw new Error('Implement me');
    },

    isFunction: function() {
        return true;
    },

    getFunction: function() {
        return this;
    },
});

export default ExprFunction;
