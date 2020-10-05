import Class from '../../ext/Class';
import AggregatorBase from './AggregatorBase';

var AggMin = Class.create(AggregatorBase, {
    classLabel: 'jassa.sparql.AggMin',
    initialize: function($super, expr) {
        $super('Min', false, expr);
    },

    copySubstitute: function(fnNodeMap) {
        return new AggMin(this.expr);
    }
});

export default AggMin;