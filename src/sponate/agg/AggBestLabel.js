import union from 'lodash.union';
import Class from '../../ext/Class';
import Agg from './Agg';
import AccBestLiteral from '../acc/AccBestLabel';


var AggBestLabel = Class.create(Agg, {
    initialize: function(bestLiteralConfig) {
        this.bestLiteralConfig = bestLiteralConfig;
    },

    clone: function() {
        var result = new AggBestLabel(this.bestLiteralConfig);
        return result;
    },

    createAcc: function() {
        var result = new AccBestLiteral(this.bestLiteralConfig);

        return result;
    },

    getSubAggs: function() {
        return [];
    },

    toString: function() {
        var result = 'bestLabel[' + this.bestLiteralConfig + ']';
        return result;
    },

//    getVarsMentioned: function() {
//        var vm = function(expr) {
//            var result = expr ? expr.getVarsMentioned() : [];
//            return result;
//        };
//
//        var blc = this.bestLiteralConfig;
//
//        var result = union(vm(blc.getLabelExpr()), vm(blc.getSubjectExpr()), vm(blc.getPropertyExpr()));
//        return result;
//    }
});

export default AggBestLabel;

