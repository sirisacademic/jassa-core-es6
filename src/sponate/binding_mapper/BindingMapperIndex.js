import Class from '../../ext/Class';
import BindingMapper from './BindingMapper';

var BindingMapperIndex = Class.create(BindingMapper, {
//    initialize: function() {
//    },

    map: function(binding, rowId) {
        return rowId;
    },

});

export default BindingMapperIndex;
