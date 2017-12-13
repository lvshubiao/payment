

import { ACTION_TYPE_MY_STORE_CODE,ACTION_TYPE_MINE_CODE} from '../actions/types';
import { ACTION_LOADINGD, ACTION_SUCCESS, ACTION_FAILED } from '../constants';
import { patchValue } from './creator';
'use strict';

const initialState = {
        status: null,
        url:null,
        error:null
};

function qrcode(state = initialState, action) {
  switch (action.type){
    case ACTION_TYPE_MY_STORE_CODE:
       return Object.assign({}, state, {
        status: ACTION_SUCCESS,
        url:action.data,
        error:null
    })
    case ACTION_TYPE_MINE_CODE:
       return Object.assign({}, state, {
       status: ACTION_SUCCESS,
       url:action.data,
       error:null
  })
    default:
      return state;
  }
}

export default qrcode;
