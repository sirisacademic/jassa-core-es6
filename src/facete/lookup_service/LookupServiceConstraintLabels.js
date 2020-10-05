import Class from '../../ext/Class';
import NodeUtils from '../../rdf/NodeUtils';
import LookupServiceBase from '../../service/lookup_service/LookupServiceBase';
import LookupServicePathLabels from './LookupServicePathLabels';
import HashMap from '../../util/collection/HashMap';
import shared from '../../util/shared';
var Promise = shared.Promise;

import PromiseUtils from '../../util/PromiseUtils';

var LookupServiceConstraintLabels = Class.create(LookupServiceBase, {
    initialize: function(lookupServiceNodeLabels, lookupServicePathLabels) {
        this.lookupServiceNodeLabels = lookupServiceNodeLabels;
        this.lookupServicePathLabels = lookupServicePathLabels || new LookupServicePathLabels(lookupServiceNodeLabels);
    },

    lookup: function(constraints) {
        // Note: For now we just assume subclasses of ConstraintBasePathValue

        var paths = [];
        var uriNodes = [];

        constraints.forEach(function(constraint) {
            var cPaths = constraint.getDeclaredPaths();
            var cNode = constraint.getValue ? constraint.getValue() : null;

            paths.push.apply(paths, cPaths);
            if(cNode && cNode.isUri()) {
                uriNodes.push(cNode);
            }
        });

        var p1 = this.lookupServiceNodeLabels.lookup(uriNodes);
        var p2 = this.lookupServicePathLabels.lookup(paths);

        var result = PromiseUtils.all([
            p1,
            p2,
        ]).spread(function(nodeMap, pathMap) {
            var r = new HashMap();

            constraints.forEach(function(constraint) {
                var cPath = constraint.getDeclaredPath();
                var cNode = constraint.getValue();

                var nodeLabelInfo = cNode && cNode.isUri()
                    ? nodeMap.get(cNode)
                    : null
                    ;

                var nodeLabel = nodeLabelInfo ? nodeLabelInfo.displayLabel : null;
                nodeLabel = nodeLabel || NodeUtils.toPrettyString(cNode);

                var pathLabel = pathMap.get(cPath);

                var cLabel = pathLabel + ' = ' + nodeLabel;
                r.put(constraint, cLabel);
            });

            return r;
        });

        return result;
    },
});

export default LookupServiceConstraintLabels;
