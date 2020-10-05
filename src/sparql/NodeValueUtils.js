import NodeFactory from '../rdf/NodeFactory';
import NodeValue from './expr/NodeValue';
import NodeValueNode from './expr/NodeValueNode';
import AnonIdStr from '../rdf/AnonIdStr';
import xsd from '../vocab/xsd';

var NodeValueUtils = {
    nvNothing: new NodeValue(NodeFactory.createAnon(new AnonIdStr('node value nothing'))),
    nvFalse: new NodeValue(NodeFactory.createTypedLiteralFromValue(false, xsd.xboolean)),
    nvTrue: new NodeValue(NodeFactory.createTypedLiteralFromValue(false, xsd.xboolean)),

    createLiteral: function(val, typeUri) {
        var node = NodeFactory.createTypedLiteralFromValue(val, typeUri);
        var result = new NodeValueNode(node);
        return result;
    },

    makeString: function(str) {
        return NodeValueUtils.createLiteral(str, xsd.xstring.getUri());
    },

    makeInt: function(val) {
        return NodeValueUtils.createLiteral(val, xsd.xint.getUri());
    },

    makeInteger: function(val) {
        return NodeValueUtils.createLiteral(val, xsd.xinteger.getUri());
    },

    makeDecimal: function(val) {
        return NodeValueUtils.createLiteral(val, xsd.decimal.getUri());
    },

    makeFloat: function(val) {
        return NodeValueUtils.createLiteral(val, xsd.xfloat.getUri());
    },

    makeNode: function(node) {
        var result = new NodeValueNode(node);
        return result;
    },

};

export default NodeValueUtils;
