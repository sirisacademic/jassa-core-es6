import Class from '../ext/Class';
import ListFilter from '../service/ListFilter';
import HashMap from '../util/collection/HashMap';
import HashSet from '../util/collection/HashSet';

/**
 * This class contains the core status about which nodes in a facet tree are
 * expanded, which direction are they pointing, and which filters apply to them.
 */
var FacetTreeState = Class.create({
    initialize: function(pathExpansions, pathToDirection, pathHeadToFilter) {
        this.pathExpansions = pathExpansions || new HashSet();
        this.pathToDirection = pathToDirection || new HashMap();
        this.pathHeadToFilter = pathHeadToFilter || new HashMap();

        /*
        if(!pathToExpansion) {
            this.pathToExpansion.put(null, true); //new FacetNodeState(true, false, new ListFilter()));
        }

        if(!pathToDirection) {
            this.pathToDirection.put(null, 1);
        }
        */
    },

    getPathExpansions: function() {
        return this.pathExpansions;
    },

    getPathToDirection: function() {
        return this.pathToDirection;
    },

    getPathHeadToFilter: function() {
        return this.pathHeadToFilter;
    }
});


export default FacetTreeState;