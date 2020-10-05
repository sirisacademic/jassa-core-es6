import HashSet from './collection/HashSet';

var SetUtils = {
    arrayToSet: function(arr) {
        var result = new HashSet();
        result.addAll(arr);

        return result;
    }

};

export default SetUtils;
