import Class from '../../ext/Class';
import NodeFactory from '../../rdf/NodeFactory';
import NodeUtils from '../../rdf/NodeUtils';

// constructor
var AggregatorSpecification = Class.create({
    classLabel: 'jassa.sparql.AggregatorSpecification',
    initialize: function(v, isDistinct, aggregationType, aggVarAs, separator) {
        this.v = v;
        this.isDistinct = isDistinct;
        this.aggregationType = aggregationType;
        this.separator = separator; // used in the aggregator 'group_concat'
        
        // if var aggVarAs is ommited, create it based on 
        // the source var and the aggregation function
        this.aggVarAs = aggVarAs || NodeFactory.createVar(aggregationType + '_' + v.getName());
    },

    getVarsMentioned: function() {
        var result = [];
        NodeUtils.pushVar(result, this.v);
        NodeUtils.pushVar(result, this.aggVarAs);
        return result;
    },

    getVar : function() {
        return this.v;
    },

    getAggVar : function() {
        return this.aggVarAs;
    }
});

export default AggregatorSpecification;