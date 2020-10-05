import AggRef from './agg/AggRef';
import AggTransform from './agg/AggTransform';


var AggUtils = {
    unwrapAggTransform: function(agg) {
        var result = agg;
        while(result instanceof AggTransform) {
            result = result.getSubAgg();
        }

        return result;
    },

    getRefs: function(agg, result) {
        result = result || [];

        if(agg instanceof AggRef) {
            result.push(agg);
        } else {
            var subAggs = agg.getSubAggs();
            subAggs.forEach(function(subAgg) {
                AggUtils.getRefs(subAgg, result);
            });
        }

        return result;
    },

};

export default AggUtils;