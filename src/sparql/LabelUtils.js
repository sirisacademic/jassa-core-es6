import Triple from '../rdf/Triple';
import NodeFactory from '../rdf/NodeFactory';
import NodeValueUtils from './NodeValueUtils';
import ExprVar from './expr/ExprVar';
import E_OneOf from './expr/E_OneOf';
import E_LangMatches from './expr/E_LangMatches';
import E_LogicalOr from './expr/E_LogicalOr';
import E_Lang from './expr/E_Lang';
import E_Bound from './expr/E_Bound';
import E_Regex from './expr/E_Regex';
import E_Str from './expr/E_Str';
import ExprUtils from './ExprUtils';
import Concept from './Concept';
import Relation from './Relation';
import ConceptUtils from './ConceptUtils';
import ElementTriplesBlock from './element/ElementTriplesBlock';
import ElementGroup from './element/ElementGroup';
import ElementOptional from './element/ElementOptional';
import ElementFilter from './element/ElementFilter';
import VarUtils from './VarUtils';
import BestLabelConfig from './BestLabelConfig';

var LabelUtils = {

    createRelationLiteralPreference: function(literalPreference) {
        var blc = new BestLabelConfig(literalPreference);
        var result = LabelUtils.createRelationPrefLabels(blc);
        return result;
    },

    createRelationPrefLabels: function(bestLabelConfig) {

        var prefLangs = bestLabelConfig.getLangs();
        var prefPreds = bestLabelConfig.getPredicates();

        var s = bestLabelConfig.getSubjectVar();
        var p = bestLabelConfig.getPredicateVar();
        var o = bestLabelConfig.getObjectVar();


        //var subjectExpr = new ExprVar(s);
        var propertyExpr = new ExprVar(p);
        var labelExpr = new ExprVar(o);

        // Second, create the element
        var langTmp = prefLangs.map(function(lang) {
            var r = new E_LangMatches(new E_Lang(labelExpr), NodeValueUtils.makeString(lang));
            return r;
        });

        // Combine multiple expressions into a single logicalOr expression.
        var langConstraint = ExprUtils.orify(langTmp);

        //var propFilter = new sparql.E_LogicalAnd(
        var propFilter = new E_OneOf(propertyExpr, prefPreds);
        //);

        var els = [];
        els.push(new ElementTriplesBlock([ new Triple(s, p, o)] ));
        els.push(new ElementFilter(propFilter));
        els.push(new ElementFilter(langConstraint));

        var langElement = new ElementGroup(els);

        //var result = new Concept(langElement, s);
        var result = new Relation(langElement, s, o);
        return result;
    },
};

export default LabelUtils;
