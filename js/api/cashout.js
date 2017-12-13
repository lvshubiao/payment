

'use strict';

import Restful from './restful';

/**
 * createdBy: Moke Sun
 * CreatedAt: 2017-10-8
 * 提现restful接口
 */

export class Cashout {

  /**
   * 提现
   * @param {*} drawMoneyAmount 提现金额 
   */
  static async cashout(drawMoneyAmount) {
    return await Restful.post('/users/balances', {drawMoneyAmount});
  }
  
}