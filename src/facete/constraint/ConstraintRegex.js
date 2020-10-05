import Class from '../../ext/Class';
import ConstraintUtils from '../ConstraintUtils';
import ConstraintBasePathValue from './ConstraintBasePathValue';


var ConstraintRegex = Class.create(ConstraintBasePathValue, {
    classLabel: 'jassa.facete.ConstraintRegex',
    
    initialize: function($super, path, regexStr) {
        $super('regex', path, regexStr);
    },
    
    createElementsAndExprs: function(facetNode) {
        var result = ConstraintUtils.createConstraintRegex(facetNode, this.path, this.value.getLiteralLexicalForm());
        return result;
    }
});

export default ConstraintRegex;
