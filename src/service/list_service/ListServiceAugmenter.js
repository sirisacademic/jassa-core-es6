import Class from '../../ext/Class';
import ListService from './ListService';


// TODO This class is redundant as it could be covered by ListService TransformItems
// Its just there because it is still referenced by legacy code
var ListServiceAugmenter = Class.create(ListService, {
    initialize: function(listService, augmenter) {
        this.listService = listService;
        this.augmenter = augmenter;
    },

    fetchItems: function(filter, limit, offset) {
        var self = this;
        var result = this.listService.fetchItems(filter, limit, offset).then(function(entries) {
//            var keys = items.map(function(item) {
//                return item.key;
//            });
//console.log('Augmenting with keys: ' + JSON.stringify(keys));
            var r = self.augmenter.augment(entries);
            return r;
        });

        return result;
    },

    fetchCount: function(filter, itemLimit, rowLimit) {
        var result = this.listService.fetchCount(filter, itemLimit, rowLimit);
        return result;
    }
});

export default ListServiceAugmenter;
