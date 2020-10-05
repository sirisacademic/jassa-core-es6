import Class from '../../ext/Class';
import AggregatorBase from './AggregatorBase';

var AggCountDistinct = Class.create(AggregatorBase, {
    classLabel: 'jassa.sparql.AggCountDistinct',
    initialize: function($super, expr) {
        $super('Count', true, expr);
    },

    copySubstitute: function(fnNodeMap) {
        return new AggCountDistinct(this.expr);
    }
});

export default AggCountDistinct;