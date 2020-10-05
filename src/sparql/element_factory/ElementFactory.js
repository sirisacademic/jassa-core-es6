import Class from '../../ext/Class';

var ElementFactory = Class.create({
    createElement: function() {
        throw new Error('Not overridden');
    },
});

export default ElementFactory;
