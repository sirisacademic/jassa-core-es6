import Class from '../ext/Class';
import BboxExprFactory from './BboxExprFactory';
import GeoExprUtils from './GeoExprUtils';

var BboxExprFactoryWgs84 = Class.create(BboxExprFactory, {
    initialize: function(xVar, yVar, castNode) {
        //this.geoVar = geoVar;
        this.xVar = xVar;
        this.yVar = yVar;
        this.castNode = castNode;
    },

    createExpr: function(bounds) {
        var result = GeoExprUtils.createExprWgs84Intersects(this.xVar, this.yVar, bounds, this.castNode);
        return result;
    }
});

export default BboxExprFactoryWgs84;
