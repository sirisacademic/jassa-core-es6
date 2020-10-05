import Class from '../../ext/Class';
import FacetService from './FacetService';
import HashMap from '../../util/collection/HashMap';

/**
 * A facet service that can override lookups for pathHeads to other facet services
 *
 */
var FacetServiceMeta = Class.create(FacetService, {
    initialize: function(facetServiceFallback, pathHeadToFacetService) {
        this.facetServiceFallback = facetServiceFallback;
        this.pathHeadToFacetService = this.pathHeadToFacetService || new HashMap();
    },

    getPathHeadToFacetService: function() {
        return this.pathHeadToFacetService;
    },

    prepareListService: function(pathHead) {
        var override = this.pathHeadToFacetService.get(pathHead);

        var facetService = override || this.facetServiceFallback;

        var result = facetService.prepareListService(pathHead);

        return result;
    },

});

export default FacetServiceMeta;
