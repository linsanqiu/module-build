import {
    getStatusList,
    getNoticeTypeList,
    getDealPeople,
    getFileType,
    getBusinessType,
    getMediaSourceList,

    getRiskTypeList,
    getSearchRiskTypeList,
    getRiskOrganizationList,
    getSearchRiskOrganizationList,
    getConstRelationList,
    getSearchConstRelationList,
    getEventProcessStatus,
    getPunishType,
    getSearchPunishType,
    getPartyType,
    getMoneyType,
    getPartyCodeList
} from "@/pages/riskWarning/api/apiManager";

const state = {
    // 处理状态
    statusList: [],
    // 公告类型
    noticeTypeList: [],
    // 处理人
    dealUserList: [],
    // 媒体出处
    mediaSourceList: [],
    // 文件类型
    fileTypeList: [],
    // 业务类型
    businessTypeList: [],

    // 已公开事件列表
    // 违规类型
    riskTypeList: [],
    // 列表页违规类型
    searchRiskTypeList: [],
    // 处罚机构
    riskOrganizationList: [],
    // 列表页处罚机构
    searchRiskOrganizationList: [],
    //关联关系
    constRelationList: [],
    searchConstRelationList: [],
    // 最新事件进程
    eventProcessStatus: [],
    //处罚类型
    punishType: [],
    // 处罚类型列表搜索
    searchPunishType: [],
    punishTypeDict: {},
    // 当事人性质
    partyType: [],
    // 罚款金额币种
    moneyType: [],
    // 当事人编码
    partyCodeList: [],

}
// getters 获取state
const getters = {

}

const actions = {
    statusList({ commit }, payload) {
        if (state.statusList.length > 0) return
        getStatusList({}).then(
            data => {
                payload = data.dictList
                commit("statusList", payload);
            }
        )
    },
    // 公告类别
    noticeTypeList({ commit }, payload) {
        if (state.noticeTypeList.length > 0) return
        getNoticeTypeList({}).then(
            data => {
                payload = data.dictList
                for (let item of data.dictList){
                    item.value = item.entryValue
                    item.label = item.entryName
                }
                commit("noticeTypeList", payload);
            }
        )
    },
    dealUserList({ commit }, payload) {
        if (state.dealUserList.length > 0) return
        getDealPeople({}).then(
            data => {
                let _list = data.handleUserList
                for (let item of _list){
                    item.value = item.id
                    item.label = item.realName
                }
                payload = data.handleUserList
                commit("dealUserList", payload);
            }
        )
    },
    fileTypeList({ commit }, payload) {
        if (state.fileTypeList.length > 0) return
        getFileType({}).then(
            data => {

            }
        )
        commit("fileTypeList", payload);
    },
    businessTypeList({ commit }, payload) {
        if (state.businessTypeList.length > 0) return
        getBusinessType({}).then(
            data => {

            }
        )
        commit("businessTypeList", payload);
    },
    mediaSourceList({ commit }, payload) {
        if (state.mediaSourceList.length > 0) return
        getMediaSourceList({}).then(
            data => {
                payload = data.mediaSourceList
                for (let item of data.mediaSourceList) {
                    item.label = item.dsNewsColumns
                    item.value = item.dsCode
                }
                commit("mediaSourceList", payload);
            }
        ).catch(
            error => {
                console.log(error)
            }
        )
    },
    riskTypeList({ commit }, payload) {
        if (state.riskTypeList.length > 0) return
        getRiskTypeList({}).then(
            data => {
                payload = data.bizTreeList
                commit("riskTypeList", payload);
            }
        )
    },
    searchRiskTypeList({ commit }, payload) {
        if (state.searchRiskTypeList.length > 0) return
        getSearchRiskTypeList({}).then(
            data => {
                payload = data.dictList
                for (let item of data.dictList) {
                    item.label = item.bizName
                    item.value = item.bizCode
                }
                commit("searchRiskTypeList", payload);
            }
        )
    },
    riskOrganizationList({ commit }, payload) {
        if (state.riskOrganizationList.length > 0) return
        getRiskOrganizationList({}).then(
            data => {
                payload = data.bizTreeList
                commit("riskOrganizationList", payload);
            }
        )
    },
    searchRiskOrganizationList({ commit }, payload) {
        if (state.searchRiskOrganizationList.length > 0) return
        getSearchRiskOrganizationList({}).then(
            data => {
                payload = data.dictList
                for (let item of data.dictList) {
                    item.label = item.bizName
                    item.value = item.bizCode
                }
                commit("searchRiskOrganizationList", payload);
            }
        )
    },
    constRelationList({ commit }, payload) {
        if (state.constRelationList.length > 0) return
        getConstRelationList({}).then(
            data => {
                payload = data.bizTreeList
                commit("constRelationList", payload);
            }
        )
    },
    searchConstRelationList({ commit }, payload) {
        if (state.constRelationList.length > 0) return
        getSearchConstRelationList({}).then(
            data => {
                payload = data.dictList
                for (let item of data.dictList) {
                    item.label = item.bizName
                    item.value = item.bizCode
                }
                commit("searchConstRelationList", payload);
            }
        )
    },
    eventProcessStatus({ commit }, payload) {
        if (state.eventProcessStatus.length > 0) return
        getEventProcessStatus({}).then(
            data => {
                payload = data.dictList
                for (let item of data.dictList) {
                    item.label = item.entryName
                    item.value = item.entryValue
                }
                commit("eventProcessStatus", payload);
            }
        )
    },
    punishType({ commit }, payload) {
        if (state.punishType.length > 0) return
        getPunishType({}).then(
            data => {
                payload = data.bizTreeList
                commit("punishType", payload);
            }
        )
    },
    searchPunishType({ commit }, payload) {
        if (state.searchPunishType.length > 0) return
        getSearchPunishType({}).then(
            data => {
                let punishTypeDict = {}
                payload = data.dictList
                for (let item of data.dictList) {
                    item.label = item.bizName
                    item.value = item.bizCode
                    punishTypeDict[item.bizCode] = item
                }
                commit("punishTypeDict", punishTypeDict);
                commit("searchPunishType", payload);
            }
        )
    },
    partyType({ commit }, payload) {
        if (state.partyType.length > 0) return
        getPartyType({}).then(
            data => {
                payload = data.dictList
                for (let item of data.dictList) {
                    item.label = item.entryName
                    item.value = item.entryValue
                }
                commit("partyType", payload);
            }
        )
    },
    moneyType({ commit }, payload) {
        if (state.moneyType.length > 0) return
        getMoneyType({}).then(
            data => {
                for (let item of data.dictList) {
                    item.label = item.entryName
                    item.value = item.entryValue
                }
                payload = data.dictList
                commit("moneyType", payload);
            }
        )
    },
    partyCodeList({ commit }, payload) {
        if (state.moneyType.length > 0) return
        getPartyCodeList({}).then(
            data => {
                for (let item of data.dictList) {
                    item.label = item.entryName
                    item.value = item.entryValue
                }
                commit("partyCodeList", payload);
            }
        )
    },

}


const mutations = {
    statusList(state, payload) {
        state.statusList = payload
    },
    noticeTypeList(state, payload) {
        state.noticeTypeList = payload
    },
    dealUserList(state, payload) {
        state.dealUserList = payload
    },
    fileTypeList(state, payload) {
        state.fileTypeList = payload
    },
    businessTypeList(state, payload) {
        state.businessType = payload
    },
    mediaSourceList(state, payload) {
        state.mediaSourceList = payload
    },
    riskTypeList(state, payload) {
        state.riskTypeList = payload
    },
    searchRiskTypeList(state, payload) {
        state.searchRiskTypeList = payload
    },
    riskOrganizationList(state, payload) {
        state.riskOrganizationList = payload
    },
    searchRiskOrganizationList(state, payload) {
        state.searchRiskOrganizationList = payload
    },
    constRelationList(state, payload) {
        state.constRelationList = payload
    },
    searchConstRelationList(state, payload) {
        state.searchConstRelationList = payload
    },
    eventProcessStatus(state, payload) {
        state.eventProcessStatus = payload
    },
    punishType(state, payload) {
        state.punishType = payload
    },
    searchPunishType(state, payload) {
        state.searchPunishType = payload
    },
    punishTypeDict(state, payload) {
        state.punishTypeDict = payload
    },
    partyType(state, payload) {
        state.partyType = payload
    },

    moneyType(state, payload) {
        state.moneyType = payload
    },
    partyCodeList(state, payload) {
        state.partyCodeList = payload
    },
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}