
'use strict';

import { User } from '../api';
import { createLoadingAction, createSuccessAction, createFailedAction } from './creator';
import { ACTION_TYPE_POST_LOGIN, ACTION_TYPE_POST_LOGOUT, ACTION_TYPE_REGISTER_GET_VCODE, 
         ACTION_TYPE_REGISTER, ACTION_TYPE_FORGET_PASSWORD,ACTION_TYPE_FORGET_PASSWORD_VCODE, 
         ACTION_TYPE_MODIFY_PASSWORD, ACTION_TYPE_MODIFY_GET_VCODE, ACTION_TYPE_IDENTIFICATION,
         ACTION_TYPE_SEND_SMS_CODE_4_IDENTIFICATION,ACTION_TYPE_GET_TEAM,ACTION_TYPE_GET_SOURCE,
         ACTION_TYPE_REAL_RECEIVABLE,ACTION_TYPE_REAL_SPEND,ACTION_TYPE_REAL_PROFIT,ACTION_TYPE_PUTIDENTIFICATION
        ,ACTION_TYPE_MY_STORE_CODE,ACTION_TYPE_GET_FAIL} from './types';
import { payload } from './creator';

//判断我的店铺二维码是否可用
function getUrl(url) {
  return (dispatch) => {
    return payload(dispatch, ACTION_TYPE_MY_STORE_CODE, User.getUrl(url));
  };
}

/**
 * 登录的action
 * @param {*} phone 
 * @param {*} password 
 */
function login({ phone, password }) {
  return (dispatch) => {
    return payload(dispatch, ACTION_TYPE_POST_LOGIN, User.login({ phone, password }));
  };
}

/**
 * 获取验证码的action
 * @param {*} phone 
 * @param {*} token 
 */
function registerVcode(phone) {
  return (dispatch) => {
    return payload(dispatch, ACTION_TYPE_REGISTER_GET_VCODE, User.sendSmsCode4Register(phone));
  };
}

/**
 * 注册的action
 * @param {*} phone 
 * @param {*} password 
 */
function register({code, phone, password,userRefereeId, userRefereePhone}) {
  return (dispatch) => {
    return payload(dispatch, ACTION_TYPE_REGISTER, User.register({code, phone, password,userRefereeId, userRefereePhone}));
  };
}

/**
 * 忘记密码的action
 * @param {*} phone 
 * @param {*} password 
 */
function forgetPassword({code, phone, newPassword}) {
  return (dispatch) => {
    return payload(dispatch, ACTION_TYPE_FORGET_PASSWORD, User.forgotPassword({code, phone, newPassword}));
  };
}

/**
 * 退出的action
 */
function logout() {
  return (dispatch) => {
    return payload(dispatch, ACTION_TYPE_POST_LOGOUT, User.logout());
  };
}

/**
 * 退出的action
 */
function getFaile() {
  return (dispatch) => {
    return payload(dispatch, ACTION_TYPE_GET_FAIL, User.getFile());
  };
}

/**
 * 修改密码的action
 * @param {*} phone 
 * @param {*} password 
 */
function modifyPassword({code, newPassword, oldPassword}) {
  return (dispatch) => {
    dispatch(createLoadingAction(ACTION_TYPE_MODIFY_PASSWORD));
    const promise = User.modifyPassword({code, newPassword, oldPassword});
    promise.then(
      (result) => {
        dispatch(createSuccessAction(ACTION_TYPE_MODIFY_PASSWORD, result));
      },
      (error) => {
        dispatch(createFailedAction(ACTION_TYPE_MODIFY_PASSWORD, error));
      }
    );
    return promise;
  }
}
/*
  * 发送实名认证的验证码
  * @param {*} phone 
  * @param {*} password 
  */
function sendSmsCode4Identification(src) {
  return (dispatch) => {
    return payload(dispatch, ACTION_TYPE_SEND_SMS_CODE_4_IDENTIFICATION, User.sendSmsCode4Indentification(src));
  };
}
/*
  * 分润账单
  */
  function getMonthBill() {
    return (dispatch) => {
      return payload(dispatch, ACTION_TYPE_SEND_SMS_CODE_4_IDENTIFICATION, User.getMonthBill());
    };
  }

/**
 * 获取忘记密码验证码的action
 * @param {*} phone 
 * @param {*} token 
 */
function forgetPasswordVcode(phone) {
  return (dispatch) => {
    dispatch(createLoadingAction(ACTION_TYPE_FORGET_PASSWORD_VCODE));
    const promise = User.sendSmsCode4ForgotPassword(phone);
    promise.then(
      (result) => {
        dispatch(createSuccessAction(ACTION_TYPE_FORGET_PASSWORD_VCODE, result));
      },
      (error) => {
        dispatch(createFailedAction(ACTION_TYPE_FORGET_PASSWORD_VCODE, error));
      }
    );
    return promise;
  };
}

/**
 * 获取修改密码验证码的action
 * @param {*} phone 
 * @param {*} token 
 */
function modifyPasswordVcode() {
  return (dispatch) => {
    dispatch(createLoadingAction(ACTION_TYPE_MODIFY_GET_VCODE));
    const promise = User.sendSmsCode4ModifyPassword();
    promise.then(
      (result) => {
        dispatch(createSuccessAction(ACTION_TYPE_MODIFY_GET_VCODE, result));
      },
      (error) => {
        dispatch(createFailedAction(ACTION_TYPE_MODIFY_GET_VCODE, error));
      }
    );
    return promise;
  };
}

/*
 * 登录的action
 * @param {*} data 
 */
function identification(data) {
  return (dispatch) => {
    return payload(dispatch, ACTION_TYPE_IDENTIFICATION, User.identification(data));
  };
}
function putIdentification(data) {
  return (dispatch) => {
    return payload(dispatch, ACTION_TYPE_PUTIDENTIFICATION, User.putIdentification(data));
  };
}
/**
 * 我的团队
 * 
 * 
 */
function getTeam(data) {
  return (dispatch) => {
    return payload(dispatch, ACTION_TYPE_GET_TEAM, User.getMyTeam(data));
  };
}
/**
 * 实时收款,消费，收益
 */
function realReceivable(data){
  return (dispatch) => {
    return payload(dispatch, ACTION_TYPE_REAL_RECEIVABLE, User.receivable(data));
  };
}
function realSpend(data){
  return (dispatch) => {
    return payload(dispatch, ACTION_TYPE_REAL_SPEND, User.spend(data));
  };
}
function realProfit(data){
  return (dispatch) => {
    return payload(dispatch, ACTION_TYPE_REAL_PROFIT, User.profit(data));
  };
}
/**
 * 导出action方法
 */
export default {
  login,
  logout,
  
  //注册
  registerVcode,  
  register,

  //忘记密码
  forgetPasswordVcode,
  forgetPassword,

  //修改密码
  modifyPasswordVcode,
  modifyPassword,  

  //实名认证
  sendSmsCode4Identification,
  identification,
  putIdentification,

  //我的团队
  getTeam,
  getMonthBill,

  //实时收款,消费，收益
  realReceivable,
  realSpend,
  realProfit,

  getUrl,
  getFaile

}