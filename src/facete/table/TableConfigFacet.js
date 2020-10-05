import Class from '../../ext/Class';
import CollectionUtils from '../../util/CollectionUtils';
import TableMod from './TableMod';
import ElementUtils from '../ElementUtils';
import Path from '../Path';
import Concept from '../../sparql/Concept';
import ArrayUtils from '../../util/ArrayUtils';
import ArrayList from '../../util/collection/ArrayList';


// TODO: Maybe this class should be TableModFacet and inherit from TableMod?
var TableConfigFacet = Class.create({
    initialize: function(facetConfig, tableMod, paths) {
        this.facetConfig = facetConfig;
        this.tableMod = tableMod || new TableMod();
        this.paths = paths || []; //new util.ArrayList();
    },

    getFacetConfig: function() {
        return this.facetConfig;
    },

    getTableMod: function() {
        return this.tableMod;
    },

    getPaths: function() {
        return this.paths;
    },

    /**
     * Return the path for a given column id
     */
    getPath: function(colId) {
        var index = this.tableMod.getColumnIds().indexOf(colId);
        var result = this.paths[index];
        return result;
    },

    getColumnId: function(path) {
        var index = ArrayUtils.firstIndexOf(this.paths, path);
        var result = this.tableMod.getColumnIds()[index];
        return result;
    },

    removeColumn: function(colId) {
        var path = this.getPath(colId);
        ArrayUtils.removeItem(this.paths, path);
    },

    getColIdForPath: function(path) {
        var rootFacetNode = this.facetConfig.getRootFacetNode();
        var facetNode = rootFacetNode.forPath(path);
        var result = facetNode.getVar().getName();

        return result;
    },

    togglePath: function(path) {
        // Updates the table model accordingly
        var tmp = new ArrayList(this.paths);
        var status = CollectionUtils.toggleItem(tmp, path);

        var varName = this.getColIdForPath(path);

        if(status) {
            this.tableMod.addColumn(varName);
        }
        else {
            this.tableMod.removeColumn(varName);
        }
    },

    createDataConcept: function() {
        var emptyPath = new Path();
        var paths = this.paths.slice(0);

        if(!ArrayUtils.contains(this.paths, emptyPath)) {
            paths.push(emptyPath);
        }

        var dataElement = ElementUtils.createElementTable(this.facetConfig, paths);//new ElementFactoryFacetPaths(this.facetConfig, paths);
        //var dataElement = dataElementFactory.createElement();

        var rootFacetNode = this.facetConfig.getRootFacetNode();
        var dataVar = rootFacetNode.getVar();

        var result = new Concept(dataElement, dataVar);

        return result;
    }

/*
    createQueryFactory: function() {
        // create an ElementFactory based on the paths and the facetConfig
        var elementFactory = new ns.ElementFactoryFacetPaths(this.facetConfig, this.paths);

        var queryFactory = new ns.QueryFactoryTableMod(elementFactory, tableMod);

        return queryFactory;
    }
*/
});

export default TableConfigFacet;

