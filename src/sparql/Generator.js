import Class from '../ext/Class';

var Generator = Class.create({
    next: function() {
        throw new Error('Override me');
    },
});

export default Generator;
