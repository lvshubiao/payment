
/**
 * 项目的配置文件，包括
 * 1. api 地址
 * 2. 版本
 * ...
 */

'use strict';


const isDebugging = __DEV__ && !!window.navigator.userAgent;

// 公共部分的配置
const common = {
  version: 1,
  refreshTokenKey: 're$resh@404#T0keN',
};

// 开发环境的配置
const development = {
  //serverURL: 'http://192.168.11.93:8088/v1.0.0',
  serverURL: 'http://payment.mosainet.com/v1.0.0',
  // serverURL: 'http://192.168.31.31:8088/v1.0.0',  // rays
  // serverURL: 'http://192.168.31.54:8088/v1.0.0',  // dove
  // serverURL: 'http://192.168.31.184:8088/v1.0.0', // linc
};

// 生产环境的配置
const production = {
   //serverURL: 'http://192.168.11.93:8088/v1.0.0',
     serverURL: 'http://payment2.mosainet.com/v1.0.0',
  // serverURL: 'http://192.168.31.31:8088/v1.0.0',
}
//				PRODUCT_BUNDLE_IDENTIFIER = org.reactjs.native.example.pay;
const merge = isDebugging ? development : production;

// 合并config
const config = {
  ...common,
  ...merge
};

export default config;