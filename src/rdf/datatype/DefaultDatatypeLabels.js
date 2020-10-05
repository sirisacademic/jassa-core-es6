import DatatypeLabelInteger from './DatatypeLabelInteger';
import DatatypeLabelFloat from './DatatypeLabelFloat';
import DatatypeLabelString from './DatatypeLabelString';
import DatatypeLabelDate from './DatatypeLabelDate';

var DefaultDatatypeLabels = {
    xinteger: new DatatypeLabelInteger(),
    xfloat: new DatatypeLabelFloat(),
    xdouble: new DatatypeLabelFloat(),
    xstring: new DatatypeLabelString(),
    date: new DatatypeLabelDate(),
    dateTime: new DatatypeLabelDate(),
    decimal: new DatatypeLabelFloat()  // TODO Handle Decimal properly
};

// freeze
//Object.freeze(DatatypeLabels);

export default DefaultDatatypeLabels;
