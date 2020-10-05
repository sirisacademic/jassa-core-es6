import Class from '../ext/Class';

var Point = Class.create({
    initialize: function(x, y) {
        this.x = x;
        this.y = y;
    },

    getX: function() {
        return this.x;
    },

    getY: function() {
        return this.y;
    }
});

export default Point;
