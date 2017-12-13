import {ACTION_TYPE_CASHOUT} from './types';
import { Cashout } from '../api';
import { payload } from './creator';
import { createLoadingAction, createSuccessAction, createFailedAction } from './creator';
/**
 * 提现
 */
function cashout(drawMoneyAmount) { 
    return (dispatch) => {
      return payload(dispatch, ACTION_TYPE_CASHOUT, Cashout.cashout(drawMoneyAmount));
    };
  }
export default { 
    cashout
  }; 