

'use strict';

import Restful from './restful';

/**
 * createdBy: Moke Sun
 * CreatedAt: 2017-10-6
 * 二维码restful接口
 */

export class Qrcode {

  /**
   * 我的店铺二维码，返回二维码的链接
   * @param {*} userId 
   */
  static async getStoreQrcode(userId) {
    let type = 'pay';
    return await Restful.get(`/qrCode/${userId}/${type}`);
    //return await Promise.resolve('https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1510804954&di=78f9679a8e7c1c4dcdce0e54929c1c19&imgtype=jpg&er=1&src=http%3A%2F%2Fwww.longwin.org%2Fimages%2Fweibo.gif');
  }
  
  /**
   * 我的二维码，返回二维码的链接
   * @param {*} userId 
   */
  static async getMyQrcode(userId) {
    return await Restful.get(`/qrcodes/${userId}/PaymentByYiMaFu`);
    //return await Promise.resolve('https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1510804954&di=78f9679a8e7c1c4dcdce0e54929c1c19&imgtype=jpg&er=1&src=http%3A%2F%2Fwww.longwin.org%2Fimages%2Fweibo.gif');
  }
  
}
