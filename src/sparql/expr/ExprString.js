import Class from '../../ext/Class';
import SparqlString from '../SparqlString';
import Expr from './Expr';

var ExprString = Class.create(Expr, {
    classLabel: 'jassa.sparql.ExprString',
    initialize: function(sparqlString) {
        this.sparqlString = sparqlString;
    },

    copySubstitute: function(fnNodeMap) {
        var newSparqlString = this.sparqlString.copySubstitute(fnNodeMap);
        return new ExprString(newSparqlString);
    },

    getVarsMentioned: function() {
        return this.sparqlString.getVarsMentioned();
    },

    getArgs: function() {
        return [];
    },

    copy: function(args) {
        if (args.length !== 0) {
            throw new Error('Invalid argument');
        }

        return this;
    },

    toString: function() {
        return '(!' + this.expr + ')';
    },

    create: function(str, varNames) {
        var result = new ExprString(SparqlString.create(str, varNames));
        return result;
    },
});

export default ExprString;
