'use strict';

import ArrayUtils from './ArrayUtils';
import ExceptionUtils from './ExceptionUtils';
import CacheUtils from './CacheUtils';
import ClusterUtils from './ClusterUtils';
import CollectionUtils from './CollectionUtils';
import JsonUtils from './JsonUtils';
import MapUtils from './MapUtils';
import ObjectUtils from './ObjectUtils';
import PrefixUtils from './PrefixUtils';
import PromiseUtils from './PromiseUtils';
import SerializationContext from './SerializationContext';
import Serializer from './Serializer';
import SetUtils from './SetUtils';
import SetDelegate from './collection/SetDelegate';
import SetDelegateCache from './collection/SetDelegateCache';
import SetIntersection from './collection/SetIntersection';
import SetDifference from './collection/SetDifference';
import SetUnion from './collection/SetUnion';
import StringUtils from './StringUtils';
import TreeUtils from './TreeUtils';
import UriUtils from './UriUtils';
import shared from './shared';
import ArrayList from './collection/ArrayList';
import Entry from './collection/Entry';
import HashBidiMap from './collection/HashBidiMap';
import HashMap from './collection/HashMap';
import HashSet from './collection/HashSet';
import Iterator from './collection/Iterator';
import IteratorAbstract from './collection/IteratorAbstract';
import IteratorArray from './collection/IteratorArray';
import ListMap from './collection/ListMap';
import MapUnion from './collection/MapUnion';
import MultiMapObjectArray from './collection/MultiMapObjectArray';
import AjaxUtils from './AjaxUtils';

var ns = {
    ArrayUtils,
    ExceptionUtils,
    CacheUtils,
    ClusterUtils,
    CollectionUtils,
    JsonUtils,
    MapUtils,
    ObjectUtils,
    PrefixUtils,
    PromiseUtils,
    SerializationContext,
    Serializer,
    SetUtils,
    SetDelegate,
    SetDelegateCache,
    SetIntersection,
    SetDifference,
    SetUnion,
    StringUtils,
    TreeUtils,
    UriUtils,
    shared,
    ArrayList,
    Entry,
    HashBidiMap,
    HashMap,
    HashSet,
    Iterator,
    IteratorAbstract,
    IteratorArray,
    ListMap,
    MapUnion,
    MultiMapObjectArray,
    AjaxUtils,
};

//Object.freeze(ns);

export default ns;

