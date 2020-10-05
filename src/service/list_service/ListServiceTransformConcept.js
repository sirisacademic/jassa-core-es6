import Class from '../../ext/Class';
import ListService from './ListService';

/**
 * A list service that transforms the input concept to another
 * which gets passed to the underlying list service
 *
 */
var ListServiceTransformConcept = Class.create(ListService, {
    initialize: function(listService, fnTransformConcept) {
        this.listService = listService;
        this.fnTransformConcept = fnTransformConcept;

        if(!fnTransformConcept) {
            throw new Error('No transformation function provided');
        }
    },

    fetchItems: function(inConcept, limit, offset) {
        var outConcept = this.fnTransformConcept(inConcept);
        var result = this.listService.fetchItems(outConcept, limit, offset);
        return result;
    },

    fetchCount: function(inConcept, itemLimit, rowLimit) {
        var outConcept = this.fnTransformConcept(inConcept);
        var result = this.listService.fetchCount(outConcept, itemLimit, rowLimit);
        return result;
    },

});

export default ListServiceTransformConcept;
