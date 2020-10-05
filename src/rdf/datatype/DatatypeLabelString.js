import Class from '../../ext/Class';
import DatatypeLabel from './DatatypeLabel';

// constructor
var DatatypeLabelString = Class.create(DatatypeLabel, {
    classLabel: 'jassa.rdf.DatatypeLabelString',
    parse: function(str) {
        return str;
    },
    unparse: function(val) {
        return val.toString();
    }
});

export default DatatypeLabelString;
