import Class from '../../ext/Class';
import AggregatorBase from './AggregatorBase';

var AggMinDistinct = Class.create(AggregatorBase, {
    classLabel: 'jassa.sparql.AggMinDistinct',
    initialize: function($super, expr) {
        $super('Min', true, expr);
    },

    copySubstitute: function(fnNodeMap) {
        return new AggMinDistinct(this.expr);
    }
});

export default AggMinDistinct;