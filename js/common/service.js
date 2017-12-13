import { User } from '../api';
import Session from '../common/session';
export default class Service {
//网络获取用户资料刷新本地
    static async getUserInfo() {
        try{
           let user = await User.getUserInfo().then((user1) => {
            Session.setUserInfo(user1);
        }); 
        return await Promise.resolve(user);
        }catch(e){ 

        }
    }
//是否完成实名认证上传图片
/*
0:初始化状态;
1.可用
2.收款银行卡不支持
3.审核中
4.证件不可用
5.收款银行卡无效
6.身份证不可用
7.审核失败
8:无可用通道
*/
    static async checkCanBePayByUNIONPAY() {
        try{
            let user = await User.getUserInfo()
                await Session.setUserInfo(user);
                let ALIPAY = user.attributes.paymentMethod.ALIPAY_SCAN_BY_USER;
                let YIMAFU = user.attributes.paymentMethod.YI_MA_FU;
                let UNIONPAY = user.attributes.paymentMethod.UNIONPAY;
                let WEIXINPAY = user.attributes.paymentMethod.WEIXIN_SCAN_BY_USER;
                if(user.idCardChecked && user.pictureIdentification===true && UNIONPAY===1){
                    return await Promise.resolve(true);
                }else{
                    return await Promise.resolve(false);
                }
        }catch(e){
                return await Promise.reject(false);
        }
      }

      static async checkCanBePayByWEIXIN() {
        try{
            let user = await User.getUserInfo();
                await Session.setUserInfo(user);
                let ALIPAY = user.attributes.paymentMethod.ALIPAY_SCAN_BY_USER;
                let YIMAFU = user.attributes.paymentMethod.YI_MA_FU;
                let UNIONPAY = user.attributes.paymentMethod.UNIONPAY;
                let WEIXINPAY = user.attributes.paymentMethod.WEIXIN_SCAN_BY_USER;
                if(user.idCardChecked && user.pictureIdentification===true){
                    
                        return await Promise.resolve(true);
                    
                }else{
                    return await Promise.resolve(false);
                }
        }catch(e){
                return await Promise.reject(false);
        }
      }
}
