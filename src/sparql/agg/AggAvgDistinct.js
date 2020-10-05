import Class from '../../ext/Class';
import AggregatorBase from './AggregatorBase';

var AggAvgDistinct = Class.create(AggregatorBase, {
    classLabel: 'jassa.sparql.AggAvgDistinct',
    initialize: function($super, expr) {
        $super('Avg', true, expr);
    },

    copySubstitute: function(fnNodeMap) {
        return new AggAvgDistinct(this.expr);
    }
});

export default AggAvgDistinct;