import Step from './Step';
import Path from './Path';
import PathHead from './PathHead';
import shared from '../util/shared';
var Promise = shared.Promise;

import FacetNodeState from './FacetNodeState';
import ListFilter from '../service/ListFilter';
import ObjectUtils from '../util/ObjectUtils';
import PromiseUtils from '../util/PromiseUtils';


var FacetTreeServiceHelpers = {//Class.create({
//    initialize: function(facetService) {
//        this.facetService = facetService;
//    },

    fetchFacetTree: function(facetService, facetTreeState, startPath) {
        var result = FacetTreeServiceHelpers.fetchFacetTreePathRec(facetService, facetTreeState, startPath).then(function(superRootFacet) {
            var r = startPath == null ? superRootFacet.outgoing.children[0] : superRootFacet;
            return r;
        });

        return result;
    },

    /**
     * Note: This method fetches the *sub*Facets at a given path
     * If the startPath is null, conceptually the children of the 'superRoot' facets are returned,
     * which is an array containing solely the 'root' facet.
     */
    fetchFacetTreePathRec: function(facetService, facetTreeState, startPath) {
        // startPath must not be undefined, but may be null to indicate the root facet
        startPath = startPath || null;

        var pathExpansions = facetTreeState.getPathExpansions();
        var pathToDirection = facetTreeState.getPathToDirection();

        var isExpanded = startPath ? pathExpansions.contains(startPath) : true;
        var dir = pathToDirection.get(startPath) || 1;

        var promises = [];
        if(isExpanded) {
            var pathHead;
            var p;

            if(dir == null || dir === 1 || dir === 2) {
                pathHead = startPath ? new PathHead(startPath, false) : null;
                p = this.fetchFacetTreePathHeadRec(facetService, facetTreeState, pathHead);
                promises.push(p);
            } else {
                promises.push(null);
            }

            if(dir === -1 || dir === 2) {
                pathHead = startPath ? new PathHead(startPath, true) : null;
                p = this.fetchFacetTreePathHeadRec(facetService, facetTreeState, pathHead);
                promises.push(p);
            } else {
                promises.push(null);
            }

        }

        return PromiseUtils.all(promises).spread(function(outgoing, incoming) {
            var r = {
                path: startPath,
                isExpanded: isExpanded,
                outgoing: outgoing,
                incoming: incoming
            };

            return r;
        });
    },


    fetchFacetTreePathHeadRec: function(facetService, facetTreeState, pathHead) {

        var pathHeadToFilter = facetTreeState.getPathHeadToFilter();
        var listFilter = pathHeadToFilter.get(pathHead) || new ListFilter(null, 10);

        //console.log('ListFilter for ' + pathHead + ': ', JSON.stringify(listFilter));
        //var pathHead = startPath ? new PathHead(startPath, state.isInverse()) : null;

        var result = Promise
            .resolve(facetService.prepareListService(pathHead))
            .then(function(listService) {
                var p1 = listService.fetchItems(listFilter.getConcept(), listFilter.getLimit(), listFilter.getOffset());
                var p2 = listService.fetchCount(listFilter.getConcept());
                return [p1, p2];
            }).spread(function(facetEntries, countInfo) {

                // FacetInfos
                // |- countInfo
                // |- labelInfo
                var facetInfos = facetEntries.map(function(entry) {
                    return entry.val;
                });

                // Pluck the ID attributes
                var subPromises = facetInfos.map(function(facetInfo) {
                    //console.log('subPath:', JSON.stringify(facetEntries));

                    var subPath = facetInfo.path;
                    if(!subPath) {
                        throw new Error('Could not obtain a path for the sub facets of ' + JSON.stringify(facetInfo));
                    }

                    var r = FacetTreeServiceHelpers.fetchFacetTreePathRec(facetService, facetTreeState, subPath);

                    return r;
                });

                var r = PromiseUtils.all(subPromises).then(function(children) {

                    facetInfos.forEach(function(facetInfo, i) {
                        var child = children[i];
                        ObjectUtils.extend(facetInfo, child);
                    });

                    var info = {
                        path: pathHead ? pathHead.getPath() : null,
                        pathHead: pathHead,
                        childCountInfo: countInfo,
                        listFilter: listFilter,
                        children: facetInfos
                    };

                    return info;
                });


                return r;
            });

        return result;
    },
};


export default FacetTreeServiceHelpers;
