import Class from '../../ext/Class';
import QueryExecution from './QueryExecution';
import QueryPaginator from '../QueryPaginator';
import IteratorArray from '../../util/collection/IteratorArray';
import ResultSetArrayIteratorBinding from '../result_set/ResultSetArrayIteratorBinding';
import shared from '../../util/shared';
var Promise = shared.Promise;


/**
 * TODO Specify and implement the behavior:
 *
 * - Start a new request if the prior one does not return within a specified time
 *     and use the fastest response
 *
 * - If there is an server-error with an endpoint,
 *
 * - Give a chance for an endpoint to recover (e.g. perform retry after a certain amount of time)
 *
 * - Start all queries simultaneously and use the fastest response
 *
 * -> requestDelay parameter
 *
 */
var QueryExecutionFailover = Class.create(QueryExecution, {
    initialize: function(sparqlServices) {
        this.sparqlServices = sparqlServices;
        this.timeoutInMillis = null;
    },

    execSelect: function() {
        var result = this.sparqlServices.createQueryExecution(this.query);
        result.setTimeout(this.timeoutInMillis);

        return result;
    },

    setTimeout: function(timeoutInMillis) {
        this.timeoutInMillis = timeoutInMillis;
    },
});

export default QueryExecutionFailover;
