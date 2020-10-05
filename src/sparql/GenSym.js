import Class from '../ext/Class';
import Generator from './Generator';

/**
 * Another class that mimics Jena's behaviour.
 *
 * @param prefix
 * @param start
 * @returns {ns.GenSym}
 */
var GenSym = Class.create(Generator, {
    initialize: function(prefix, start) {
        this.prefix = prefix ? prefix : 'v';
        this.nextValue = start ? start : 0;
    },

    next: function() {
        ++this.nextValue;

        var result = this.prefix + '_' + this.nextValue;

        return result;
    },
});

GenSym.create = function(prefix) {
    var result = new GenSym(prefix, 0);
    return result;
};

export default GenSym;
