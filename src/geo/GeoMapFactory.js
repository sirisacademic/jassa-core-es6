import Class from '../ext/Class';
import Concept from '../sparql/Concept';
import ElementGroup from '../sparql/element/ElementGroup';
import ElementFilter from '../sparql/element/ElementFilter';
import MappedConcept from '../sponate/MappedConcept';

// ElementFactoryConst
// Mapping


var GeoMapFactory = Class.create({
    classLabel: 'GeoMapFactory',

    initialize: function(mappedConcept, bboxExprFactory) {
        //this.template = template;
        //this.baseElement = baseElement;
        this.mappedConcept = mappedConcept;
        this.bboxExprFactory = bboxExprFactory;
    },

    createMap: function(bounds) {
        var result = this.createMapForBounds(bounds);
        return result;
    },

    // DEPRECATED - use createMap(null)
    createMapForGlobal: function() {
        var result = this.createMapForBounds(null);
        return result;
    },

    // DEPRECATED - use createMap(bounds)
    createMapForBounds: function(bounds) {
        var mappedConcept = this.mappedConcept;
        var bboxExprFactory = this.bboxExprFactory;

        var concept = mappedConcept.getConcept();

        var agg = mappedConcept.getAgg();
        //var baseElementFactory = baseSponateView.getElementFactory();
        //var baseElement = baseElementFactory.createElement();
        var baseElement = concept.getElement();

        var element = baseElement;
        if(bounds) {
            var filterExpr = bboxExprFactory.createExpr(bounds);
            var filterElement = new ElementFilter(filterExpr);

            element = new ElementGroup([baseElement, filterElement]);
        }

        var c = new Concept(element, concept.getVar());
        var result = new MappedConcept(c, agg);
        return result;
    }
});

export default GeoMapFactory;
