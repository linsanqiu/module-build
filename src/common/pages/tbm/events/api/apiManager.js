import { post, get } from "@/http/client";
import apiUrl from './apiUrl'
// 获取违规事件列表
const batchDeleteEvent = params => {
    return post(apiUrl.BATCH_DELETE_EVENT, params)
}
const checkDate = params => {
    return post(apiUrl.CHECK_DATE, params)
}
const checkSimilarEvent = params => {
    return post(apiUrl.CHECK_SIMILAR, params)
}
export {
    batchDeleteEvent,
    checkDate,
    checkSimilarEvent
}
