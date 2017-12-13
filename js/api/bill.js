
'use strict';

import Restful from './restful';
var qs = require('qs');
/**
 * createdBy: Moke Sun
 * CreatedAt: 2017-10-6
 * 账单Restful接口
 */

export class Bill {

  /**
   * 获取我的团队信息
   */
  static async getMyTeam() {
    return await Restful.get('/users/team');
  }

  /**
   * 获取我的分润列表
   * @param limit   条数
   * @param offset  偏移量
   */
  static async getSharedProfit(limit,offset) {
    return await Restful.get(`/users/commissions?limit=${limit}&offset=${offset}`);
  }
  
  /**
   * 获取我的账单列表
   * UNIONPAY,//银联快捷支付
   * WEIXIN_SCAN_BY_USER,//微信
   * ALIPAY_SCAN_BY_USER,//支付宝
   * @param {*} paymentMethod   过滤类型 微信 or 支付宝 or 银联
   * @param {*} limit  条数
   * @param {*} offset 偏移量
   */
  static async getReceivables({paymentMethod,limit,offset}) {
    return await Restful.get('/users/bills?' + qs.stringify({paymentMethod,limit,offset}));
  }
  
  
}
