

/**
 * createdBy: Moke Sun
 * CreatedAt: 2017-10-6
 * 常量定义
 * 备注： 存储到localstrage的key不要出现下划线
 */

'use strict';

export const KEY_TOKEN = 'token';
export const KEY_REFRESH_TOKEN = 'refreshtoken';
export const KEY_USER_INFO = 'user';

export const ACTION_LOADINGD = 'ACTION_LOADINGD';
export const ACTION_SUCCESS  = 'ACTION_SUCCESS';
export const ACTION_FAILED   = 'ACTION_FAILED';

export const UNIONPAY   = 'UNIONPAY';
export const WEIXIN_SCAN_BY_USER   = 'WEIXIN_SCAN_BY_USER';
export const ALIPAY_SCAN_BY_USER   = 'ALIPAY_SCAN_BY_USER';


//支付状态
export const PAY_RESULT_PRE   = 2;
export const PAY_RESULT_UNION_CONFORM   = 3;
export const PAY_RESULT_OK = 1;
export const PAY_RESULT_FAIL = 0;
export const PAY_RESULT_TIMEOUT = 99;

export const PaymentByYiMaFu = 'PaymentByYiMaFu';


export const TOPIC_HTTP_STATUS = 'TOPIC_HTTP_STATUS';
export const TOPIC_TOKEN_EXPIRED = 'TOPIC_TOKEN_EXPIRED';

