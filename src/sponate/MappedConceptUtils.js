import NodeUtils from '../rdf/NodeUtils';
import LabelUtils from '../sparql/LabelUtils';
import VarUtils from '../sparql/VarUtils';
import ExprVar from '../sparql/expr/ExprVar';
import AggArray from './agg/AggArray';
import AggLiteral from './agg/AggLiteral';
import AggMap from './agg/AggMap';
import AggObject from './agg/AggObject';
import AggBestLabel from './agg/AggBestLabel';
import AggTransform from './agg/AggTransform';
import BindingMapperExpr from './binding_mapper/BindingMapperExpr';
import BindingMapperTransform from './binding_mapper/BindingMapperTransform';
import Concept from '../sparql/Concept';
import MappedConcept from './MappedConcept';
import NodeUtils from '../rdf/NodeUtils';
import BestLabelConfig from '../sparql/BestLabelConfig';

var MappedConceptUtils = {

    createMappedConceptLiteralPreference: function(literalPreference) {
        var bestLiteralConfig = new BestLabelConfig(literalPreference);

        var result = MappedConceptUtils.createMappedConceptBestLabel(bestLiteralConfig);
        return result;
    },

    createMappedConceptBestLabel: function(bestLabelConfig) {
        var relation = LabelUtils.createRelationPrefLabels(bestLabelConfig);

        var s = relation.getSourceVar();
        var o = relation.getTargetVar();

        var agg =
            new AggObject({
                id: new AggTransform(new AggLiteral(new BindingMapperExpr(new ExprVar(s))), NodeUtils.getValue),
                displayLabel: new AggTransform(new AggBestLabel(bestLabelConfig), NodeUtils.getValue),
                hiddenLabels: new AggArray(
                    new AggTransform(new AggLiteral(new BindingMapperExpr(new ExprVar(o))), NodeUtils.getValue))
            });

        agg = new AggMap(new BindingMapperExpr(new ExprVar(s)), agg);


        var labelConcept = new Concept(relation.getElement(), relation.getSourceVar());
        var result = new MappedConcept(labelConcept, agg);

        return result;
    },

};

export default MappedConceptUtils;
