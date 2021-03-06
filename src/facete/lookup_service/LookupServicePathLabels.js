import Class from '../../ext/Class';
import LookupServiceBase from '../../service/lookup_service/LookupServiceBase';
import HashMap from '../../util/collection/HashMap';
import PathUtils from '../../facete/PathUtils';



/**
 * The baseLookupService must return labels for rdf.Node objects
 *
 */
var LookupServicePathLabels = Class.create(LookupServiceBase, {
    /**
     *
     * labelFn is a function that creates path labels from a path and a map from nodeToPathLabel
     */
    initialize: function(lookupServiceBase, labelFn) {
        this.lookupServiceBase = lookupServiceBase;
        this.labelFn = labelFn || PathUtils.createLabelFn('Items', '$&sup1', '&raquo;');
    },

    lookup: function(paths) {
        var self = this;

        var nodes = PathUtils.getNodesFromPaths(paths);

        //console.log('nodes: ', JSON.stringify(nodes));

        // Do a lookup with all the nodes
        var result = this.lookupServiceBase.lookup(nodes).then(function(nodeToLabelInfo) {

            var r = new HashMap();
            paths.forEach(function(path) {
                var label = self.labelFn(path, nodeToLabelInfo);

                r.put(path, label);
            });

            return r;
        });

        return result;
    },
});

export default LookupServicePathLabels;
