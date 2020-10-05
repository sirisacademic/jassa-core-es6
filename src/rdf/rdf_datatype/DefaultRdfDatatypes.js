import xsd from '../../vocab/xsd';
import DatatypeLabels from '../datatype/DefaultDatatypeLabels';
import RdfDatatypeLabel from './RdfDatatypeLabel';

// init object
var DefaultRdfDatatypes = {};

// helper function
var registerRdfDatype = function(node, label) {
    var uri = node.getUri();
    DefaultRdfDatatypes[uri] = new RdfDatatypeLabel(uri, label);
};

registerRdfDatype(xsd.xint, DatatypeLabels.xinteger);
registerRdfDatype(xsd.xlong, DatatypeLabels.xinteger);
registerRdfDatype(xsd.xinteger, DatatypeLabels.xinteger);
registerRdfDatype(xsd.xstring, DatatypeLabels.xstring);
registerRdfDatype(xsd.xfloat, DatatypeLabels.xfloat);
registerRdfDatype(xsd.xdouble, DatatypeLabels.xdouble);
registerRdfDatype(xsd.decimal, DatatypeLabels.xfloat);
registerRdfDatype(xsd.date, DatatypeLabels.date);
registerRdfDatype(xsd.dateTime, DatatypeLabels.dateTime);

export default DefaultRdfDatatypes;
