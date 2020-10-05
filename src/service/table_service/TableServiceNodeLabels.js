import Class from '../../ext/Class';
import TableServiceDelegateBase from './TableServiceDelegateBase';
import TableServiceUtils from '../TableServiceUtils';

var TableServiceNodeLabels = Class.create(TableServiceDelegateBase, {
    initialize: function($super, delegate, lookupServiceNodeLabels) {
        $super(delegate);
        this.lookupServiceNodeLabels = lookupServiceNodeLabels;
    },

    fetchData: function(limit, offset) {
        var promise = this.delegate.fetchData(limit, offset);

        var self = this;
        var result = promise.then(function(rows) {
            var r = TableServiceUtils.transformToNodeLabels(self.lookupServiceNodeLabels, rows);
            return r;
        });

        return result;
    },
});

export default TableServiceNodeLabels;
