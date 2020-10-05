import Class from '../../ext/Class';
import AggregatorBase from './AggregatorBase';

var AggCount = Class.create(AggregatorBase, {
    classLabel: 'jassa.sparql.AggCount',
    initialize: function($super, expr) {
        $super('Count', false, expr);
    },

    copySubstitute: function(fnNodeMap) {
        return new AggCount(this.expr);
    }
});

export default AggCount;