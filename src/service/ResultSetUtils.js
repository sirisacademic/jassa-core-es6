import HashMap from '../util/collection/HashMap';
import IteratorArray from '../util/collection/IteratorArray';
import VarUtils from '../sparql/VarUtils';
import ResultSetArrayIteratorBinding from './result_set/ResultSetArrayIteratorBinding';
import ResultSetPart from './ResultSetPart';
import Binding from '../sparql/Binding';
import Triple from '../rdf/Triple';
import GraphImpl from '../rdf/GraphImpl';

var ResultSetUtils = {

    jsonToResultSet: function(json) {

        // TODO We should check whether the json is really json, but maybe not necessarily in this method
        //console.log('Building result set from ', json);

        var varNames = json.head.vars;
        var bindings = json.results.bindings;

        var tmp = bindings.map(function(b) {
            var bindingObj = Binding.fromTalisJson(b);
            return bindingObj;
        });

        var itBinding = new IteratorArray(tmp);

        var result = new ResultSetArrayIteratorBinding(itBinding, varNames);
        return result;
    },

    partition: function(rs, v) {
        var varNames = rs.getVarNames();
        //var result = {};
        var result = new HashMap();

        while(rs.hasNext()) {
            var binding = rs.next();
            var val = binding.get(v);

            var rsp = result.get(val);
            if(rsp == null) {
                rsp = new ResultSetPart(varNames);
                result.put(val, rsp);
            }

            rsp.getBindings().push(binding);
        }

        return result;
    },

    createResultSetFromBindings: function(bindings, varNames) {
        var it = new IteratorArray(bindings);
        var result = new ResultSetArrayIteratorBinding(it, varNames);

        return result;
    },

    createEmptyResultSet: function(query) {
        var vars = query.getProjectVars();
        var varNames = VarUtils.getVarNames(vars);

        var result = this.createResultSetFromBindings([], varNames);
        return result;
    },

    resultSetToGraph: function(rs, s, p, o) {
        var bindings = rs.getBindings();

        var result = this.bindingsToGraph(bindings, s, p, o);
        return result;
    },

    bindingsToGraph: function(bindings, s, p, o) {
        var result = new GraphImpl();

        bindings.forEach(function(b) {
            var t = new Triple(b.get(s), b.get(p), b.get(o));
            result.add(t);
        });

        return result;
    }
};

export default ResultSetUtils;