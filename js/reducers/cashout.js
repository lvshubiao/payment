import { ACTION_TYPE_CASHOUT } from '../actions/types';
import { ACTION_LOADINGD, ACTION_SUCCESS, ACTION_FAILED } from '../constants';
'use strict';
import { defaultParam, patchValue } from './creator';

const initialState = {
    cashouts: {
        ...defaultParam
    },
};

function cashout(state = initialState, action) {
    let { type, data, error, status, wechat, alipay } = action;
    let newState = { ...state };
    switch (type) {
        case ACTION_TYPE_CASHOUT:
            patchValue(newState.cashouts, data, error, status);
            return { ...newState };
        default:
            return state;
    }
}

export default cashout;