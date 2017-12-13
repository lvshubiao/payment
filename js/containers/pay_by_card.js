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
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity
} from 'react-native';
import { connect } from 'react-redux';
import { Button } from 'react-native-elements';
import Resource from '../../resource/index'
import { RadioGroup, RadioButton } from 'react-native-flexi-radio-button';
import { UNIONPAY, WEIXIN_SCAN_BY_USER, ALIPAY_SCAN_BY_USER } from '../constants';
import { card } from '../actions';
import Toast, { DURATION } from 'react-native-easy-toast';
import Spinner from '../components/spinner';
import commonStyle from '../common/style';
var dismissKeyboard = require('dismissKeyboard');
let ScreenWidth = Dimensions.get('window').width;
let ScreenHeight = Dimensions.get('window').height

function clickClose() {
  dismissKeyboard();
}

class PayByCard extends Component {

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
  _keyboardDidShow() {
    keyBoardIsShow = true;
  }

  _keyboardDidHide() {
    keyBoardIsShow = true;
  }

  static navigationOptions  = ({ navigation }) => ({
    title: '银联快捷',
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
      paymentMethod: UNIONPAY,
      disabled:true,
      LongSize: '',
    }
  }

  onSelect(index, value) {
    this.setState({
      paymentMethod: value
    });
  }

  goPay() {
    Keyboard.dismiss();
    const that = this;
    const { navigate } = this.props.navigation;
    if (this.state.amount == '') {
      this.refs.toast.show('金额不能为空');
    } else {
      that.refs.spinner.loading();
      //检查是否有银行卡
      this.props.getCreditCards().then((list) => {
        that.refs.spinner.done();
        if (list && list.length) {
          navigate('UnionPay_order_payment', {
            amount: this.state.amount,
            paymentMethod: this.state.paymentMethod
          });
        } else {
          navigate('Unionpay_order', {
            amount: this.state.amount,
            paymentMethod: this.state.paymentMethod,
            bankId: null,
            maskCardNumber: null,
            bankName: null
          });
        }
      }, (err) => {
        that.refs.spinner.done();
        // 获取信用卡错误，没所谓，使用新卡支付
        navigate('Unionpay_order', {
          amount: this.state.amount,
          paymentMethod: this.state.paymentMethod,
          bankId: null,
          maskCardNumber: null,
          bankName: null
        });
      });
    }

  }
  chkPrice(obj) { //方法1  
    obj = obj.replace(/[^\d.]/g, "");  
    //必须保证第一位为数字而不是.   
    obj = obj.replace(/^\./g, "");  
    //保证只有出现一个.而没有多个.   
    obj = obj.replace(/\.{2,}/g, ".");  
    //保证.只出现一次，而不能出现两次以上   
    obj = obj.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");  
    if(obj.length <= 0 || obj == ""){
      this.setState({ disabled: true});
    }
    return obj;  
}  
chkLast(obj) {  
    // 如果出现非法字符就截取掉   
    if (obj.substr((obj.length - 1), 1) == '.')  
        obj = obj.substr(0, (obj.length - 1));  
}  
  render() {
    return (
      <TouchableWithoutFeedback
        onPress={this.lostBlur.bind(this)}>
        <View style={styles.container}>
          <Spinner ref="spinner" />
          <Toast ref="toast" position='top' opacity={0.8} />
          <View style={[styles.border, styles.pay]}>
            <Text style={[styles.amountLabel, commonStyle.text]}>收款金额</Text>
            <View style={styles.row}>
              <Text style={styles.money}>￥</Text>
              <TextInput
                style={styles.amountInput}
                placeholder="输入金额"
                keyboardType="numeric"
                underlineColorAndroid={'transparent'}
                value={this.state.LongSize}
                onChangeText={(text) => {
                  this.setState({ amount: text});
                  this.setState({ LongSize: this.chkPrice(text)});
                  if(text.length>0){
                    this.setState({ disabled: false});
                  }else{
                    this.setState({ disabled: true});
                  }
                }
                }>
              </TextInput>
            </View>
          </View>
          <View style={[styles.border, styles.tr2]}>
            <RadioGroup
              onSelect={(index, value) => this.onSelect(index, value)}
              selectedIndex={0}
              style={{ justifyContent: 'center' }}
            >
              <RadioButton value={UNIONPAY} style={{ alignItems: 'center' }}>
                <View style={styles.row}>
                  <Image source={Resource.image.ICON_UNION} style={styles.icon} />
                  <Text style={{ alignItems: 'center', fontSize: 16, marginTop: 4 }}>银联快捷收款</Text>
                </View>
              </RadioButton>
            </RadioGroup>
          </View>
          <Button
            title="去收款"
            backgroundColor="#0076ff"
            borderRadius={5}
            disabled={this.state.disabled}
            buttonStyle={[{ marginBottom: 15, marginTop: 50, width: ScreenWidth * 0.9,shadowOpacity: 1,
              shadowRadius: 1,
              shadowColor:"black",
              shadowOffset:{width:0,height:1} }]}
            onPress={() => this.goPay()}
          />
        </View>
      </TouchableWithoutFeedback>
    );
  }

}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
  },
  container: {
    flex: 1,
    backgroundColor: '#F4F4F4',
  },
  border: {
    borderWidth: 1,
    borderColor: '#bbb',
    borderStyle: 'solid',
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    backgroundColor: '#fff',
  },
  pay: {
    width: ScreenWidth,
    height: 100,
    paddingTop: 15,
    paddingBottom: 15,
    paddingLeft: 15,
    borderTopColor: 'transparent',
    backgroundColor: '#fff',
  },
  amountLabel: {
    color: '#000',
    paddingTop: 5,
    paddingBottom: 5,
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
  input: {
    width: 250,
    height: 40,
    //color: '#eee',
    fontSize: 16,
    marginLeft: 25,
  },
  amountInput: {
    width: '100%',
    height: 40,
    padding: 5,
    marginLeft: 25,
    fontSize: 16,
    color: '#333',
  },
  tr1: {
    width: ScreenWidth,
    height: 60,
    justifyContent: 'center',
    paddingLeft: 15,
    borderTopColor: 'transparent',
  },
  tr2: {
    width: ScreenWidth,
    height: 60,
    justifyContent: 'center',
    paddingLeft: 15,
    borderTopColor: 'transparent',
  },
  icon: {
    height: 32,
    width: 32,
    marginLeft: 10,
    marginRight: 10
  },
});


const mapStateToProps = state => ({

});

const mapDispatchToProps = dispatch => ({
  dispatch: dispatch,
  getCreditCards: () => dispatch(card.getCreditCards())
});

export default connect(mapStateToProps, mapDispatchToProps)(PayByCard);