import Class from '../../ext/Class';
import HashMap from '../../util/collection/HashMap';
import FacetUtils from '../FacetUtils';
import FacetConceptSupplier from './FacetConceptSupplier';

var FacetConceptSupplierMeta = Class.create({
    initialize: function(facetConceptSupplierFallback, pathHeadToConcept) {
        this.facetConceptSupplierFallback = facetConceptSupplierFallback;
        this.pathHeadToConcept = pathHeadToConcept || new HashMap();
    },

    getPathHeadToConcept: function() {
        return this.pathHeadToConcept;
    },

    getConcept: function(pathHead) {
        var override = this.pathHeadToConcept.get(pathHead);
        var result = override || this.facetConceptSupplierFallback.getConcept(pathHead);
        return result;
    },

});

export default FacetConceptSupplierMeta;
