'use strict';

import owl from './owl';
import rdf from './rdf';
import rdfs from './rdfs';
import wgs84 from './wgs84';
import xsd from './xsd';
import cs from './cs';
import InitialContext from './InitialContext';

var ns = {
    owl,
    rdf,
    rdfs,
    wgs84,
    xsd,
    cs,
    InitialContext
};

//Object.freeze(ns);

export default ns;

