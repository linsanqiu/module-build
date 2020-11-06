import {
    getEventItem, addEvent as apiAddEvent,
    deleteEvent as apiDeleteEvent,
    saveProcess as apiSaveProcess,
    judjeCanEditRelationAnnc,
    saveRelation as apiSaveRelation,
    deleteProcess as apiDeleteProcess,
    saveEvent as apiSaveEvent,
    deleteParty as apiDeleteParty,
    saveParty as apiSaveParty,
    unbindRelation as apiUnbindRelation
} from "@/pages/riskWarning/api/apiManager";
import Vue from 'vue'; //引入vue
//必须实例化 Vue
let vm = new Vue();
import { copyDeep } from '@/filters'
const DEFALUT_PARTY_INFO = Object.freeze({
    "relationTypes": [[]],
    "punishOrgRemark": "",
    "partyOrderNo": "",
    "penalty": "",
    "vioTypes": [[]],
    "punishRemark": "",
    "updateOperator": "",
    "updateTime": '',
    "closeDate": "",
    "partyNature": "",
    "punishedOrgCode": {},
    "company": {},
    "vioTypeRemark": "",
    "punishOrg": [],
    "partyCode": {},
    "partyName": "",
    "vioTerm": "",
    "punishType": [],
    "currency": "",
    "relationRemark": "",
    "partyId": '',
    "startDate": "",
    "editing": true
})

const DEFALUT_PROCESS = Object.freeze({
    'eventProcessTime': '',
    'processId': '',
    'updateOperator': '',
    'updateTime': '',
    'eventProcessCode': '',
    'editing': true,
})
const EVENT_INFO = Object.freeze({
    "anncFirstReleaseTime": "",
    "anncLatestReleaseTime": "",
    "content": "",
    "eventId": "",
    "latestProcess": "",
    "latestProcessCode": "",
    "publishStatus": "",
    "publishStatusCode": 0,
    "updateOperator": "",
    "updateTime": "",
    "eventSubs": [{}],
    "editing": true
})

const state = {
    // 公告信息
    anncInfo: {},
    eventList: [],
    eventInfo: {},
    eventProcesses: [],
    eventParties: [],  //当事人
    // 关联公告
    anncInfos: [],
    eventSelectIndex: 0,
    eventPartyIndex: -1,
    isEventInfoItemShow: true
}

// getters 获取state
const getters = {
    getEventSelectIndex: state => {
        return state.eventSelectIndex
    },
    getEventList: state => {
        return state.eventList
    },
    getEventInfo: state => {
        return state.eventInfo
    },
    getEventProcesses: state => {
        return state.eventProcesses
    },
    getEventParties: state => {
        return state.eventParties
    },
    getAnncInfos: state => {
        return state.anncInfos
    },
}

// actions 外部调用action
// 例store.dispatch('changeNavKeyList')
const actions = {
    setEventSelectIndex({ commit }, payload) {
        // 判断是否加锁
        // lockEvent({}).then(
        //     data => {
        //         commit("setEventSelectIndex", payload);
        //     }
        // )
        commit("setEventSelectIndex", payload);
    },
    // 事件列表
    addEvent({ commit }, payload) {
        let {anncId, callback} = payload
        apiAddEvent({ anncId: anncId }).then(
            data => {
                let anncInfo = data.anncInfo
                commit("setAnncInfo", anncInfo);
                delete data['anncInfo']
                commit("addEvent", data);
                commit("setPartyIndex", 0);
                callback && callback(data.eventInfo.eventId)
            }
        ).catch(
            error => {
                vm.$hMessage.error(error.content)
            }
        )
    },
    saveEvent({ commit }, payload) {
        commit("saveEvent", payload);
    },
    setEventInfoNoApi({ commit }, payload){
        commit("setEventInfo", payload);
    },
    // 事项信息
    setEventInfo({ commit }, payload) {
        let { data } = payload
        data.anncId = state.anncInfo.anncId
        if (data.editing) {
            commit("setEventInfo", payload);
        } else {
            apiSaveEvent(data).then(
                data => {
                    let anncInfo = data.anncInfo
                    payload.data = data.eventInfo
                    commit("setAnncInfo", anncInfo);
                    commit("setEventInfo", payload);
                    commit("setAnncInfos", data.anncInfos);
                }
            )
            .catch(
                error => {
                    vm.$hMessage.error(error.content)
                }
            )
        }

    },
    deleteEventInfo({ commit }, payload) {
        let callback = payload.callback
        delete payload['callback']
        apiDeleteEvent(payload).then(
            data => {
                let anncInfo = data.anncInfo
                commit("setAnncInfo", anncInfo);
                commit("deleteEventInfo", payload);
                callback && callback()
            }
        )
        .catch(
            error => {
                vm.$hMessage.error(error.content)
            }
        )
    },

    setAnncInfo({ commit }, anncInfo) {
        commit("setAnncInfo", anncInfo);
    },
    setViolateDetails({ commit }, eventInfos) {
        commit("setViolateDetails", eventInfos);
    },
    setProcess({ commit }, payload) {
        let { data, index } = payload
        let body = {
            eventId: state.eventInfo.eventId,
            processId: data.processId,
            eventProcessCode: data.eventProcessCode,
            eventProcessTime: data.eventProcessTime,
            anncId: state.anncInfo.anncId
        }
        if (data.editing) {
            commit("setProcess", payload);
        } else {
            // 保存完毕
            apiSaveProcess(body).then(
                data => {
                    let anncInfo = data.anncInfo
                    let _eventInfo = data.eventInfo
                    let eventInfo = state.eventInfo
                    let {latestProcess, latestProcessCode, updateOperator, updateTime} = _eventInfo
                    eventInfo.latestProcess = latestProcess
                    eventInfo.latestProcessCode = latestProcessCode
                    eventInfo.updateOperator = updateOperator
                    eventInfo.updateTime = updateTime
                    delete data['anncInfo']
                    payload.data = data
                    commit("setEventInfo", {data: eventInfo});
                    commit("setAnncInfo", anncInfo);
                    commit("setProcess", payload);
                }
            ).catch(
                error => {
                    vm.$hMessage.error(error.content)
                }
            )
        }
    },
    setOtherProcess({ commit }, payload) {
        commit("setOtherProcess", payload);
    },
    deleteProcess({ commit }, payload) {
        let publishStatusCode = state.eventInfo.publishStatusCode
        let { data, index } = payload
        if (!data.processId || publishStatusCode !== 0) {
            commit("deleteProcess", payload);
            return
        }
        let body = {
            eventId: state.eventInfo.eventId,
            processId: data.processId,
            anncId: state.anncInfo.anncId
        }
        apiDeleteProcess(body).then(
            data => {
                let anncInfo = data.anncInfo
                let eventInfo = state.eventInfo
                delete data['anncInfo']
                let {latestProcess, latestProcessCode, updateOperator, updateTime} = data
                eventInfo.latestProcess = latestProcess
                eventInfo.latestProcessCode = latestProcessCode
                eventInfo.updateOperator = updateOperator
                eventInfo.updateTime = updateTime
                commit("setEventInfo", {data: eventInfo});
                commit("setAnncInfo", anncInfo);
                commit("deleteProcess", payload);
            }
        ).catch(
            error => {
                vm.$hMessage.error(error.content)
            }
        )
    },
    addProcess({ commit }, payload) {
        commit("addProcess", payload);
    },

    // 当事人
    setParty({ commit }, payload) {
        let { data, index } = payload
        let body = {
            ...data,
            eventId: state.eventInfo.eventId,
            anncId: state.anncInfo.anncId
        }
        if (data.editing) {
            commit("setParty", payload);
        } else {
            // 保存完毕
            apiSaveParty(body).then(
                _data => {
                    let anncInfo = _data.anncInfo
                    delete data['anncInfo']
                    payload.data = _data
                    commit("setAnncInfo", anncInfo);
                    commit("setParty", payload);
                }
            ).catch(
                error => {
                    vm.$hMessage.error(error.content)
                }
            )
        }
    },
    setOtherParty({ commit }, payload) {
        commit("setOtherParty", payload);
    },
    deleteParty({ commit }, payload) {
        let publishStatusCode = state.eventInfo.publishStatusCode
        let { data, index } = payload
        if (!data.partyId || publishStatusCode !== 0) {
            commit("deleteParty", payload);
            return
        }
        let body = {
            partyId: data.partyId,
            anncId: state.anncInfo.anncId
        }
        apiDeleteParty(body).then(
            data => {
                let anncInfo = data.anncInfo
                commit("setAnncInfo", anncInfo);
                commit("deleteParty", payload);
            }
        ).catch(
            error => {
                vm.$hMessage.error(error.content)
            }
        )
    },
    coverParties({commit}, parties){
        commit("coverParties", parties);
    },
    addParty({ commit }, payload) {
        commit("addParty", payload);
    },
    // 关联公告
    setRelation({ commit }, payload) {
        let { data, anncId } = payload
        if (data.editing) {
            // 改状态到编辑，判断锁情况
            judjeCanEditRelationAnnc({ anncId: anncId }).then(
                _data => {
                    payload.data = {...data, ..._data}
                    commit("setRelation", payload);
                }
            ).catch(
                error => {
                    vm.$hMessage.error(error.content)
                }
            )
        } else {
            let body = {
                anncId: anncId,
                admNo: data.admNo,
                content: data.content,
                anncTypeCode: data.anncTypeCode,
            }
            // 保存完毕
            apiSaveRelation(body).then(
                _data => {
                    let anncInfo = _data.anncInfo
                    payload.data = {...data, ...anncInfo}
                    commit("setAnncInfo", anncInfo);
                    commit("setRelation", payload);
                }
            ).catch(
                error => {
                    vm.$hMessage.error(error.content)
                }
            )
        }
    },
    // 公告解绑
    unBindRelation({ commit }, payload){
        let {anncId,eventId, index} = payload
        let body = {
            anncId: anncId,
            eventId: eventId,
        }
        apiUnbindRelation(body).then(
            data => {
                if (anncId == state.anncInfo.anncId){
                    // 当前公告
                    commit("deleteEventInfo", payload); //删除事件
                    payload.callback && payload.callback()
                }else{
                    let anncInfos = copyDeep(state.anncInfos)
                    anncInfos.splice(index, 1)
                    commit("setAnncInfos", anncInfos);
                }
            }
        )
        // .catch(
        //     error => {
        //         vm.$hMessage.error(error.content)
        //     }
        // )
    },
    // 添加关联关系或违规类型
    addPartyInfoRow({ commit }, payload) {
        commit("addPartyInfoRow", payload);
    },
    removePartyInfoRow({ commit }, payload) {
        commit("removePartyInfoRow", payload);
    },
    setEventItem({ commit }, payload) {
        payload.anncId = state.anncInfo.anncId
        getEventItem(payload).then(
            data => {
                let anncInfo = data.anncInfo
                commit("setAnncInfo", anncInfo);
                commit("setEventItem", data);
            }
        )
        .catch(
            error => {
                vm.$hMessage.error(error.content)
            }
        )
    },
    coverNowEvent({ commit }, payload){
        commit("coverNowEvent", payload);
    },
    setPartyIndex({ commit }, index){
        commit("setPartyIndex", index);
    },
}

// mutations 更改state
const mutations = {
    setEventSelectIndex(state, payload) {
        let { index } = payload
        state.eventSelectIndex = index
        state.isEventInfoItemShow = false
        initEventItem(state)
        vm.$nextTick(()=>{
            state.isEventInfoItemShow = true
        })
    },
    addEvent(state, data) {
        let nowEventInfo = state.eventInfo
        data.eventInfo = {...nowEventInfo, ...data.eventInfo}
        data.eventInfo.editing = true
        state.eventList.push(data)
        state.eventSelectIndex = state.eventList.length - 1
        initEventItem(state)
    },
    saveEvent(state, payload) {
        let { eventInfo, eventProcesses, eventParties, anncInfos, eventSelectIndex } = state
        state.eventList[eventSelectIndex] = {
            ...state.eventList[eventSelectIndex],
            eventInfo: eventInfo,
            eventProcesses: eventProcesses,
            eventParties: eventParties,
            anncInfos: anncInfos
        }
    },
    // 保存事件
    setEventInfo(state, payload) {
        let { data } = payload
        if (!data.eventSubs || data.eventSubs.length == 0){
            data.eventSubs = [{}]
        }
        state.eventInfo = data
    },
    // 删除事件
    deleteEventInfo(state, payload) {
        let eventSelectIndex = state.eventSelectIndex
        let eventList = state.eventList
        eventList.splice(eventSelectIndex, 1)
        state.eventSelectIndex = 0
        state.eventList = eventList
        initEventItem(state)
    },
    // 进程
    setProcess(state, payload) {
        let { data, index } = payload
        state.eventProcesses.splice(index, 1, data)
    },
    setOtherProcess(state, payload) {
        let { data } = payload
        let copyData = copyDeep(data)
        copyData.processId = ''
        copyData.updateOperator = ''
        copyData.updateTime = ''
        copyData.editing = true
        state.eventProcesses.push(copyData)
    },
    deleteProcess(state, payload) {
        let { index } = payload
        state.eventProcesses.splice(index, 1)
    },
    addProcess(state, payload) {
        let { data, index } = payload
        state.eventProcesses.splice(index, 1, data)
        let defalut = copyDeep(DEFALUT_PROCESS)
        state.eventProcesses.push(defalut)
    },

    // 当事人
    coverParties(state, parties){
        state.eventParties = parties
    },
    setParty(state, payload) {
        let { data, index } = payload
        if (!data.relationTypes || data.relationTypes.length == 0){
            data.relationTypes = [[]]
        }
        if (!data.vioTypes || data.vioTypes.length == 0){
            data.vioTypes = [[]]
        }
        data['_highlight'] = true
        state.eventParties.splice(index, 1, data)
    },
    setOtherParty(state, payload) {
        let { data } = payload
        let copyData = copyDeep(data)
        copyData.partyId = ''
        copyData.updateOperator = ''
        copyData.updateTime = ''
        copyData.editing = true
        state.eventParties.push(copyData)
        state.eventPartyIndex = state.eventParties.length - 1
    },
    deleteParty(state, payload) {
        let { index } = payload
        state.eventParties.splice(index, 1)
        state.eventParties[0]['_highlight'] = true
        state.eventPartyIndex = 0
    },
    addParty(state, payload) {
        let { data, index } = payload
        state.eventParties.splice(index, 1, data)
        let defalut = copyDeep(DEFALUT_PARTY_INFO)
        state.eventParties.push(defalut)
        state.eventPartyIndex = state.eventParties.length - 1
    },

    // 关联公告
    setRelation(state, payload) {
        let { data, index } = payload
        state.anncInfos.splice(index, 1, data)
    },
    setAnncInfo(state, payload) {
        state.anncInfo = payload
    },
    setViolateDetails(state, payload) {
        state.eventList = payload
        initEventItem(state, true)
    },
    addPartyInfoRow(state, payload) {
        let { fieldCode, nowIndex } = payload
        let partyInfoItem = state.eventParties[nowIndex]
        partyInfoItem[fieldCode].push([])
    },
    removePartyInfoRow(state, payload) {
        let { fieldCode, index, nowIndex } = payload
        let partyInfoItem = state.eventParties[nowIndex]
        partyInfoItem[fieldCode].splice(index, 1)
    },
    setEventItem(state, payload) {
        state.eventList.push(payload)
        state.eventSelectIndex = state.eventList.length - 1
        initEventItem(state)
    },
    coverNowEvent(state, payload){
        state.anncInfo = payload.anncInfo
        state.eventList.splice(state.eventSelectIndex, 1, payload)
        initEventItem(state)
    },
    setPartyIndex(state, index){
        state.eventPartyIndex = index
    },
    setAnncInfos(state, anncInfos){
        state.anncInfos = anncInfos
    }
}

function judejArray(array) {
    let pass = true
    for (let j = 0; j < array.length; j++) {
      let _value = array[j];
      if (!_value) {
        pass = false;
        break;
      }
    }
    return pass
}

function changeEditing(item, dictKeyList){
    for (let keyItem in dictKeyList){
        let type = keyItem.type
        let key = keyItem.key
        let value = item[key]
        if (type == '1'){
            if (!value){
                item['editing'] = true
            }
        }else if(type == '2'){
            if (!value){
                item['editing'] = true
            }else{
                if (value.length == 0){
                    item['editing'] = true
                }
            }
        }else if (type == '3'){
            if (!value){
                item['editing'] = true
            }else{
                for (let array in value){
                    let pass = judejArray(array)
                    if (!pass){
                        itemp['editing'] = true
                    }
                }
            }
        }
    }
}

function initEventItem(state, init=false) {
    let eventItem = state.eventList[state.eventSelectIndex] || {}
    let { eventProcesses, eventParties, anncInfos, eventInfo } = eventItem
    if (eventInfo) {
        let {publishStatusCode} = eventInfo
        for (let key in EVENT_INFO) {
            let value = eventInfo[key]
            if (key == 'content' && !value){
                eventInfo.editing = true
            }else if (key == 'content' && value){
                eventInfo[key] = value.replace(/\\n/g, "\n\t");
            }
            if(publishStatusCode == '1' || publishStatusCode == '2'){
                eventInfo.editing = true
            }
            if (value) {
                continue
            }
            if (key == 'editing'){
                continue
            }
            eventInfo[key] = EVENT_INFO[key]
        }
    }else{
        eventInfo = copyDeep(EVENT_INFO)
    }
    if (!eventProcesses) {
        eventProcesses = copyDeep([DEFALUT_PROCESS])
    }else{
        let {publishStatusCode} = eventInfo
        for (let i = 0;i< eventProcesses.length;i++){
            let process = eventProcesses[i]
            if(publishStatusCode == '1' || publishStatusCode == '2'){
                process.editing = true
            }
        }
    }
    if (!eventParties) {
        eventParties = copyDeep([DEFALUT_PARTY_INFO])
    }else{
        let {publishStatusCode} = eventInfo
        for (let i = 0;i< eventParties.length;i++){
            let party = eventParties[i]
            if(publishStatusCode == '1' || publishStatusCode == '2'){
                party.editing = true
            }
            for (let key in DEFALUT_PARTY_INFO) {
                let value = party[key]
                if (value) {
                    continue
                }
                if (key == 'editing'){
                    continue
                }
                party[key] = DEFALUT_PARTY_INFO[key]
            }
            // changeEditing(party, PARTY_REQUIRE_KEY_LIST)
        }

    }
    state.eventInfo = eventInfo
    state.eventProcesses = eventProcesses
    state.eventParties = eventParties
    state.anncInfos = anncInfos
    if (init){
        state.eventPartyIndex = 0
    }
    if (state.eventParties && state.eventParties.length > 0 && state.eventPartyIndex > -1) {
        for (let i = 0; i < state.eventParties.length; i++) {
            let item = state.eventParties[i]
            if (i == state.eventPartyIndex){
                item['_highlight'] = true
            }else{
                item['_highlight'] = false
            }
        }
    }
}
export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}
