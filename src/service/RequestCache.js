import Class from '../ext/Class';
import CacheSimple from './cache/CacheSimple';

var RequestCache = Class.create({
    initialize: function(executionCache, resultCache) {
        this.executionCache = executionCache ? executionCache : {};
        this.resultCache = resultCache ? resultCache : new CacheSimple();
    },

    getExecutionCache: function() {
        return this.executionCache;
    },

    getResultCache: function() {
        return this.resultCache;
    },

});

export default RequestCache;
