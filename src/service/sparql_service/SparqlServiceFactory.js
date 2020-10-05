import Class from '../../ext/Class';

var SparqlServiceFactory = Class.create({
    createSparqlService: function() {
        throw new Error('Not overridden');
    },
});

export default SparqlServiceFactory;
