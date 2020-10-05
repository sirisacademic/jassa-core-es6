import Class from '../../ext/Class';
import shared from '../../util/shared';
var Promise = shared.Promise;

import HashMap from '../../util/collection/HashMap';
import Concept from '../../sparql/Concept';
import VarUtils from '../../sparql/VarUtils';
import ExprVar from '../../sparql/expr/ExprVar';
import E_OneOf from '../../sparql/expr/E_OneOf';
import ElementFilter from '../../sparql/element/ElementFilter';
import LookupServiceBase from './LookupServiceBase';


var LookupServiceListServiceSparql = Class.create(LookupServiceBase, {
    initialize: function(listService) {
        this.listService = listService;
    },

    /**
     * @param uris An array of rdf.Node objects that represent URIs
     */
    lookup: function(nodes) {
        var v = VarUtils.s;
        var element = new ElementFilter(new E_OneOf(new ExprVar(v), nodes));

        var concept = new Concept(element, v);

        var result = this.listService.fetchItems(concept)
            .then(function(entries) {
                var r = new HashMap();
                r.putEntries(entries);
                return r;
            });

        return result;
    }
});

export default LookupServiceListServiceSparql;
