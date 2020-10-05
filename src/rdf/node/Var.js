import Class from '../../ext/Class';
import Node_Variable from './Node_Variable';
import ObjectUtils from '../../util/ObjectUtils';


var Var = Class.create(Node_Variable, {
    classLabel: 'Var',
    initialize: function(name) {
        this.name = name;
    },
    getName: function() {
        return this.name;
    },
    toString: function() {
        return '?' + this.name;
    },

    hashCode: function() {
        if(this.hash == null) {
            this.hash = ObjectUtils.hashCodeStr(this.name);
        }

        return this.hash;
    },
    equals: function(that) {
        var result =
            that != null &&
            that.isVariable != null &&
            that.isVariable() &&
            this.name === that.name;

        return result;
    }
});

export default Var;
