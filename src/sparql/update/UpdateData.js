import Class from '../../ext/Class';
import QuadUtils from '../../sparql/QuadUtils';

var UpdateData = Class.create({
    initialize: function(quads) {
        this.quads = quads || [];
    },

    toString: function($super) {
        var result = '' + QuadUtils.quadsToElement(this.quads);
        return result;
    }
});

export default UpdateData;
