/* jshint evil: true */
import Class from '../ext/Class';

var ExprEvaluator = Class.create({
    eval: function() { // expr, binding) {
        throw new Error('Not overridden');
    },
});

export default ExprEvaluator;
