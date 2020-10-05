import Class from '../ext/Class';

//var BestLabelConfig = require('../sparql/BestLabelConfig');
import LiteralPreference from '../sparql/LiteralPreference';

import FacetConfig from './FacetConfig';
import HashMap from '../util/collection/HashMap';

//var FacetNodeState = require('./FacetNodeState');
import FacetTreeState from './FacetTreeState';

import ListFilter from '../service/ListFilter';

var FacetTreeConfig = Class.create({
    initialize: function(facetConfig, literalPreference, facetTreeState, pathToTags, pathHeadToTags, tagFn) {
        this.facetConfig = facetConfig || new FacetConfig();
        this.literalPreference = literalPreference || new LiteralPreference();

        this.facetTreeState = facetTreeState || new FacetTreeState();

        this.pathToTags = pathToTags || new HashMap();
        //this.pathHeadToTags = pathHeadToTags || new HashMap();
        this.tagFn = tagFn;
    },

    getFacetConfig: function() {
        return this.facetConfig;
    },

    getFacetTreeState: function() {
        return this.facetTreeState;
    },

    getLiteralPreference: function() {
        return this.literalPreference;
    },

    getPathToTags: function() {
        return this.pathToTags;
    },

//    getPathHeadToTags: function() {
//        return this.pathHeadToTags;
//    },

    getTagFn: function() {
        return this.tagFn;
    }
});

/*
var FacetTreeConfig = Class.create({
    initialize: function(defaultState) {
        //this.defaultState = defaultState || new FacetNodeState();
        this.pathToState = new HashMap();
    },

    getState: function(path) {
        var result = this.pathToState.get(path);
        if(!result) {
            result = new FacetNodeState();
            this.pathToState.put(path, result);
        }
        //var result = override || this.defaultState;
        return result;
    },

    setState: function(path, state) {
        this.pathToState.put(path, state);
    },

});
*/


export default FacetTreeConfig;
