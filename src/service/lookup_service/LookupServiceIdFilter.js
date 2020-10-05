import Class from '../../ext/Class';
import LookupServiceDelegateBase from './LookupServiceDelegateBase';

/**
 * Lookup Service which can filter keys. Used to e.g. get rid of invalid URIs which would
 * cause SPARQL queries to fail
 */
var LookupServiceIdFilter = Class.create(LookupServiceDelegateBase, {
    initialize: function($super, delegate, predicateFn) {
        $super(delegate);
        this.predicateFn = predicateFn;
    },

    lookup: function(keys) {
        var newKeys = keys.filter(this.predicateFn);
        var result = this.delegate.lookup(newKeys);
        return result;
    },
});


//var LookupServiceIdFilter = Class.create(LookupServiceDelegateBase, {
//    initialize: function($super, delegate, predicateFn) {
//        $super(delegate);
//        this.predicateFn = predicateFn;
//    },
//
//    lookup: function(keys) {
//        var self = this;
//        var lookupKeys = [];
//        var nullKeys = [];
//
//        keys.forEach(function(key) {
//            var isAccepted = self.predicateFn(key);
//            if(isAccepted) {
//                lookupKeys.push(key);
//            } else {
//                nullKeys.push(key);
//            }
//        });
//
//        var result = this.delegate.lookup(lookupKeys).then(function(map) {
//            var r = new HashMap();
//            r.putEntries(map.entries());
//
//            nullKeys.forEach(function(key) {
//                r.put(key, null);
//            });
//
//            return r;
//        });
//
//        return result;
//    },
//});


export default LookupServiceIdFilter;
