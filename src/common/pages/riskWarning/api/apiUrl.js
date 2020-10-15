const base = '/tm/'
const constPrex = '/tm/vac/sys/dict/getByDictCode'
const constTreePrex = '/tm/vac/sys/bizTree/getTree'
// 违规事件列表
const VIOLATE_LIST = `${base}vac/anncInfo/getAnncPage`
const PUBLISH_EVENT_LIST = `${base}vac/eventInfo/getEventPage`
const VIOLATE_DETAILS = `${base}vac/anncEvent/getInfo`
const VIOLATE_DETAILS_EVENT = `${base}vac/event/getAnncEventInfo`

const EVENT_SAVE = `${base}vac/event/modify`
const ADD_EVENT = `${base}vac/anncEvent/add`

const PUBLISH_EVENT = `${base}vac/event/publish`
const DELETE_EVENT = `${base}vac/anncEvent/remove`
const DELETE_EVENT_LIST = `${base}vac/anncEvent/batch/remove`
const CHECK_PUBLISH = `${base}vac/eventInfo/eventPublishCheck`

const LOCK_VIOLATE = `${base}vac/anncInfo/lockTask`
const LOCK_EVENT = `${base}/vac/event/lockEvent`
const LOCK_EVENT_LIST = `${base}/vac/event/lockEvent`
const ENTER_PROCESS = `${base}vac/anncInfo/getIntoProcess`
const GET_EVENT_ITEM = `${base}vac/anncEvent/bind`

// 关联公告
const JUDJE_ANNC = `${base}vac/event/annc/getInfo`
const SAVE_RELATION = `${base}vac/event/annc/modify`
const UNBIND_RELATION = `${base}vac/anncEvent/unbind`

// 进程
const SAVE_PROCESS =  `${base}vac/event/process/addOrModify`
const DELETE_PROCESS =  `${base}vac/event/process/remove`

// 当事人
const SAVE_PARTY =  `${base}vac/event/party/addOrModify`
const DELETE_PARTY =  `${base}vac/event/party/remove`

//常量列表获取 
//违规事件列表下拉常量

//处理状态
const STATUS_LIST = `${constPrex}?dictCode=PROCESS_STATUS`
//公告类别
const NOTICE_TYPE_LIST = `${constPrex}?dictCode=ANNC_TYPE`
// 处理人
const DEAL_PEOPLE = `${base}vac/anncInfo/handleUserList`
//媒体出处
const MEDIA_SOURCE_LIST = `${base}vac/anncInfo/getMediaSource`
const FILE_TYPE = `${base}ruleConfig/fileType`
const BUSINESS_TYPE = `${base}ruleConfig/businessType`

const ORGANIZATION_LIST = `${base}ruleConfig/organizationList`
const EVENTID_LIST = `${base}ruleConfig/eventIdList`
const RISK_ORGANIZATION_CODE_LIST = `${base}ruleConfig/riskCodeList`
const PARTY_CODE_LIST = `${base}ruleConfig/punisType`


const EVENT_PROCESS_STATUS = `${constPrex}?dictCode=EVENT_PROCESS`
const PARTY_TYPE = `${constPrex}?dictCode=PARTY_NATURE`
const MONEY_TYPE = `${constPrex}?dictCode=PENALTY_CURRENCY`

const RISK_ORGANIZATION_LIST = `${constTreePrex}?bizTypeCode=PUNISH_ORG`
const SEARCH_RISK_ORGANIZATION_LIST = `${base}vac/sys/bizTree/getBizMap?bizTypeCode=PUNISH_ORG`
const RELATION_LIST = `${constTreePrex}?bizTypeCode=RELATION`
const SEARCH_RELATION_LIST = `${base}vac/sys/bizTree/getBizMap?bizTypeCode=RELATION`
const RISK_TYPE_LIST = `${constTreePrex}?bizTypeCode=VIO_TYPE`
const SEARCH_RISK_TYPE_LIST = `${base}vac/sys/bizTree/getBizMap?bizTypeCode=VIO_TYPE`
const PUNIS_TYPE = `${constTreePrex}?bizTypeCode=PUNISH_TYPE`
const SEARCH_PUNIS_TYPE = `${base}vac/sys/bizTree/getBizMap?bizTypeCode=PUNISH_TYPE`
// 事件详情

const VIOLATE_NEXT = `${base}vac/anncInfo/getNextAnncInfo`
// 需要处理
const SHOULD_DEAL_ANNC =`${base}vac/anncInfo/needProcess`
// 无需处理
const NO_DEAL_EVENT = `${base}vac/anncInfo/noProcess`
// 处理完成
const COMPLETE_EVENT = `${base}vac/anncInfo/processCompleted`

const RETURN_BACK = `${base}vac/anncInfo/returnBack`
// 获取涉及公司涉及证券对应关系
const GET_EVENT_RELATION = `${base}ruleConfig/lockEvent`

const SEARCH_EVENT_LIST = `${base}vac/anncEvent/getListByPage`

const ES_SARCH_COMPANY = `/hos-api/vac/company/queryLike`
export default {
    VIOLATE_LIST,
    PUBLISH_EVENT_LIST,
    VIOLATE_DETAILS,
    VIOLATE_DETAILS_EVENT,
    EVENT_SAVE,
    ADD_EVENT,
    CHECK_PUBLISH,
    PUBLISH_EVENT,
    
    DELETE_EVENT,
    DELETE_EVENT_LIST,
    VIOLATE_NEXT,
    ENTER_PROCESS,
    GET_EVENT_ITEM,
    // 公告
    SAVE_PROCESS,
    DELETE_PROCESS,
    UNBIND_RELATION,
    // 当事人
    SAVE_PARTY,
    DELETE_PARTY,

    JUDJE_ANNC,
    SAVE_RELATION, 
    LOCK_VIOLATE,
    LOCK_EVENT,
    LOCK_EVENT_LIST,
    STATUS_LIST,
    NOTICE_TYPE_LIST,
    FILE_TYPE,
    BUSINESS_TYPE,
    DEAL_PEOPLE,
    MEDIA_SOURCE_LIST,
    ORGANIZATION_LIST,
    EVENTID_LIST,
    RISK_TYPE_LIST,
    SEARCH_RISK_TYPE_LIST,
    RISK_ORGANIZATION_LIST,
    SEARCH_RISK_ORGANIZATION_LIST,
    RISK_ORGANIZATION_CODE_LIST,
    RELATION_LIST,
    SEARCH_RELATION_LIST,
    EVENT_PROCESS_STATUS,
    PARTY_CODE_LIST,
    PARTY_TYPE,
    NO_DEAL_EVENT,
    SHOULD_DEAL_ANNC,
    RETURN_BACK,
    COMPLETE_EVENT,
    MONEY_TYPE,
    PUNIS_TYPE,
    SEARCH_PUNIS_TYPE,
    GET_EVENT_RELATION,
    SEARCH_EVENT_LIST,
    
    ES_SARCH_COMPANY,
}