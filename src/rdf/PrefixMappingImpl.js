import forEach from 'lodash.foreach';
import Class from '../ext/Class';
import CurieUtils from '../util/CurieUtils';
import PrefixUtils from '../util/PrefixUtils';
import GraphUtils from './GraphUtils';

// helper function
var startsWith = function(str, starts) {
    if (starts === '') {
        return true;
    }
    if (str == null || starts == null) {
        return false;
    }
    str = String(str);
    starts = String(starts);
    return str.length >= starts.length && str.slice(0, starts.length) === starts;
};
var isFunction = function(obj) {
    return typeof obj === 'function';
};
var extend = function(obj, source) {
    var prop;
    for (prop in source) {
        if (hasOwnProperty.call(source, prop)) {
            obj[prop] = source[prop];
        }
    }
    return obj;
};

var PrefixMappingImpl = Class.create({
    initialize: function(prefixes) {
        this.prefixes = prefixes ? prefixes : {};

        // TODO add a mapping from namespace to uri
    },

    expandPrefix: function(prefixed) {
        var pair = PrefixUtils.parseCurie(prefixed);

        var result;
        if(pair == null) {
            result = prefixed;
        } else {
            var ns = this.prefixes[pair.key];
            result = ns ? ns + pair.val : prefixed;
        }
        return result;
    },

    getNsPrefixMap: function() {
        return this.prefixes;
    },

    getNsPrefixURI: function(prefix) {
        return this.prefixes[prefix];
    },

    /**
     * Answer the prefix for the given URI, or null if there isn't one.
     *
     * TODO Do not return prefix matches if it using it for the short form would lead to an invalid CURIE
     */
    getNsURIPrefix: function(uri) {
        var result = null;
        var bestNs = null;

        // TODO: forEach can't be used in case a simple dictionary/map is used;
        // moreover this will also fail if the empty fallback prefixes map {}
        // is used
//        this.prefixes.forEach(function(u, prefix) {
//            if (startsWith(uri, u)) {
//                if (!bestNs || (u.length > bestNs.length)) {
//                    result = prefix;
//                    bestNs = u;
//                }
//            }
//        });

        var processCandidate = function(ns, prefix) {
            if (startsWith(uri, ns)) {
                if (!bestNs || (ns.length > bestNs.length)) {

                    result = prefix;
                    bestNs = ns;
                }
            }
        };

        var current = this.prefixes;
        while(current != null) {
            forEach(current, processCandidate);
            current = Object.getPrototypeOf(current);
        }

        return result;
    },

    qnameFor: function() {

    },

    removeNsPrefix: function(prefix) {
        delete this.prefixes[prefix];
    },

    samePrefixMappingAs: function() {
        throw new Error('Not implemented yet - Sorry');
    },

    setNsPrefix: function(prefix, uri) {
        this.prefixes[prefix] = uri;

        return this;
    },

    setNsPrefixes: function(obj) {
        var json = isFunction(obj.getNsPrefixMap) ? obj.getNsPrefixMap() : obj;

        // TODO: forEach can't be used in case a simple dictionary/map is used;
        // moreover this will also fail if the empty fallback prefixes map {}
        // is used
//        var self = this;
//        json.forEach(function(uri, prefix) {
//            self.setNsPrefix(prefix, uri);
//        });
        for (var prefix in json) {
            if (json.hasOwnProperty(prefix)) {
                var ns = json[prefix];
                this.setNsPrefix(prefix, ns);
            }
        }
        return this;
    },

    shortForm: function(uri) {
        var prefix = this.getNsURIPrefix(uri);

        var result;
        if (prefix) {

            var u = this.prefixes[prefix];
            var qname = uri.substring(u.length);

            var isValidLocalName = CurieUtils.isValidSparqlLocalName(qname);
            //console.log('Is valid, ', uri, localName, isValidLocalName);

            result = isValidLocalName
                ? prefix + ':' + qname
                : uri
                ;
        } else {

            result = uri;
        }

        return result;
    },

    addPrefix: function(prefix, urlBase) {
        this.prefixes[prefix] = urlBase;
    },

//    getPrefix: function(prefix) {
//        var result = this.prefixes[prefix];
//        return result;
//    },

    addJson: function(json) {
        extend(this.prefixes, json);
    },

    getJson: function() {
        return this.prefixes;
    },

    toString: function() {
        var result = PrefixUtils.prefixObjectToString(this.prefixes);
        return result;
    },

    // TODO Maybe move this to a utility object
    retainByGraph: function(graph) {
        var prefixMapping = this;
        var prefixToNs = {};

        var uris = GraphUtils.extractUris(graph);
        uris.forEach(function(uri) {
            var prefix = prefixMapping.getNsURIPrefix(uri);
            if(prefix != null) {
                prefixToNs[prefix] = prefixMapping.getNsPrefixURI(prefix);
            }
        });

        var result = new PrefixMappingImpl(prefixToNs);
        return result;
    },

});

export default PrefixMappingImpl;
