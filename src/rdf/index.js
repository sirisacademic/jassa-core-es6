'use strict';

import AnonId from './AnonId';
import AnonIdStr from './AnonIdStr';
import GraphImpl from './GraphImpl';
import GraphUtils from './GraphUtils';
import LiteralLabel from './LiteralLabel';
import NodeFactory from './NodeFactory';
import NodeUtils from './NodeUtils';
import PrefixMappingImpl from './PrefixMappingImpl';
import Triple from './Triple';
import TripleUtils from './TripleUtils';
import TypeMapper from './TypeMapper';
import DatatypeLabel from './datatype/DatatypeLabel';
import DatatypeLabelDate from './datatype/DatatypeLabelDate';
import DatatypeLabelFloat from './datatype/DatatypeLabelFloat';
import DatatypeLabelInteger from './datatype/DatatypeLabelInteger';
import DatatypeLabelString from './datatype/DatatypeLabelString';
import DefaultDatatypeLabels from './datatype/DefaultDatatypeLabels';
import Node from './node/Node';
import Node_Blank from './node/Node_Blank';
import Node_Concrete from './node/Node_Concrete';
import Node_Fluid from './node/Node_Fluid';
import Node_Literal from './node/Node_Literal';
import Node_Uri from './node/Node_Uri';
import Node_Variable from './node/Node_Variable';
import Var from './node/Var';
import BaseDatatype from './rdf_datatype/BaseDatatype';
import DefaultRdfDatatypes from './rdf_datatype/DefaultRdfDatatypes';
import RdfDatatype from './rdf_datatype/RdfDatatype';
import RdfDatatypeBase from './rdf_datatype/RdfDatatypeBase';
import RdfDatatypeLabel from './rdf_datatype/RdfDatatypeLabel';
import TypedValue from './rdf_datatype/TypedValue';
import Coordinate from './talis/Coordinate';
import GraphTalis from './talis/GraphTalis';
import TalisRdfJsonUtils from './talis/TalisRdfJsonUtils';

var ns = {
    AnonId,
    AnonIdStr,
    GraphImpl,
    GraphUtils,
    LiteralLabel,
    NodeFactory,
    NodeUtils,
    PrefixMappingImpl,
    Triple,
    TripleUtils,
    TypeMapper,
    DatatypeLabel,
    DatatypeLabelDate,
    DatatypeLabelFloat,
    DatatypeLabelInteger,
    DatatypeLabelString,
    DefaultDatatypeLabels,
    Node,
    Node_Blank,
    Node_Concrete,
    Node_Fluid,
    Node_Literal,
    Node_Uri,
    Node_Variable,
    Var,
    BaseDatatype,
    DefaultRdfDatatypes,
    RdfDatatype,
    RdfDatatypeBase,
    RdfDatatypeLabel,
    TypedValue,
    Coordinate,
    GraphTalis,
    TalisRdfJsonUtils
};

//Object.freeze(ns);

export default ns;
