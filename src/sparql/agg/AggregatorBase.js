import Class from '../../ext/Class';

// constructor
var AggregatorBase = Class.create({
    classLabel: 'jassa.sparql.AggregatorBase',
    initialize: function(name, isDistinct, expr) {
        this.name = name;
        this.isDistinct = isDistinct;
        this.expr = expr;
    },

    getVarsMentioned: function() {
        return (this.expr)? this.expr.getVarsMentioned() : [];
    },

    toString : function() {
        return this.name +
            '(' + 
            ((this.isDistinct)?  'Distinct ' : '') + 
            ((this.expr)?        this.expr.toString() : '*') +
            ')';
    }
});

export default AggregatorBase;