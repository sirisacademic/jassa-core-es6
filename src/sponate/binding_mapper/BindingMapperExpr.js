import Class from '../../ext/Class';
import BindingMapper from './BindingMapper';

/**
 * Evaluates an expression to a {jassa.rdf.Node}
 *
 * TODO Not sure if evaluating to NodeValue instead would have any benefits
 */
var BindingMapperExpr = Class.create(BindingMapper, {
    initialize: function(expr) {
        this.expr = expr;
    },

    getExpr: function() {
        return this.expr;
    },

    map: function(binding, rowId) {
        var nv = this.expr.eval(binding);
        var result = nv.asNode();
        return result;
    },

});

export default BindingMapperExpr;
