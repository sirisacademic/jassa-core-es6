import Class from '../../ext/Class';
import NodeUtils from '../../rdf/NodeUtils';
import ExprHelpers from '../ExprHelpers';

var ExprAggregator = Class.create({
    initialize: function(v, aggregator) {
        this.v = v; // I don't know what jena uses the var for
        this.agg = aggregator;
    },

    copySubstitute: function(fnNodeMap) {
        var newV = NodeUtils.getSubstitute(this.v, fnNodeMap);
        var newAgg = this.agg.copySubstitute(fnNodeMap);
        var result = new ExprAggregator(newV, newAgg);
        return result;
    },

    getAggregator: function() {
        return this.agg;
    },
    
    getArgs: function() {
        return [];
    },

    copy: function(args) {
        var result = new ExprAggregator(this.v, this.agg);
        return result;
    },

    toString: function() {
        return this.agg.toString();
    },

    getVarsMentioned: function() {
        // TODO Include this.v in the result?
        var result = this.agg.getVarsMentioned();
        return result;
    },

});

export default ExprAggregator;
