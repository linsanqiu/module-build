import { post, get } from "@/http/client";
import apiUrl from './apiUrl'
const getInfos = params => {
    return post(apiUrl.GET_INFOS, params)
}
const getNewsType = params => {
    return get(apiUrl.GET_NEWS_TYPE, params)
}
const modifyInfo = params => {
    return post(apiUrl.MODIFY_INFO, params)
}
export {
    getInfos,
    getNewsType,
    modifyInfo
}
