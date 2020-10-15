import { post, get } from "@/http/client";
import apiUrl from './apiUrl'
// 获取违规事件列表
const getViolateList = params => {
    return post(apiUrl.VIOLATE_LIST, params)
}

// 获取公开事件列表
const getPublishEventList = params => {
    return post(apiUrl.PUBLISH_EVENT_LIST, params)
}
// 获取公开事件详情
const getViolateDetails = (params) => {
    if (params.eventId){
        return get(apiUrl.VIOLATE_DETAILS_EVENT, params)
    }else{
        return get(apiUrl.VIOLATE_DETAILS, params)
    }
}
const lockViolate = params => {
    return get(apiUrl.LOCK_VIOLATE, params)
}
// 保存事件
const saveEvent = params => {
    return post(apiUrl.EVENT_SAVE, params)
}
// 公开事件
const publushEvent = params => {
    return post(apiUrl.PUBLISH_EVENT, params)
}
const checkPublish = params => {
    return post(apiUrl.CHECK_PUBLISH, params)
}
// 添加事件
const addEvent = params => {
    return post(apiUrl.ADD_EVENT, params)
}
// 删除公告
const deleteEvent = params => {
    return get(apiUrl.DELETE_EVENT, params)
}
const deleteEventList = params => {
    return post(apiUrl.DELETE_EVENT_LIST, params)
}
// 公告下一条
const violateNext = params => {
    return post(apiUrl.VIOLATE_NEXT, params)
}
// 判断事件锁
const judjeLockEvent  = (params, fromList=false) => {
    if (fromList){
        return get(apiUrl.LOCK_EVENT_LIST, params)
    }else{
        return get(apiUrl.LOCK_EVENT, params)
    }
}
// 进入流程
const enterProcess = params => {
    return get(apiUrl.ENTER_PROCESS, params)
}
// 处理状态
const getStatusList = params => {
    return get(apiUrl.STATUS_LIST, params)
}
// 获取特定事件详情
const getEventItem = params => {
    return post(apiUrl.GET_EVENT_ITEM, params)
}
// 公告类别
const getNoticeTypeList = params => {
    return get(apiUrl.NOTICE_TYPE_LIST, params)
}
// 处理人列表
const getDealPeople = params => {
    return get(apiUrl.DEAL_PEOPLE, params)
}
// 涉及公司
const getCompanyList = params => {
    return post(apiUrl.COMPANY_LIST, params)
}
// 文件类型
const getFileType = params => {
    return post(apiUrl.FILE_TYPE, params)
}
// 业务类型
const getBusinessType = params => {
    return post(apiUrl.BUSINESS_TYPE, params)
}
// 媒体常量
const getMediaSourceList = params => {
    return get(apiUrl.MEDIA_SOURCE_LIST, params)
}


// 关联公告
const judjeCanEditRelationAnnc = params => {
    return get(apiUrl.JUDJE_ANNC, params)
}
const saveRelation = params => {
    return post(apiUrl.SAVE_RELATION, params)
}

// 进程
const saveProcess = params => {
    return post(apiUrl.SAVE_PROCESS, params)
}
const deleteProcess = params => {
    return get(apiUrl.DELETE_PROCESS, params)
}
// 当事人

const saveParty = params=> {
    return post(apiUrl.SAVE_PARTY, params)
}
const deleteParty = params=> {
    return get(apiUrl.DELETE_PARTY, params)
}

// 公开事件常量
// 违规类型
const getRiskTypeList = params => {
    return get(apiUrl.RISK_TYPE_LIST, params)
}
const getSearchRiskTypeList = params => {
    return get(apiUrl.SEARCH_RISK_TYPE_LIST, params)
}
// 处罚机构
const getRiskOrganizationList = params => {
    return get(apiUrl.RISK_ORGANIZATION_LIST, params)
}
const getSearchRiskOrganizationList = params => {
    return get(apiUrl.SEARCH_RISK_ORGANIZATION_LIST, params)
}

// 关联关系
const getConstRelationList = params => {
    return get(apiUrl.RELATION_LIST, params)
}
// 列表关联关系
const getSearchConstRelationList = params => {
    return get(apiUrl.SEARCH_RELATION_LIST, params)
}

//处罚类型
const getPunishType = params => {
    return get(apiUrl.PUNIS_TYPE, params)
}
const getSearchPunishType = params => {
    return get(apiUrl.SEARCH_PUNIS_TYPE, params)
}
// 当事人性质
const getPartyType = params => {
    return get(apiUrl.PARTY_TYPE, params)
}
// 最新事件进程
const getEventProcessStatus = params => {
    return get(apiUrl.EVENT_PROCESS_STATUS, params)
}
//处罚币种
const getMoneyType = params => {
    return get(apiUrl.MONEY_TYPE, params)
}
//当事人编码
const getPartyCodeList = params => {
    return get(apiUrl.PARTY_CODE_LIST, params)
}

// 事件详情

// 无需处理变更为需要处理
const shouldDealAnnc = params => {
    return get(apiUrl.SHOULD_DEAL_ANNC, params)
}

// 无需处理
const noDealEvent = params => {
    return post(apiUrl.NO_DEAL_EVENT, params)
}
// 返回
const retrnBack = params => {
    return get(apiUrl.RETURN_BACK, params)
}
// 处理完成
const completeEvent = params => {
    return post(apiUrl.COMPLETE_EVENT, params)
}

const getEventRelation = params => {
    return post(apiUrl.GET_EVENT_RELATION, params)
}

const searchEventList = params => {
    return post(apiUrl.SEARCH_EVENT_LIST, params)
}


const esSearchCompany = params => {
    return post(apiUrl.ES_SARCH_COMPANY, params, 'data')
}

const unbindRelation = params => {
    return post(apiUrl.UNBIND_RELATION, params)
}
export {
    lockViolate,
    getViolateList,
    getPublishEventList,
    getViolateDetails,
    saveEvent,
    publushEvent,
    checkPublish,
    addEvent,

    deleteEvent,
    deleteEventList,
    violateNext,
    judjeLockEvent,
    enterProcess,
    getEventItem,
    
    // 公告
    saveProcess,
    deleteProcess,
    // 当事人
    saveParty,
    deleteParty,
    
    judjeCanEditRelationAnnc,
    saveRelation,
    
    // 违规公告列表常量
    getStatusList,
    getNoticeTypeList,
    getFileType,
    getBusinessType,
    getMediaSourceList,
    getDealPeople,
    getCompanyList,
    

    // 公开事件列表常量
    getRiskTypeList,
    getSearchRiskTypeList,
    getConstRelationList,
    getSearchConstRelationList,
    getRiskOrganizationList,
    getSearchRiskOrganizationList,
    getEventProcessStatus,
    getPartyType,
    getMoneyType,
    getPunishType,
    getSearchPunishType,
    getPartyCodeList,
    // 事件详情
    retrnBack,
    noDealEvent,
    shouldDealAnnc,
    completeEvent,
    getEventRelation,
    searchEventList,

    esSearchCompany,
    unbindRelation,
}
