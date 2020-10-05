import Class from '../../ext/Class';
import LookupService from './LookupService';
import ObjectUtils from '../../util/ObjectUtils';
import HashMap from '../../util/collection/HashMap';
import shared from '../../util/shared';
var Promise = shared.Promise;

/**
 * Lookup service which passes keys through a function (identity by default)
 * and maps them to the result
 */
var LookupServiceKeyMap = Class.create(LookupService, {
    initialize: function(fnTransformKey) {
        this.fnTransformKey = fnTransformKey || ObjectUtils.identity;
    },

    lookup: function(keys) {
        var map = new HashMap();

        var self = this;
        keys.forEach(function(key) {
            var val = self.fnTransformKey(key);
            map.put(key, val);
        });

        return Promise.resolve(map);
    },
});

export default LookupServiceKeyMap;
