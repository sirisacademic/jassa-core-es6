import uniq from 'lodash.uniq';
import forEach from 'lodash.foreach';
import VarUtils from '../sparql/VarUtils';
import ServiceUtils from './ServiceUtils';
import IteratorArray from '../util/collection/IteratorArray';
import ResultSetArrayIteratorBinding from './result_set/ResultSetArrayIteratorBinding';
import shared from '../util/shared';
import QueryUtils from '../sparql/QueryUtils';

var Promise = shared.Promise;

var TableServiceUtils = {
    bindingToJsMap: function(varList, binding) {
        var result = {};

        varList.forEach(function(v) {
            var varName = v.getName();
            // result[varName] = '' + binding.get(v);
            result[varName] = binding.get(v);
        });

        return result;
    },

    createNgGridOptionsFromQuery: function(query) {
        if (!query) {
            return [];
        }

        var projectVarList = query.getProjectVars(); // query.getProjectVars().getVarList();
        var projectVarNameList = VarUtils.getVarNames(projectVarList);

        var result = projectVarNameList.map(function(varName) {
            var col = {
                field: varName,
                displayName: varName,
            };

            return col;
        });

        return result;
    },

    fetchCount: function(sparqlService, query, timeoutInMillis, secondaryCountLimit) {
        var result;
        if (!sparqlService || !query) {
            result = new Promise(function(resolve) {
                resolve(0);
            });
        } else {
            query = query.clone();

            query.setLimit(null);
            query.setOffset(null);

            result = ServiceUtils.fetchCountQuery(sparqlService, query, timeoutInMillis, secondaryCountLimit);
        }

        return result;
    },

    fetchData: function(sparqlService, query, limit, offset, prefixMapping) {
        if (!sparqlService || !query) {
            var itBinding = new IteratorArray([]);
            var varNames = [];
            var rs = new ResultSetArrayIteratorBinding(itBinding, varNames);

            return new Promise(function(resolve) {
                resolve(rs);
            });
        }

        // Clone the query as to not modify the original object
        query = query.clone();

        query.setLimit(limit);
        query.setOffset(offset);
        
        // if there is a prefixMapping create the query execution 
        // from the query string, which will include the serialized
        // prefix mapping
        var qe = sparqlService.createQueryExecution(
            (prefixMapping)?
                QueryUtils.prettifyQueryString(query, prefixMapping) : query 
        );
                
        var result = qe.execSelect().then(function(rs) {
            var data = [];

            var projectVarList = query.getProjectVars(); // query.getProjectVars().getVarList();

            while (rs.hasNext()) {
                var binding = rs.next();

                var o = TableServiceUtils.bindingToJsMap(projectVarList, binding);

                data.push(o);
            }

            return data;
        });

        return result;
    },

    collectNodes: function(rows) {
        // Collect nodes
        var result = [];
        rows.forEach(function(item) {
            forEach(item, function(node) {
                if(node != null) {
                    result.push(node);
                } else {
                    console.log('should not happen');
                }
            });
        });

        result = uniq(result, false, function(x) {
            return x.toString();
        });

        return result;
    },

    fetchSchemaTableConfigFacet: function(tableConfigFacet, lookupServicePathLabels) {
        var paths = tableConfigFacet.getPaths();//.getArray();

        // We need to fetch the column headings
        var promise = lookupServicePathLabels.lookup(paths);

        var result = promise.then(function(map) {

            var colDefs = paths.map(function(path) {
                var r = {
                    field: tableConfigFacet.getColumnId(path),
                    displayName: map.get(path),
                    path: path,
                };
                return r;
            });

            var r = {
                colDefs: colDefs,
            };

            return r;
        });

        return result;
    },

    // rows is expected to be a List<Map<String, Node>>
    transformToNodeLabels: function(lookupServiceNodeLabels, rows) {

        var nodes = this.collectNodes(rows);

        // Get the node labels
        var p = lookupServiceNodeLabels.lookup(nodes);

        // Transform every node
        var result = p.then(function(nodeToLabel) {
            var r = rows.map(function(row) {
                var r = {};
                forEach(row, function(node, key) {
                    var labelInfo = nodeToLabel.get(node);
                    r[key] = {
                        node: node,
                        displayLabel: labelInfo ? labelInfo.displayLabel : '(no label)',
                    };
                });
                return r;
            });
            return r;
        });

        return result;
    },
};

export default TableServiceUtils;
