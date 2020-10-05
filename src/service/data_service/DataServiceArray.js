import Class from '../../ext/Class';
import DataService from './DataService';
import shared from '../../util/shared';
var Promise = shared.Promise;

/**
 * A data service only provides a single method for retrieving data based on some 'key' (thing)
 * The key can be an arbitrary object that identifies a collection (e.g. a tag), a sparql concept, etc...
 */
var DataServiceArray = Class.create(DataService, {
    initialize: function(data) {
        this.data = data || [];
    },

    fetchData: function(thing) {
        var result = Promise.resolve(this.data);
        return result;
    },

});

export default DataServiceArray;
