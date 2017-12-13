
'use strict';

import {
  ACTION_TYPE_POST_GEN_QR_PAY_ORDER,
  ACTION_TYPE_POST_GEN_UINION_PAY_ORDER,
  ACTION_TYPE_PUT_CONFIRM_UNION_PAY_ORDER,
  ACTION_TYPE_GET_PAYMENT_RESULT
} from '../actions/types';

import {
  ACTION_LOADINGD,
  ACTION_SUCCESS,
  ACTION_FAILED
} from '../constants';

import { defaultParam, patchValue } from './creator';


// 定义初始化状态
const initialState = {
  qrcodePayOrder: {
    ...defaultParam
  },
  unionPayOrder: {
    ...defaultParam
  },
  unionPayResult: {
    ...defaultParam
  },
  paymentResult: {
    ...defaultParam
  }
};

function payment(state = initialState, action) {
  let { type, data, error, status } = action;
  let newState = { ...state };
  switch (type) {
    case ACTION_TYPE_POST_GEN_QR_PAY_ORDER:
      patchValue(newState.qrcodePayOrder, data, error, status);
      return { ...newState };
    case ACTION_TYPE_POST_GEN_UINION_PAY_ORDER:
      patchValue(newState.unionPayOrder, data, error, status);
      return { ...newState };
    case ACTION_TYPE_PUT_CONFIRM_UNION_PAY_ORDER:
      patchValue(newState.unionPayResult, data, error, status);
      return { ...newState };
    case ACTION_TYPE_GET_PAYMENT_RESULT:
      patchValue(newState.paymentResult, data, error, status);
      return { ...newState };
    default:
      return state;
  }
}

export default payment;
