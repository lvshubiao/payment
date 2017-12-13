

'use strict';

import Restful from './restful';
import Session from '../common/session';
import AnalyticsUtil from '../utils/AnalyticsUtil';
import cutstring from '../common/cutstring';
/**
 * createdBy: Moke Sun
 * CreatedAt: 2017-10-6
 * 用户Restful接口
 */

export class User {

  /**
   * 获取token
   * @param {*} phone    电话 
   * @param {*} password 密码
   */
  static async authorize({phone, password}) {
    return await Restful.formPost('/passport/authorize', {phone, password});
  }

  /**
   * 获取用户详情
   */
  static async getUserInfo() {
    return await Restful.get('/users/me');
  }

  /**
   * 获取我的店铺二维码
   */
  static async getUrl(url) {
    return await Restful.get(url);
  }

  /**
   * 登录并保存token、user信息到本地storage
   * @param {*} phone    电话 required
   * @param {*} password 密码 required
   * @returns user 用户详情
   */
  static async login ({phone, password}) {
    let that = this;
    let res = new Promise(async (resolve, reject) => {
      try{
        if(!phone || !password){
          reject('参数错误');
          return;
        }
        const { accessToken, refreshToken } = await that.authorize({phone, password});
        if(!accessToken){
          reject('登录失败, token 响应为空');
          return;
        }
        // save token to local
        await Session.setToken(accessToken);
        await Session.setRefreshToken(refreshToken);

        let user = await that.getUserInfo();
        if(!user){
          reject('获取用户信息错误，响应空对象');
          return;
        }
        // save user info to local storage
        await Session.setUserInfo(user);
        
        AnalyticsUtil.profileSignInWithPUID(user.userId.toString());

        AnalyticsUtil.onEventWithMap("login",{USERID:user.userId.toString(),PHONE:cutstring.formatPhone(user.phone)});
        resolve(user);
      }catch(e){
        reject(e);
      }
    });
    return await res;
  }

  /**
   * 退出登录并清除本地storage的token信息、user信息
   */
  static async logout () {
    return await new Promise(async (resolve, reject)=>{
      await Session.clearSession();
      try{
        let result = await Restful.delete('/passport/logout');
        AnalyticsUtil.profileSignOff();
        resolve(result);
      }catch(e){
        reject(e);
      }
    });
  }

  /**
   * 注册账号
   * @param {*} code              验证码    required
   * @param {*} phone             电话号码   required
   * @param {*} password          密码       required
   * @param {*} userRefereeId     推荐人id
   * @param {*} userRefereePhone  推荐人电话号码
   */
  static async register({code, phone, password, userRefereeId, userRefereePhone}) {
    return await new Promise(async (resolve, reject)=>{
      try{
        if(!code || !phone || !password){
          reject('参数错误');
        }
        let result = await Restful.post('/users', { code, phone, password, userRefereeId, userRefereePhone });
        resolve(result);
      }catch(e){
        reject(e);
      }
    });
  }

  /**
   * 忘记密码
   * @param {*} code          验证码
   * @param {*} phone         电话号码
   * @param {*} newPassword   新密码
   */
  static async forgotPassword({code, phone, newPassword}) {
    return await Restful.put('/users/password/forgot', {code, phone, newPassword});
  }

  /**
   * 修改密码
   * @param {*} code          验证码
   * @param {*} newPassword   新密码
   * @param {*} oldPassword   旧密码
   */
  static async modifyPassword({code, newPassword, oldPassword}) {
    return await Restful.put('/users/password', {code, newPassword, oldPassword});
  }

  /**
   * 发送忘记密码短信验证码
   * @param {*} phone 手机号码 
   */
  static async sendSmsCode4ForgotPassword(phone) {
    return await Restful.get(`/users/password/forgot/smsCode/${phone}`);
  }

  /**
   * 修改密码短信验证码
   */
  static async sendSmsCode4ModifyPassword() {
    return await Restful.get(`/users/password/smsCode`);
  }

  /**
   * 注册短信验证码
   * @param {*} phone 手机号码 
   */
  static async sendSmsCode4Register(phone) {
    return await Restful.get(`/users/smsCode/${phone}`);
  }

  /**
   * 身份认证，包括身份证认证、收款账户的银行卡认证
   * 如果认证成功，重新刷新用户信息
   * @param {*} data 认证数据
   *{
   *  "bankCardNumber": "银行卡号码",
   *  "bankName": "银行名称",
   *  "cardholder": "持卡人姓名",
   *  "code": "验证码",
   *  "idCardNumber": "身份证号码"
   *}
   */
  static async identification(data) {
    var map = {
      bankCardNumber:cutstring.formatBankCard(data.bankCardNumber),
      bankName:data.bankName,
      cardholder:cutstring.formatName(data.cardholder),
      idCardNumber:cutstring.formatBankCard(data.idCardNumber),
      code:'0'
    }
      return await Restful.post('/users/identification', { ...data });
  }

  static async putIdentification(data) {
    var map = {
      bankCardNumber:cutstring.formatBankCard(data.bankCardNumber),
      bankName:data.bankName,
      cardholder:cutstring.formatName(data.cardholder),
      idCardNumber:cutstring.formatBankCard(data.idCardNumber),
      code:'0'
    }
      await this.refreshUserInfo();
      map.code = '0';
      AnalyticsUtil.onEventWithMap('identification',map);
      return await Restful.put('/users/identification', { ...data });
  }
  /**
   * 刷新用户信息
   */
  static async refreshUserInfo() {
    try{
      let user = await this.getUserInfo();
      await Session.setUserInfo(user);
      return await Promise.resolve(true);
    }catch(e){
      return await Promise.reject(false);
    }
  }



  /**
   * 发送实名验证的验证码
   */
  static async sendSmsCode4Indentification(src) {
    if(src){
      return await Restful.get("/users/identification/smsCode?isUpdate=true");
    }else{
      return await Restful.get('/users/identification/smsCode');
    }
  }


  /**
   * 获取文案分享
   */
  static async getFile() {
      return await Restful.get('/advertisements?limit=100&offset=0');
  }

  /**
   * 实时收益
   */
  static async profit() {
    return await Restful.get('/users/profits');
  }
  /**
   * 实时收款
   */
  static async receivable() {
    return await Restful.get('/users/receivables');
  }
    /**
   * 实时消费
   */
  static async spend() {
    return await Restful.get('/users/spends');
  }
  static async getMyTeam() {
    return await Restful.get('/users/team');
  }

  /**
   * 我的收账
   */
  static async getMonthBill() {
    return await Restful.get('/users/commissions/months/current');

  }
}

  
