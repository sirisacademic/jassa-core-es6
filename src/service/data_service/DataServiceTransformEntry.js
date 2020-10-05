import Class from '../../ext/Class';
import DataService from './DataService';


var DataServiceTransformEntry = Class.create(DataService, {
    initialize: function(delegate, transformFn) {
        this.delegate = delegate;
        this.transformFn = transformFn;// || function() { return true; };
    },
    fetchData: function(concept) {
        var self = this;
        return this.delegate.fetchData(concept).then(function(entries) {
            var r = entries.map(self.transformFn);
            return r;
        });
    }
});

export default DataServiceTransformEntry;
