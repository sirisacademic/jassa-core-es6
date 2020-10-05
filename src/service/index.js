'use strict';

import AjaxUtils from './AjaxUtils';
import BindingLookup from './BindingLookup';
import ListFilter from './ListFilter';
import LookupServiceBuilder from './LookupServiceBuilder';
import LookupServiceUtils from './LookupServiceUtils';
import PageExpandUtils from './PageExpandUtils';
import QueryPaginator from './QueryPaginator';
import RequestCache from './RequestCache';
import ResultSetPart from './ResultSetPart';
import ResultSetUtils from './ResultSetUtils';
import ServiceUtils from './ServiceUtils';
import SparqlServiceBuilder from './SparqlServiceBuilder';
import TableServiceUtils from './TableServiceUtils';
import SparqlCacheSupplier from './cache/SparqlCacheSupplier';
import Cache from './cache/Cache';
import CacheSimple from './cache/CacheSimple';
import Criteria from './criteria/Criteria';
import Order from './criteria/Order';
import Restrictions from './criteria/Restrictions';
import ServiceBuilder from './criteria/ServiceBuilder';
import DataService from './data_service/DataService';
import DataServiceArray from './data_service/DataServiceArray';
import DataServiceFilter from './data_service/DataServiceFilter';
import DataServiceTransformEntry from './data_service/DataServiceTransformEntry';
import AugmenterLookup from './list_service/AugmenterLookup';
import ListService from './list_service/ListService';
import ListServiceArray from './list_service/ListServiceArray';
import ListServiceAugmenter from './list_service/ListServiceAugmenter';
import ListServiceConcept from './list_service/ListServiceConcept';
import ListServiceConceptKeyLookup from './list_service/ListServiceConceptKeyLookup';
import ListServiceFn from './list_service/ListServiceFn';
import ListServiceIndexSubString from './list_service/ListServiceIndexSubString';
import ListServicePageExpand from './list_service/ListServicePageExpand';
import ListServiceSparqlQuery from './list_service/ListServiceSparqlQuery';
import ListServiceTransformConcept from './list_service/ListServiceTransformConcept';
import ListServiceTransformConceptMode from './list_service/ListServiceTransformConceptMode';
import ListServiceTransformItem from './list_service/ListServiceTransformItem';
import ListServiceTransformItems from './list_service/ListServiceTransformItems';
import ListServiceUtils from './ListServiceUtils';
import LookupService from './lookup_service/LookupService';
import LookupServiceBase from './lookup_service/LookupServiceBase';
import LookupServiceCache from './lookup_service/LookupServiceCache';
import LookupServiceChunker from './lookup_service/LookupServiceChunker';
import LookupServiceConst from './lookup_service/LookupServiceConst';
import LookupServiceDelegateBase from './lookup_service/LookupServiceDelegateBase';
import LookupServiceFn from './lookup_service/LookupServiceFn';
import LookupServiceGraphSparql from './lookup_service/LookupServiceGraphSparql';
import LookupServiceIdFilter from './lookup_service/LookupServiceIdFilter';
import LookupServiceKeyMap from './lookup_service/LookupServiceKeyMap';
import LookupServiceListServiceSparql from './lookup_service/LookupServiceListServiceSparql';
import LookupServiceMap from './lookup_service/LookupServiceMap';
import LookupServiceFallback from './lookup_service/LookupServiceFallback';
import LookupServiceMulti from './lookup_service/LookupServiceMulti';
import LookupServiceSparqlQuery from './lookup_service/LookupServiceSparqlQuery';
import LookupServiceTimeout from './lookup_service/LookupServiceTimeout';
import LookupServiceTransform from './lookup_service/LookupServiceTransform';
import LookupServiceTransformKey from './lookup_service/LookupServiceTransformKey';
import QueryCacheBindingHashSingle from './query_cache/QueryCacheBindingHashSingle';
import QueryCacheNodeFactory from './query_cache/QueryCacheNodeFactory';
import QueryCacheNodeFactoryImpl from './query_cache/QueryCacheNodeFactoryImpl';
import QueryExecution from './query_execution/QueryExecution';
import QueryExecutionCache from './query_execution/QueryExecutionCache';
import QueryExecutionDelegate from './query_execution/QueryExecutionDelegate';
import QueryExecutionFailover from './query_execution/QueryExecutionFailover';
import QueryExecutionHttp from './query_execution/QueryExecutionHttp';
import QueryExecutionPageExpand from './query_execution/QueryExecutionPageExpand';
import QueryExecutionPaginate from './query_execution/QueryExecutionPaginate';
import UpdateExecutionHttp from './query_execution/UpdateExecutionHttp';
import ResultSet from './result_set/ResultSet';
import ResultSetArrayIteratorBinding from './result_set/ResultSetArrayIteratorBinding';
import ResultSetHashJoin from './result_set/ResultSetHashJoin';
import SparqlService from './sparql_service/SparqlService';
import SparqlServiceBaseString from './sparql_service/SparqlServiceBaseString';
import SparqlServiceCache from './sparql_service/SparqlServiceCache';
import SparqlServiceConsoleLog from './sparql_service/SparqlServiceConsoleLog';
import SparqlServiceFactory from './sparql_service/SparqlServiceFactory';
import SparqlServiceFactoryConst from './sparql_service/SparqlServiceFactoryConst';
import SparqlServiceFactoryDefault from './sparql_service/SparqlServiceFactoryDefault';
import SparqlServiceFailover from './sparql_service/SparqlServiceFailover';
import SparqlServiceHttp from './sparql_service/SparqlServiceHttp';
import SparqlServiceLimit from './sparql_service/SparqlServiceLimit';
import SparqlServicePageExpand from './sparql_service/SparqlServicePageExpand';
import SparqlServicePaginate from './sparql_service/SparqlServicePaginate';
import SparqlServiceReliableLimit from './sparql_service/SparqlServiceReliableLimit';
import SparqlServiceVirtFix from './sparql_service/SparqlServiceVirtFix';
import SparqlUpdateBaseString from './sparql_service/SparqlUpdateBaseString';
import SparqlUpdateHttp from './sparql_service/SparqlUpdateHttp';
import TableService from './table_service/TableService';
import TableServiceDelegateBase from './table_service/TableServiceDelegateBase';
import TableServiceFacet from './table_service/TableServiceFacet';
import TableServiceListService from './table_service/TableServiceListService';
import TableServiceNodeLabels from './table_service/TableServiceNodeLabels';
import TableServiceQuery from './table_service/TableServiceQuery';
import UpdateUtils from './UpdateUtils';

var ns = {
    AjaxUtils,
    BindingLookup,
    ListFilter,
    LookupServiceBuilder,
    LookupServiceUtils,
    PageExpandUtils,
    QueryPaginator,
    RequestCache,
    ResultSetPart,
    ResultSetUtils,
    ServiceUtils,
    SparqlServiceBuilder,
    TableServiceUtils,
    SparqlCacheSupplier,
    Cache,
    CacheSimple,
    Criteria,
    Order,
    Restrictions,
    ServiceBuilder,
    DataService,
    DataServiceArray,
    DataServiceFilter,
    DataServiceTransformEntry,
    AugmenterLookup,
    ListService,
    ListServiceArray,
    ListServiceAugmenter,
    ListServiceConcept,
    ListServiceConceptKeyLookup,
    ListServiceFn,
    ListServiceIndexSubString,
    ListServicePageExpand,
    ListServiceSparqlQuery,
    ListServiceTransformConcept,
    ListServiceTransformConceptMode,
    ListServiceTransformItem,
    ListServiceTransformItems,
    ListServiceUtils,
    LookupService,
    LookupServiceBase,
    LookupServiceCache,
    LookupServiceChunker,
    LookupServiceConst,
    LookupServiceDelegateBase,
    LookupServiceFn,
    LookupServiceGraphSparql,
    LookupServiceIdFilter,
    LookupServiceKeyMap,
    LookupServiceListServiceSparql,
    LookupServiceMap,
    LookupServiceFallback,
    LookupServiceMulti,
    LookupServiceSparqlQuery,
    LookupServiceTimeout,
    LookupServiceTransform,
    LookupServiceTransformKey,
    QueryCacheBindingHashSingle,
    QueryCacheNodeFactory,
    QueryCacheNodeFactoryImpl,
    QueryExecution,
    QueryExecutionCache,
    QueryExecutionDelegate,
    QueryExecutionFailover,
    QueryExecutionHttp,
    QueryExecutionPageExpand,
    QueryExecutionPaginate,
    UpdateExecutionHttp,
    ResultSet,
    ResultSetArrayIteratorBinding,
    ResultSetHashJoin,
    SparqlService,
    SparqlServiceBaseString,
    SparqlServiceCache,
    SparqlServiceConsoleLog,
    SparqlServiceFactory,
    SparqlServiceFactoryConst,
    SparqlServiceFactoryDefault,
    SparqlServiceFailover,
    SparqlServiceHttp,
    SparqlServiceLimit,
    SparqlServicePageExpand,
    SparqlServicePaginate,
    SparqlServiceReliableLimit,
    SparqlServiceVirtFix,
    SparqlUpdateBaseString,
    SparqlUpdateHttp,
    TableService,
    TableServiceDelegateBase,
    TableServiceFacet,
    TableServiceListService,
    TableServiceNodeLabels,
    TableServiceQuery,
    UpdateUtils,
};

//Object.freeze(ns);

export default ns;

