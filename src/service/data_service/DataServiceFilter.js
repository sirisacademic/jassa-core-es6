import Class from '../../ext/Class';
import DataService from './DataService';


var DataServiceFilter = Class.create(DataService, {
    initialize: function(delegate, filterFn) {
        this.delegate = delegate;
        this.filterFn = filterFn || function() { return true; };
    },
    fetchData: function(concept) {
        var self = this;
        return this.delegate.fetchData(concept).then(function(entries) {
            return entries.filter(self.filterFn);
        });
    },
    setFilter: function(filterFn) {
        this.filter = filterFn;
    }
});

export default DataServiceFilter;
