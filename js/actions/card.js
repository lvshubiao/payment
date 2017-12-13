

import { ACTION_TYPE_GET_CREDITCARDS,ACTION_TYPE_DELETE_BANK, ACTION_TYPE_GET_BANK_NAME,ACTION_TYPE_ADD_BANK } from './types';
import { BankCard } from '../api';
import { payload } from './creator';
import { createLoadingAction, createSuccessAction, createFailedAction } from './creator';


/**
 * 获取信用卡列表
 */
function getCreditCards() {
  return (dispatch) => {
    return payload(dispatch, ACTION_TYPE_GET_CREDITCARDS, BankCard.getCreditCards());
  };
}

/**
 * 获取银行卡名称
 * @param {*} cardNumber 
 */
function getBankName(cardNumber) {
  return (dispatch) => {
    return payload(dispatch, ACTION_TYPE_GET_BANK_NAME, BankCard.getBankName(cardNumber));
  };
}
//添加信用卡
function addBankCard(scope) {
  return (dispatch) => {
    return payload(dispatch, ACTION_TYPE_ADD_BANK, BankCard.addBankCard(scope));
  };
}
//删除
function deleteBankCard(scope) {
  return (dispatch) => {
    return payload(dispatch, ACTION_TYPE_DELETE_BANK, BankCard.deleteBankCard(scope));
  };
}

export default {
  getCreditCards,
  getBankName,
  addBankCard,
  deleteBankCard
}; 