import Class from '../../ext/Class';

var FacetSystem = Class.create({
    createFacetService: function(constraints, baseConcept) {
        throw new Error('Override me');
    }
});

export default FacetSystem;
