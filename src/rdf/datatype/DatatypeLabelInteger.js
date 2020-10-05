import Class from '../../ext/Class';
import DatatypeLabel from './DatatypeLabel';

// constructor
var DatatypeLabelInteger = Class.create(DatatypeLabel, {
    classLabel: 'jassa.rdf.DatatypeLabelInteger',
    parse: function(str) {
        return parseInt(str, 10);
    },
    unparse: function(val) {
        return val.toString();
    }
});

export default DatatypeLabelInteger;
