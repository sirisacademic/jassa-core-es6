import ElementUtils from '../sparql/ElementUtils';
import ExprVar from '../sparql/expr/ExprVar';
import E_Lang from '../sparql/expr/E_Lang';
import E_LangMatches from '../sparql/expr/E_LangMatches';
import E_Regex from '../sparql/expr/E_Regex';
import E_Equals from '../sparql/expr/E_Equals';
import NodeValueUtils from '../sparql/NodeValueUtils';
import ElementTriplesBlock from '../sparql/element/ElementTriplesBlock';
import ElementsAndExprs from './ElementsAndExprs';
import Concept from '../sparql/Concept';
import ConceptUtils from '../sparql/ConceptUtils';

var ConstraintUtils = {
    createConstraintExists: function(rootFacetNode, path) {

        var facetNode = rootFacetNode.forPath(path);
        var elements = ElementUtils.createElementsTriplesBlock(facetNode.getTriples());
        var result = new ElementsAndExprs(elements, []);

        return result;
    },

    createConstraintLang: function(rootFacetNode, path, langStr) {
        var facetNode = rootFacetNode.forPath(path);

        var pathVar = facetNode.getVar();
        var exprVar = new ExprVar(pathVar);

        var elements = ElementUtils.createElementsTriplesBlock(facetNode.getTriples());

        // NOTE Value is assumed to be node holding a string, maybe check it here
        var val = langStr; //constraintSpec.getValue().getLiteralValue();

        var exprs = [new E_LangMatches(new E_Lang(exprVar), val)];

        var result = new ElementsAndExprs(elements, exprs);

        //console.log('constraintSpec.getValue() ', constraintSpec.getValue());
        return result;
    },

    createConstraintRegex: function(rootFacetNode, path, str) {
        var facetNode = rootFacetNode.forPath(path);

        var pathVar = facetNode.getVar();
        var exprVar = new ExprVar(pathVar);

        var elements = ElementUtils.createElementsTriplesBlock(facetNode.getTriples());

        // NOTE Value is assumed to be node holding a string, maybe check it here
        var val = str; //constraintSpec.getValue().getLiteralValue();


        var exprs = [new E_Regex(exprVar, val, 'i')];

        var result = new ElementsAndExprs(elements, exprs);

        //console.log('constraintSpec.getValue() ', constraintSpec.getValue());
        return result;
    },

    createConstraintEquals: function(rootFacetNode, path, node) {
        var facetNode = rootFacetNode.forPath(path);

        var pathVar = facetNode.getVar();
        var exprVar = new ExprVar(pathVar);

        var elements = ElementUtils.createElementsTriplesBlock(facetNode.getTriples());

        //var valueExpr = constraintSpec.getValue();
        var valueExpr = NodeValueUtils.makeNode(node); //constraintSpec.getValue());


        var exprs = [new E_Equals(exprVar, valueExpr)];

        var result = new ElementsAndExprs(elements, exprs);

        //console.log('constraintSpec.getValue() ', constraintSpec.getValue());
        return result;
    },

    createConstraintConcept: function(rootFacetNode, path, filterConcept) {
        var facetNode = rootFacetNode.forPath(path);

        var pathVar = facetNode.getVar();
        var element = new ElementTriplesBlock(facetNode.getTriples());

        var pathConcept = new Concept(element, pathVar);
        var resultConcept = ConceptUtils.createCombinedConcept(pathConcept, filterConcept, true, false);

        var exprs = [];

        var result = new ElementsAndExprs([resultConcept.getElement()], exprs);

        //console.log('constraintSpec.getValue() ', constraintSpec.getValue());
        return result;

    },
};

export default ConstraintUtils;
