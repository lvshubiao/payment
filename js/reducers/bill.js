import { ACTION_TYPE_GET_BILL,ACTION_TYPE_GET_PROFIT } from '../actions/types';
import { ACTION_LOADINGD, ACTION_SUCCESS, ACTION_FAILED } from '../constants';
'use strict';
import { defaultParam, patchValue } from './creator';

const initialState = {
    bills: {
        ...defaultParam
    },
    profits:{
        ...defaultParam
    }
};

function bill(state = initialState, action) {
    let { type, data, error, status, wechat, alipay } = action;
    let newState = { ...state };
    switch (type) {
        case ACTION_TYPE_GET_BILL:
            patchValue(newState.bills, data, error, status);
            return { ...newState };
        case ACTION_TYPE_GET_PROFIT:
            patchValue(newState.profits, data, error, status);
            return { ...newState };
        default:
            return state;
    }
}

export default bill;