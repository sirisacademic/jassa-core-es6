import Class from '../../ext/Class';
import AggregatorBase from './AggregatorBase';

var AggMaxDistinct = Class.create(AggregatorBase, {
    classLabel: 'jassa.sparql.AggMaxDistinct',
    initialize: function($super, expr) {
        $super('Max', true, expr);
    },

    copySubstitute: function(fnNodeMap) {
        return new AggMaxDistinct(this.expr);
    }
});

export default AggMaxDistinct;