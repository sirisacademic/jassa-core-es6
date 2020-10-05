import Class from '../ext/Class';

// constructor
var AnonId = Class.create({
    classLabel: 'AnonId',
    getLabelString: function() {
        throw new Error('not implemented');
    },
});

export default AnonId;
