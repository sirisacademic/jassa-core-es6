/* jshint maxparams: 6 */
import Class from '../../ext/Class';

import HashBidiMap from '../../util/collection/HashBidiMap';
import GenSym from '../GenSym';
import GeneratorBlacklist from '../GeneratorBlacklist';
import ElementUtils from '../ElementUtils';
import ElementGroup from '../element/ElementGroup';
import ElementOptional from '../element/ElementOptional';
import VarUtils from '../VarUtils';
import JoinNode from './JoinNode';
import JoinTargetState from './JoinTargetState';
import JoinInfo from './JoinInfo';
import JoinType from './JoinType';

// constructor
var JoinBuilder = Class.create({
    initialize: function(rootElement, rootElementVars, rootAlias, defaultRootJoinVars) {
        // Null elements can be used for pseudo-joins that only allocated variables
        // TODO Instead of null elements we now support default join variables for the root node
        if (rootElement == null) {
            console.log('[Error] Root element must not be null');
            throw new Error('Bailing out');
        }

        this.usedVarNames = [];
        this.usedVars = [];

        this.aliasGenerator = new GenSym('a');
        this.varNameGenerator = new GeneratorBlacklist(new GenSym('v'), this.usedVarNames);

        this.aliasToState = {};

        this.rootAlias = rootAlias ? rootAlias : this.aliasGenerator.next();

        // var rootElementVars = targetElement.getVarsMentioned();
        if (defaultRootJoinVars == null) {
            defaultRootJoinVars = [];
        }

        var rootState = this.createTargetState(this.rootAlias, new HashBidiMap(), defaultRootJoinVars, rootElement, rootElementVars, defaultRootJoinVars);

        this.aliasToState[this.rootAlias] = rootState;

        this.rootNode = rootState.getJoinNode(); // new ns.JoinNode(rootAlias);
    },

    getRootNode: function() {
        return this.rootNode;
    },

    getJoinNode: function(alias) {
        var state = this.aliasToState[alias];

        var result = state ? state.getJoinNode() : null;

        return result;
    },

    getState: function(alias) {
        return this.aliasToState[alias];
    },

    getElement: function(alias) {
        var state = this.aliasToState[alias];
        var result = state ? state.getElement() : null;
        return result;
    },

    addVars: function(vars) {

        var self = this;
        vars.forEach(function(v) {
            var varName = v.getName();
            var isContained = self.usedVarNames.indexOf(varName) !== -1;
            if (!isContained) {
                self.usedVarNames.push(varName);
                self.usedVars.push(v);
            }
        });
    },

    createTargetState: function(targetAlias, sourceVarMap, sourceJoinVars, targetElement, oldTargetVars, targetJoinVars) {
        var sjv = sourceJoinVars.map(function(v) {
            var rv = sourceVarMap.get(v);
            return rv;
        });

        var targetVarMap = ElementUtils.createJoinVarMap(this.usedVars, oldTargetVars, sjv, targetJoinVars, this.varNameGenerator);

        var newTargetElement = null;
        if (targetElement != null) {
            newTargetElement = ElementUtils.createRenamedElement(targetElement, targetVarMap);
        }

        var newTargetVars = targetVarMap.getInverse().keys();
        this.addVars(newTargetVars);

        var result = new JoinNode(this, targetAlias, targetJoinVars);

        var targetState = new JoinTargetState(targetVarMap, result, newTargetElement, newTargetVars);
        return targetState;
    },

    addJoin: function(joinType, sourceAlias, sourceJoinVars, targetElement, targetJoinVars, targetAlias) {
        var sourceState = this.aliasToState[sourceAlias];
        var sourceVarMap = sourceState.getVarMap();

        if (!targetAlias) {
            targetAlias = this.aliasGenerator.next();
        }

        var targetElementVars = targetElement.getVarsMentioned();

        var targetState = this.createTargetState(targetAlias, sourceVarMap, sourceJoinVars, targetElement, targetElementVars, targetJoinVars);

        // TODO support specification of join types (i.e. innerJoin, leftJoin)
        var joinInfo = new JoinInfo(targetAlias, joinType);
        sourceState.getJoinInfos().push(joinInfo);

        this.aliasToState[targetAlias] = targetState;

        var result = targetState.getJoinNode();
        return result;
    },

    getElementsRec: function(node) {
        var resultElements = [];

        var element = node.getElement();
        if (element != null) {

            resultElements.push(element);
        }

        var children = node.getJoinNodeInfos();

        var self = this;
        children.forEach(function(child) {
            var childNode = child.getJoinNode();
            var childElements = self.getElementsRec(childNode);

            var childElement = new ElementGroup(childElements);

            var joinType = child.getJoinType();
            switch (joinType) {
                case JoinType.LEFT_JOIN:
                    childElement = new ElementOptional(childElement);
                    break;
                case JoinType.INNER_JOIN:
                    break;
                default:
                    throw new Error('[ERROR] Unsupported join type: ' + joinType);
            }
            resultElements.push(childElement);
        });

        return resultElements;
    },

    getElements: function() {
        var rootNode = this.getRootNode();

        var result = this.getElementsRec(rootNode);

        return result;
    },

    getAliasToVarMap: function() {
        var result = {};
        this.aliasToState.forEach(function(state, alias) {
            result[alias] = state.varMap;
        });

        return result;
    },

    create: function(rootElement, rootAlias, defaultJoinVars) {

        var vars = rootElement.getVarsMentioned();

        var joinBuilder = new JoinBuilder(rootElement, vars, rootAlias, defaultJoinVars);
        var result = joinBuilder.getRootNode();

        return result;
    },

    /**
     * Creates a join node with a 'null' element,
     * however with a set of allocated variables.
     *
     *
     */
    createWithEmptyRoot: function(varNames, rootAlias) {
        // FIXME: varNamesToNodes not defined
        var vars = VarUtils.varNamesToNodes(varNames);

        var joinBuilder = new JoinBuilder(null, vars, rootAlias);
        var result = joinBuilder.getRootNode();

        return result;
    },
});

export default JoinBuilder;
