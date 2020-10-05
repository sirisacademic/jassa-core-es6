import Class from '../../ext/Class';
import ConstraintUtils from '../ConstraintUtils';
import ConstraintBasePathValue from './ConstraintBasePathValue';

var ConstraintEquals = Class.create(ConstraintBasePathValue, {
    classLabel: 'jassa.facete.ConstraintEquals',
    
    initialize: function($super, path, node) {
        $super('equals', path, node);
    },
    
    createElementsAndExprs: function(facetNode) {
        var result = ConstraintUtils.createConstraintEquals(facetNode, this.path, this.value);
        return result;
    }
});

export default ConstraintEquals;