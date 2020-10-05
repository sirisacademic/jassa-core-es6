import Class from '../../ext/Class';
import SetDelegate from './SetDelegate';

var SetDelegateCache = Class.create(SetDelegate, {
    initialize: function($super, sets) {
        $super(sets);
        this.lastHash = null;
        this.delegateSet = null;
    },

    computeHash: function() {
        var result = this._sets.reduce(function(x, item) {
            var h = item.hashCode();
            var r = x + 13 * h;
            return r;
        }, 0);
        return result;
    },

    computeDelegate: function() {
        throw new Error('must be overridden');
    },

    delegate: function() {
        var currentHash = this.computeHash();
        if(currentHash !== this.lastHash) {
            this.delegateSet = this.computeDelegate();
            this.lastHash = currentHash;
            //console.log('hashes', this.lastHash, currentHash, this.delegateSet.entries());
        }

        return this.delegateSet;
    }
});

export default SetDelegateCache;
