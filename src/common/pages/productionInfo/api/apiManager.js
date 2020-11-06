import { post, get } from "@/http/client";
import apiUrl from './apiUrl'

// 产品数据一览API
// 根据业务类型匹配下拉框
const getRowListFromBusinessCode = params => {
    return get(apiUrl.GET_ROW_LIST_FROM_BUSINESS_CODE, params)
}
// 产品数据一览列表
const proDataList = params => {
    return post(apiUrl.PRO_DATA_LIST, params)
}
// 删除锁
const deleteLock = params => {
    return get(apiUrl.DELETE_LOCK, params)
}
// 规则模板配置
// 字段列表
const getAttrList = params => {
    return post(apiUrl.GET_ATTR_LIST, params)
}
// 根据业务类型获取分组集合
const getTempGroups = params => {
    return get(apiUrl.GET_TEMP_GROUPS,  params)
}
// 新增或编辑字段
const savaOrModifyAttr = params => {
    return post(apiUrl.SAVE_OR_MODIFY_ATTR, params)
}
// 字段修改或新增
const saveOrModifyRule = params => {
    return post(apiUrl.SAVE_OR_MODIFY_RULE, params)
}
// 根据统一模板字段id获取替换规则信息
const getRepRuleInfos = params => {
    return get(apiUrl.GET_REPLACE_RULE_INFOS, params)
}
// 删除统一模板字段
const removeRule = params => {
    return get(apiUrl.REMOVE_RULE, params)
}
// 公告数据录入（根据业务类型获取分组集合）
const getRuleAttrByBizCode = params => {
    return get(apiUrl.RULE_ATTR_BY_BIZCODE, params)
}
// 获取历史数据
const getHistoryProductList = params => {
    return get(apiUrl.HISTORY_PRODUCT_LIST, params)
    
}
const getProdData = params => {
    return get(apiUrl.GET_PROD_DATA, params)
}
const saveProdData = params => {
    return post(apiUrl.SAVE_PROD_DATA, params)
}
const deleteProdData = params => {
    return post(apiUrl.DELETE_PROD_DATA, params)
}
// 业务类型
const getBizTypeList = params => {
    return get(apiUrl.GET_BIZ_TYPE_LIST, params)
}
const getDictList = params => {
    return get(apiUrl.GET_DICT_LIST, params)
}
// 校验数据录入规则
const checkVerifyData = params => {
    return post(apiUrl.CHECK_VERIFY_DATA, params)
}
const checkVerifyDataFromList = params => {
    return post(apiUrl.CHECK_VERIFY_DATA_FROM_LIST, params)
}

const getFieldCode = params => {
    return get(apiUrl.GET_FIELD_CODE, params)
}
// 相关公告
const getProdAnncPage = params => {
    return post(apiUrl.GET_PROD_ANNCPAGE, params)
}
// 获取校验规则
const getFieldVerify = params => {
    return get(apiUrl.GET_FIELD_VERIFY, params)
}
// 修改规则
const saveOrModifyVerifyRule = params => {
    return post(apiUrl.SAVE_OR_MODIFY_VERIFY_RULE, params)
}
// 产品内码搜索
const searchProdList = params => {
    return post(apiUrl.SEARCH_PROD_LIST, params, 'data')
}
// 公告锁判断
const judjeLock = params => {
    return get(apiUrl.JUDJE_LOCK, params)
}

// 获取产品数据一览表头
const getTableHeader = params => {
    return post(apiUrl.GET_TABLE_HEADER, params)
}
export{
    getRowListFromBusinessCode,
    proDataList,
    deleteLock,
    getAttrList,
    getTempGroups,
    savaOrModifyAttr,
    saveOrModifyRule,
    getHistoryProductList,
    getRepRuleInfos,
    removeRule,
    getRuleAttrByBizCode,

    getBizTypeList,
    getDictList,
    checkVerifyData,
    checkVerifyDataFromList,
    getFieldCode,
    getProdData,
    saveProdData,
    deleteProdData,
    getProdAnncPage,
    getFieldVerify,
    saveOrModifyVerifyRule,
    searchProdList,
    judjeLock,
    getTableHeader
}