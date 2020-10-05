import Class from '../../ext/Class';
import HashSet from './HashSet';
import SetDelegateCache from './SetDelegateCache';

var SetDifference = Class.create(SetDelegateCache, {
    initialize: function($super, a, b) {
        $super([a, b]);
        this.a = a;
        this.b = b;
    },

    computeDelegate: function() {
        var self = this;
        var result = new HashSet();
        this.a.forEach(function(item) {
            var exclude = self.b.contains(item);
            if(!exclude) {
                result.add(item);
            }

        });

        return result;
    }
});

export default SetDifference;
