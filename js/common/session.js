
'use strict';
import { User } from '../api';
import { KEY_TOKEN, KEY_USER_INFO, KEY_REFRESH_TOKEN } from '../constants';
/**
 * session
 */
export default class Session {

  /**
   * 判断是否已登录
   * 从local storage里面取
   */
  static async hasLoggedIn() {
    try{
      const storage = global.storage;
      const token = await storage.load({key: KEY_TOKEN});
      if(token){
        return await Promise.resolve(true);
      }else{
        return await Promise.reject(false);
      }
    }catch(e){
      return await Promise.reject(false);
    }
  }

  /**
   * 保存登录的token信息
   * @param {*} token 
   */
  static async setToken(token) {
    const storage = global.storage;
    return await storage.save({ key: KEY_TOKEN, data: token });
  }
  /**
   * 获取登录的token信息
   * @param {*} token 
   */
  static async getToken() {
    const storage = global.storage;
    return await storage.load({ key: KEY_TOKEN});
  }
  /**
   * 保存登录的Refresh token信息
   * @param {*} token 
   */
  static async setRefreshToken(token) {
    const storage = global.storage;
    return await storage.save({ key: KEY_REFRESH_TOKEN, data: token });
  }
  /**
   * 获取登录的Refresh token信息
   * @param {*} token 
   */
  static async getRefreshToken() {
    const storage = global.storage;
    return await storage.load({ key: KEY_REFRESH_TOKEN});
  }
  /**
   * 获取用户信息
   * 从local storage里面取
   */
  static async getUserInfo() {
    try{
      const storage = global.storage;
      const user = await User.getUserInfo();
      return await Promise.resolve(user);
    }catch(e){
      return await Promise.reject(e);
    }
  }
  static async getLocalUserInfo() {
    try{
      const storage = global.storage;
      const user = await storage.load({key: KEY_USER_INFO});     
      return await Promise.resolve(user);
    }catch(e){
      return await Promise.reject(e);
    }
  }

  /**
   * 保存用户信息
   * @param {*} user 
   */
  static async setUserInfo(user) {
    const storage = global.storage;
    return await storage.save({ key: KEY_USER_INFO, data: user });
  }

  /**
   * 清除session
   */
  static async clearSession() {
    try{
      const storage = global.storage;
      storage.remove({ key: KEY_TOKEN });
      storage.remove({ key: KEY_USER_INFO });
      return await Promise.resolve(true);
    }catch(e){
      return await Promise.reject(e);
    }
  }

}
