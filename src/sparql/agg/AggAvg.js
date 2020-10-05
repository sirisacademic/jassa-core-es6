import Class from '../../ext/Class';
import AggregatorBase from './AggregatorBase';

var AggAvg = Class.create(AggregatorBase, {
    classLabel: 'jassa.sparql.AggAvg',
    initialize: function($super, expr) {
        $super('Avg', false, expr);
    },

    copySubstitute: function(fnNodeMap) {
        return new AggAvg(this.expr);
    }
});

export default AggAvg;