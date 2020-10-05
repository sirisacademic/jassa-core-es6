import Class from '../../ext/Class';
import NodeFactory from '../../rdf/NodeFactory';
import Concept from '../../sparql/Concept';
import ConceptUtils from '../../sparql/ConceptUtils';

//var ListServiceConcept = require('../../service/list_service/ListServiceConcept');
import ListServiceArray from '../../service/list_service/ListServiceArray';

import ListServiceSparqlQuery from '../../service/list_service/ListServiceSparqlQuery';
import ListServiceTransformItem from '../../service/list_service/ListServiceTransformItem';
import FacetService from './FacetService';
import FacetUtils from '../FacetUtils';
import RelationUtils from '../../sparql/RelationUtils';
import VarUtils from '../../sparql/VarUtils';
import Step from '../Step';
import Path from '../Path';
import shared from '../../util/shared';
var Promise = shared.Promise;

/*
var properties = [];
entries.forEach(function(entry) {
    properties.push(entry.key);
});
*/

var FacetServiceSparql = Class.create(FacetService, {
    initialize: function(sparqlService, facetConceptSupplier) {
        this.sparqlService = sparqlService;
        this.facetConceptSupplier = facetConceptSupplier;
    },

    /**
     * Returns a list service, that yields JSON documents of the following form:
     * {
     *   id: property {jassa.rdf.Node},
     *   countInfo: { count: , hasMoreItems: true/false/null }
     * }
     */
    prepareListService: function(pathHead) {

        //console.log('Preparing list service for pathHead: ' + pathHead);

        // null indicates to return the root facet
        var listService;
        if(pathHead == null) {
            var path = new Path();
            var superRootFacets = [{
                key: path,
                val: {
                    path: path,
                    property: NodeFactory.createUri('http://facete.aksw.org/resource/rootFacet')
                }
            }];

            listService = new ListServiceArray(superRootFacets, function(concept) {
                // TODO Should we allow filtering by the root facet? I doubt it.
                return function(item) {
                    return true;
                };
            });
        } else {


            var concept = this.facetConceptSupplier.getConcept(pathHead);

            var query = ConceptUtils.createQueryList(concept);

            listService = new ListServiceSparqlQuery(this.sparqlService, query, concept.getVar(), false, true);
            listService = new ListServiceTransformItem(listService, function(entry) {

                // Replace the keys with the appropriate paths
                var id = entry.key;

                // TODO DESIGN ISSUE Should the ids here be the property nodes or the whole paths?
                // It seems the property nodes makes life easier on this level; but only time will tell
                // So for now we use the key as the ID but already compute the path attribute here
                var step = new Step(id.getUri(), pathHead.isInverse());
                var path = pathHead.getPath().copyAppendStep(step);

                var r = {
                    key: id,
                    val: {
                        path: path,
                        property: id
                    }
                };

                // Create steps from the properties

    //            var r = {
    //                key: path,
    //                val: {
    //                    path: path,
    //                    property: entry.key
    //                }
    //            };

                return r;
            });
        }

        var result = Promise.resolve(listService);

        return result;
    },

});

export default FacetServiceSparql;
