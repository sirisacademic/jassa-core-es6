import Class from '../../ext/Class';
import AggregatorBase from './AggregatorBase';

var AggMax = Class.create(AggregatorBase, {
    classLabel: 'jassa.sparql.AggMax',
    initialize: function($super, expr) {
        $super('Max', false, expr);
    },

    copySubstitute: function(fnNodeMap) {
        return new AggMax(this.expr);
    }
});

export default AggMax;