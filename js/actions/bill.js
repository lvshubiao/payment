import {ACTION_TYPE_GET_BILL,ACTION_TYPE_GET_PROFIT} from './types';
import { Bill } from '../api';
import { payload } from './creator';
import { createLoadingAction, createSuccessAction, createFailedAction } from './creator';
/**
 * 获取收账信息
 */
function getBill(dic) { 
    return (dispatch) => {
      return payload(dispatch, ACTION_TYPE_GET_BILL, Bill.getReceivables(dic));
    };
  }
/**
 * 获取分润明细
 */
function getSharedProfit(limit, offset) { 
  return (dispatch) => {
    return payload(dispatch, ACTION_TYPE_GET_PROFIT, Bill.getSharedProfit(limit, offset));
  };
}
export default { 
    getBill,
    getSharedProfit
  }; 