const base = '/pic/audit/'

const dictBase = '/pic/audit/sys/'
const GET_ROW_LIST_FROM_BUSINESS_CODE = `${base}prodData/getBizGroupField`
const DELETE_LOCK = `${base}anncInfo/taskLock/release`
const JUDJE_LOCK = `${base}anncInfo/lockTask`
const PRO_DATA_LIST = `${base}prodData/getProdDataPage`
const GET_ATTR_LIST =  `${base}tmpl/field/listByPage`
const GET_TEMP_GROUPS = `${base}tmpl/getBizGroups`
const SAVE_OR_MODIFY_RULE = `${base}tmpl/field/fullyAddRepRules`
const HISTORY_PRODUCT_LIST = `${base}anncData/getHistoryProdData`
const GET_REPLACE_RULE_INFOS = `${base}tmpl/field/getRepRuleInfos`
const REMOVE_RULE = `${base}tmpl/field/remove`
const RULE_ATTR_BY_BIZCODE = `${base}tmpl/field/getUnifyFieldInfos`

const SAVE_OR_MODIFY_ATTR = `${base}tmpl/field/saveOrModify`
const GET_BIZ_TYPE_LIST = `${dictBase}getDict?dictCode=BIZ_TYPE`
const GET_PROD_DATA =  `${base}anncData/getProdData`
const SAVE_PROD_DATA = `${base}prodData/modifyProdDataBatch`
const DELETE_PROD_DATA = `${base}prodData/deleteProdDataBatch`
const GET_PROD_ANNCPAGE = `${base}prodData/getProdAnncPage`


const GET_DICT_LIST = `${dictBase}getDict`

const CHECK_VERIFY_DATA = `${base}`
const GET_FIELD_CODE = `${base}tmpl/field/getFieldCode`

const GET_FIELD_VERIFY = `${base}tmpl/field/getVerifyRuleInfos`
const SAVE_OR_MODIFY_VERIFY_RULE  =  `${base}tmpl/field/saveOrModifyVerifyRule`
const SEARCH_PROD_LIST = `/hos-api/pic/product/queryLike`

export default {
    GET_ROW_LIST_FROM_BUSINESS_CODE,
    DELETE_LOCK,
    PRO_DATA_LIST,
    GET_ATTR_LIST,
    HISTORY_PRODUCT_LIST,
    GET_TEMP_GROUPS,
    SAVE_OR_MODIFY_RULE,
    GET_REPLACE_RULE_INFOS,
    REMOVE_RULE,
    RULE_ATTR_BY_BIZCODE,
    GET_BIZ_TYPE_LIST,
    SAVE_OR_MODIFY_ATTR,
    GET_DICT_LIST,
    CHECK_VERIFY_DATA,
    GET_FIELD_CODE,
    GET_PROD_DATA,
    SAVE_PROD_DATA,
    GET_PROD_ANNCPAGE,
    DELETE_PROD_DATA,
    GET_FIELD_VERIFY,
    SAVE_OR_MODIFY_VERIFY_RULE,
    SEARCH_PROD_LIST,
    JUDJE_LOCK
}