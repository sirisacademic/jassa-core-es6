import Class from '../../ext/Class';
import DatatypeLabel from './DatatypeLabel';

// constructor
var DatatypeLabelDate = Class.create(DatatypeLabel, {
    classLabel: 'jassa.rdf.DatatypeLabelDate',
    parse: function(str) {
        var result = !str ? null : new Date(str);
        return result;
    },
    unparse: function(val) {
        var result = !val ? null : val.toString();
        return result;
    }
});

export default DatatypeLabelDate;
