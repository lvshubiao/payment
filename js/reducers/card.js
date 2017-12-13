
'use strict';

import {
  ACTION_TYPE_GET_CREDITCARDS,
  ACTION_TYPE_GET_BANK_NAME,
  ACTION_TYPE_DELETE_BANK
} from '../actions/types';
import {
  ACTION_LOADINGD,
  ACTION_SUCCESS,
  ACTION_FAILED
} from '../constants';
import {
  defaultParam,
  patchValue
} from './creator';

const initialState = {
  bankName: null,
  creditCards: {
    ...defaultParam,
  },
  debitCard: {
    ...defaultParam,
  },
  deleteCard:{
    ...defaultParam,
  }
};

function card(state = initialState, action) {
  let { type, data, error, status } = action;
  let newState = { ...state };
  switch (type) {
    case ACTION_TYPE_GET_CREDITCARDS:
      patchValue(newState.creditCards, data, error, status);
      return { ...newState };
    case ACTION_TYPE_GET_BANK_NAME:
      if (data && status === ACTION_SUCCESS) {
        newState.bankName = data;
      }
      return { ...newState };
    return { ...newState };
    case ACTION_TYPE_DELETE_BANK:
    patchValue(newState.deleteCard, data, error, status);
      return { ...newState };
    default:
      return state;
  }
}

export default card;