import Class from '../ext/Class';
import BboxExprFactory from './BboxExprFactory';
import GeoExprUtils from './GeoExprUtils';


var BboxExprFactoryWkt = Class.create(BboxExprFactory, {
    initialize: function(wktVar, intersectsFnName, geomFromTextFnName) {
        this.wktVar = wktVar;
        this.intersectsFnName = intersectsFnName;
        this.geomFromTextFnName = geomFromTextFnName;
    },

    createExpr: function(bounds) {
        var result = GeoExprUtils.createExprOgcIntersects(this.wktVar,bounds, this.intersectsFnName, this.geomFromTextFnName);
        return result;
    }
});

export default BboxExprFactoryWkt;
