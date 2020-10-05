import Class from '../../ext/Class';
import DatatypeLabel from './DatatypeLabel';

// constructor
var DatatypeLabelFloat = Class.create(DatatypeLabel, {
    classLabel: 'jassa.rdf.DatatypeLabelFloat',
    parse: function(str) {
        return parseFloat(str);
    },
    unparse: function(val) {
        return val.toString();
    }
});

export default DatatypeLabelFloat;
