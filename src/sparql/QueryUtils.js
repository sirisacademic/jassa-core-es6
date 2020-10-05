import ArrayUtils from '../util/ArrayUtils';
import Triple from '../rdf/Triple';
import ExprVar from './expr/ExprVar';
import E_OneOf from './expr/E_OneOf';
import ExprAggregator from './expr/ExprAggregator';
import AggCount from './agg/AggCount';
import ElementFilter from './element/ElementFilter';
import ElementGroup from './element/ElementGroup';
import ElementUnion from './element/ElementUnion';
import ElementSubQuery from './element/ElementSubQuery';
import ElementTriplesBlock from './element/ElementTriplesBlock';
import SparqlIo from '../io/SparqlIo';

//var VarUtils = require('./VarUtils');

import Query from './Query';

var QueryUtils = {

    injectElement: function(query, element) {
        var old = query.getQueryPattern();

        var tmp = new ElementGroup([old, element]);
        var newQueryPattern = tmp.flatten();

        query.setQueryPattern(newQueryPattern);
        return query;
    },

    injectSortElement: function(query, sortElement) {
        var e = sortElement.getElement();

        QueryUtils.injectElement(query, e);

        var scs = sortElement.getSortConditions();
        // extend the query pattern with
        var arr = query.getOrderBy();
        ArrayUtils.clear(arr);
        ArrayUtils.addAll(arr, scs);

        return query;
    },


    // This method is dangerous as it attempts to handle too many cases
    // don't use
    createQueryCount: function(elements, limit, variable, outputVar, groupVars, useDistinct, options) {
        var element = elements.length === 1 ? elements[0] : new ElementGroup(elements);

        var exprVar = variable ? new ExprVar(variable) : null;


        var queryPattern;

        var needsSubQuery = limit || useDistinct || (groupVars && groupVars.length > 0);
        if(needsSubQuery) {

            var subQuery = new Query();
            subQuery.setQueryPattern(element);

            if(groupVars) {
                for(var i = 0; i < groupVars.length; ++i) {
                    var groupVar = groupVars[i];
                    subQuery.getProject().add(groupVar);
                    //subQuery.groupBy.push(groupVar);
                }
            }

            if(variable) {
                subQuery.getProject().add(variable);
            }

            if(subQuery.getProjectVars().length === 0) {
                subQuery.setQueryResultStar(true);
            }

            subQuery.setDistinct(useDistinct);
            subQuery.setLimit(limit);

            queryPattern = new ElementSubQuery(subQuery);
        } else {
            queryPattern = new ElementGroup(elements);
        }



        var result = new Query();
        result.setQueryPattern(queryPattern);

        if(groupVars) {
            groupVars.forEach(function(groupVar) {
                result.getProject().add(groupVar);
                result.getGroupBy().push(new ExprVar(groupVar));
            });
        }

        result.getProject().add(outputVar, new ExprAggregator(null, new AggCount()));

        return result;
    },


    createQueryUnionSubQueries: function(subQueries, projectVars) {
        var result;

        if(subQueries.length === 0) {
            result = null;
        } else {

            if(subQueries.length === 1) {
                result = subQueries[0];
            } else {
                // Convenience assumption if no project vars are provided
                projectVars = projectVars || subQueries[0].getProjectVars();

                // Create a union over the sub queries
                var subElements = subQueries.map(function(subQuery) {
                    var r = new ElementSubQuery(subQuery);
                    return r;
                });

                var union = new ElementUnion(subElements);

                result = new Query();
                result.setQuerySelectType();
                projectVars.forEach(function(v) {
                    result.getProject().add(v);
                });
                //result.getProject().add(sourceVar);
                //result.getProject().add(targetVar);
                result.setQueryPattern(union);
            }
        }

        return result;
    },

    // iris as rdf.Nodes
    createQueryDescribeViaSelect: function(iris, s, p, o) {

        var result = new Query();
        result.setQuerySelectType();
        result.setDistinct(true);

        var element = new ElementGroup([
            new ElementTriplesBlock([new Triple(s, p, o)]),
            new ElementFilter(new E_OneOf(new ExprVar(s), iris))
        ]);

        result.setQueryPattern(element);

        result.getProject().add(s);
        result.getProject().add(p);
        result.getProject().add(o);

        return result;
    },

    /**
     * Obtain a 'pretty' string from a node object, under an optional prefixMapping.
     * Pretty means, that Uris will be converted to their short form (if a prefix mapping applies) or
     * their local name (otherwise).
     */
    prettifyQueryString: function(query, prefixMapping) {
        var queryString = query.toString();

        if(prefixMapping) {
            // if there is a prefixMapping create the query execution 
            // from the query string, which will include the serialized
            // prefix mapping. In the query string prettify the nodes
            // so all the URIs are in its short form
            Object.keys(prefixMapping.prefixes).forEach(function(prefix) {
                
                var uri = prefixMapping.getNsPrefixURI(prefix);
            
                //escape all forward slashes in the uri string so the uri can be used in a RegExp
                var uriEscaped = uri.replace(/\//g, '\\/');
                
                // between the '<'uri and the '>', match any group of 
                // alphanumeric characters, including minus sign. This set of characters
                // should include all characters enabled to name nodes
                var regExp = new RegExp('<' + uriEscaped + '[\\w\-]+>', 'gi');
            
                // do replacement:
                // from <URI#whatever> to prefix:whatever
                queryString = queryString.replace(regExp, function(matchedString) {
                    // get the matching substring we looked for with
                    // the regExp (the \w+ part)
                    var match = matchedString.substring(
                        matchedString.lastIndexOf('#') + 1, 
                        matchedString.lastIndexOf('>')
                    );
                    return prefix + ':' + match; 
                });
            });
            queryString = SparqlIo.serializePrefixMapping(prefixMapping) + ' ' + queryString;
        }

        return queryString;
    }

};

export default QueryUtils;
