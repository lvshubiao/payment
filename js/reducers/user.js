
'use strict';

import {
  ACTION_TYPE_POST_LOGIN,
  ACTION_TYPE_POST_LOGOUT,
  ACTION_TYPE_REGISTER,
  ACTION_TYPE_REGISTER_GET_VCODE,
  ACTION_TYPE_IDENTIFICATION,
  ACTION_TYPE_SEND_SMS_CODE_4_IDENTIFICATION,
  ACTION_TYPE_FORGET_PASSWORD,
  ACTION_TYPE_FORGET_PASSWORD_VCODE,
  ACTION_TYPE_MODIFY_GET_VCODE,
  ACTION_TYPE_MODIFY_PASSWORD,
  ACTION_TYPE_GET_TEAM,
  ACTION_TYPE_GET_SOURCE,
  ACTION_TYPE_REAL_RECEIVABLE,
  ACTION_TYPE_REAL_SPEND,
  ACTION_TYPE_REAL_PROFIT,
  ACTION_TYPE_PUTIDENTIFICATION,
  ACTION_TYPE_GET_FAIL
} from '../actions/types';

import {
  ACTION_LOADINGD,
  ACTION_SUCCESS,
  ACTION_FAILED
} from '../constants';

import { defaultParam, patchValue } from './creator';


// 定义初始化状态
const initialState = {
  login: {
    isLoggedIn: false,
    ...defaultParam
  },
  registerVcode: {
    ...defaultParam
  },
  register: {
    ...defaultParam
  },
  forgetPasswordVcode: {
    ...defaultParam    
  },
  forgetPassword: {
    ...defaultParam    
  },
  modifyPasswordVcode: {
    ...defaultParam    
  },
  modifyPassword: {
    ...defaultParam    
  },
  identificationVcode: {
    ...defaultParam
  },
  identification: {
    ...defaultParam
  },
  putIdentification: {
    ...defaultParam
  },
  team:{
    ...defaultParam
  },
  monthBill:{
    ...defaultParam
  },
  realReceivable:{
    ...defaultParam
  },
  realSpend:{
    ...defaultParam
  },
  realProfit:{
    ...defaultParam
  },
  getFail:{
    ...defaultParam
  }
};

function user(state = initialState, action) {
  let { type, data, error, status } = action;
  let newState = { ...state };
  switch (type) {
    case ACTION_TYPE_POST_LOGIN:
      patchValue(newState.login, data, error, status);
      newState.login.isLoggedIn = status === ACTION_SUCCESS;
      return { ...newState };
    case ACTION_TYPE_POST_LOGOUT:
      patchValue(newState.login, data, error, status);
      newState.login.isLoggedIn = !(status === ACTION_SUCCESS);
      return { ...newState };
    case ACTION_TYPE_IDENTIFICATION:
      patchValue(newState.identification, data, error, status);
      return { ...newState };
    case ACTION_TYPE_SEND_SMS_CODE_4_IDENTIFICATION:
      patchValue(newState.identificationVcode, data, error, status);
      return { ...newState };
    case ACTION_TYPE_REGISTER_GET_VCODE:
      patchValue(newState.registerVcode, data, error, status);    
      return { ...newState };
    case ACTION_TYPE_REGISTER:
      patchValue(newState.register, data, error, status);    
      return { ...newState };
    case ACTION_TYPE_FORGET_PASSWORD_VCODE:
      patchValue(newState.forgetPasswordVcode, data, error, status);    
      return { ...newState };
    case ACTION_TYPE_FORGET_PASSWORD:
      patchValue(newState.forgetPassword, data, error, status);    
      return { ...newState };
    case ACTION_TYPE_MODIFY_GET_VCODE:
      patchValue(newState.modifyPasswordVcode, data, error, status);    
      return { ...newState };
    case ACTION_TYPE_MODIFY_PASSWORD:
      patchValue(newState.modifyPassword, data, error, status);    
      return { ...newState };
    case ACTION_TYPE_GET_TEAM:
     patchValue(newState.team, data, error, status);    
      return { ...newState };
    case ACTION_TYPE_GET_SOURCE:
       patchValue(newState.monthBill, data, error, status);    
      return { ...newState };
    case ACTION_TYPE_REAL_RECEIVABLE:
      patchValue(newState.realReceivable, data, error, status);    
     return { ...newState };
    case ACTION_TYPE_REAL_SPEND:
     patchValue(newState.realSpend, data, error, status);    
    return { ...newState };
    case ACTION_TYPE_REAL_PROFIT:
    patchValue(newState.realProfit, data, error, status);    
   return { ...newState };
    case ACTION_TYPE_PUTIDENTIFICATION:
    patchValue(newState.identification,data, error, status);    
    return { ...newState };
    case ACTION_TYPE_GET_FAIL:
    patchValue(newState.getFail,data, error, status);    
    return { ...newState };
    default:
      return state;
  }
}


export default user;
