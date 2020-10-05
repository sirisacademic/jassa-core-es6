import Class from '../../ext/Class';
import LookupServiceBase from './LookupServiceBase';
import ServiceUtils from '../ServiceUtils';
import HashMap from '../../util/collection/HashMap';
import GraphImpl from '../../rdf/GraphImpl';
import GraphUtils from '../../rdf/GraphUtils';

/**
 * Looks up RDF Graphs based on given subject URIs via a SPARQL service
 */
var LookupServiceGraphSparql = Class.create(LookupServiceBase, {
    initialize: function(sparqlService) {
        this.sparqlService = sparqlService;
    },

    lookup: function(subjects) {
        var promise = ServiceUtils.execDescribeViaSelect(this.sparqlService, subjects);

        var result = promise.then(function(graph) {
            var r = new HashMap();

            // Allocate a fresh graph for each subject, so that each requested subject gets a graph
            subjects.forEach(function(subject) {
                r.put(subject, new GraphImpl());
            });

            GraphUtils.indexBySubject(graph, r);

            return r;
        });

        return result;
    }

});



export default LookupServiceGraphSparql;
