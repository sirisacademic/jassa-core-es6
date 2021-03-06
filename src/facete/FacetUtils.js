import Concept from '../sparql/Concept';
import Relation from '../sparql/Relation';
import HashMap from '../util/collection/HashMap';
import NodeFactory from '../rdf/NodeFactory';
import Triple from '../rdf/Triple';
import NodeUtils from '../rdf/NodeUtils';
import ExprVar from '../sparql/expr/ExprVar';
import E_Equals from '../sparql/expr/E_Equals';
import NodeValue from '../sparql/expr/NodeValue';
import NodeValueUtils from '../sparql/NodeValueUtils';
import E_LogicalNot from '../sparql/expr/E_LogicalNot';
import E_OneOf from '../sparql/expr/E_OneOf';
import ElementGroup from '../sparql/element/ElementGroup';
import ElementFilter from '../sparql/element/ElementFilter';
import ElementTriplesBlock from '../sparql/element/ElementTriplesBlock';
import PatternUtils from '../sparql/PatternUtils';
import ElementUtils from '../sparql/ElementUtils';
import VarUtils from '../sparql/VarUtils';
import Step from './Step';
import StepUtils from './StepUtils';
import StepRelation from './StepRelation';
import FacetRelationIndex from './FacetRelationIndex';
import PathHead from './PathHead';

var FacetUtils = {

    /**
     * Create a concept for the set of resources at a given path.
     * Note that this is distinct from the facets and the facet values:
     * If the facets are properties, and the facet values are objects, then
     * this this is the subjects.
     *
     */
    createConceptResources: function(facetConfig, path, excludeSelfConstraints) {
        var baseConcept = facetConfig.getBaseConcept();
        var rootFacetNode = facetConfig.getRootFacetNode();
        var constraintManager = facetConfig.getConstraintManager();

        var excludePath = excludeSelfConstraints ? path : null;

        var elementsAndExprs = constraintManager.createElementsAndExprs(rootFacetNode, excludePath);
        var constraintElements = elementsAndExprs.getElements();
        var constraintExprs = elementsAndExprs.getExprs();

        var facetNode = rootFacetNode.forPath(path);
        var facetVar = facetNode.getVar();

        var baseElements = baseConcept.getElements();
        var pathElements = facetNode.getElements();

        var facetElements = [];
        facetElements.push.apply(facetElements, pathElements);
        facetElements.push.apply(facetElements, constraintElements);

        if(baseConcept.isSubjectConcept()) {
            if(facetElements.length === 0) {
                facetElements = baseElements;
            }
        } else {
            facetElements.push.apply(facetElements, baseElements);
        }

        var filterElements = constraintExprs.map(function(expr) {
            var element = new ElementFilter(expr);
            return element;
        });

        facetElements.push.apply(facetElements, filterElements);

        var finalElement = (new ElementGroup(facetElements)).flatten();

        //var finalElements = ElementUtils.flatten(facetElements);
        //finalElements = ElementUtils.flattenElements(finalElements);


        var result = new Concept(finalElement, facetVar);
        return result;
    },

    /**
     * Creates a concept that fetches all facets at a given path
     *
     * Note that the returned concept does not necessarily
     * offer access to the facet's values (see first example).
     *
     * Examples:
     * - ({?s a rdf:Property}, ?s)
     * - ({?s a ex:Foo . ?s ?p ?o }, ?p)
     *
     * TODO We should add arguments to support scanLimit and resourceLimit (such as: only derive facets based on distinct resources within the first 1000000 triples)
     *
     */
    createConceptFacets: function(facetConfig, pathHead) {
        var relation = this.createRelationFacets(facetConfig, pathHead);

        //var relation.Concept();
        var result = new Concept(relation.getElement(), relation.getSourceVar());
        return result;
    },


    /**
     * Creates a relation that relates facets to their values.
     * Example ({ ?s a Airport . ?s ?p ?o}, ?p , ?o)
     *
     * Common method to create concepts for both facets and facet values.
     *
     * This method is the core for both creating concepts representing the set
     * of facets as well as facet values.
     *
     * TODO Possibly add support for specifying the p ond o base var names
     *
     * @param path The path for which to describe the set of facets
     * @param isInverse Whether at the given path the outgoing or incoming facets should be described
     * @param enableOptimization Returns the concept (?p a Property, ?p) in cases where (?s ?p ?o, ?p) would be returned.
     * @param singleProperty Optional. Whether to create a concept where only a single property at the given path is selected. Useful for creating concepts for individual properties
     */
    createRelationFacets: function(facetConfig, pathHead, singleProperty) {

        var path = pathHead.getPath();
        var isInverse = pathHead.isInverse();

        var baseConcept = facetConfig.getBaseConcept();
        var rootFacetNode = facetConfig.getRootFacetNode();
        var constraintManager = facetConfig.getConstraintManager();

        var singleStep = null;
        if(singleProperty) {
            singleStep = new Step(singleProperty.getUri(), isInverse);
        }

        var excludePath = null;
        if(singleStep) {
            excludePath = path.copyAppendStep(singleStep);
        }

        var elementsAndExprs = constraintManager.createElementsAndExprs(rootFacetNode, excludePath);
        var constraintElements = elementsAndExprs.toElements();

        var facetNode = rootFacetNode.forPath(path);
        var facetVar = facetNode.getVar();

        var baseElements = baseConcept.getElements();

        var facetElements;
        if(baseConcept.isSubjectConcept()) {
            facetElements = constraintElements;
        } else {
            facetElements = baseElements.concat(constraintElements);
        }

        var varsMentioned = PatternUtils.getVarsMentioned(facetElements); //.getVarsMentioned();

        var propertyVar = VarUtils.freshVar('p', varsMentioned);
        var objectVar = VarUtils.freshVar('o', varsMentioned);

        //console.log('propertyVar: ' + propertyVar);

        var triple = !isInverse
            ? new Triple(facetVar, propertyVar, objectVar)
            : new Triple(objectVar, propertyVar, facetVar);

        facetElements.push(new ElementTriplesBlock([triple]));

        if(singleStep) {
            var exprVar = new ExprVar(propertyVar);
            var expr = new E_Equals(exprVar, NodeValueUtils.makeNode(singleProperty));
            facetElements.push(new ElementFilter(expr));
        }

        var pathElements = facetNode.getElements();
        facetElements.push.apply(facetElements, pathElements);

        var finalElement = (new ElementGroup(facetElements)).flatten();
        //var finalElements = ElementUtils.flatten(facetElements);
        //finalElements = sparql.ElementUtils.flattenElements(finalElements);

        //var facetConcept = new ns.Concept(finalElements, propertyVar);
        var result = new Relation(finalElement, propertyVar, objectVar);
        return result;
    },

    /**
     * The returned relation holds a reference
     * to the facet and facet value variables.
     *
     * Intended use is to first obtain the set of properties, then use this
     * method, and constrain the concept based on the obtained properties.
     *
     * Examples:
     * - ({?p a rdf:Propery . ?s ?p ?o }, ?p, ?o })
     * - ({?s a ex:Foo . ?o ?p ?s }, ?p, ?o)
     *
     *
     * @param path
     * @param isInverse
     * @param properties {jassa.rdf.Node}
     * @param isNegated {boolean} True if the properties should be considered blacklisted
     */
    createStepRelationsProperties: function(facetConfig, pathHead, properties, isNegated) {
        var result = [];

        var path = pathHead.getPath();
        var isInverse = pathHead.isInverse();


        var baseConcept = facetConfig.getBaseConcept();
        var rootFacetNode = facetConfig.getRootFacetNode();
        var constraintManager = facetConfig.getConstraintManager();

        var propertyNames = properties.map(NodeUtils.getUri);

        var facetNode = rootFacetNode.forPath(path);

        // Set up the concept for fetching facets on constrained paths
        // However make sure to filter them by the user supplied array of properties
        var rawConstrainedSteps = constraintManager.getConstrainedSteps(path);

        var constrainedSteps = rawConstrainedSteps.filter(function(step) {
            var isSameDirection = step.isInverse() === isInverse;
            if(!isSameDirection) {
                return false;
            }

            var isContained = propertyNames.indexOf(step.getPropertyName()) >= 0;

            var r = isNegated ? !isContained : isContained;
            return r;
        });

        var excludePropertyNames = constrainedSteps.map(StepUtils.getPropertyName);

        var includeProperties = [];
        var excludeProperties = [];

        properties.forEach(function(property) {
            if(excludePropertyNames.indexOf(property.getUri()) >= 0) {
                excludeProperties.push(property);
            }
            else {
                includeProperties.push(property);
            }
        });

        // The first part of the result is formed by  the constrained steps
        var constrainedStepRelations = this.createStepRelations(facetConfig, path, constrainedSteps);
        result.push.apply(result, constrainedStepRelations);

        // Set up the concept for fetching facets of all concepts that were NOT constrained
        //var genericConcept = facetFacadeNode.createConcept(true);
        var genericRelation = this.createRelationFacets(facetConfig, pathHead);

        // Combine this with the user specified array of properties
        var filterElement = this.createElementFilterBindVar(genericRelation.getSourceVar(), includeProperties, false);
        if(filterElement != null) {
            genericRelation = new Relation(
                new ElementGroup([genericRelation.getElement(), filterElement]), // TODO flatten?
                genericRelation.getSourceVar(),
                genericRelation.getTargetVar());
        }

        // Important: If there are no properties to include, we can drop the genericConcept
        if(includeProperties.length > 0 || isNegated) {
            var genericStepRelation = new StepRelation(null, genericRelation);

            result.push(genericStepRelation);
        }

        return result;
    },

    createFacetRelationIndex: function(facetConfig, pathHead) {
        var stepRelations = FacetUtils.createStepRelationsProperties(facetConfig, pathHead, [], true);

        // Retrieve the variable of the step relations
        // Note: all relations are assumed to use the same source var
        var sourceVar = stepRelations.length > 0 ? stepRelations[0].getRelation().getSourceVar() : null;

        // index by step.property
        var propertyToRelation = new HashMap();

        var defaultRelation = null;
        stepRelations.forEach(function(sr) {
            var step = sr.getStep();
            var relation = sr.getRelation();

            var p = step ? NodeFactory.createUri(step.getPropertyName()) : null;
            if(p) {
                propertyToRelation.put(p, relation);
            } else {
                defaultRelation = relation;
            }
        });

        var result = new FacetRelationIndex(sourceVar, defaultRelation, propertyToRelation);
        return result;
    },

    createElementFilterBindVar: function(v, nodes, isNegated) {
        var result = null;
        if(nodes.length > 0) {
            var expr = new E_OneOf(new ExprVar(v), nodes);

            if(isNegated) {
                expr = new E_LogicalNot(expr);
            }

            result = new ElementFilter(expr);
        }

        return result;
    },


    createStepRelations: function(facetConfig, path, constrainedSteps) {
        var self = this;

        var result = constrainedSteps.map(function(step) {
            var r = self.createStepRelation(facetConfig, path, step);
            return r;
        });

        return result;
    },

    createStepRelation: function(facetConfig, path, step) {
        var propertyName = step.getPropertyName();
        var property = NodeFactory.createUri(propertyName);

        var pathHead = new PathHead(path, step.isInverse());
        var targetConcept = this.createRelationFacets(facetConfig, pathHead, property);

        var result = new StepRelation(step, targetConcept);
        return result;
    },

};

export default FacetUtils;
