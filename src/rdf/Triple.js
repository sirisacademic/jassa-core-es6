import Class from '../ext/Class';
import NodeUtils from './NodeUtils';

// constructor
var Triple = Class.create({
    classLabel: 'jassa.rdf.Triple',

    // functions
    initialize: function(subject, predicate, object) {
        this.subject = subject;
        this.predicate = predicate;
        this.object = object;
    },

    equals: function(that) {
        var result =
            this.subject.equals(that.subject) &&
            this.predicate.equals(that.predicate) &&
            this.object.equals(that.object);

        return result;
    },

    hashCode: function() {
        if(this.hash == null) {
            this.hash = this.subject.hashCode() + 3 * this.predicate.hashCode() + 7 * this.object.hashCode();
        }

        return this.hash;
    },

    toString: function() {
        return this.subject + ' ' + this.predicate + ' ' + this.object;
    },
    copySubstitute: function(fnNodeMap) {
        var result = new Triple(
            NodeUtils.getSubstitute(this.subject, fnNodeMap),
            NodeUtils.getSubstitute(this.predicate, fnNodeMap),
            NodeUtils.getSubstitute(this.object, fnNodeMap)
        );
        return result;
    },
    getSubject: function() {
        return this.subject;
    },
    getPredicate: function() {
        return this.predicate;
    },
    getObject: function() {
        return this.object;
    },
    getVarsMentioned: function() {
        var result = [];
        NodeUtils.pushVar(result, this.subject);
        NodeUtils.pushVar(result, this.predicate);
        NodeUtils.pushVar(result, this.object);
        return result;
    },

    toArray: function() {
        var result = [this.subject, this.predicate, this.object];
        return result;
    },
});

export default Triple;
