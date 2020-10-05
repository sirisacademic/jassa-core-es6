import Class from '../../ext/Class';
import UpdateData from './UpdateData';

var UpdateDeleteData = Class.create(UpdateData, {
    initialize: function($super, quads) {
        $super(quads);
    },

    toString: function($super) {
        var result = 'Delete Data { ' + $super() + ' }';
        return result;
    }
});

export default UpdateDeleteData;
