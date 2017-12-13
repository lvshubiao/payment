import {Qrcode} from '../api';
import { createLoadingAction, createSuccessAction, createFailedAction } from './creator';
import { ACTION_TYPE_MY_STORE_CODE,ACTION_TYPE_MINE_CODE} from './types';
import { payload } from './creator';
/**
 * 我的店铺二维码，返回二维码的链接
 * @param {*} userId
 */
function getStoreQrcode(userId){
      return (dispatch) => {
        return payload(dispatch, ACTION_TYPE_MY_STORE_CODE, Qrcode.getStoreQrcode(userId));
      };
}

/**
 * 我的二维码，返回二维码的链接
 * @param {*} userId
 */
function getMineQrcode(userId){
  return (dispatch) => {
    return payload(dispatch, ACTION_TYPE_MINE_CODE, Qrcode.getMyQrcode(userId));
  };
}
export default { 
  getStoreQrcode,
  getMineQrcode
}; 