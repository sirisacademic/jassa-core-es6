import Class from '../../ext/Class';
import ConstraintUtils from '../ConstraintUtils';
import ConstraintBasePathValue from './ConstraintBasePathValue';

var ConstraintLang = Class.create(ConstraintBasePathValue, {
    classLabel: 'jassa.facete.ConstraintLang',
    
    initialize: function($super, path, langStr) {
        $super('lang', path, langStr);
    },
    
    createElementsAndExprs: function(facetNode) {
        var result = ConstraintUtils.createConstraintLang(facetNode, this.path, this.value);
        return result;
    }
});

export default ConstraintLang;