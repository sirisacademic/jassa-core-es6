import Class from '../../ext/Class';
import FacetService from './FacetService';
import HashMap from '../../util/collection/HashMap';
import ListServiceConceptKeyLookup from '../../service/list_service/ListServiceConceptKeyLookup';
import ListServiceTransformItem from '../../service/list_service/ListServiceTransformItem';

/**
 * A facet service that can override lookups for pathHeads to other facet services
 *
 */
var FacetServiceLookup = Class.create(FacetService, {
    /**
     * @param fnLookupService A function that yields a lookup service for a pathHead
     */
    initialize: function(facetService, fnLookupService) {
        this.facetService = facetService;
        this.fnLookupService = fnLookupService;
    },

    prepareListService: function(pathHead) {
        var lookupService = this.fnLookupService(pathHead);

        var result = this.facetService.prepareListService(pathHead).then(function(ls) {

            ls = new ListServiceConceptKeyLookup(ls, lookupService, function(entry) {
                var r = entry.val.property;
                //console.log('Property: ' + r);
                return r;
            });

//            ls = new ListServiceConceptKeyLookup(ls, lookupService);
//            , function(entry) {
//                // Perform the lookup based on the facet's property
//                var r = entry.val.property;
//                return r;
//            });


//            ls = new ListServiceTransformItem(ls, function(item) {
//                return item.key;
//            });

            return ls;
        });

        return result;
    },

});

export default FacetServiceLookup;
