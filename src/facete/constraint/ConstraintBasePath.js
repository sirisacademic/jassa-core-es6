import Class from '../../ext/Class';
import Constraint from './Constraint';

/**
 * The class of constraint specs that are only based on exactly one path.
 * 
 * Offers the method getDeclaredPath() (must not return null)
 * Do not confuse with getDeclaredPaths() which returns the path as an array
 * 
 */
var ConstraintBasePath = Class.create(Constraint, {
    initialize: function(name, path) {
        this.name = name;
        this.path = path;
    },
    
    getName: function() {
        return this.name;
    },
    
    getDeclaredPaths: function() {
        return [this.path];
    },
    
    getDeclaredPath: function() {
        return this.path;
    }
});

export default ConstraintBasePath;
