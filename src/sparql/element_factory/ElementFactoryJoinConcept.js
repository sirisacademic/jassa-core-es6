import Class from '../../ext/Class';
import JoinType from '../join/JoinType';
import JoinBuilder from '../join/JoinBuilder';
import ElementGroup from '../element/ElementGroup';
import ElementFactory from './ElementFactory';

/**
 * Variables of conceptB are renamed
 *
 */
var ElementFactoryJoinConcept = Class.create(ElementFactory, {
    initialize: function(conceptFactoryA, conceptFactoryB, joinType) {
        this.conceptFactoryA = conceptFactoryA;
        this.conceptFactoryB = conceptFactoryB;
        this.joinType = joinType || JoinType.INNER_JOIN;
    },

    createElement: function() {
        var conceptA = this.conceptFactoryA.createConcept();
        var conceptB = this.conceptFactoryB.createConcept();

        var elementA = conceptA.getElement();
        var elementB = conceptB.getElement();

        if (conceptB.isSubjectConcept()) {
            return elementA;
        }

        var joinVarsA = [
            conceptA.getVar(),
        ];
        var joinVarsB = [
            conceptB.getVar(),
        ];

        var rootJoinNode = JoinBuilder.create(elementA);
        var joinNode = rootJoinNode.joinAny(this.joinType, joinVarsA, elementB, joinVarsB);

        var joinBuilder = joinNode.getJoinBuilder();
        var elements = joinBuilder.getElements();
        var result = new ElementGroup(elements);

        return result;
    },
});

export default ElementFactoryJoinConcept;
