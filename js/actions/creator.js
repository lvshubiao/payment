
'use strict';

import { ACTION_LOADINGD, ACTION_SUCCESS, ACTION_FAILED } from '../constants';

/**
 * 处理api返回
 * 成功dispatch success action
 * 失败dispatch fail action
 * @param {*} apiPromise 
 */
export function payload(dispatch, actionType, promise) {
  dispatch(createLoadingAction(actionType));
  promise.then(
    (result) => {
      dispatch(createSuccessAction(actionType, result));
    },
    (error) => {
      dispatch(createFailedAction(actionType, error));
    }
  );
  return promise;
}

/**
 * 创建loading的action
 * @param {*} type 
 */
export function createLoadingAction(type) {
  return {
    type: type,
    data: null,
    status: ACTION_LOADINGD
  };
}

/**
 * 创建成功的action
 * @param {*} type 
 * @param {*} data 
 */
export function createSuccessAction(type, data) {
  return {
    type: type,
    data: data,
    status: ACTION_SUCCESS
  };
}

/**
 * 创建失败的action
 * @param {*} type 
 * @param {*} error 
 */
export function createFailedAction(type, error) {
  return {
    type: type,
    error: error,
    status: ACTION_FAILED
  };
}

