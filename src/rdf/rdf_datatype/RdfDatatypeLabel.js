/* jscs:null requireCamelCaseOrUpperCaseIdentifiers */
import Class from '../../ext/Class';

import RdfDatatypeBase from './RdfDatatypeBase';

// constructor
var RdfDatatypeLabel = Class.create(RdfDatatypeBase, {
    classLabel: 'jassa.rdf.RdfDatatype_Label',
    initialize: function($super, uri, datatypeLabel) {
        $super(uri);

        this.datatypeLabel = datatypeLabel;
    },
    parse: function(str) {
        return this.datatypeLabel.parse(str);
    },
    unparse: function(val) {
        return this.datatypeLabel.unparse(val);
    }
});

export default RdfDatatypeLabel;
