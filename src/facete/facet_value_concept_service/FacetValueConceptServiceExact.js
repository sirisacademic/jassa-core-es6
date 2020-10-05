import Class from '../../ext/Class';
import FacetValueConceptService from './FacetValueConceptService';
import FacetUtils from '../FacetUtils';
import shared from '../../util/shared';
var Promise = shared.Promise;


/**
 * Service for creating facet value concepts
 *
 * This is the basic implementation.
 */
var FacetValueConceptServiceExact = Class.create({
    initialize: function(facetConfig) {
        this.facetConfig = facetConfig;
    },

    prepareConcept: Promise.method(function(path, excludeSelfConstraints) {
        var result = FacetUtils.createConceptResources(this.facetConfig, path, excludeSelfConstraints);

        return result;
    }),

});

export default FacetValueConceptServiceExact;
