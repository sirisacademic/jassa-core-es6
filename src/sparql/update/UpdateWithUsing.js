import Class from '../../ext/Class';

var UpdateWithUsing = Class.create({
    initialize: function(withNode, usingNodes, usingNamedNodes) {
        this.withNode = withNode;
        this.usingNodes = usingNodes;
        this.usingNamedNodes = usingNamedNodes;
    },

    toString: function() {
        var result = '';

        if(this.withNode != null) {
            result += 'WITH ' + this.withNode + ' ';
        }

        if(this.usingNodes != null) {
            result += 'USING ' + this.usingNodes.join(' ') + ' ';
        }

        if(this.usingNamedNodes != null) {
            result += 'USING NAMED' + this.usingNamedNodes.join(' ') + ' ';
        }

        return result;
    }
});

export default UpdateWithUsing;
