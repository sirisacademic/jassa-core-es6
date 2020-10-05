import Class from '../ext/Class';

var MappedConceptSource = Class.create({
    initialize: function(mappedConcept, sparqlService) {
        this.mappedConcept = mappedConcept;
        this.sparqlService = sparqlService;
    },

    getMappedConcept: function() {
        return this.mappedConcept;
    },

    getSparqlService: function() {
        return this.sparqlService;
    },

});

export default MappedConceptSource;
