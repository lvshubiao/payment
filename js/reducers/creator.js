
'use strict';

/**
 * 默认参数
 */
export const defaultParam = {
  data: null,
  error: null,
  status: null
};

/**
 * 设置新的state值
 * @param {*} newState 
 * @param {*} data 
 * @param {*} error 
 * @param {*} status 
 */
export function patchValue(newState, data, error, status) {
  newState['data'] = data;
  newState['error'] = error;
  newState['status'] = status;
}