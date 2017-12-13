

'use strict';

import ajax from './ajax';
const _ = require('lodash');
import PubSub from 'pubsub-js';
import { TOPIC_HTTP_STATUS, TOPIC_TOKEN_EXPIRED } from '../constants';

/**
 * createdBy: Moke Sun
 * CreatedAt: 2017-10-6
 * Restful类，主要是对ajax再一次封装，直接返回数据，或者错误信息
 */

export default class Restful {

  /**
   * restful get 请求
   * 如果成功，返回data
   * 如果失败，返回error message
   * @param {*} url 
   */
  static async get(url) {
    return await this.getData4Get(ajax.get(url));
  }

  /**
   * restful delete 请求
   * 如果成功，返回data
   * 如果失败，返回error message
   * @param {*} url 
   */
  static async delete(url) {
    return await this.getResult(ajax.delete(url));
  }

  /**
   * restful post 请求
   * 如果成功，返回data
   * 如果失败，返回error message
   * @param {*} url 
   * @param {*} data 
   */
  static async post(url, data) {
    return await this.getResult(ajax.post(url, data));
  }

  /**
   * restful put 请求
   * 如果成功，返回data
   * 如果失败，返回error message
   * @param {*} url 
   * @param {*} data 
   */
  static async put(url, data) {
    return await this.getResult(ajax.put(url, data));
  }
  
  /**
   * 提交 form post 请求
   * 如果成功，返回data
   * 如果失败，返回error message
   * @param {*} url 
   * @param {*} data 
   */
  static async formPost(url, data) {
    return await this.getResult(ajax.formPost(url, data));
  }

  /**
   * 提交 form get 请求
   * 如果成功，返回data
   * 如果失败，返回error message
   * @param {*} url 
   */
  static async formGet(url) {
    return await this.getResult(ajax.formGet(url));
  }

  /**
   * 上传文件
   * 如果成功，返回formData
   * 如果失败，返回error message
   * @param {*} url 
   * @param {*} formData 
   */
  static async upload(url, formData) {
    return await this.getResult(ajax.upload(url, formData));
  }



  /**
   * 获取ajax请求的结果
   * @param {*} promise 
   */
  static async getResult(promise) {
    const that = this; 
    return await new Promise((resolve, reject)=>{
      promise.then((res) => { 
        resolve(res);
      }, (err) => {
        let error = err;
        if(err && err.data){
          error = err.data;
        }
        if(err.data 
          && err.data.status == 100006
          && err.status == 403){
          PubSub.publish(TOPIC_TOKEN_EXPIRED, err.data.message || 'token过期，请重新登录！');
        }
        PubSub.publish(TOPIC_HTTP_STATUS, err.status);
        reject(error.message || JSON.stringify(err));
      });
    });
  }

  /**
   * 获取ajax请求的结果
   * @param {*} promise 
   */
  static async getData4Get(promise) {
    const that = this; 
    return await new Promise((resolve, reject)=>{
      promise.then((res) => { 
        resolve(res.data);
      }, (err) => {
        
        let error = err; 
        if(err && err.data){
          error = err.data;
        }
        if(err.data 
          && err.data.status == 100006
          && err.status == 403){
          PubSub.publish(TOPIC_TOKEN_EXPIRED, err.data.message || 'token过期，请重新登录！');
        }
        PubSub.publish(TOPIC_HTTP_STATUS, err.status);
        reject(error.message || JSON.stringify(err));
      });
    });
  }
  

}
