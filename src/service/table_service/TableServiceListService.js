import Class from '../../ext/Class';

/**
 *
 *
 */
var TableServiceListService = Class.create({
    initialize: function(listService) {
        this.listService = listService;
    },

    fetchCount: function(itemLimit, rowLimit) {
        this.listService.fetchCount(null, itemLimit, rowLimit);
    },

    fetchData: function() {

    },



});

export default TableServiceListService;
