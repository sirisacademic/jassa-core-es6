import Class from '../../ext/Class';
import LookupService from './LookupService';

var LookupServiceDelegateBase = Class.create(LookupService, {
    initialize: function(delegate) {
        this.delegate = delegate;
    },

    getIdStr: function(id) {
        var result = this.delegate.getIdStr(id);
        return result;
    },
});

export default LookupServiceDelegateBase;
