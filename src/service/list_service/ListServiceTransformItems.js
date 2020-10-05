import Class from '../../ext/Class';
import ListService from './ListService';
import shared from '../../util/shared';
var Promise = shared.Promise;

/**
 * A list service that transforms the input concept to another
 * which gets passed to the underlying list service
 *
 */
var ListServiceTransformItems = Class.create(ListService, {
    initialize: function(listService, fnTransformItems) {
        this.listService = listService;
        this.fnTransformItems = fnTransformItems;
    },

    fetchItems: function(concept, limit, offset) {

        var self = this;
        var result = this.listService.fetchItems(concept, limit, offset).then(function(items) {
            var r = self.fnTransformItems(items);
            return r;
        });

        return result;
    },

    fetchCount: function(concept, itemLimit, rowLimit) {
        var result = this.listService.fetchCount(concept, itemLimit, rowLimit);
        return result;
    },

});

export default ListServiceTransformItems;
