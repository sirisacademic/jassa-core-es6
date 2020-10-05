import Class from '../ext/Class';
import SparqlServiceHttp from './sparql_service/SparqlServiceHttp';
import SparqlServicePaginate from './sparql_service/SparqlServicePaginate';
import SparqlServicePageExpand from './sparql_service/SparqlServicePageExpand';
import SparqlServiceCache from './sparql_service/SparqlServiceCache';
import SparqlServiceVirtFix from './sparql_service/SparqlServiceVirtFix';
import SparqlServiceLimit from './sparql_service/SparqlServiceLimit';
import SparqlServiceConsoleLog from './sparql_service/SparqlServiceConsoleLog';


var SparqlServiceBuilder = Class.create({
    initialize: function(sparqlService) {
        this.sparqlService = sparqlService;
    },

    create: function() {
        return this.sparqlService;
    },

    log: function() {
        this.sparqlService = new SparqlServiceConsoleLog(this.sparqlService);
        return this;
    },

    paginate: function(pageSize) {
        this.sparqlService = new SparqlServicePaginate(this.sparqlService, pageSize);
        return this;
    },

    pageExpand: function(pageSize) {
        this.sparqlService = new SparqlServicePageExpand(this.sparqlService, pageSize);
        return this;
    },

    cache: function(requestCache) {
        this.sparqlService = new SparqlServiceCache(this.sparqlService, requestCache);
        return this;
    },

    virtFix: function() {
        this.sparqlService = new SparqlServiceVirtFix(this.sparqlService);
        return this;
    },

    limit: function(limit) {
        this.sparqlService = new SparqlServiceLimit(this.sparqlService, limit);
        return this;
    },


//    delay: function() {
//        // does not exist yet
//    },
//    failover: function() {
//
//    },

});

// var sparqlService = SparqlServiceBuilder.http().limit(100000).virtFix().cache().paginate(1000).pageExpand(100).create();
SparqlServiceBuilder.from = function(sparqlService) {
    var result = new SparqlServiceBuilder(sparqlService);
    return result;
};

SparqlServiceBuilder.http = function(serviceUri, defaultGraphUris, ajaxOptions, httpArgs) {
    var sparqlService = new SparqlServiceHttp(serviceUri, defaultGraphUris, ajaxOptions, httpArgs);
    var result = SparqlServiceBuilder.from(sparqlService);
    return result;
};

export default SparqlServiceBuilder;
