import FacetTreeService from './facet_tree_service/FacetTreeService';
import HashMap from '../util/collection/HashMap';
import FacetServiceBuilder from './FacetServiceBuilder';
import FacetNodeState from './FacetNodeState';


var FacetTreeServiceUtils = {

    createFacetTreeService: function(sparqlService, facetTreeConfig) {


        var facetConfig = facetTreeConfig.getFacetConfig();
        //var tagMap = new HashMap();
        var pathToTags = facetTreeConfig.getPathToTags();

        //var pathToState = facetTreeConfig.getPathToState();

        var tagFn = function(entry) {
            var userFn = facetTreeConfig.getTagFn();
            if(userFn) {
                entry = userFn(entry);
            }

//            var key = entry.key;

//            var state = pathToState.get(key);
//            if(!state) {
//                state = new FacetNodeState();
//                pathToState.put(key, state);
//            }
//
//            entry.val.tags.state = state;
            return entry;
        };

        //var facetService = new facete.FacetServiceUtils.createFacetService(sparqlService, facetConfig, tagMap.asFn());
        var facetService = FacetServiceBuilder
            .core(sparqlService, facetConfig)
            .labelConfig()
            .index()
            .pathToTags(pathToTags)
            .tagFn(tagFn)
            .create();

        //var result = new FacetTreeService(facetService, pathToState.asFn());
        var result = new FacetTreeService(facetService, facetTreeConfig.getFacetTreeState());

        return result;
    }
};


export default FacetTreeServiceUtils;
