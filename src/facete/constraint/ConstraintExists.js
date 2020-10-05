import Class from '../../ext/Class';
import ConstraintUtils from '../ConstraintUtils';
import ConstraintBasePath from './ConstraintBasePath';

var ConstraintExists = Class.create(ConstraintBasePath, {
    classLabel: 'jassa.facete.ConstraintExists',

    initialize: function($super, path) {
        $super('exists', path);
    },
    
    createElementsAndExprs: function(facetNode) {
        var result = ConstraintUtils.createConstraintExists(facetNode, this.path);
        return result;
    },

});

export default ConstraintExists;