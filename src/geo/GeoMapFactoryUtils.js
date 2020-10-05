import BboxExprFactoryWkt from './BboxExprFactoryWkt';
import BboxExprFactoryWgs84 from './BboxExprFactoryWgs84';
import GeoMapUtils from './GeoMapUtils';
import GeoMapFactory from './GeoMapFactory';
import VarUtils from '../sparql/VarUtils';
import Concept from '../sparql/Concept';
import ElementString from '../sparql/element/ElementString';
import ElementTriplesBlock from '../sparql/element/ElementTriplesBlock';
import NodeFactory from '../rdf/NodeFactory';
import Triple from '../rdf/Triple';
import rdf from '../vocab/rdf';
import xsd from '../vocab/xsd';

//var TemplateParser = require('../sponate/TemplateParser');
import SponateUtils from '../sponate/SponateUtils';

var defaultIntersectsFnName = 'bif:st_intersects';
var defaultGeomFromTextFnName = 'bif:st_geomFromText';

//var mapParser = new TemplateParser();


var GeoMapFactoryUtils = {

    createXyMapFactory: function(xPredicateName, yPredicateName, doCast) {
        var elementStr = '?s <' + xPredicateName + '> ?x ; <' + yPredicateName + '> ?y';
        var concept = new Concept(ElementString.create(elementStr), VarUtils.s);

        var cast = doCast ? xsd.xdouble : null;

        var result = new GeoMapFactory(
                GeoMapUtils.createXyView(concept),
                new BboxExprFactoryWgs84(VarUtils.x, VarUtils.y, cast));

        return result;
    },

    wgs84MapFactory: new GeoMapFactory(
            GeoMapUtils.wgs84GeoView,
            new BboxExprFactoryWgs84(VarUtils.x, VarUtils.y)
    ),

    /**
     * A geomap factory similar to the one above, however geo:lat / geo:long values in the data
     * are explicitly converted to decimals in order to account for standard conform string values
     */
    wgs84CastMapFactory: new GeoMapFactory(
            GeoMapUtils.wgs84GeoView,
            new BboxExprFactoryWgs84(VarUtils.x, VarUtils.y, xsd.xdouble)
    ),

    ogcVirtMapFactory: new GeoMapFactory(
            GeoMapUtils.ogcGeoView,
            new BboxExprFactoryWkt(VarUtils.w, defaultIntersectsFnName, defaultGeomFromTextFnName)
    ),


    // TODO Replace defaults with geosparql rather than virtuoso bifs
    createWktMapFactory: function(wktPredicateName, intersectsFnName, geomFromTextFnName) {
        wktPredicateName = wktPredicateName || 'http://www.opengis.net/ont/geosparql#asWKT';
        intersectsFnName = intersectsFnName || defaultIntersectsFnName;
        geomFromTextFnName = geomFromTextFnName || defaultGeomFromTextFnName;

        var predicate = NodeFactory.createUri(wktPredicateName);

        var geoConcept = new Concept(
            new ElementTriplesBlock([new Triple(VarUtils.s, predicate, VarUtils.w)]),
            VarUtils.s
        );


        var baseMap = SponateUtils.parseSpec({
            name: 'geoMap-' + wktPredicateName,
            template: [{
                id: '' + geoConcept.getVar(), // TODO get rid of the '' +
                wkt: '' + VarUtils.w
            }],
            from: geoConcept.getElement()
        });


        var result = new GeoMapFactory(
                baseMap,
                new BboxExprFactoryWkt(VarUtils.w, intersectsFnName, geomFromTextFnName)
        );

        return result;
    }
};

export default GeoMapFactoryUtils;
