
'use strict';

import Restful from './restful';
/**
 * createdBy: Moke Sun
 * CreatedAt: 2017-10-8
 * 银行卡Restful接口
 */

export class BankCard {

  /**
   * 获取信用卡列表
   * @param {*} bankCard 
   */
  static async getCreditCards() {
    return await Restful.get('/users/bankcards');
  }

  /**
   * 添加银行卡（目前基本上都是信用卡）
   * @param {*} bankCard 
   */
  static async addBankCard(bankCard) {
    return await Restful.post('/users/bankcards', bankCard);
  }
/**
   * 删除信用卡
   * @param {*} bankCard 
   */
  static async deleteBankCard(bankCardId) {
    return await Restful.delete(`/users/bankcards/${bankCardId}`);
  }

  /**
   * 设置信用卡还款日期
   * @param {*} cardId   信用卡id
   * @param {*} day      还款日期 1-31
   */
  static async setRepaymentDate(cardId, day) {
    return await Restful.put(`/users/bankcards/repaymentDate/${cardId}/${day}`, {});
  }

  /**
   * 根据银行卡号码获取银行名称
   * @param {*} cardNumber  银行卡号码
   */
  static async getBankName(cardNumber) {
    if(!cardNumber) {
      return await Promise.resolve('');
    }
    return await Restful.get(`/api/resources/bankName/${cardNumber}`);
  }

}
