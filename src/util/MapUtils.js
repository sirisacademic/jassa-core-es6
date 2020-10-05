import HashMap from './collection/HashMap';
import ObjectUtils from './ObjectUtils';

var MapUtils = {
    indexBy: function(arr, keyOrFn, result) {
        result = result || new HashMap();

        var fnKey;

        if (ObjectUtils.isString(keyOrFn)) {
            fnKey = function(obj) {
                return obj[keyOrFn];
            };
        } else {
            fnKey = keyOrFn;
        }

        arr.forEach(function(item) {
            var key = fnKey(item);
            result.put(key, item);
        });

        return result;
    },

    retainKeys: function(map, keySet) {
        var mapKeys = map.keys();

        mapKeys.forEach(function(mapKey) {
            var isContained = keySet.contains(mapKey);
            if(!isContained) {
                map.remove(mapKey);
            }
        });
    }
};

export default MapUtils;
