import Class from '../../ext/Class';
import TableServiceNodeLabels from './TableServiceNodeLabels';
import TableServiceUtils from '../TableServiceUtils';

/***
 * A table service, that decorates the schema of the underlying table service
 * with column headings based on the corresponding facet path
 */
var TableServiceFacet = Class.create(TableServiceNodeLabels, {

    // ns.TableServiceFacet = Class.create(ns.TableService, {
    initialize: function($super, tableServiceQuery, tableConfigFacet, lookupServiceNodeLabels, lookupServicePathLabels) {
        $super(tableServiceQuery, lookupServiceNodeLabels);
        // this.tableServiceQuery = tableServiceQuery;
        this.tableConfigFacet = tableConfigFacet;
        // this.lookupServiceNodeLabels = lookupServiceNodeLabels;
        this.lookupServicePathLabels = lookupServicePathLabels;
    },

    fetchSchema: function() {
        // Ignores the schema of the underlying table Service
        var result = TableServiceUtils.fetchSchemaTableConfigFacet(this.tableConfigFacet, this.lookupServicePathLabels);
        return result;
    },
});

export default TableServiceFacet;
