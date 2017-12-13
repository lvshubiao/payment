

'use strict';

import Restful from './restful';
import AnalyticsUtil from '../utils/AnalyticsUtil';
/**
 * createdBy: Moke Sun
 * CreatedAt: 2017-10-6
 * 支付restful接口
 */

export class Payment {

  /**
   * 生成收款二维码，返回二维码的链接
   * @param {*} amount 
   * @param {*} name 
   * @param {*} paymentMethod 
   */
  static async generatePayQrcode({amount, name, paymentMethod}) {
    return await Restful.post('/payments', {amount, name, paymentMethod});
  }

  /**
   * 生成银联支付订单，不管是新卡还是旧卡都支持
   * 1. 如果选择已有的银行卡支付，银行卡对象里面应该有 bankId
   * 2. 如果选择新的银行卡支付，银行卡对象的  bankId 应该是空的
   * 注：需要带上是否记住的参数
   * @param {*} amount 
   * @param {*} bankCardNumber 
   * @param {*} bankId 
   * @param {*} bankName 
   * @param {*} cardholder 
   * @param {*} cvv2 
   * @param {*} expiredMonth 
   * @param {*} expiredYear 
   * @param {*} idCardNumber 
   * @param {*} phone 
   * @param {*} rememberMe 
   */
  static async generateUinionPayOrder(scope) {
    return await Restful.post('/payments/unionpay', scope);
  }

  /**
   * 银联支付订单确认支付
   * @param {*} authorizationCode 
   * @param {*} paymentId 
   * @param {*} paymentMethod 默认值 ‘UNIONPAY’ 
   */
  static async confirmUinionPayOrder({authorizationCode, paymentId, paymentMethod = 'UNIONPAY'}) {

    
    return await Restful.put('/payments', {authorizationCode,paymentId, paymentMethod});
  }

  static async postUinionPayOrder({name="银联支付", bankCardId, paymentMethod="UNIONPAY",amount}) {
    return await Restful.post('/payments', {name,bankCardId, paymentMethod,amount});
  }
   /**
   * 获取支付结果, （支付详情）
   * @param {*} paymentId 
   */
  static async getPaymentResult(paymentId) {

    return await Restful.get(`/payments/${paymentId}`);
  }


}