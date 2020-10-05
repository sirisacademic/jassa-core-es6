import ConceptUtils from '../sparql/ConceptUtils';
import LookupServiceSparqlQuery from '../service/lookup_service/LookupServiceSparqlQuery';
import LookupServiceTransform from '../service/lookup_service/LookupServiceTransform';
import LookupServiceFallback from '../service/lookup_service/LookupServiceFallback';
import LookupServiceFn from '../service/lookup_service/LookupServiceFn';
import LookupServiceIdFilter from '../service/lookup_service/LookupServiceIdFilter';
import LookupServiceChunker from '../service/lookup_service/LookupServiceChunker';
import BestLabelConfig from '../sparql/BestLabelConfig';
import ObjectUtils from '../util/ObjectUtils';
import MappedConceptUtils from './MappedConceptUtils';
import NodeUtils from '../rdf/NodeUtils';
import UriUtils from '../util/UriUtils';
import HashMap from '../util/collection/HashMap';
import AccUtils from './AccUtils';
import LiteralPreference from '../sparql/LiteralPreference';

var LookupServiceUtils = {

        /*
    createTransformAggResultSetPart: function(agg) {
        //var fn = LookupServiceUtils.createTransformAccResultSetPart(agg);

        var result = function(resultSetPart) {
            var acc = fn(resultSetPart);

            var r = acc.getValue();
            return r;
        };

        return result;
    },
    */

    createTransformAccResultSetPart: function(agg) {

        var result = function(resultSetPart) {
            // AccMap expected here
            var acc = agg.createAcc();
            //console.log('resultSetPart', resultSetPart);

            var bindings = resultSetPart.getBindings();
            bindings.forEach(function(binding) {
                acc.accumulate(binding);
            });

            //console.log('LSVAL: ' + JSON.stringify(agg));
            //var r = acc.getState();
            //return r;
            return acc;
        };

        return result;
    },


    createLookupServiceNodeLabels: function(sparqlService, literalPreference, chunkSize) { //langs, predicates) {
        //var blc = new BestLabelConfig(langs, predicates);
        literalPreference = literalPreference || new LiteralPreference();
        var blc = new BestLabelConfig(literalPreference);
        var mappedConcept = MappedConceptUtils.createMappedConceptBestLabel(blc);
        var result = this.createLookupServiceMappedConcept(sparqlService, mappedConcept);


        if(chunkSize) {
            result = new LookupServiceChunker(result, chunkSize);
        }

        result = new LookupServiceIdFilter(result, function(node) {
            // TODO Using a proper URI validator would increase quality
            //console.log('Node: ', node);
            var r = node && node.isUri();
            if(r) {
                var uri = node.getUri();
                r = UriUtils.isValidUri(uri);
            }
            return r;
        });

        var fallback = new LookupServiceFn(function(key) {
            var r = NodeUtils.toPrettyString(key);
            return r;
            //var r = new HashMap();

            //keys.forEach(function(key) {
                //var val = NodeUtils.toPrettyString(key);
                //r.put(key, val);
            //});

            //return r;
        });

//        var fallback = new LookupServiceTransform(result, function(doc, id) {
//        });

        result = new LookupServiceFallback(result, fallback, function(val, key) {
            var r = val == null || val.displayLabel == null;
            return r;
        }, function(fallback, primary) {
            var result = {};
            if(primary != null) {
                ObjectUtils.extend(result, primary); // Make a copy to avoid possibly corrupting cached data
            }

            result.displayLabel = fallback;

            return result;

        });


        return result;
    },

    /**
     * public static <T> LookupService<Node, T> createLookupService(QueryExecutionFactory sparqlService, MappedConcept<T> mappedConcept)
     */
    createLookupServiceMappedConcept: function(sparqlService, mappedConcept) {
        var ls = this.createLookupServiceMappedConceptAcc(sparqlService, mappedConcept);

        var result = new LookupServiceTransform(ls, function(acc) {
            var r = acc.getValue();
            return r;
        });

        return result;
        /*
        var concept = mappedConcept.getConcept();
        var query = ConceptUtils.createQueryList(concept);

        // TODO Set up a projection using the grouping variable and the variables referenced by the aggregator
        query.setQueryResultStar(true);

        var result = this.createLookupServiceAgg(sparqlService, query, concept.getVar(), mappedConcept.getAgg());

        return result;
*/
//        var ls = new LookupServiceSparqlQuery(sparqlService, query, concept.getVar());
//        var agg = mappedConcept.getAgg();
//        var fnTransform = this.createTransformAggResultSetPart(agg);
//
//        var result = new LookupServiceTransform(ls, fnTransform);
//        return result;
    },

    /*
    createLookupServiceAgg: function(sparqlService, query, groupVar, agg) {
        var ls = new LookupServiceSparqlQuery(sparqlService, query, groupVar);
        var fnTransform = this.createTransformAggResultSetPart(agg);

        var result = new LookupServiceTransform(ls, fnTransform);
        return result;
    },
    */


    createLookupServiceMappedConceptAcc: function(sparqlService, mappedConcept) {
        var concept = mappedConcept.getConcept();
        var query = ConceptUtils.createQueryList(concept);
        var groupVar = concept.getVar();

        // TODO Set up a projection using the grouping variable and the variables referenced by the aggregator
        query.setQueryResultStar(true);

        var aggMap = mappedConcept.getAgg();
        var subAgg = aggMap.getSubAgg();

        var ls = new LookupServiceSparqlQuery(sparqlService, query, groupVar);
        //var ls = this.createLookupServiceAcc(sparqlService, query, concept.getVar(), mappedConcept.getAgg());
        var fnTransform = this.createTransformAccResultSetPart(subAgg);

        var result = new LookupServiceTransform(ls, fnTransform);
        return result;
    }

};

export default LookupServiceUtils;
