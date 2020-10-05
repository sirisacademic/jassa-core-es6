import Class from '../../ext/Class';
import BindingMapper from './BindingMapper';

/**
 * Evaluates an expression to a {jassa.rdf.Node}
 * 
 * TODO Not sure if evaluating to NodeValue instead would have any benefits
 */
var BindingMapperTransform = Class.create(BindingMapper, {
    initialize: function(subBindingMapper, fn) {
        this.subBindingMapper = subBindingMapper;
        this.fn = fn;
    },

    map: function(binding, rowId) {
        var val = this.subBindingMapper.map(binding, rowId);
        var result = this.fn(val);
        return result;
    },

});

export default BindingMapperTransform;
