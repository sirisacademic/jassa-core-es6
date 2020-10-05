import Class from '../../ext/Class';
import PrefixMappingImpl from '../../rdf/PrefixMappingImpl';
import ObjectUtils from '../../util/ObjectUtils';
import Context from '../Context';
import Engine from '../Engine';
import SponateUtils from '../SponateUtils';
import MappedConceptSource from '../MappedConceptSource';
import MappedConcept from '../MappedConcept';
import ListServiceFn from '../../service/list_service/ListServiceFn';
import CollectionFacade from './CollectionFacade';
import ObjectUtils from '../../util/ObjectUtils';
import forEach from 'lodash.foreach';


var StoreFacade = Class.create({
    initialize: function(defaultSparqlService, prefixMapping, context) {
        this.defaultSparqlService = defaultSparqlService;

        this.prefixMapping = prefixMapping
            ? prefixMapping instanceof PrefixMappingImpl
                ? prefixMapping
                : new PrefixMappingImpl(prefixMapping)
            : new PrefixMappingImpl();

        this.context = context || new Context(prefixMapping);
//        this.nameToMap = {};

        // This map is for templates (just convenience in the facade)
        this.nameToMappedConcept = {};
    },

//    getEngine: function() {
//        return this.engine;
//    },

    getContext: function() {
        return this.context;
    },


//    getPrefixMapping: function() {
//        return this.prefixMapping;
//    },

//    getdefaultSparqlService: function() {
//        return this.defaultSparqlService;
//    },

    addTemplate: function(spec) {
        var name = spec.name;
        if(!name) {
            throw new Error('Sponate spec must have a name');
        }

        var mappedConcept = SponateUtils.parseSpec(spec, this.prefixMapping);

        this.nameToMappedConcept[name] = mappedConcept;

        //this.context.addTemplate(spec);
//        var name = spec.name;
//        if(!name) {
//            throw new Error('Sponate spec must have a name');
//        }
//
//        this.nameToTemplate[name] = spec;
    },

    addMap: function(spec) {
        var name = spec.name;
        if(!name) {
            throw new Error('Sponate spec must have a name');
        }

        var sparqlService = spec.service || this.defaultSparqlService;
        if(!sparqlService) {
            throw new Error('No service provided for ', spec);
        }

        var mappedConcept;
        if(ObjectUtils.isString(spec.template)) {
            var templateName = spec.template;
            var tmp = this.nameToMappedConcept[templateName];
            if(!tmp) {
                throw new Error('No template with name ' + templateName + ' registered.');
            }

            mappedConcept = new MappedConcept(tmp.getConcept(), tmp.getAgg().clone());
        } else {
            mappedConcept = SponateUtils.parseSpec(spec, this.prefixMapping);
        }

        var source = new MappedConceptSource(mappedConcept, sparqlService);

        this.context.addSource(name, source);

        this[name] = new CollectionFacade(this, name);

        return source;

//        if(!spec.service) {
//            ObjectUtils.extend({}, spec);
//            spec.service = this.defaultSparqlService;
//        }
//
//        this.context.add(spec);
//        var name = spec.name; // context.add will fail if the name is missing
//
//        if(!name) {
//            throw new Error('Sponate spec must have a name');
//        }
//        this.context.add(spec);

//        this[name] = new CollectionFacade(this, name);
//        this.nameToMap[name] = spec;
    },

    getListService: function(sourceName, isLeftJoin) {
        var self = this;

        var fn = function() {
            var context = self.context.createResolvedContext();
            var r = Engine.createListService(context, sourceName, isLeftJoin);
            return r;
        };

        var result = new ListServiceFn(fn);

        //var result = Engine.createListService(this.context, sourceName, isLeftJoin);
        return result;
    },

});

export default StoreFacade;
