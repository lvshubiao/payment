
// action type 定义
export const ACTION_TYPE_POST_LOGIN = 'ACTION_TYPE_POST_LOGGED_IN';
export const ACTION_TYPE_POST_LOGOUT = 'ACTION_TYPE_POST_LOGGED_OUT';

export const ACTION_TYPE_GET_FAIL = 'ACTION_TYPE_GET_FAIL';

//注册
export const ACTION_TYPE_REGISTER_GET_VCODE = 'ACTION_TYPE_REGISTER_GET_VCODE';
export const ACTION_TYPE_REGISTER = 'ACTION_TYPE_REGISTER';

//忘记密码
export const ACTION_TYPE_FORGET_PASSWORD_VCODE = 'ACTION_TYPE_FORGET_PASSWORD_VCODE';
export const ACTION_TYPE_FORGET_PASSWORD = 'ACTION_TYPE_FORGET_PASSWORD';


//修改密码
export const ACTION_TYPE_MODIFY_GET_VCODE = 'ACTION_TYPE_MODIFY_GET_VCODE';
export const ACTION_TYPE_MODIFY_PASSWORD = 'ACTION_TYPE_MODIFY_PASSWORD';

//实名认证
export const ACTION_TYPE_IDENTIFICATION = 'ACTION_TYPE_IDENTIFICATION';
export const ACTION_TYPE_PUTIDENTIFICATION = 'ACTION_TYPE_PUTIDENTIFICATION';
export const ACTION_TYPE_SEND_SMS_CODE_4_IDENTIFICATION = 'ACTION_TYPE_SEND_SMS_CODE_4_IDENTIFICATION';

//我的二维码
export const ACTION_TYPE_MY_STORE_CODE = 'ACTION_TYPE_MY_STORE_CODE';
export const ACTION_TYPE_MINE_CODE = 'ACTION_TYPE_MINE_CODE';

//银行卡Types
export const ACTION_TYPE_GET_CREDITCARDS = 'ACTION_TYPE_GET_CREDITCARDS';
export const ACTION_TYPE_GET_BANK_NAME = 'ACTION_TYPE_GET_BANK_NAME';
export const ACTION_TYPE_ADD_BANK = 'ACTION_TYPE_ADD_BANK';
export const ACTION_TYPE_DELETE_BANK = 'ACTION_TYPE_DELETE_BANK';
//支付
export const ACTION_TYPE_POST_GEN_QR_PAY_ORDER = 'ACTION_TYPE_POST_GEN_QR_PAY_ORDER';
export const ACTION_TYPE_POST_GEN_UINION_PAY_ORDER = 'ACTION_TYPE_POST_GEN_UINION_PAY_ORDER';
export const ACTION_TYPE_PUT_CONFIRM_UNION_PAY_ORDER = 'ACTION_TYPE_PUT_CONFIRM_UNION_PAY_ORDER';
export const ACTION_TYPE_GET_PAYMENT_RESULT = 'ACTION_TYPE_GET_PAYMENT_RESULT';

//我的团队
export const ACTION_TYPE_GET_TEAM = 'ACTION_TYPE_GET_TEAM';
//收账
export const ACTION_TYPE_GET_BILL = 'ACTION_TYPE_GET_BILL';
//分润
export const ACTION_TYPE_GET_PROFIT = 'ACTION_TYPE_GET_PROFIT';


//本月分润收账
export const ACTION_TYPE_GET_SOURCE = 'ACTION_TYPE_GET_SOURCE';

// 实时收款
export const ACTION_TYPE_REAL_RECEIVABLE = 'ACTION_TYPE_REAL_RECEIVABLE';
// 实时消费
export const ACTION_TYPE_REAL_SPEND = 'ACTION_TYPE_REAL_SPEND';
// 实时收益
export const ACTION_TYPE_REAL_PROFIT = 'ACTION_TYPE_REAL_PROFIT';

// 提现
export const ACTION_TYPE_CASHOUT = 'ACTION_TYPE_CASHOUT'


