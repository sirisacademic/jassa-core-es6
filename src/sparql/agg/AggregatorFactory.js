import Class from '../../ext/Class';
import AggAvg from './AggAvg';
import AggAvgDistinct from './AggAvgDistinct';
import AggCount from './AggCount';
import AggCountDistinct from './AggCountDistinct';
import AggMax from './AggMax';
import AggMaxDistinct from './AggMaxDistinct';
import AggMin from './AggMin';
import AggMinDistinct from './AggMinDistinct';
import AggSum from './AggSum';
import AggSumDistinct from './AggSumDistinct';
import AggGroup_Concat from './AggGroup_Concat';
import AggGroup_ConcatDistinct from './AggGroup_ConcatDistinct';
import ExprVar from '../expr/ExprVar';

// constructor
var AggregatorFactory = {
    createAvg: function(distinct, v) {
        var expr = v?   new ExprVar(v) : undefined;
        return distinct?    new AggAvgDistinct(expr) : new AggAvg(expr);
    },

    createCount: function(distinct, v) {
        var expr = v?   new ExprVar(v) : undefined;
        return distinct?    new AggCountDistinct(expr) : new AggCount(expr);
    },

    createMax: function(distinct, v) {
        var expr = v?   new ExprVar(v) : undefined;
        return distinct?    new AggMaxDistinct(expr) : new AggMax(expr);
    },

    createMin: function(distinct, v) {
        var expr = v?   new ExprVar(v) : undefined;
        return distinct?    new AggMinDistinct(expr) : new AggMin(expr);
    },

    createSum: function(distinct, v) {
        var expr = v?   new ExprVar(v) : undefined;
        return distinct?    new AggSumDistinct(expr) : new AggSum(expr);
    },

    createGroup_Concat: function(distinct, v, sep) {
        var expr = v?   new ExprVar(v) : undefined;
        return distinct?    new AggGroup_ConcatDistinct(expr, sep) : new AggGroup_Concat(expr, sep);
    }
};

export default AggregatorFactory;