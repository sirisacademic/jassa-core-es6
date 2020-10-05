import Class from '../../ext/Class';
import SparqlService from './SparqlService';

/**
 *
 */
var SparqlServiceLimit = Class.create(SparqlService, {
    initialize: function(sparqlService, maxLimit) {
        this.sparqlService = sparqlService;
        this.maxLimit = maxLimit;
    },

    getServiceId: function() {
        return this.sparqlService.getServiceId();
    },

    getStateHash: function() {
        return this.sparqlService.getStateHash();
    },

    hashCode: function() {
        return 'maxLimit:' + this.sparqlService.hashCode();
    },

    createQueryExecution: function(query) {
        var limit = query.getLimit();

        if(limit == null || limit > this.maxLimit) {
            query = query.clone();
            query.setLimit(this.maxLimit);
        }

        var result = this.sparqlService.createQueryExecution(query);
        return result;
    },

});

export default SparqlServiceLimit;
