import Class from '../../ext/Class';

var Iterator = Class.create({
    next: function() {
        throw new Error('Not overridden');
    },
    hasNext: function() {
        throw new Error('Not overridden');
    }
});

export default Iterator;
