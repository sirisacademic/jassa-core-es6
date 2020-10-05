import union from 'lodash.union';
import shared from '../util/shared';
var Promise = shared.Promise;

import ResultSetArrayIteratorBinding from './result_set/ResultSetArrayIteratorBinding';
import ArrayUtils from '../util/ArrayUtils';
import IteratorArray from '../util/collection/IteratorArray';
import ExprVar from '../sparql/expr/ExprVar';
import ElementFilter from '../sparql/element/ElementFilter';
import E_OneOf from '../sparql/expr/E_OneOf';
import ElementSubQuery from '../sparql/element/ElementSubQuery';
import VarUtils from '../sparql/VarUtils';
import Binding from '../sparql/Binding';
import ConceptUtils from '../sparql/ConceptUtils';
import ElementUtils from '../sparql/ElementUtils';
import QueryUtils from '../sparql/QueryUtils';
import ResultSetUtils from './ResultSetUtils';
import PromiseUtils from '../util/PromiseUtils';

//var Triple = require('../rdf/Triple');
////var VarUtils = require('../sparql/VarUtils');
//var Query = require('../sparql/Query');
////var ExprVar = jassa.sparql.ExprVar;
////var E_OneOf = require('../sparql/E_OneOf')
//var ElementGroup = require('../sparql/element/ElementGroup');
//var ElementTriplesBlock = require('../sparql/element/ElementTriplesBlock');
//var ElementFilter = jassa.sparql.ElementFilter;
//var GraphImpl = require('../rdf/GraphImpl');


var ServiceUtils = {

    // FIXME constrainQueryVar, constrainQueryExprVar, chunkQuery should go to a different place, such as sparql.QueryUtils
    constrainQueryVar: function(query, v, nodes) {
        var exprVar = new ExprVar(v);
        var result = this.constrainQueryExprVar(query, exprVar, nodes);
        return result;
    },

    constrainQueryExprVar: function(query, exprVar, nodes) {
        var result = query.clone();
        var e = new ElementFilter(new E_OneOf(exprVar, nodes));
        result.getElements().push(e);

        return result;
    },

    /**
     * Returns an array of queries where the variable v has been constraint to elements in nodes.
     */
    chunkQuery: function(query, v, nodes, maxChunkSize) {
        var chunks = ArrayUtils.chunk(nodes, maxChunkSize);
        var exprVar = new ExprVar(v);

        var self = this;
        var result = chunks.map(function() { // chunk) {
            var r = self.constrainQueryExprVar(query, exprVar, nodes);
            return r;
        });

        return result;
    },

    mergeResultSets: function(arrayOfResultSets) {
        var bindings = [];
        var varNames = [];
        arrayOfResultSets.forEach(function(rs) {
            var vns = rs.getVarNames();
            varNames = union(varNames, vns);

            var arr = rs.getIterator().getArray();
            bindings.push.apply(bindings, arr);
        });

        var itBinding = new IteratorArray(bindings);
        var result = new ResultSetArrayIteratorBinding(itBinding, varNames);

        return result;
    },

    execSelectForNodes: function(sparqlService, query, v, nodes, maxChunkSize) {
        var queries = this.chunkQuery(query, v, nodes, maxChunkSize);

        var promises = queries.map(function(query) {
            var qe = sparqlService.createQueryExecution(query);
            var r = qe.execSelect();
            return r;
        });

        var masterTask = PromiseUtils.all(promises);

        var self = this;
        var result = masterTask.then(function( /* arguments will be result sets */ ) {
            var r = self.mergeResultSets(arguments);
            return r;
        });

        return result;
    },

    /**
     * TODO Rather use .close()
     *
     * @param {Object} rs
     * @returns
     */
    consumeResultSet: function(rs) {
        while (rs.hasNext()) {
            rs.nextBinding();
        }
    },

    resultSetToList: function(rs, variable) {
        var result = [];
        while (rs.hasNext()) {
            var binding = rs.nextBinding();

            var node = binding.get(variable);
            result.push(node);
        }
        return result;
    },

    // TODO: If there is only one variable in the rs, use it.
    resultSetToInt: function(rs, variable) {
        var result = null;

        if (rs.hasNext()) {
            var binding = rs.nextBinding();

            var node = binding.get(variable);

            // TODO Validate that the result actually is int.
            result = node.getLiteralValue();
        }

        return result;
    },

    fetchList: function(queryExecution, variable) {
        var self = this;
        var result = queryExecution.execSelect().then(function(rs) {
            var r = self.resultSetToList(rs, variable);
            return r;
        });

        return result;
    },

    fetchInt: function(sparqlService, query, v) {
        var qe = sparqlService.createQueryExecution(query);
        var result = this.fetchIntQe(qe, v);
        return result;
    },

    /**
     * Fetches the first column of the first row of a result set and parses it as int.
     *
     */
    fetchIntQe: function(queryExecution, variable) {
        var self = this;
        var result = queryExecution.execSelect().then(function(rs) {
            var r = self.resultSetToInt(rs, variable);
            return r;
        });

        return result;
    },

    // NOTE: If there is a rowLimit, we can't determine whether there are more items or not
    fetchCountConcept: Promise.method(function(sparqlService, concept, itemLimit, rowLimit) {

        var outputVar = ConceptUtils.freshVar(concept);

        var xitemLimit = itemLimit == null ? null : itemLimit + 1;
        var xrowLimit = rowLimit == null ? null : rowLimit + 1;

        var countQuery = ConceptUtils.createQueryCount(concept, outputVar, xitemLimit, xrowLimit);

        //var qe = sparqlService.createQueryExecution(countQuery);

        return ServiceUtils
            .fetchInt(sparqlService, countQuery, outputVar)
            .then(function(count) {
                var hasMoreItems = rowLimit != null
                    ? null
                    : (itemLimit != null ? count > itemLimit : false)
                    ;

                var r = {
                    hasMoreItems: hasMoreItems,
                    count: hasMoreItems ? itemLimit : count,
                    itemLimit: itemLimit,
                    rowLimit: rowLimit
                };

                return r;
            });
    }),

    fetchCountRows: function(sparqlService, element, rowLimit) {
        var v = ElementUtils.freshVar(element, 'c');
        var query = ElementUtils.createQueryCountRows(element, v, rowLimit + 1);
        var result = this.fetchInt(sparqlService, query, v).then(function(count) {
            var r = {
                count: Math.min(count, rowLimit),
                hasMoreItems: count > rowLimit,
                rowLimit: rowLimit
            };

            return r;
        });

        return result;
    },


    /**
     * Count the results of a query, whith fallback on timeouts
     *
     * Attempt to count the full result set based on firstTimeoutInMs
     *
     * if this fails, repeat the count attempt using the scanLimit
     *
     * TODO Finish
     */
    fetchCountQuery: Promise.method(function(sparqlService, query, firstTimeoutInMs, limit) {

        var elements = [
            new ElementSubQuery(query),
        ];

        var varsMentioned = query.getVarsMentioned();

        var varGen = VarUtils.createVarGen('c', varsMentioned);

        var outputVar = varGen.next();
        // var outputVar = rdf.NodeFactory.createVar('_cnt_');

        // createQueryCount(elements, limit, variable, outputVar, groupVars, useDistinct, options)
        var countQuery = QueryUtils.createQueryCount(elements, null, null, outputVar, null, null, null);

        var qe = sparqlService.createQueryExecution(countQuery);
        qe.setTimeout(firstTimeoutInMs);

        return ServiceUtils.fetchIntQe(qe, outputVar)
            .then(function(count) {
                return {
                    count: count,
                    limit: null,
                    hasMoreItems: false,
                };
            })
            //.catch // Prevent the eclipse default js parser to complain about this
            // https://github.com/petkaantonov/bluebird/blob/master/API.md -> For compatibility with earlier ECMAScript version, an alias .caught() is provided for .catch().
            .caught
            (function() {
                // Try counting with the fallback size
                var countQuery = QueryUtils.createQueryCount(elements, limit + 1, null, outputVar, null, null, null);
                var qe = sparqlService.createQueryExecution(countQuery);
                return ServiceUtils.fetchIntQe(qe, outputVar)
                    .then(function(count) {
                        return {
                            count: count,
                            limit: limit,
                            hasMoreItems: count > limit,
                        };
                    });
            });
    }),

    // ns.globalSparqlCacheQueue = [];

    fetchItemsConcept: function(sparqlService, concept, limit, offset) {
        var query = ConceptUtils.createQueryList(concept, limit, offset);
        var qe = sparqlService.createQueryExecution(query);

        var result = qe.execSelect().then(function(rs) {
            var r = ServiceUtils.resultSetToList(rs, concept.getVar());
            return r;
        });

        return result;
    },


    /**
     * @param sparqlService
     * @param iris
     * @returns jassa.rdf.Graph
     */
    execDescribeViaSelect: function(sparqlService, iris) {
        var query = QueryUtils.createQueryDescribeViaSelect(iris, VarUtils.s, VarUtils.p, VarUtils.o);

        var qe = sparqlService.createQueryExecution(query);
        var result = qe.execSelect().then(function(rs) {
            var r = ResultSetUtils.resultSetToGraph(rs, VarUtils.s, VarUtils.p, VarUtils.o);
            return r;
        });

        return result;
    }

};

export default ServiceUtils;
