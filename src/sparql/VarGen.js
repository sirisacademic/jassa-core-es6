import Class from '../ext/Class';
import NodeFactory from '../rdf/NodeFactory';

var VarGen = Class.create({
    initialize: function(genSym) {
        this.genSym = genSym;
    },

    next: function() {
        var name = this.genSym.next();
        var result = NodeFactory.createVar(name);
        return result;
    }
});

export default VarGen;
