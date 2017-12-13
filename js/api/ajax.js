
import axios from 'axios';
import config from '../config';
import { KEY_TOKEN, KEY_REFRESH_TOKEN } from '../constants';
import sha512 from 'crypto-js/sha512';
const qs = require('qs');
const _ = require('lodash');


// 创建一个自定义的axios
var instance = axios.create();

// api url 
instance.defaults.baseURL = config.serverURL;
instance.defaults.headers.post['Content-Type'] = 'application/json';


instance.interceptors.request.use(function (config) {
  return config;
}, function (error) {
  return Promise.reject(error);
});

instance.interceptors.response.use(function (response) {
  return response;
}, function (error) { 
  let err = JSON.stringify(error);
  /*
{successful: false, status: 0, message: "持卡人身份信息、手机号或CVN2输入不正确，验证失败[1000005]"}
message
:
"持卡人身份信息、手机号或CVN2输入不正确，验证失败[1000005]"
status
:
0
successful
:
false
  */
  //第三方通道拦截
  if(error
  && error.response
  && error.response.status == 400
  && error.response.data){
    return Promise.reject(error);
  }
  // 判断是否token过期，过期重新获取
  if (error
    && error.response
    && error.response.status == 403
    && error.response.data
    && error.response.data.status == 100005) {
      let url = _.replace(error.request._url, config.serverURL, '');
      let method = _.lowerCase(error.request._method);
      return refreshToken(url, method).then((res)=>{
        return res;
      }, (err)=>{ 
        return Promise.reject(err);
      });
  }else{
    return Promise.reject(error);
  }  
});


/**
 * 刷新token
 */
async function refreshToken(url, method) {
  try {
    const storage = global.storage;
    const refreshToken = await storage.load({ key: KEY_REFRESH_TOKEN });
    const oldToken = await storage.load({ key: KEY_TOKEN });
    let refreshSecureKey = sha512(oldToken + '.' + config.refreshTokenKey) + '.' + refreshToken;
    let newAxios = axios.create();
    let newResponse = await newAxios.request({
      url: url,
      method: method,
      baseURL: config.serverURL,
      headers: {
        'Content-Type': 'application/json',
        'X-SECURE-TOKEN':  refreshSecureKey,
        'Authorization': oldToken
      }
    });
    const newToken = newResponse.headers.authorization;
    const newRefreshToken = newResponse.headers['x-refresh-token'];
    await storage.save({ key: KEY_TOKEN, data: newToken });
    await storage.save({ key: KEY_REFRESH_TOKEN, data: newRefreshToken });
    return await Promise.resolve(newResponse);
  } catch (e) { 
    // 刷新token失败，可能是刷新的token也已经过期
    return await Promise.reject(e);
  }
}

/**
 * 设置token
 */
async function setTokenForAxiosInstance() {
  try {
    const token = await global.storage.load({ key: KEY_TOKEN });
    instance.defaults.headers.common['Authorization'] = token;
    return await Promise.resolve(instance);
  } catch (e) {
    // 获取token失败，可能是没有存在，忽略
    return await Promise.resolve(instance);
  }
}

/**
 * 返回http request promise的结果
 * @param {*} promise 
 */
async function resResult(promise) {
  return await new Promise(async (resolve, reject) => {
    promise.then((res) => { 
      resolve(res.data);
    }, (err) => {
      let error = null;
      if (err.response) {
        if(err.response.status === 500
          || err.response.status === 503){
          if(err.response.data){
            err.response = err.response.status + ":服务器内部错误,如有问题请联系我们的客服";
            err.response = err.response.split('/')[0];
          }
          
        }
        error = err.response;
      } else {
        error = '服务器没有响应！';
      }
      reject(error);
    });
  });
}

/**
 * get request
 * @param {*g} url 
 */
async function get(url) {
  const request = await setTokenForAxiosInstance();
  return await resResult(request.get(url));
}

/**
 * post request
 * @param {*} url 
 * @param {*} data 
 */
async function post(url, data) {
  const request = await setTokenForAxiosInstance();
  return await resResult(request.post(url, data));
}

/**
 * delete request
 * @param {*g} url 
 */
async function del(url) {
  const request = await setTokenForAxiosInstance();
  return await resResult(request.delete(url));
}

/**
 * put request
 * @param {*} url 
 * @param {*} data 
 */
async function put(url, data) {
  const request = await setTokenForAxiosInstance();
  return await resResult(request.put(url, data));
}

/**
 * post form表单提交
 * @param {*} url 
 * @param {*} data 
 */
async function formPost(url, data) {
  const request = await setTokenForAxiosInstance();
  let headers = { 'Content-Type': 'application/x-www-form-urlencoded' };
  return await resResult(request.post(url, qs.stringify(data), { headers }));
}

/**
 * get form表单提交
 * @param {*} url 
 * @param {*} data 
 */
async function formGet(url) {
  const request = await setTokenForAxiosInstance();
  let headers = { 'Content-Type': 'application/x-www-form-urlencoded' };
  return await resResult(request.get(url, { headers }));
}

/**
 * 文件上传
 * @param {*} url 
 * @param {*} formData 
 */
async function upload(url, formData) {
  const request = await setTokenForAxiosInstance();
  let headers = { 'Content-Type': 'multipart/form-data', 'Accept': 'application/json' };
  return await resResult(request.post(url, formData, { headers }));
}

const ajax = {
  get: get,
  post: post,
  delete: del,
  put: put,
  formPost: formPost,
  formGet: formGet,
  upload: upload
};

export default ajax;