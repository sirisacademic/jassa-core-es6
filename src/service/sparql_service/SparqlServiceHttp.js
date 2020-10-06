import Class from '../../ext/Class';
import SparqlServiceBaseString from './SparqlServiceBaseString';
import QueryExecutionHttp from '../query_execution/QueryExecutionHttp';
import JSONCanonical from '../../ext/JSONCanonical';
import DatasetDescription from '../../sparql/DatasetDescription';

//var ObjectUtils = require('../../util/ObjectUtils');

import _ from 'lodash';

var SparqlServiceHttp = Class.create(SparqlServiceBaseString, {

    // @param graphs: An array of default graphs or a dataset description object or null
    // @param http: An function which acts as a http client
    // ajaxOptions, httpOptions
    initialize: function(serviceUri, graphs, ajaxOptions, httpArgs, httpClient) {
        // Some handling for legacy
        var datasetDescription = graphs == null
            ? new DatasetDescription()
            : _.isArray(graphs)
                ? new DatasetDescription(graphs)
                : graphs
                ;

        /*
        var httpClient = ObjectUtils.isFunction(http)
            ? http
            : function(ajaxSpec) {

            };
        */


        this.initializeCore(serviceUri, datasetDescription, ajaxOptions, httpArgs, httpClient);
    },


    initializeCore: function(serviceUri, datasetDescription, ajaxOptions, httpArgs, httpClient) {
        this.serviceUri = serviceUri;
        this.datasetDescription = datasetDescription; // || new DatasetDescription();
        // this.setDefaultGraphs(defaultGraphUris);

        this.ajaxOptions = ajaxOptions;
        this.httpArgs = httpArgs;
        this.httpClient = httpClient;
    },

    getServiceId: function() {
        return this.serviceUri;
    },

    /**
     * This method is intended to be used by caches,
     *
     * A service is not assumed to return the same result for
     * a query if this method returned different hashes.
     *
     * The state hash does not include the serviceId
     *
     */
    getStateHash: function() {
        var result
            = '' + this.datasetDescription//JSONCanonical.stringify(this.defaultGraphUris);
            + JSONCanonical.stringify(this.httpArgs);
        return result;
    },

    hashCode: function() {
        return this.getServiceId() + '/' + this.getStateHash();
    },

    getDatasetDescription: function() {
        return this.datasetDescription;
    },

    /*
    setDefaultGraphs: function(uriStrs) {
        this.defaultGraphUris = uriStrs; // ? uriStrs : [];
    },

    getDefaultGraphs: function() {
        return this.defaultGraphUris;
    },
    */

    createQueryExecutionStr: function(queryStr) {
        var ajaxOptions = _.defaults({}, this.ajaxOptions);

        var result = new QueryExecutionHttp(queryStr, this.serviceUri, this.datasetDescription, ajaxOptions, this.httpArgs, this.httpClient);
        return result;
    },

    createQueryExecutionObj: function($super, query) {
        if (true) {
            if (query.flatten) {
                var before = query;
                query = before.flatten();
            }
        }

        var result = $super(query);
        return result;
    },
});

export default SparqlServiceHttp;
