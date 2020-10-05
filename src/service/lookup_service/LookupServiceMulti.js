import Class from '../../ext/Class';
import LookupService from './LookupService';
import HashMap from '../../util/collection/HashMap';
import shared from '../../util/shared';
var Promise = shared.Promise;


/**
 * A lookup service that is configured with a map from
 * attributes to lookup services, e.g.
 * {
 *     id: identityLookupService, // A lookup service that maps a key back to itself
 *     name: nameLookupService
 *     friends: friendsLookupService
 * }
 *
 * when lookup is called, each of the lookup services is called,
 * and
 */
var LookupServiceMulti = Class.create(LookupService, {
    initialize: function(attrToLookupService) {
        this.attrToLookupService = attrToLookupService;
    },

    lookup: function(keys) {

        var self = this;
        var props = {};

        var attrs = Object.keys(this.attrToLookupService);
        attrs.forEach(function(attr) {
            var ls = self.attrToLookupService[attr];
            if(ls) {
                props[attr] = ls.lookup(keys);
            } else {
                props[attr] = null;
            }
        });

        var result = Promise.props(props).then(function(data) {
            // data now is a map from attributes to maps (the lookup results)
            // e.g. { name: Map<key, value>, address: Map<key, value>}
            // we transpose this to Map<Key, {name:..., address: ....}>

            var r = new HashMap();

            keys.forEach(function(key) {
                var obj = {};

                attrs.forEach(function(attr) {
                    var map = data[attr];
                    var val = map ? map.get(key) : null;

                    obj[attr] = val;
                });

                r.put(key, obj);
            });

            return r;
        });

        return result;
    },
});

export default LookupServiceMulti;
