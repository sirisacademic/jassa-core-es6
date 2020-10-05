import rdf from '../vocab/rdf';
import owl from '../vocab/owl';
import Triple from '../rdf/Triple';
import ElementTriplesBlock from '../sparql/element/ElementTriplesBlock';
import ElementFilter from '../sparql/element/ElementFilter';
import ElementGroup from '../sparql/element/ElementGroup';
import E_LogicalOr from '../sparql/expr/E_LogicalOr';
import E_Equals from '../sparql/expr/E_Equals';
import ExprVar from '../sparql/expr/ExprVar';
import Concept from '../sparql/Concept';
import NodeValueUtils from '../sparql/NodeValueUtils';
import VarUtils from '../sparql/VarUtils';

var CannedConceptUtils = {

    /**
     * Parser.parseGraphPattern(
     * {
     *   ?s a ?o .
     *   Filter(?o = rdf:Property || ?o = owl:DatatypeProperty || ?o = owl:ObjectProperty || ?o = owl:AnnotationProperty)
     *   # Alternative:
     *   Filter(?o In (rdf:Property, owl:DatatypeProperty, owl:ObjectProperty, owl:AnnotationProperty))
     * }
     *
     */
    createConceptDeclaredProperties: function(s, o) {
        s = s || VarUtils.s;
        o = o || VarUtils.o;

        var eo = new ExprVar(o);

        var rdfProperty = NodeValueUtils.makeNode(rdf.Property);
        var owlDatatypeProperty = NodeValueUtils.makeNode(owl.DatatypeProperty);
        var owlObjectProperty = NodeValueUtils.makeNode(owl.ObjectProperty);
        var owlAnnotationProperty = NodeValueUtils.makeNode(owl.AnnotationProperty);

        var result = new Concept(
            new ElementGroup([
                new ElementTriplesBlock([new Triple(s, rdf.type, o)]),
                new ElementFilter(
                    new E_LogicalOr(
                        new E_Equals(eo, rdfProperty),
                        new E_LogicalOr(
                            new E_Equals(eo, owlDatatypeProperty),
                            new E_LogicalOr(
                                new E_Equals(eo, owlObjectProperty),
                                new E_Equals(eo, owlAnnotationProperty)
                            )
                        )
                    )
                )
            ]),
            s);

        return result;
    }

    // TODO We need to integrate the rdfstore js parser, so we can do Concept.parse();
//    createConceptDeclaredProperties: function() {
//
//        var types = [rdf.Property, owl.AnnotationProperty, owl.DatatypeProperty, owl.ObjectProperty];
//
//        var o = VarUtils.o;
//        var exprVar = new ExprVar(o);
//        var typeExprs = _(types).map(function(node) {
//            var nodeValue = NodeValue.makeNode(node);
//            var expr = new E_Equals(exprVar, nodeValue);
//        return expr;
//
//
//        var filterExpr = ExprUtils.orify(typeExprs);
//
//        triple = new Triple(propertyVar, vocab.rdf.type, v);
//
//        var element = new ElementGroup([
//            new ElementTriplesBlock([triple]),
//            new ElementFilter(filterExpr)
//        ]);
//
//        //console.log('ELEMENTE' + element);
//
//        facetElements.push(element);
//
//    },


};


export default CannedConceptUtils;
