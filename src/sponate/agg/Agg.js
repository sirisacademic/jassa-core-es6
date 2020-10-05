import Class from '../../ext/Class';

var Agg = Class.create({
    classLabel: 'jassa.sponate.Agg',

    createAcc: function() {
        throw new Error('override me');
    },

    getSubAggs: function() {
        throw new Error('override me');
    },

    clone: function() {
        throw new Error('override me');
    },

});

export default Agg;
