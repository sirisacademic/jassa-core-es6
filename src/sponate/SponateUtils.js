import ObjectUtils from '../util/ObjectUtils';
import PrefixUtils from '../util/PrefixUtils';
import Element from '../sparql/element/Element';
import ElementString from '../sparql/element/ElementString';
import TemplateParser from './TemplateParser';
import ListServiceUtils from './ListServiceUtils';
import AggMap from './agg/AggMap';
import MappedConcept from './MappedConcept';
import ExprVar from '../sparql/expr/ExprVar';
import Concept from '../sparql/Concept';
import AggUtils from './AggUtils';

var SponateUtils = {



    /**
     * Parses a sponate mapping spec object into a MappedConcept.
     *
     */
    parseSpec: function(spec, prefixMapping, templateParser) {
        var template = spec.template;

        var result
            = (template instanceof MappedConcept)
            ? template
            : this.parseSpecCore(spec, prefixMapping, templateParser)
            ;

        return result;
    },

    parseSpecCore: function(spec, prefixMapping, templateParser) {

        templateParser = templateParser || new TemplateParser();

        var template = spec.template;
        var from = spec.from;

        // Parse the 'from' attribute into an ElementFactory
        // TODO Move to util class
        var element;
        if(ObjectUtils.isString(from)) {

            var elementStr = from;

            if(prefixMapping != null) {
                var prefixes = prefixMapping.getNsPrefixMap();
                //var vars = sparql.extractSparqlVars(elementStr);
                elementStr = PrefixUtils.expandPrefixes(prefixes, elementStr);
            }

            element = new ElementString.create(elementStr);

            //elementFactory = new sparql.ElementFactoryConst(element);
        }
        else if(from instanceof Element) {
            element = from;
        }
//        else if(from instanceof ElementFactory) {
//            throw new Error('ElementFactories / functions in the FROM part not supported anymore');
//        }
        else if(ObjectUtils.isFunction(from)) {
            throw new Error('ElementFactories / functions in the FROM part not supported anymore');
        }
        else {
            throw new Error('Unknown argument type for FROM attribute', from);
        }

        //this.context.mapTableNameToElementFactory(name, elementFactory);

        // TODO The support joining the from element

        var tmp = templateParser.parseAgg(template);

        // Remove the outer most transformation wrapping an AggMap!
        var agg = AggUtils.unwrapAggTransform(tmp);

        // Extract the ID attribute
        var idExpr;


        //var tmp = AggUtils.unwrapAggTransform(agg);
        if(agg instanceof AggMap) {
            var keyBindingMapper = agg.getKeyBindingMapper();
            idExpr = keyBindingMapper.getExpr(); // TODO Check for whether the mapper provides getExpr()
        }
        else {
            throw new Error('Could not obtain ID attribute from aggregator');
        }

        var idVar;
        if(idExpr instanceof ExprVar) {
            idVar = idExpr.asVar();
        }
        else {
            throw new Error('Variable required for ID attribute, got an expression instead: ' + idExpr);
        }

        var concept = new Concept(element, idVar);

        var result = new MappedConcept(concept, agg);
        return result;
    },

};

export default SponateUtils;
