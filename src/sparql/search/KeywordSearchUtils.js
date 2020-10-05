import ExprVar from '../expr/ExprVar';
import E_LangMatches from '../expr/E_LangMatches';
import E_LogicalOr from '../expr/E_LogicalOr';
import E_Lang from '../expr/E_Lang';
import E_Bound from '../expr/E_Bound';
import E_Regex from '../expr/E_Regex';
import E_Str from '../expr/E_Str';
import E_Function from '../expr/E_Function';
import Concept from '../Concept';
import ElementGroup from '../element/ElementGroup';
import ElementOptional from '../element/ElementOptional';
import ElementFilter from '../element/ElementFilter';
import NodeValueUtils from '../NodeValueUtils';
import LabelUtils from '../LabelUtils';

var KeywordSearchUtils = {
    /**
     * ?s ?p ?o // your relation
     * Filter(Regex(Str(?o), 'searchString'))
     * 
     * if includeSubject is true, the output becomes:
     * 
     * Optional {
     *     ?s ?p ?o // your relation
     *     Filter(Regex(Str(?o), 'searchString'))
     * }
     * Filter(Regex(Str(?s), 'searchString') || Bound(?o))
     * 
     * 
     * 
     * @param relation
     * @returns
     */
    createConceptRegex: function(relation, searchString, includeSubject) {
        var result = includeSubject
            ? this.createConceptRegexIncludeSubject(relation, searchString)
            : this.createConceptRegexLabelOnly(relation, searchString);

        return result;
    },
   
    createConceptRegexLabelOnly: function(relation, searchString) {
        
        var result;
        if(searchString) {
            var element =
                new ElementGroup([
                    relation.getElement(),
                    new ElementFilter(
                        new E_Regex(new E_Str(new ExprVar(relation.getTargetVar())), searchString, 'i'))
               ]);
            
            result = new Concept(element, relation.getSourceVar());
        } else {
            result = null;
        }

        return result;
    },

    createConceptRegexIncludeSubject: function(relation, searchString) {
        var result;

        if(searchString) {
            var relEl = relation.getElement();
            var s = relation.getSourceVar();
            var o = relation.getTargetVar();
    
            // var nv = NodeValueUtils.makeString(searchString);
    
            var es = new ExprVar(s);
            var eo = new ExprVar(o);
            
            var innerExpr = new E_Regex(new E_Str(eo), searchString, 'i');
            
            var outerExpr = new E_LogicalOr(
                new E_Regex(new E_Str(es), searchString, 'i'),
                new E_Bound(eo));
            
    
            var element = new ElementGroup([
                new ElementOptional(
                    new ElementGroup([relEl, new ElementFilter(innerExpr)])),
                new ElementFilter(outerExpr)
            ]);
    
            result = new Concept(element, s);
        } else {
            result = null;
        }
        
        return result;
    },

    /**
     * ?s ?p ?o // relation
     * Filter(<bif:contains>(?o, 'searchString')
     */
    createConceptBifContains: function(relation, searchString) {
        var result;

        if(searchString) {
            var relEl = relation.getElement();
            var o = relation.getTargetVar();
            
            var eo = new ExprVar(o);
            var nv = NodeValueUtils.makeString(searchString);
            
            var element =
                new ElementGroup([
                    relation.getElement(),
                    new ElementFilter(new E_Function('<bif:contains>', [eo, nv]))
                ]);
    
            var s = relation.getSourceVar();
            result = new Concept(element, s);
        } else {
            result = null;
        }

        return result;
    }
};

export default KeywordSearchUtils;
