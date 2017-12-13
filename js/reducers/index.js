'use strict';

import { combineReducers } from 'redux';

import user from './user';
import qrcode from './qrcode';
import card from './card';
import payment from './payment';
import bill from './bill';
import cashout from './cashout'

/**
 * 导出的对象的key是作为state数据存储的key，譬如：login 的 reducer， 需要访问到login reducer返回的新state值
 * 用 state.login.xxx
 */
const reducers = combineReducers({
  user,
  qrcode,
  card,
  bill,
  payment,
  cashout
});

export default reducers;