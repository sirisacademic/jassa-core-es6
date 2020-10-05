import Class from '../../ext/Class';
import Node_Fluid from './Node_Fluid';

var Node_Variable = Class.create(Node_Fluid, {
    classLabel: 'jassa.rdf.Node_Variable',
    isVariable: function() {
        return true;
    }
});

export default Node_Variable;
