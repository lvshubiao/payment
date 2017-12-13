

'use strict';

import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Image,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  Keyboard,
  TouchableWithoutFeedback,
  ScrollView
} from 'react-native';
import { CheckBox, Button } from 'react-native-elements';
import { ACTION_LOADINGD, ACTION_SUCCESS, ACTION_FAILED } from '../constants';
import { connect } from 'react-redux';
import { user } from '../actions';
import Resource from '../../resource';
import Toast, { DURATION } from 'react-native-easy-toast';
import Spinner from '../components/spinner';
import SHA512 from 'crypto-js/sha512';
import { NavigationActions } from 'react-navigation'
//import AnalyticsUtil from '../utils/AnalyticsUtil';
// const resetAction = NavigationActions.reset({
//     index: 0,
//     actions: [
//       NavigationActions.navigate({ routeName: 'TabBar'}),
//     ]
//   });
//   this.props.navigation.dispatch(resetAction);
let screenWidth = Dimensions.get('window').width;
let screenHeight = Dimensions.get('window').height

let keyBoardIsShow = true;
/**
 * createdBy: Moke Sun
 * CreatedAt: 2017-10-8
 * 用户登录界面
 */

class Login extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: '登录',
    headerLeft: (
      <TouchableOpacity onPress={() => {
        Keyboard.dismiss();
        navigation.goBack();
      }}
      >
        <Image style={{ width: 30, height: 30, marginLeft: 10 }}
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
      phone: '',
      password: '',
      remember: false,
      status: true
    };
    this.login = this.login.bind(this);
  }

  login() {
    //AnalyticsUtil.onEventWithMap("login",{USERID:"09909",PHONE:"8848"});
    
    this.lostBlur();
    const that = this;
    const { navigate } = this.props.navigation;
    that.refs.spinner.loading();
    const promise = this.props.login({
      phone: this.state.phone,
      password: SHA512(this.state.password).toString()
    });
    promise.then((data) => {
      this.lostBlur();
      this.refs.spinner.done();
      this.refs.toast.show('登录成功');

      setTimeout(() => {
        const resetAction = NavigationActions.reset({
          index: 0,
          actions: [
            NavigationActions.navigate({ routeName: 'TabBar' }),
          ]
        });
        this.props.navigation.dispatch(resetAction);
      }, 1000);
    }, (err) => {
      this.refs.spinner.done();
        if(err.length > 20){
          let data = JSON.parse(err);
          let obj = data.data.fieldErrors;
          for (var key in obj){  
              this.refs.toast.show(obj[key]);  
          }  
      }else{
          this.refs.toast.show(err);
      }
    });
  }

  gotoRegister() {
    const { navigate } = this.props.navigation;
    navigate('Register')
  }

  gotoForgetPassword() {
    const { navigate } = this.props.navigation;
    navigate('ForgetPassword')
  }

  rememberPwd() {
    this.setState({
      remember: !this.state.remember
    })
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

  _keyboardDidShow() {
    keyBoardIsShow = true;
  }

  _keyboardDidHide() {
    keyBoardIsShow = false;
  }

  render() {
    const { navigate } = this.props.navigation;
    return (
      <TouchableWithoutFeedback
        onPress={() => this.lostBlur()}>
          <ScrollView
            keyboardShouldPersistTaps="always"
            style={styles.container}>
            <Spinner ref="spinner" />
            <Toast ref="toast" position='top' opacity={0.8} />
            <View style={[styles.row, styles.logoContainer]}>
              <Image
                style={styles.logo}
                source={Resource.image.LOGO}
              />
            </View>
            <View style={styles.row}>
              <Text style={styles.storeName}>乐惠品</Text>
            </View>

            <View style={styles.form}>
              <View style={styles.formItem}>
                <View style={styles.formLabel}>
                  <Image
                    style={styles.formIcon}
                    source={Resource.image.ICON_PHONE}
                  />
                </View>
                <View style={styles.formFeild}>
                  <TextInput
                    style={styles.formControl}
                    onChangeText={(text) => {
                      if (text == '' || this.state.password == '') {
                        this.setState({ status: true })
                      } else {
                        this.setState({ status: false })
                      }
                      this.setState({ phone: text })
                    }}
                    value={this.state.phone}
                    autoCapitalize='none'
                    keyboardType="numeric"
                    underlineColorAndroid='transparent'
                    placeholder='请输入手机号码' />
                </View>
              </View>

              <View style={styles.line} />

              <View style={styles.formItem}>
                <View style={styles.formLabel}>
                  <Image
                    style={styles.formIcon}
                    source={Resource.image.ICON_PASSWORD}
                  />
                </View>
                <View style={styles.formFeild}>
                  <TextInput
                    style={styles.formControl}
                    secureTextEntry={true}
                    onChangeText={(text) => {
                      if (text == '' || this.state.phone == '') {
                        this.setState({ status: true })
                      } else {
                        this.setState({ status: false })
                      }
                      this.setState({ password: text })
                    }}
                    value={this.state.password}
                    underlineColorAndroid='transparent'
                    placeholder='请输入密码' />
                </View>
              </View>

              <View style={styles.line} />

              <View style={styles.buttonGroup}>
                <Button
                  title='登录'
                  color="#fff"
                  backgroundColor="#0076ff"
                  disabled={this.state.status}
                  borderRadius={4}
                  containerViewStyle={{
                    marginLeft: 0, marginRight: 0, shadowOpacity: 1,
                    shadowRadius: 1,
                    shadowColor: "black",
                    shadowOffset: { width: 0, height: 1 }
                  }}
                  onPress={this.login}
                />
              </View>
            </View>
            {/* <View style={[styles.formItem]}> */}
            {/* <TouchableOpacity
              onPress={() => this.gotoRegister()}>
              <Text style={styles.registerText}>没有账号？去注册</Text>
            </TouchableOpacity> */}
            {/* </View> */}
            <View style={styles.wrapper}>
              {/* <CheckBox
                style={styles.remember}
                checked={this.state.remember}
                onPress={() => this.rememberPwd()}
                title='记住密码' /> */}
              <TouchableOpacity
                style={styles.remember}
                onPress={() => this.gotoRegister()}>
                <Text style={styles.forgotText}>注册账号</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.forgotLink1}>
                <Text style={styles.forgotText}></Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.forgotLink}
                onPress={() => this.gotoForgetPassword()}>
                <Text style={styles.forgotText}>忘记密码</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
      </TouchableWithoutFeedback>
    );
  }
}

const styles = StyleSheet.create({

  container: {
    backgroundColor: '#fff',
    height: screenHeight
  },
  row: {
    alignItems: 'center',
  },
  logoContainer: {
    marginTop: 20
  },
  logo: {
    width: 65,
    height: 65
  },
  storeName: {
    color: '#0076ff',
    fontSize: 20,
    paddingTop: 20,
    paddingBottom: 20,
  },
  form: {
    padding: 20
  },
  formItem: {
    flex: 0,
    flexDirection: 'row',
    flexWrap: 'nowrap',
    alignItems: 'center',
    justifyContent: 'center',
  },
  formLabel: {
    width: '10%',
  },
  formFeild: {
    width: '90%',
  },
  formIcon: {
    width: 28,
    height: 28
  },
  formControl: {
    height: 50,
    fontSize: 15,
    padding: 2,
    borderWidth: 0
  },
  line: {
    borderBottomWidth: 1,
    borderBottomColor: '#bbb',
    marginTop: 5,
    marginBottom: 5,
  },
  wrapper: {
    flexWrap: 'wrap',
    flexDirection: 'row',
  },
  remember: {
    width: '30%',
    alignItems: 'flex-start',
  },
  forgotLink1: {
    width: '40%',
    alignItems: 'center',
  },
  forgotLink: {
    width: '30%',
    alignItems: 'flex-end',
  },
  forgotText: {
    color: '#0076ff',
    paddingTop: 2,
    paddingBottom: 5,
    paddingLeft: 20,
    paddingRight: 20,
    fontSize: 15
  },
  buttonGroup: {
    marginTop: 40
  },
  registerText: {
    color: '#0076ff',
    fontSize: 15
  },
  errMsgBox: {
    padding: 20
  }

});

/**
 * 这里是知道map到props的state
 * @param {*} state 
 */
const mapStateToProps = state => ({
  status: state.user.login.status,
  error: state.user.login.error
});

/**
 * 这里指定要map到props的事件
 * 一般情况下该conponent需要发送的action事件都应该定义在这里
 * 如果偷懒不定义这个方法，那么在component中，直接引用dispatch去发送action
 * @param {*} dispatch 
 */
const mapDispatchToProps = dispatch => ({
  dispatch: dispatch,
  login: (scope) => dispatch(user.login(scope))
});

/**
 * 如果没有传入mapDispatchToProps，默认会把dispatch map到props
 * 如果传入的话，必须显示的指定，否则会undefined
 */
export default connect(mapStateToProps, mapDispatchToProps)(Login);