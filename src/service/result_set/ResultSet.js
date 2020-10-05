import Class from '../../ext/Class';
import Iterator from '../../util/collection/Iterator';

/**
 * Utility class to create an iterator over an array.
 *
 */
var ResultSet = Class.create(Iterator, {
    getVarNames: function() {
        throw new Error('Override me');
    },
});

export default ResultSet;
