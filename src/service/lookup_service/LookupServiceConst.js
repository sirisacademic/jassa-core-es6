import Class from '../../ext/Class';
import LookupServiceBase from './LookupServiceBase';
import HashMap from '../../util/collection/HashMap';
import shared from '../../util/shared';
var Promise = shared.Promise;

var LookupServiceConst = Class.create(LookupServiceBase, {
    initialize: function(data) {
        this.data = data;
    },

    lookup: function(keys) {
        var map = new HashMap();
        var self = this;
        keys.forEach(function(key) {
            map.put(key, self.data);
        });

        var result = Promise.resolve(map);
        return result;
    },
});

export default LookupServiceConst;
