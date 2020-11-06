import { post, get } from "@/http/client";
import apiUrl from './apiUrl'
// 获取违规事件列表
const deleteNewsList = params => {
    return post(apiUrl.DELETE_NEWS_LIST, params)
}
const getSearchData = params => {
    return post(apiUrl.GET_SEARCH_DATA, params)
}
const getSimilarEvent = params => {
    return post(apiUrl.GET_SIMILAR_EVENT, params)
}
const getNewsSimilarList = params => {
    return get(apiUrl.GET_NEWS_SIMILAR_LIST, params)
}

export {
    deleteNewsList,
    getSearchData,
    getSimilarEvent,
    getNewsSimilarList,
}