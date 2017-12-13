import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  InteractionManager,
  Platform,
  Dimensions,
  TextInput,
  ScrollView,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  AppState
} from 'react-native';
import { connect } from 'react-redux';
import Session from '../common/session';
var dismissKeyboard = require('dismissKeyboard');
import { CheckBox } from 'react-native-elements';
import { Button } from 'react-native-elements';
import ModalDropdown from 'react-native-modal-dropdown';

import Resource from '../../resource/index';
import FormCard from './form_card'
import AnalyticsUtil from '../utils/AnalyticsUtil'
import { payment, card } from '../actions';
import {
  PAY_RESULT_OK,
  PAY_RESULT_TIMEOUT,
  PAY_RESULT_FAIL
} from '../constants';
import Toast, { DURATION } from 'react-native-easy-toast';
import Spinner from '../components/spinner';

let screenWidth = Dimensions.get('window').width;
let screenHeight = Dimensions.get('window').height
function clickClose() {
  dismissKeyboard();
}
class UnionpayOrder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      amount: null,
      paymentMethod: null,
      bankCardNumber: null,
      maskCardNumber: null,
      bankId: null,
      bankName: '',
      cardholder: null,
      cvv2: null,
      expiredMonth: null,
      expiredYear: '2018',
      idCardNumber: null,
      phone: null,
      rememberMe: null,
      authorizationCode: null,
      paymentId: null,
      name: '银联支付',
      loopTimes: 5,
      ispostCode: false,
      disabled: true,
      text: '获取验证码',
      time: 60,
      keyboardHeight:0,
      status: true,
      buttonStatus:false,
    }
  }

  static navigationOptions  = ({ navigation }) => ({
    title: '银联订单支付',
    headerLeft: (
      <TouchableOpacity onPress={() => {
          Keyboard.dismiss();
          navigation.goBack();    
      }}
      >
          <Image style={{ width: 15, height: 30,marginLeft:10}}
              source={Resource.image.ICON_BACK}
          />
      </TouchableOpacity>
  ),
  headerRight: (
    <View style={{height: 30,width: 55,justifyContent: 'center',paddingRight:15} }/>
),
headerTitleStyle:{alignSelf:'center'},
  });
  
  lostBlur() {
      Keyboard.dismiss();
  }
  _handleAppStateChange = (nextAppState) => {
    const { navigate } = this.props.navigation;
    Session.hasLoggedIn().then((result) => {
      
    }, (err) => {
        if(nextAppState == "active"){
            navigate("Login");
        }
    });
 }
  phoneValue(text) {
    if (text.length >= 0) {
      if (text.length === 0) {
        this.setState({
          status: true,
          phone: text
        })
      } else {
        this.setState({
          status: false,
          phone: text
        })
      }
    }
  }

  runTimer1() {
    this.timer1 = setTimeout(
      () => {
        var time = this.state.time - 1;
        this.setState({status: true, time: time, text: time + "秒后重新获取" });
        if (this.state.time >= 1) {
          this.runTimer1();
        } else {
          this.timer1 && clearTimeout(this.timer1);
          this.setState({ status: false, time: 60, text: "获取验证码" });
        }
      },
      1000
    );
  }

  componentWillMount() {
    this.lostBlur();
    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', 
    this._keyboardDidShow.bind(this));
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', 
    this._keyboardDidHide.bind(this));
    if(this.state.phone){
      this.setState({status:false});
    }
  }

  componentWillUnmount() {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
    this.timer && clearTimeout(this.timer);
    this.timer1 && clearTimeout(this.timer1);
    AppState.removeEventListener('change', this._handleAppStateChange);
  }

  _keyboardDidShow(e) {
    if (Platform.OS === 'android') {  
      }else{  
        this.setState({
          keyboardHeight:e.startCoordinates.height
      });
     }     
  }
  _scrollViewDidScrol(){
    if (Platform.OS === 'android') {  
      
      }else{  
        if(this.state.keyboardHeight >= 200){
          return;
        }else{
          this.refs.scrollView.scrollTo({y:this.state.keyboardHeight + 200});
        } 
    }     
  }
  
  _keyboardDidHide(e) {
    if (Platform.OS === 'android') {  
    }else{  
        this.setState({
          keyboardHeight:0
      });
      this.refs.scrollView.scrollTo({y:0});
    }
  }
  componentDidMount() {
    AppState.addEventListener('change', this._handleAppStateChange.bind(this));
    Session.getUserInfo().then((user) => {
      this.setState({ phone: user.phone});
  });
    const navigation = this.props.navigation;
    const amount = navigation.state.params.amount;
    const paymentMethod = navigation.state.params.paymentMethod;
    const bankId = navigation.state.params.bankId;
    const bankName = navigation.state.params.bankName;
    const maskCardNumber = navigation.state.params.maskCardNumber;

    this.setState({
      amount: amount,
      paymentMethod: paymentMethod,
      bankId: bankId,
      maskCardNumber: maskCardNumber
    });
    if(bankId != null)
    {
      this.setState({status:false})
    }
  }
  sendVcode() {
    this.setState({status: true});
    this.runTimer1();
    if(this.state.bankId)
    {
      const promise = this.props.postUinionPayOrder({
        amount:this.state.amount,
        bankCardId:this.state.bankId
      });
      promise.then((res) => {
        this.setState({ paymentId: res.paymentId, ispostCode: true,status: true, time: 60, text: "60秒后重新获取"});
        this.refs.toast.show('验证码发送成功');
       
      }, (err) => {
        this.setState({ ispostCode: false});
        if(err.length > 30){
          let data = JSON.parse(err);
          let obj = data.data.fieldErrors;
          for (var key in obj){  
              this.refs.toast.show(obj[key]);  
              return;
          }  
        }else{
          this.refs.toast.show(err);
        }
      });
    }else{
      const promise = this.props.generateUinionPayOrder(this.state);
      promise.then((res) => {
      this.setState({ paymentId: res.paymentId, ispostCode: true,status: true, time: 60, text: "60秒后重新获取"});
      this.refs.toast.show('验证码发送成功');
    }, (err) => {
      this.setState({ ispostCode: false});
      if(err.length > 30){
        let data = JSON.parse(err);
        let obj = data.data.fieldErrors;
        for (var key in obj){  
            this.refs.toast.show(obj[key]);  
            return;
        }  
      }else{
        this.refs.toast.show(err);
      } 
    });
    }
    
  }
  confirmPay() {
    this.setState({disabled:true});
    this.lostBlur();
    const that = this;
    that.refs.spinner.loading();
    const { navigate } = this.props.navigation;
    if(this.state.rememberMe === true){
      this.props.addBankCard({
        bankName:this.state.bankName,
        cardNumber:this.state.bankCardNumber,
        cvv2:this.state.cvv2,
        expiredMonth:this.state.expiredMonth,
        expiredYear:this.state.expiredYear
      });
    }
    var map = {
      paymentId:this.state.paymentId,
      type:'UNIONPAY',
      state:'0',
      code:'0'
    }
    this.props.confirmUinionPayOrder({
      authorizationCode: this.state.authorizationCode,
      paymentId: this.state.paymentId,
      paymentMethod: this.state.paymentMethod
    }).then((data) => {
      map.code = '0';
      AnalyticsUtil.onEventWithMap('pay',map);
      // 开始轮训支付状态
      this.runTimer();
    }, (err) => {
      map.code = '1';
      AnalyticsUtil.onEventWithMap('pay',map);
      this.setState({disabled:false});
      that.refs.spinner.done();
      // todo:
      if(err){
        if(err.length > 50){
          let data = JSON.parse(err);
          let obj = data.data.fieldErrors;
          for (var key in obj){  
            this.refs.toast.show(obj[key]);  
            return;
          }  
        }else{
          this.refs.toast.show(err); 
        }
      }else{
        this.setState({disabled:false});
        that.refs.toast.show('银联支付失败');
      }
     
    });
  }

  runTimer() {
    const that = this;
    const { navigate } = this.props.navigation;
    const paymentId = this.state.paymentId;

    var map = {
      paymentId:paymentId,
      type:'UNIONPAY',
      state:'1',
      code:'0'
    }
    
    this.timer = setTimeout(
      () => {
        that.props.getPaymentResult(paymentId).then((result) => {
          map.code = '0';
          AnalyticsUtil.onEventWithMap('pay',map);

          if (result.status === PAY_RESULT_OK || result.status === PAY_RESULT_FAIL) {
            that.refs.spinner.done();
            this.setState({disabled:false});
            that.timer && clearTimeout(that.timer);
            navigate('Receivables_results', { paymentId: paymentId, payStatus: result.status, amount: result.order.amount });
          }
        }, (err) => {
          map.code = '1';
          AnalyticsUtil.onEventWithMap('pay',map);

          this.setState({disabled:false});
          if(err.length > 40){
            let data = JSON.parse(err);
            let obj = data.data.fieldErrors;
            for (var key in obj){  
              this.refs.toast.show(obj[key]);  
              return;
            }  
          }else{
            this.refs.toast.show(err);
          }
          
        });
        that.setState({ loopTimes: that.state.loopTimes - 1 });
        if (that.state.loopTimes > 0) {
          this.setState({disabled:false});
          that.runTimer();
        } else {
          that.timer && clearTimeout(that.timer);
          that.refs.spinner.done();
          this.setState({disabled:false});
          map.code = '2';
          AnalyticsUtil.onEventWithMap('pay',map);
          // 超时处理
          navigate('Receivables_results', { paymentId: paymentId, payStatus: PAY_RESULT_TIMEOUT, amount: that.state.amount });
        }
      },
      1000
    );
  }

  goSelectCreditCard() {
    const { navigate } = this.props.navigation;
    navigate('UnionPay_order_payment', {
      amount: this.state.amount,
      paymentMethod: this.state.paymentMethod
    })
  }

  getBankName(bankCardNumber) {
    this.props.getBankName(bankCardNumber)
      .then((data) => {
        this.setState({ bankName: data });
      });
  }

  render() {
    let bankCard = null;
    if (this.state.bankId) {
      bankCard = (
        <TouchableWithoutFeedback
          onPress={this.lostBlur.bind(this)}>
          <ScrollView ref="scrollView">
            <View style={styles.itemStyle}>
              <Text style={styles.titleStyle}>{this.props.navigation.state.params.bankName}</Text>
              <Text style={styles.subStyle}>信用卡</Text>
              <Text style={styles.numberStyle}>**** **** **** {this.state.maskCardNumber}</Text>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>

      );
    } else {
      bankCard = (
          <ScrollView ref="scrollView" keyboardShouldPersistTaps="always">
            <View style={[styles.border, styles.cardForm]}>
              <View style={[styles.row, styles.marginBottom]}>
                <Text style={styles.centerText}>
                  银行卡号:
                  </Text>
              <TextInput style={styles.input}
                placeholder="请输入信用卡卡号"
                autoCapitalize='none'
                keyboardType="numeric"
                clearButtonMode="while-editing"
                underlineColorAndroid='transparent'
                onBlur={() => this.getBankName(this.state.bankCardNumber)}
                onChangeText={(text) => this.setState({ bankCardNumber: text })}>
              </TextInput>
            </View>
            <View style={[styles.row, styles.marginBottom]}>
              <Text style={styles.centerText}>
                开户银行:
          </Text>
              <TextInput style={styles.input}
                placeholder="请输入开户银行"
                autoCapitalize='none'
                underlineColorAndroid='transparent'
                value={this.state.bankName}
                onChangeText={(text) => this.setState({ bankName:text})}>
              </TextInput>
            </View>
            <View style={[styles.row, styles.marginBottom]}>
              <Text style={styles.centerText}>
                持卡人姓名:
                  </Text>
                <TextInput
                  style={styles.input}
                  placeholder="请输入持卡人姓名"
                  autoCapitalize='none'
                  underlineColorAndroid='transparent'
                  onFocus={()=>this._scrollViewDidScrol()}
                  onChangeText={(text) => this.setState({ cardholder: text })}>
                </TextInput>
              </View>

              <View style={[styles.row, styles.marginBottom]}>
                <Text style={styles.centerText}>
                  CVV2:
                 </Text>
                <TextInput
                  style={styles.input}
                  placeholder="请输入CVV2,卡背签名栏后三位"
                  autoCapitalize='none'
                  underlineColorAndroid='transparent'
                  onFocus={()=>this._scrollViewDidScrol()}
                  onChangeText={(text) => this.setState({ cvv2: text })}>
                </TextInput>
              </View>
              <View style={[styles.row, styles.marginBottom]}>
                <Text style={styles.centerText}>
                  有效期:
                  </Text>
                <TextInput
                  style={styles.input}
                  placeholder="格式为月/年,如08/21"
                  autoCapitalize='none'
                  underlineColorAndroid='transparent'
                  onFocus={()=>this._scrollViewDidScrol()}
                  onChangeText={(text) => 
                  this.setState({ expiredMonth: text.split('/')[0], expiredYear: "20" + text.split('/')[1] })}>
                </TextInput>
              </View>

              <View style={[styles.row, styles.marginBottom]}>
                <Text style={styles.centerText}>
                  证件号码:
                  </Text>
              <TextInput
                style={styles.input}
                placeholder="请输入持卡人身份证号"
                autoCapitalize='none'
                clearButtonMode="while-editing"
                underlineColorAndroid='transparent'
                onFocus={()=>this._scrollViewDidScrol()}
                onChangeText={(text) => this.setState({ idCardNumber: text })}>
              </TextInput>
              </View>
            </View>
          </ScrollView>
      );
    }

    return (
      
        <ScrollView ref="scrollView" keyboardShouldPersistTaps="always">
        <TouchableWithoutFeedback
        onPress={this.lostBlur}>
          <View style={styles.container}>
            <Spinner ref="spinner" />
            <Toast ref="toast" position='center' opacity={0.8} />

            <View style={[styles.header, styles.row]}>
              <Text style={styles.headerText}>支付金额</Text>
              <Text style={styles.headerAmount}>￥ {this.state.amount}</Text>
            </View>

            <View style={[styles.row, styles.info]}>
              <View style={[styles.row, styles.alignItems]}>
                <Image source={Resource.image.ICON_UNION} style={styles.unionIcon} />
                <Text style={{ fontSize: 16 }}>银行卡信息</Text>
              </View>
              <TouchableOpacity onPress={() => this.goSelectCreditCard()}>
                <View>
                  <Text style={{ color: '#0076ff', fontSize: 16 }}>{this.state.bankId == null?'选择已绑定信用卡  >':'重新选择信用卡'}</Text>
                </View>
              </TouchableOpacity>
            </View>

            {bankCard}

            <View style={[styles.cardForm]}>
            {this.state.bankId==null?( 
            <View style={[styles.row, styles.marginBottom]}>
                <Text style={styles.centerText}>
                  手机号码:
              </Text>
                  <TextInput
                  style={styles.input}
                  placeholder="请输入银行预留手机号码"
                  autoCapitalize='none'
                  keyboardType="numeric"
                  onFocus={()=>this._scrollViewDidScrol()}
                  underlineColorAndroid='transparent'
                  onChangeText={(text) => this.phoneValue(text)}
                ></TextInput>
              </View>):null
            }
             
              <View style={[styles.row, styles.marginBottom]}>
                <Text style={[styles.centerText]}>
                  验证码:
              </Text>
                <View style={[styles.row]}>
                {
                (this.state.bankId)?(
                  <TextInput
                  style={[styles.input]}
                  placeholder="请输入验证码"
                  autoCapitalize='none'
                  keyboardType="numeric"
                  underlineColorAndroid='transparent'
                  onChangeText={(text) => {
                    if (text.length < 4) {
                      this.setState({ disabled: true })
                    } else {
                      this.setState({ disabled: false })
                    }
                    this.setState({ authorizationCode: text })
                  }}>
                </TextInput>
                ):(
                  <TextInput
                  style={[styles.input]}
                  placeholder="请输入验证码"
                  autoCapitalize='none'
                  keyboardType="numeric"
                  underlineColorAndroid='transparent'
                  onFocus={()=>this._scrollViewDidScrol()}
                  onChangeText={(text) => {
                    if (text.length < 4) {
                      this.setState({ disabled: true })
                    } else {
                      this.setState({ disabled: false })
                    }
                    this.setState({ authorizationCode: text })
                  }}>
                </TextInput>
                )
              }
                  {/* <TouchableOpacity
                    style={styles.buttonStyle}
                    opacity={0.8}
                    onPress={() => this.sendVcode()}>
                    <Text style={styles.btnText}>获取验证码</Text>
                  </TouchableOpacity> */}
                  <Button
                    title={this.state.text}
                    color="#fff"
                    backgroundColor="#0076ff"
                    disabled={this.state.status}
                    borderRadius={4}
                    containerViewStyle={{
                      height: 40,
                      justifyContent: 'center',
                      position: 'absolute',
                      right: -10,
                      borderRadius: 4
                    }}
                    onPress={() => this.sendVcode()}
                  />
                </View>
              </View>
              <View>
                {this.state.bankId!=null?(null):( <CheckBox
                  title='记住银行卡'
                  checked={this.state.rememberMe}
                  style={styles.rememberMe}
                  onPress={() => this.setState({ rememberMe: !this.state.rememberMe })}
                />)}
              </View>
            </View>
            <View style={styles.btnPanel}>
              <Button
                title="确认支付"
                backgroundColor="#5068E6"
                borderRadius={4}
                disabled={this.state.disabled}
                buttonStyle={[{ marginBottom: 15, marginTop: 10, width: screenWidth * 0.94,shadowOpacity: 1,
                  shadowRadius: 1,
                  shadowColor:"black",
                  shadowOffset:{width:0,height:1} }]}
                onPress={() => this.confirmPay()}
              />
              {
                (this.state.ispostCode === false) ? (
                  <Text style={styles.war}></Text>
                ) : (
                    <Text style={styles.war}>验证码将发送到信用卡关联的手机号，请在5分钟之内输入提交</Text>
                  )
              }

            </View>

          </View>
          </TouchableWithoutFeedback>
        </ScrollView>
      
    );
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#efefef',
  },
  war: {
    marginLeft: 20,
    marginRight: 20,
    color: "#6A737D",
    fontSize: 16,
  },
  row: {
    flexDirection: 'row'
  },
  unionIcon: {
    width: 36,
    height: 36
  },
  alignItems: {
    alignItems: 'center'
  },
  cardForm: {
    backgroundColor: '#fff',
  },
  info: {
    justifyContent: 'space-between',
    //height: 60,
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 10
  },
  marginBottom: {
    //marginBottom: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#efefef',
    borderStyle: 'solid',
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: 'transparent',
    justifyContent: 'center',
    paddingTop: 5,
    paddingBottom: 5
  },
  border: {
    borderWidth: 1,
    borderColor: '#bbb',
    borderStyle: 'solid',
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
  },
  title: {
    width: screenWidth,
    height: 70,
    justifyContent: 'center'
  },
  text: {
    textAlign: 'center',
    fontSize: 20
  },
  position: {
    position: 'absolute',
    right: 20,
    bottom: 15
  },
  centerText: {
    fontSize: 16,
    width: 100,
    textAlign: 'left',
    color: '#666'
  },
  input: {
    width: 250,
    height: 40,
    //color: '#eee',
    //fontSize: 16,
  },
  verification: {
    width: 130,
    height: 40,
    color: '#eee',
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#bbb',
    borderStyle: 'solid',
    borderRadius: 5
  },
  v2: {
    paddingLeft: 20
  },
  m2: {
    marginLeft: 20
  },
  change: {
    position: 'absolute',
    right: 20,
    bottom: 15
  },
  cards: {
    justifyContent: 'center',
    paddingTop: 30,
    paddingBottom: 30,

  },
  cardsText: {
    textAlign: 'center',
    fontSize: 16,
    marginBottom: 5
  },
  tip: {
    width: screenWidth,
    height: 200,
    overflow: 'visible',
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 5,
    paddingBottom: 5,
  },
  tipText: {
    fontSize: 16,
    color: '#888888',
    flexWrap: 'wrap',
  },
  header: {
    height: 60,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#5677FC'
  },
  headerText: {
    fontSize: 18,
    color: '#fff',
  },
  headerAmount: {
    fontSize: 26,
    color: '#fff',
  },
  buttonStyle: {
    backgroundColor: "#5677FC",
    width: 115,
    alignItems: 'center',
    height: 40,
    justifyContent: 'center',
    position: 'absolute',
    right: 0,
    borderRadius: 4,
  },
  btnText: {
    color: "#FFFFFF",
    textAlign: "center",
    fontSize: 17,
  },
  rememberMe: {
    borderWidth: 0,
    padding: 10
  },
  btnPanel: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 20,
    paddingBottom: 50,
  },

  itemStyle: {
    marginTop: 5,
    marginBottom: 5,
    backgroundColor: "#EE2C2C",
    marginLeft: 10,
    position: "relative",
    width: screenWidth - 20,
    height: 100,
    borderRadius: 5,
  },
  titleStyle: {
    marginTop: 10,
    marginLeft: screenWidth / 8,
    color: "#FFFFFF",
    fontSize: 16,
    position: "absolute",
  },
  icon: {
    marginTop: 20,
    marginLeft: 10,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#FFFFFF",
    position: "absolute",
  },
  subStyle: {
    marginTop: 40,
    marginLeft: screenWidth / 8,
    color: '#efefef',
    fontSize: 16,
    position: "absolute",
  },
  numberStyle: {
    marginTop: 70,
    marginLeft: screenWidth / 8,
    color: "#FFFFFF",
    fontSize: 16,
    position: "absolute",
  },
  btnStyle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginLeft: screenWidth - 60,
    marginTop: 40,
    borderColor: "#FFFFFF",
  },
  touchStyle: {
    alignItems: 'center',
    height: 10,
    maxWidth: 10,
    marginLeft: screenWidth - 60,
    position: "relative",
  },
  btnPanel: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 20,
    paddingBottom: 50,
  },
});

const mapStateToProps = state => ({
  bankName: state.card.bankName
});

const mapDispatchToProps = dispatch => ({
  dispatch: dispatch,
  generateUinionPayOrder: (scope) => dispatch(payment.generateUinionPayOrder(scope)),
  confirmUinionPayOrder: (scope) => dispatch(payment.confirmUinionPayOrder(scope)),
  postUinionPayOrder: (scope) => dispatch(payment.postUinionPayOrder(scope)),
  getPaymentResult: (paymentId) => dispatch(payment.getPaymentResult(paymentId)),
  getBankName: (cardNumber) => dispatch(card.getBankName(cardNumber)),
  addBankCard: (scope) => dispatch(card.addBankCard(scope)),
});

export default connect(mapStateToProps, mapDispatchToProps)(UnionpayOrder);