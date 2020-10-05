import Class from '../../ext/Class';
import ListServiceTransformConcept from '../../service/list_service/ListServiceTransformConcept';
import FacetService from './FacetService';

/**
 * This facet service wraps the list service provided by the underlying facet service
 * with a transformation of the filter concept.
 *
 *  This can be used to e.g. turn a keyword search query into a sparql concept making use of bif:contains or regex
 */
var FacetServiceTransformConcept = Class.create({
    initialize: function(facetService, fnTransform) {
        this.facetService = facetService;
        this.fnTransform = fnTransform;
    },

    prepareListService: function(pathHead) { // TODO Maybe replace arguments with the PathHead object?
        var promise = this.facetService.prepareListService(pathHead);
        var self = this;
        var result = promise.then(function(ls) {
            var r = new ListServiceTransformConcept(ls, self.fnTransform);
            return r;
        });

        return result;
    },

});

export default FacetServiceTransformConcept;
