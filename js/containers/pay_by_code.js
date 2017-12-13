/**
 * 欢迎页
 * @flow
 * **/
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
  TouchableHighlight,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity
} from 'react-native';
import { connect } from 'react-redux';
import { Button } from 'react-native-elements';
import Resource from '../../resource/index'
import { RadioGroup, RadioButton } from 'react-native-flexi-radio-button';
import { UNIONPAY, WEIXIN_SCAN_BY_USER, ALIPAY_SCAN_BY_USER } from '../constants';
import { payment } from '../actions';
import Toast, { DURATION } from 'react-native-easy-toast';
import Spinner from '../components/spinner';
import AnalyticsUtil from '../utils/AnalyticsUtil';
import Session from '../common/session';


let ScreenWidth = Dimensions.get('window').width;
let ScreenHeight = Dimensions.get('window').height

function clickClose() {
  dismissKeyboard();
}

class PayByCode extends Component {
  static navigationOptions  = ({ navigation }) => ({
    title: '二维码收款',
    headerLeft: (
      <TouchableOpacity onPress={() => {
          Keyboard.dismiss();
          navigation.goBack();    
      }}
      >
          <Image style={{ width: 30, height: 30,marginLeft:10}}
              source={Resource.image.ICON_BACK}
          />
      </TouchableOpacity>
  ),
  headerRight: (
    <View style={{height: 30,width: 55,justifyContent: 'center',paddingRight:15} }/>
),
headerTitleStyle:{alignSelf:'center'},
  });
  constructor() {
    super();
    this.state = {
      amount: '',
      paymentMethod: WEIXIN_SCAN_BY_USER,
      name: '微信收款',
      disabled: true,
      selectedIndex:null,
      // 判断用户是否开通微信，支付宝二维码收款功能
      aliPay:true,
      weixinPay:true
    }
  }
  lostBlur() {
    //退出软件盘
    Keyboard.dismiss();
  }
  componentWillMount() {
    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow);
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);
  }

  componentWillUnmount() {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }
  componentDidMount(){
    Session.getUserInfo().then((user)=>{
      if(user.attributes.paymentMethod.ALIPAY_SCAN_BY_USER == 1){
        this.setState({
          aliPay:false,
          selectedIndex:1
        })
      }
      if(user.attributes.paymentMethod.WEIXIN_SCAN_BY_USER == 1){
        this.setState({
          weixinPay:false,
          selectedIndex:0
        })
      }
      if(user.attributes.paymentMethod.ALIPAY_SCAN_BY_USER ==1&&
        user.attributes.paymentMethod.WEIXIN_SCAN_BY_USER ==1){
          this.setState({
            weixinPay:false,
            aliPay:false,
            selectedIndex:0
          })
        }
      
    },(err)=>{
      const { navigate } = this.props.navigation;
      navigate('Login');
    })
  }
  _keyboardDidShow() {
    keyBoardIsShow = true;
  }

  _keyboardDidHide() {
    keyBoardIsShow = true;
  }
  onSelect(index, value) {
    this.setState({ paymentMethod: value });
    if (value == WEIXIN_SCAN_BY_USER) {
      this.setState({ name: '微信收款' });
    } else {
      this.setState({ name: '支付宝收款' });
    }
  }

  generateQrcode() {
    Keyboard.dismiss();
    const that = this;
    if (this.state.amount == '') {
      that.refs.toast.show('请填写收款金额');
      return;
    }
    const { navigate } = this.props.navigation;
    that.refs.spinner.loading();

    var map = {
      userId:'1',
      code:'0'
    }
    Session.getUserInfo().then((user) => {
      map.userId = user.userId;
    });
  

    this.props.generatePayQrcode(this.state).then((result) => {
      map.code='0';
      AnalyticsUtil.onEventWithMap('payQrcod',map);
      that.refs.spinner.done();
      navigate('PayByWeChat', {
        authorizationCode: result.authorizationCode,
        paymentId: result.paymentId,
        amount: this.state.amount,
        paymentMethod: this.state.paymentMethod
      });
    }, (err) => {
      map.code='1';
      AnalyticsUtil.onEventWithMap('payQrcod',map);
      that.refs.spinner.done();
        if(err.length>10){
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
  render() {
    return (
      <TouchableWithoutFeedback
        onPress={this.lostBlur.bind(this)}>
        <View style={styles.container}>
          <Spinner ref="spinner" />
          <Toast ref="toast" position='top' opacity={0.8} />

          <View style={[styles.border, styles.pay]}>
            <Text style={styles.amountLabel}>收款金额</Text>
            <View style={styles.row}>
              <Text style={styles.money}>￥</Text>
              <TextInput style={styles.amountInput}
                placeholder="输入金额"
                keyboardType="numeric"
                underlineColorAndroid='transparent'
                onChangeText={(text) => {
                  if (text.length > 0) {
                    if(this.state.aliPay == false||this.state.weixinPay == false){
                      this.setState({ disabled: false });
                    }
                  } else {
                    this.setState({ disabled: true });
                  }
                  this.setState({ amount: text })
                }
                }>
              </TextInput>
            </View>
          </View>

          <View style={[styles.border, styles.tr2]}>
            <RadioGroup
              onSelect={(index, value) => this.onSelect(index, value)}
              selectedIndex={this.state.selectedIndex}
            >
              <RadioButton value={WEIXIN_SCAN_BY_USER} style={styles.radioButton} disabled={this.state.aliPay}>
                <View style={styles.row}>
                  <Image source={Resource.image.ICON_WEBCHAT} style={styles.icon} />
                  <Text style={{ alignItems: 'center', fontSize: 16 }}>微信二维码收款</Text>
                </View>
              </RadioButton>
              <RadioButton value={ALIPAY_SCAN_BY_USER} style={styles.radioButton} disabled={this.state.weixinPay}>
                <View style={styles.row}>
                  <Image source={Resource.image.ICON_ALIPAY} style={styles.icon} />
                  <Text style={{ alignItems: 'center', fontSize: 16 }}>支付宝二维码收款</Text>
                </View>
              </RadioButton>
            </RadioGroup>
          </View>

          <Button
            title="去收款"
            backgroundColor="#5068E6"
            borderRadius={25}
            disabled={this.state.disabled}
            buttonStyle={[{ marginBottom: 15, marginTop: 50, width: ScreenWidth * 0.9,shadowOpacity: 1,
              shadowRadius: 1,
              shadowColor:"black",
              shadowOffset:{width:0,height:1} }]}
            onPress={() => this.generateQrcode()}
          />

        </View>
      </TouchableWithoutFeedback>
    );
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#F4F4F4',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  wrapper: {
    padding: 5
  },
  border: {
    borderWidth: 1,
    borderColor: '#bbb',
    borderStyle: 'solid',
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    backgroundColor: '#fff'
  },
  pay: {
    width: ScreenWidth,
    height: 100,
    paddingTop: 15,
    paddingBottom: 15,
    paddingLeft: 15,
    borderTopColor: 'transparent',
  },
  amountLabel: {
    color: '#000',
    paddingTop: 5,
    paddingBottom: 5,
    fontSize: 16
  },
  money: {
    position: 'absolute',
    top: 10,
    fontSize: 20,
    fontWeight: 'bold'
  },
  text: {
    fontSize: 16
  },
  amountInput: {
    width: '100%',
    height: 40,
    padding: 5,
    marginLeft: 25,
    fontSize: 16,
    color: '#333',
  },
  input: {
    width: 250,
    height: 40,
    color: '#000',
    fontSize: 16,
    marginLeft: 25,
  },
  tr1: {
    width: ScreenWidth,
    //height: 60,
    justifyContent: 'center',
    paddingLeft: 15,
    borderTopColor: 'transparent',
  },
  tr2: {
    width: ScreenWidth,
    //height: 80,
    justifyContent: 'center',
    paddingLeft: 15,
    borderTopColor: 'transparent',
  },
  icon: {
    height: 26,
    width: 26,
    marginLeft: 10,
    marginRight: 10

  },
  radioButton: {
    width: '100%',
    alignItems: 'center',
    padding: 5,
    margin: 5,
  },
  buttonStyle: {
    marginTop: 30,
    backgroundColor: "#6495ED",
    width: '96%',
    borderRadius: 5,
    alignItems: 'center',
    height: 40,
    justifyContent: 'center',
  },
  btnText: {
    color: "#FFFFFF",
    textAlign: "center",
    fontSize: 18,
  }
});


const mapStateToProps = state => ({

});

const mapDispatchToProps = dispatch => ({
  dispatch: dispatch,
  generatePayQrcode: (scope) => dispatch(payment.generatePayQrcode(scope)),
});

export default connect(mapStateToProps, mapDispatchToProps)(PayByCode);