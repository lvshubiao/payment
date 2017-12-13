
'use strict';

import { Payment } from '../api';
import {
  ACTION_TYPE_POST_GEN_QR_PAY_ORDER,
  ACTION_TYPE_POST_GEN_UINION_PAY_ORDER,
  ACTION_TYPE_PUT_CONFIRM_UNION_PAY_ORDER,
  ACTION_TYPE_GET_PAYMENT_RESULT,
} from './types';
import { payload } from './creator';

/**
 * 生成支付二维码
 * @param {*} scope 
 */
function generatePayQrcode(scope) {
  return (dispatch) => {
    return payload(dispatch, ACTION_TYPE_POST_GEN_QR_PAY_ORDER, Payment.generatePayQrcode(scope));
  };
}

/**
 * 生成银联支付订单
 * @param {*} scope 
 */
function generateUinionPayOrder(scope) {
  return (dispatch) => {
    return payload(dispatch, ACTION_TYPE_POST_GEN_UINION_PAY_ORDER, Payment.generateUinionPayOrder(scope));
  };
}

/**
 * 确认银联支付订单
 * @param {*} scope 
 */
function confirmUinionPayOrder(scope) {
  return (dispatch) => {
    return payload(dispatch, ACTION_TYPE_PUT_CONFIRM_UNION_PAY_ORDER, Payment.confirmUinionPayOrder(scope));
  };
}

function postUinionPayOrder(scope) {
  return (dispatch) => {
    return payload(dispatch, ACTION_TYPE_POST_GEN_QR_PAY_ORDER, Payment.postUinionPayOrder(scope));
  };
}

/**
 * 获取支付结果
 * @param {*} paymentId 
 */
function getPaymentResult(paymentId) {
  return (dispatch) => {
    return payload(dispatch, ACTION_TYPE_GET_PAYMENT_RESULT, Payment.getPaymentResult(paymentId));
  };
}

/**
 * 导出action方法
 */
export default {
  generatePayQrcode,
  generateUinionPayOrder,
  confirmUinionPayOrder,
  getPaymentResult,
  postUinionPayOrder
}

