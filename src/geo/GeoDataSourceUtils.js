import LookupServiceUtils from '../service/LookupServiceUtils';
import LookupServiceConst from '../service/lookup_service/LookupServiceConst';
import LookupServiceTransform from '../service/lookup_service/LookupServiceTransform';
import ListServiceAugmenter from '../service/list_service/ListServiceAugmenter';
import AugmenterLookup from '../service/list_service/AugmenterLookup';
import BestLabelConfig from '../sparql/BestLabelConfig';
import ListServiceBbox from './ListServiceBbox';
import DataServiceBboxCache from './DataServiceBboxCache';
import LookupServiceUtils from '../sponate/LookupServiceUtils';
import MappedConceptUtils from '../sponate/MappedConceptUtils';


var GeoDataSourceUtils = {

    /**
     *
     * @param attrs Additional static attributes, such as style information
     */
    createGeoDataSourceLabels: function(sparqlService, geoMapFactory, concept, attrs) {

        if(attrs == null) {
            attrs = {};
        }

        // The 'core' service from which to retrieve the initial data
        var bboxListService = new ListServiceBbox(sparqlService, geoMapFactory, concept);

        // Wrap this service for augmenting (enriching) it with labels
        //var lookupServiceLabels = SponateLookupServiceUtils.createLookupServiceNodeLabels(sparqlService);
        var blc = new BestLabelConfig();
        var mappedConcept = MappedConceptUtils.createMappedConceptBestLabel(blc);
        var lookupServiceLabels = LookupServiceUtils.createLookupServiceMappedConcept(sparqlService, mappedConcept);


        lookupServiceLabels = new LookupServiceTransform(lookupServiceLabels, function(doc, id) {
            var result = {
                shortLabel: doc
            };
            return result;
        });

        var augmenterLabels = new AugmenterLookup(lookupServiceLabels);
        bboxListService = new ListServiceAugmenter(bboxListService, augmenterLabels);

        // Also add style information
        var lookupServiceStyle = new LookupServiceConst(attrs);

        var augmenterStyle = new AugmenterLookup(lookupServiceStyle);
        bboxListService = new ListServiceAugmenter(bboxListService, augmenterStyle);

        // Wrap the list service with clustering support
        var result = new DataServiceBboxCache(bboxListService, 1500, 500, 2);

        return result;
    }
};

export default GeoDataSourceUtils;
