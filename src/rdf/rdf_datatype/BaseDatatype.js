import Class from '../../ext/Class';
import RdfDatatype from './RdfDatatype';
import TypedValue from './TypedValue';

// constructor
var BaseDatatype = Class.create(RdfDatatype, {
    classLabel: 'jassa.rdf.BaseDatatype',
    initialize: function(datatypeUri) {
        this.datatypeUri = datatypeUri;
    },
    getUri: function() {
        return this.datatypeUri;
    },
    unparse: function(value) {
        var result;

        if (value instanceof TypedValue) {
            result = value.getLexicalValue();

        } else {
            result = value.toString();
        }
        return result;
    },
    /** Convert a value of this datatype to lexical form. */
    parse: function(str) {
        return new TypedValue(str, this.datatypeUri);
    },
    toString: function() {
        return 'Datatype [' + this.datatypeUri + ']';
    }
});

export default BaseDatatype;
