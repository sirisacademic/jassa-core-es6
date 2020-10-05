import Class from '../../ext/Class';

var FacetValueServiceWrapListService = Class.create({
    initialize: function(facetValueService, listServiceWrapperFn) {
        this.facetValueService = facetValueService;
        this.listServiceWrapperFn = listServiceWrapperFn;
    },

    prepareTableService: function(path, excludeSelfConstraints) {
        var self = this;

        var result = this.facetValueService.prepareTableService(path, excludeSelfConstraints).then(function(ls) {
            var r = self.listServiceWrapperFn(ls, path, excludeSelfConstraints);
            return r;
        });

        return result;
    }
});


export default FacetValueServiceWrapListService;
