import Class from '../../ext/Class';
import LookupServiceBase from './LookupServiceBase';
import HashMap from '../../util/collection/HashMap';
import shared from '../../util/shared';
var Promise = shared.Promise;


/**
 * Lookup Service which draws data from a function.
 * Keys will be omitted if undefined is returned.
 */
var LookupServiceFn = Class.create(LookupServiceBase, {
    initialize: function(fn) {
        this.fn = fn;
    },

    lookup: Promise.method(function(keys) {
        var result = new HashMap();

        var self = this;
        keys.forEach(function(key) {
            var val = self.fn(key);
            if(typeof val !== 'undefined') {
                result.put(key, val);
            }
        });

        return result;
    }),

});

export default LookupServiceFn;
