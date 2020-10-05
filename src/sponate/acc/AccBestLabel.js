import Class from '../../ext/Class';
import NodeUtils from '../../rdf/NodeUtils';
import Acc from './Acc';


// zip - but only for two arrays
var zip = function(a, b) {
    var result = [];

    var n = Math.max(a.length, b.length);

    for(var i = 0; i < n; ++i) {
        var item = [a[i], b[i]];
        result.push(item);
    }

    return result;
};

var compareArray = function(as, bs, op) {
    var result = false;

    var n = Math.max(as.length, bs.length);
    for(var i = 0; i < n; ++i) {
        var a = as[i];
        var b = bs[i];

        if (op(a, b)) {
            if (op(b, a)) {
                continue;
            }

            result = true;
            break;
        } else { //else if(op(b, a)) {
            if (!op(b, a)) {
                continue;
            }

            result = false;
            break;
        }
    }

    return result;
};


var cmpLessThan = function(a, b) {
    return a < b;
};

var indexOf = function(a, v) {
    var result = -1;
    for(var i = 0; i < a.length; ++i) {
        var item = a[i];
        if(item.equals(v)) {
            result = i;
            break;
        }
    }

    return result;
};

var AccBestLabel = Class.create(Acc, {
    initialize: function(bestLiteralConfig) {
        this.bestLiteralConfig = bestLiteralConfig;

        this.bestMatchNode = null;
        this.bestMatchScore = [1000, 1000];
    },

    getSubAccs: function() {
        return [];
    },

    accumulate: function(binding) {

        // Evaluate label, property and subject based on the binding
        var blc = this.bestLiteralConfig;

        var subject = binding.get(blc.getSubjectVar());
        var property = binding.get(blc.getPredicateVar());
        var label = binding.get(blc.getObjectVar());

        if(this.bestMatchNode == null) {
            this.bestMatchNode = subject;
        }

        var candidateLang = NodeUtils.getLang(label);

        // Determine the score vector for the property and the language
        var propertyScore = indexOf(blc.getPredicates(), property);
        var langScore = blc.getLangs().indexOf(candidateLang);

        var score = [propertyScore, langScore];

        var allNonNegative = score.every(function(item) {
            return item >= 0;
        });

        if(allNonNegative) {
            // Check if the new score is better (less than) than the current best match
            var cmp = compareArray(score, this.bestMatchScore, cmpLessThan);
            //console.log('status', cmp, score, this.bestMatchScore, cmpLessThan);
            if(cmp === true) {
                this.bestMatchScore = score;
                this.bestMatchNode = label;
            }
        }
    },

    getValue: function() {
        return this.bestMatchNode;
    },

});

export default AccBestLabel;
