import Class from '../ext/Class';
import ListServiceTransformConcept from '../service/list_service/ListServiceTransformConcept';
import ListServiceConceptKeyLookup from '../service/list_service/ListServiceConceptKeyLookup';
import ListServiceTransformItems from '../service/list_service/ListServiceTransformItems';
import LookupServiceUtils from '../sponate/LookupServiceUtils';
import FacetValueService from './facet_value_service/FacetValueService';
import FacetValueServiceWrapListService from './facet_value_service/FacetValueServiceWrapListService';
import LiteralPreference from '../sparql/LiteralPreference';
import KeywordSearchUtils from '../sparql/search/KeywordSearchUtils';
import LabelUtils from '../sparql/LabelUtils';


var FacetValueServiceBuilder = Class.create({
    initialize: function(facetValueService, sparqlService, facetConfig) {
        this.facetValueService = facetValueService;
        this.sparqlService = sparqlService;
        this.facetConfig = facetConfig;
    },

    labelConfig: function(literalPreference) {
        literalPreference = literalPreference || new LiteralPreference();

        this._labelConfigLookup(literalPreference);
        this._labelConfigFilter(literalPreference);

        return this;
    },

    wrapListService: function(listServiceWrapperFn) {
        this.facetValueService = new FacetValueServiceWrapListService(this.facetValueService, listServiceWrapperFn);

        return this;
    },

    constraintTagging: function() {
        var constraintManager = this.facetConfig.getConstraintManager();

        var listServiceWrapperFn = function(listService, path) {
            var r = new ListServiceTransformItems(listService, function(entries) {

                var cs = constraintManager.getConstraintsByPath(path);
                var values = {};
                cs.forEach(function(c) {
                    if(c.getName() === 'equals') {
                        values[c.getValue()] = true;
                    }
                });

                entries.forEach(function(entry) {
                    var item = entry.val;

                    var isConstrained = values['' + item.node];
                    item.isConstrainedEqual = isConstrained;
                });
                //$scope.facetValues = items;
                return entries;
            });

            return r;
        };

        this.wrapListService(listServiceWrapperFn);
        return this;
    },


    _labelConfigFilter: function(literalPreference) {
        // TODO: Make the search function configurable

        var fnTransformSearch = function(searchString) {
            var r;
            if(searchString) {

                var relation = LabelUtils.createRelationLiteralPreference(literalPreference);
                // TODO Make it configurable to whether scan URIs too (the true argument)
                r = KeywordSearchUtils.createConceptRegex(relation, searchString, true);
                //var result = sparql.KeywordSearchUtils.createConceptBifContains(relation, searchString);
            } else {
                r = null;
            }

            return r;
        };


        var listServiceWrapperFn = function(ls) {
          var r = new ListServiceTransformConcept(ls, fnTransformSearch);
          return r;
        };

        this.wrapListService(listServiceWrapperFn);
        return this;
    },

    _labelConfigLookup: function(literalPreference) {
        //this._labelConfigLabels(bestLiteralConfig);
        //this._labelConfigFilter(bestLiteralConfig);

        var self = this;

        var listServiceWrapperFn = function(ls) {
            var lookupServiceNodeLabels = LookupServiceUtils.createLookupServiceNodeLabels(self.sparqlService, literalPreference);

            var r = new ListServiceConceptKeyLookup(ls, lookupServiceNodeLabels, null, function(entry, lookup) {
                entry.val.labelInfo = lookup;
                return entry;
            });
            return r;
        };

        this.wrapListService(listServiceWrapperFn);
        return this;
    },

    create: function() {
        return this.facetValueService;
    }
});


FacetValueServiceBuilder.core = function(sparqlService, facetConfig, rowLimit) {
    var facetValueService = new FacetValueService(sparqlService, facetConfig, rowLimit);

    var result = new FacetValueServiceBuilder(facetValueService, sparqlService, facetConfig);
    return result;
};

export default FacetValueServiceBuilder;
