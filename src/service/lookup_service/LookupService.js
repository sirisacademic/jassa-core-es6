import Class from '../../ext/Class';

var LookupService = Class.create({
    getIdStr: function() { // id) {
        throw new Error('Not overridden');
    },

    /**
     * This method must return a promise for a Map<Id, Data>
     */
    lookup: function(keys) {
        throw new Error('Not overridden');
    },
});

export default LookupService;
