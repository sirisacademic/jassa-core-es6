import Class from '../../ext/Class';

var QueryCacheNodeFactory = Class.create({
    createQueryCache: function() { // sparqlService, query, indexExpr) {
        throw new Error('Not overridden');
    },
});

export default QueryCacheNodeFactory;
