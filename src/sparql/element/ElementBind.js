import Class from '../../ext/Class';
import union from 'lodash.union';
import NodeUtils from '../../rdf/NodeUtils';
import Element from './Element';

var ElementBind = Class.create(Element, {
    classLabel: 'jassa.sparql.ElementBind',

    initialize: function(variable, expression){
        this.expr = expression;
        this.variable = variable;
    },

    getArgs: function(){
        return [];
    },

    getExpr: function(){
        return this.expr;
    },

    getVar: function(){
        return this.variable;
    },

    getVarsMentioned: function(){
        return union(this.expr.getVarsMentioned(), this.variable);
    },

    copy: function(){
        return new ElementBind(this.variable,this.expr);
    },

    copySubstitute: function(fnNodeMap) {
        return new ElementBind(NodeUtils.getSubstitute(this.variable,  fnNodeMap),this.expr.copySubstitute(fnNodeMap));
    },

    flatten: function(){
        return this;
    },

    toString: function(){
        return 'bind(' + this.expr + ' as ' + this.variable  +  ')';
    }

});

export default ElementBind;
