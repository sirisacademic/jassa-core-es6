import Class from '../ext/Class';
import AnonId from './AnonId';

// constructor
var AnonIdStr = Class.create(AnonId, {
    classLabel: 'AnonIdStr',
    initialize: function(label) {
        this.label = label;
    },
    getLabelString: function() {
        return this.label;
    },
    toString: function() {
        return this.label;
    },
});

export default AnonIdStr;
