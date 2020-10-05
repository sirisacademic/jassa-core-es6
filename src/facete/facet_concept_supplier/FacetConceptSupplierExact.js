import Class from '../../ext/Class';
import Concept from '../../sparql/Concept';
import FacetUtils from '../FacetUtils';
import FacetConceptSupplier from './FacetConceptSupplier';


var FacetConceptSupplierExact = Class.create(FacetConceptSupplier, {
    initialize: function(facetConfig) {
        this.facetConfig = facetConfig;
    },
    
    getConcept: function(pathHead) {
        var relation = FacetUtils.createRelationFacets(this.facetConfig, pathHead);
        var result = new Concept(relation.getElement(), relation.getSourceVar());

        return result;
    },

});

export default FacetConceptSupplierExact;
