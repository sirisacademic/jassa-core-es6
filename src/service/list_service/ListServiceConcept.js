import Class from '../../ext/Class';
import ServiceUtils from '../ServiceUtils';
import ListService from './ListService';

var ListServiceConcept = Class.create(ListService, {
    initialize: function(sparqlService) {
        this.sparqlService = sparqlService;
    },

    fetchItems: function(concept, limit, offset) {
        var result = ServiceUtils.fetchItemsConcept(this.sparqlService, concept, limit, offset);
        return result;
    },

    fetchCount: function(concept, itemLimit, rowLimit) {
        var result = ServiceUtils.fetchCountConcept(this.sparqlService, concept, itemLimit, rowLimit);
        return result;
    },

});

export default ListServiceConcept;
