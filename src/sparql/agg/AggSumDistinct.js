import Class from '../../ext/Class';
import AggregatorBase from './AggregatorBase';

var AggSumDistinct = Class.create(AggregatorBase, {
    classLabel: 'jassa.sparql.AggSumDistinct',
    initialize: function($super, expr) {
        $super('Sum', true, expr);
    },

    copySubstitute: function(fnNodeMap) {
        return new AggSumDistinct(this.expr);
    }
});

export default AggSumDistinct;