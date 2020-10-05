import Class from '../../ext/Class';
import ObjectUtils from '../../util/ObjectUtils';
import ConstraintBasePath from './ConstraintBasePath';


var ConstraintBasePathValue = Class.create(ConstraintBasePath, {
    //classLabel: 'jassa.facete.ConstraintSpecPathValue',

    initialize: function($super, name, path, value) {
        $super(name, path);
        this.value = value;
    },

    getValue: function() {
        return this.value;
    },
    
    equals: function(that) {
        if(!(that instanceof ConstraintBasePath)) {
            return false;
        }
        
        var a = this.name == that.name;
        var b = this.path.equals(that.path);
        var c = this.value.equals(that.value);
        
        var r = a && b &&c;
        return r;
    },
    
    hashCode: function() {
        var result = ObjectUtils.hashCode(this, true);
        return result;
    }
});

export default ConstraintBasePathValue;
    
