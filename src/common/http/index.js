import http from 'axios';
import store from '@/store';
import api from '@/constant/api'

// 添加一个请求拦截器
http.interceptors.request.use(function (config) {
  if(!config.params){
    config.params = {};
  }
  config.params['_time'] = (new Date()).getTime()
  // Do something before request is sent
  return config;
}, function (error) {
  // Do something with request error
  return Promise.reject(error);
});

// 添加一个响应拦截器
http.interceptors.response.use(function (response) {
  //1004
  if(response && response.data && response.data.status && response.data.status == api.NOLOGIN){
    store.dispatch("logout");
    location.reload();
  }
  return response;
}, function (error) {
  // Do something with response error
  return Promise.reject(error);
});

export default http;
