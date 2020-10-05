import Class from '../ext/Class';
import HashMap from '../util/collection/HashMap';
import NodeUtils from '../rdf/NodeUtils';
import NodeFactory from '../rdf/NodeFactory';
import ElementSubQuery from '../sparql/element/ElementSubQuery';
import ElementUnion from '../sparql/element/ElementUnion';
import ElementFilter from '../sparql/element/ElementFilter';
import ElementGroup from '../sparql/element/ElementGroup';
import Query from '../sparql/Query';
import Concept from '../sparql/Concept';
import ConceptUtils from '../sparql/ConceptUtils';
import NodeValueUtils from '../sparql/NodeValueUtils';
import ExprVar from '../sparql/expr/ExprVar';
import E_OneOf from '../sparql/expr/E_OneOf';
import E_Equals from '../sparql/expr/E_Equals';

//var ListServiceConcept = require('../service/list_service/ListServiceConcept');
import ListServiceSparqlQuery from '../service/list_service/ListServiceSparqlQuery';

//var FacetService = require('./FacetService');
import LookupService from '../service/lookup_service/LookupService';

import FacetUtils from './FacetUtils';
import Relation from '../sparql/Relation';
import RelationUtils from '../sparql/RelationUtils';
import VarUtils from '../sparql/VarUtils';
import AggMap from '../sponate/agg/AggMap';
import AggTransform from '../sponate/agg/AggTransform';
import AggLiteral from '../sponate/agg/AggLiteral';
import BindingMapperExpr from '../sponate/binding_mapper/BindingMapperExpr';
import LookupServiceUtils from '../sponate/LookupServiceUtils';
import ServiceUtils from '../sponate/ServiceUtils';
import shared from '../util/shared';
var Promise = shared.Promise;

import QueryUtils from '../sparql/QueryUtils';

var CountUtils = {
    createAggMapCount: function(sourceVar, targetVar) {
        //var result = new AggTransform(new AggLiteral(new BindingMapperExpr(new ExprVar(targetVar))), NodeUtils.getValue);
        var result =
            new AggMap(
                new BindingMapperExpr(new ExprVar(sourceVar)),
                new AggTransform(new AggLiteral(new BindingMapperExpr(new ExprVar(targetVar))), NodeUtils.getValue));

        return result;
    },

    execQueries: function(sparqlService, subQueries, sourceVar, targetVar) {
        var query = QueryUtils.createQueryUnionSubQueries(subQueries, [sourceVar, targetVar]);

        var result;
        if(query) {
            var agg = this.createAggMapCount(sourceVar, targetVar);
            result = ServiceUtils.execAgg(sparqlService, query, agg);
            //var ls = LookupServiceUtils.createLookupServiceAgg(sparqlService, query, sourceVar, agg);
            //result = ls.lookup(); // unconstrained lookup
        } else {
            result = Promise.resolve(new HashMap());
        }

        return result;
    },


    createQueriesPreCountCore: function(facetRelationIndex, countVar, properties, propertyQueryFn) {
        // Create the queries
        var defaultRelation = facetRelationIndex.getDefaultRelation();
        var propertyToRelation = facetRelationIndex.getPropertyToRelation();
//throw new Error('here' + JSON.stringify(properties));
        var result = properties.map(function(property) {
            var relation = propertyToRelation.get(property);
            if(!relation) {
                relation = defaultRelation;
            }

            var r = propertyQueryFn(relation, property, countVar);
            return r;
        });

        return result;
    },

    createQueriesPreCount: function(facetRelationIndex, countVar, properties, rowLimit) {
        var result = this.createQueriesPreCountCore(facetRelationIndex, countVar, properties, function(relation, property, countVar) {
            var r = RelationUtils.createQueryRawSize(relation, property, countVar, rowLimit);
            return r;
        });

        return result;
    },

    createQueriesExactCount: function(facetRelationIndex, countVar, properties) {
        var result = this.createQueriesExactCountSingle(facetRelationIndex, countVar, properties);
        return result;
    },

    createQueriesExactCountSingle: function(facetRelationIndex, countVar, properties) {
        var result = this.createQueriesPreCountCore(facetRelationIndex, countVar, properties, function(relation, property, countVar) {
            var sourceVar = relation.getSourceVar();

            var filter = new ElementFilter(new E_Equals(new ExprVar(sourceVar), NodeValueUtils.makeNode(property)));
            var filteredRel = new Relation(new ElementGroup([relation.getElement(), filter]), sourceVar, relation.getTargetVar());

            var r = RelationUtils.createQueryDistinctValueCount(filteredRel, countVar);
            return r;
        });

        return result;
    },


    // TODO This approach uses ?property In (propertyList)
    // but it is utterly slow on virtuoso :( - thus we created the single version
    createQueriesExactCountMulti: function(facetRelationIndex, countVar, properties) {
        var sourceVar = facetRelationIndex.getSourceVar();
        var defaultRelation = facetRelationIndex.getDefaultRelation();
        var propertyToRelation = facetRelationIndex.getPropertyToRelation();

        var defaultProperties = [];
        var result = [];

        // If properties map to a relation, we can create the query right away,
        // as this indicates that special constraints apply that do not apply to any other property
        properties.forEach(function(property) {
            var relation = propertyToRelation.get(property);
            if(!relation) {
                defaultProperties.push(property);
            } else {
                var query = RelationUtils.createQueryDistinctValueCount(relation, countVar);
                result.push(query);
            }
        });

        // Those properties that did not map to a relation can be grouped into a single query
        var fr = defaultRelation;
        var filter = new ElementFilter(new E_OneOf(new ExprVar(sourceVar), defaultProperties));
        var filteredRel = new Relation(new ElementGroup([fr.getElement(), filter]), fr.getSourceVar(), fr.getTargetVar());
        var defaultQuery = RelationUtils.createQueryDistinctValueCount(filteredRel, countVar);

        result.push(defaultQuery);

        return result;
    },

};

export default CountUtils;
