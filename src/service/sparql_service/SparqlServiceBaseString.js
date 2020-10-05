import Class from '../../ext/Class';
import SparqlService from './SparqlService';

var SparqlServiceBaseString = Class.create(SparqlService, {
    /**
     * Base class for processing query strings.
     */
    createQueryExecution: function(queryStrOrObj) {
        var result;
        if (Object.toString(queryStrOrObj) === '[object String]') {
            result = this.createQueryExecutionStr(queryStrOrObj);
        } else {
            result = this.createQueryExecutionObj(queryStrOrObj);
        }

        return result;
    },

    createQueryExecutionObj: function(queryObj) {
        var queryStr = queryObj.toString();
        var result = this.createQueryExecutionStr(queryStr);

        return result;
    },

    createQueryExecutionStr: function() { // queryStr) {
        throw new Error('Not implemented');
    },
});

export default SparqlServiceBaseString;
