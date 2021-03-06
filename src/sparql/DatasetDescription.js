import Class from '../ext/Class';
import ObjectUtils from '../util/ObjectUtils';

//var reduce = require('lodash.reduce');
import * as _ from 'lodash';


/**
 * A specification of an RDF Dataset
 *
 * http://www.w3.org/TR/sparql11-query/#rdfDataset
 *
 */
var DatasetDescription = Class.create({
    initialize: function(defaultGraphUris, namedGraphUris) {
        this.defaultGraphUris = defaultGraphUris || [];
        this.namedGraphUris = namedGraphUris || [];
    },

    getDefaultGraphUris: function() {
        return this.defaultGraphUris;
    },

    getNamedGraphUris: function() {
        return this.namedGraphUris;
    },

    getUrisMentioned: function() {
        var raw = this.defaultGraphUris.concat(this.namedGraphUris);
        var result = _.uniq(raw);
        return result;
    },

    hashCode: function() {
        if(this.hash == null) {
            this.hash = ObjectUtils.hashCode(this);
        }

        return this.hash;
    },

    equals: function(that) {
        var result = ObjectUtils.isEqual(this, that);
        return result;
    },

    toString: function() {
        return 'DatasetDescription: ' + JSON.stringify(this);
    }
});


export default DatasetDescription;
