import Class from '../../ext/Class';
import Node from './Node';

var Node_Fluid = Class.create(Node, {
    classLabel: 'jassa.rdf.Node_Fluid',
    isConcrete: function() {
        return false;
    }
});

export default Node_Fluid;
