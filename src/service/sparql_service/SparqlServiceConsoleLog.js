import Class from '../../ext/Class';
import SparqlService from './SparqlService';

/**
 * Sparql Service wrapper that expands limit/offset in queries
 * to larger boundaries. Intended to be used in conjunction with a cache.
 *
 */
var SparqlServiceConsoleLog = Class.create(SparqlService, {
    initialize: function(sparqlService) {
        this.sparqlService = sparqlService;
    },

    getServiceId: function() {
        return this.sparqlService.getServiceId();
    },
    
    getStateHash: function() {
        return this.sparqlService.getStateHash();
    },

    hashCode: function() {
        return 'console-log:' + this.sparqlService.hashCode();
    },

    createQueryExecution: function(query) {
        console.log('SparqlServiceConsoleLog saw query: ' + query);
        var result = this.sparqlService.createQueryExecution(query);
        return result;
    }
});

export default SparqlServiceConsoleLog;
