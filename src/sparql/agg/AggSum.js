import Class from '../../ext/Class';
import AggregatorBase from './AggregatorBase';

var AggSum = Class.create(AggregatorBase, {
    classLabel: 'jassa.sparql.AggSum',
    initialize: function($super, expr) {
        $super('Sum', false, expr);
    },

    copySubstitute: function(fnNodeMap) {
        return new AggSum(this.expr);
    }
});

export default AggSum;