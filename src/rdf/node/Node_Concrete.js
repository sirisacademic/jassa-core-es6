import Class from '../../ext/Class';
import Node from './Node';

var Node_Concrete = Class.create(Node, {
    classLabel: 'jassa.rdf.Node_Concrete',
    isConcrete: function() {
        return true;
    }
});

export default Node_Concrete;
