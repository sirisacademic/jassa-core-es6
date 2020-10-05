import Class from '../../ext/Class';
import VarUtils from '../../sparql/VarUtils';
import CountUtils from '../CountUtils';
import HashMap from '../../util/collection/HashMap';
import LookupService from '../../service/lookup_service/LookupService';

var LookupServiceFacetExactCount = Class.create(LookupService, {
    initialize: function(sparqlService, facetRelationIndex) {
        this.sparqlService = sparqlService;
        this.facetRelationIndex = facetRelationIndex;
    },

    lookup: function(properties) {
        var countVar = VarUtils.c;
        var subQueries = CountUtils.createQueriesExactCount(this.facetRelationIndex, countVar, properties, this.rowLimit);
        var exec = CountUtils.execQueries(this.sparqlService, subQueries, this.facetRelationIndex.getSourceVar(), countVar);
        
        var result = exec.then(function(map) {
            var r = new HashMap();
            
            var entries = map.entries();
            entries.forEach(function(entry) {
                var property = entry.key;
                var count = entry.val;
                
                var countInfo = {
                    count: count,
                    hasMoreItems: false
                };
                
                r.put(property, countInfo);
            });
            
            return r;
        });

        return result;
    },
});

export default LookupServiceFacetExactCount;
