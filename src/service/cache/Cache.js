import Class from '../../ext/Class';

var Cache = Class.create({
    getItem: function(key) {
        throw new Error('not implemented');
    },

    setItem: function(key, val) {
        throw new Error('not implemented');
    },

});

export default Cache;
