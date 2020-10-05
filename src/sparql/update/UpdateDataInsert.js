import Class from '../../ext/Class';
import UpdateData from './UpdateData';

var UpdateInsertData = Class.create(UpdateData, {
    initialize: function($super, quads) {
        $super(quads);
    },

    toString: function($super) {
        var result = 'Insert Data { ' + $super() + ' }';
        return result;
    }
});

export default UpdateInsertData;
