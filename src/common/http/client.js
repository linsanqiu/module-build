import http from '@/http'
import API from '@/constant/api.js';
const post = (url, params, type='') => {
    return new Promise( (resolve, reject) => {
        http.post(url, params).then(
            res => {
                let data = res.data
                if(data.status == API.SUCCESS){
                    if (type == 'data'){
                        resolve(data.data)
                    }else{
                        resolve(data.body)
                    }
                }else{
                    reject({content: data.msg, code: data.status})
                }
            }
        ).catch( error => {
            reject({content: '网络连接失败...'})
        })
    })

}
const get = (url, params) => {
    let first = true
    for (let key in params){
        if (first){
            url = `${url}?${key}=${params[key]}`
            first = false
        }else{
            url = `${url}&${key}=${params[key]}`
        }
    }
    return new Promise( (resolve, reject) => {
        http.get(url, params).then(
            res => {
                let data = res.data
                if(data.status == API.SUCCESS){
                    resolve(data.body)
                }else{
                    reject({content: data.msg, code: data.status})
                }
            }
        )
        .catch( error => {
            reject({content: '网络连接失败...'})
        })
    })
}

export {
	post,
    get
}