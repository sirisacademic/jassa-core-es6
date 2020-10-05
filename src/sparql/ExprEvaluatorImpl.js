/* jshint evil: true */
import Class from '../ext/Class';

import NodeValue from './expr/NodeValue';
import NodeValueUtils from './NodeValueUtils';
import ExprEvaluator from './ExprEvaluator';

var ExprEvaluatorImpl = Class.create(ExprEvaluator, {
    eval: function(expr, binding) {
        var result;
        var e;

        if (expr.isVar()) {
            e = expr.getExprVar();
            result = this.evalExprVar(e, binding);
        } else if (expr.isFunction()) {
            e = expr.getFunction();
            result = this.evalExprFunction(e, binding);
        } else if (expr.isConstant()) {
            e = expr.getConstant();
            // FIXME: this.evalConstant not defined
            result = this.evalConstant(e, binding);
        } else {
            throw new Error('Unsupported expr type');
        }

        return result;
    },

    evalExprVar: function(expr, binding) {
        // console.log('Expr' + JSON.stringify(expr));
        var v = expr.asVar();

        var node = binding.get(v);

        var result;
        if (node == null) {
            // console.log('No Binding for variable "' + v + '" in ' + expr + ' with binding ' + binding);
            // throw 'Bailing out';
            return NodeValue.nvNothing;
            // return null;
        } else {
            result = NodeValueUtils.makeNode(node);
        }

        return result;
    },

    evalExprFunction: function() { // expr, binding) {
    },

    evalNodeValue: function() { // expr, binding) {
    },
});

export default ExprEvaluatorImpl;
