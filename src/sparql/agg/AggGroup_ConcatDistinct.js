import Class from '../../ext/Class';
import AggregatorBase from './AggregatorBase';

var AggGroup_ConcatDistinct = Class.create(AggregatorBase, {
    classLabel: 'jassa.sparql.AggGroup_Concat',
    initialize: function($super, expr, separator) {
        $super('Group_Concat', true, expr);
        this.separator = separator || ', ';
    },

    copySubstitute: function(fnNodeMap) {
        return new AggGroup_ConcatDistinct(this.expr, this.separator);
    },

    toString : function() {
        return this.name +
            '(' + 
            ((this.isDistinct)?  'Distinct ' : '') + 
            ((this.expr)?        this.expr.toString() : '*') +
            '; Separator="' + this.separator + '"' + 
            ')';
    }
});

export default AggGroup_ConcatDistinct;