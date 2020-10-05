import Class from '../../ext/Class';

var Order = Class.create({
    initialize: function(property, _isAscending) {
        this.property = property;
        this._isAscending = _isAscending;
    },

    isAscending: function() {
        return this._isAscending;
    }
});

export default Order;
