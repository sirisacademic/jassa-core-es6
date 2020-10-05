import Class from '../../ext/Class';
import RdfDatatype from './RdfDatatype';

// constructor
var RdfDatatypeBase = Class.create(RdfDatatype, {
    classLabel: 'jassa.rdf.RdfDatatypeBase',
    initialize: function(uri) {
        this.uri = uri;
    },
    getUri: function() {
        return this.uri;
    }
});

export default RdfDatatypeBase;
