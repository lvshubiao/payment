/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Button,
    Navigator,
    TextInput,
    Dimensions,
    PixelRatio,
    TouchableOpacity
} from 'react-native';
import { connect } from 'react-redux';
import { user } from '../actions';
import { ACTION_LOADINGD, ACTION_SUCCESS, ACTION_FAILED } from '../constants';
import Toast, { DURATION } from 'react-native-easy-toast';
import Spinner from '../components/spinner';

var screenWidth = Dimensions.get("window").width;
var screenHeight = Dimensions.get("window").height;

class Banding extends Component {

    static navigationOptions  = ({ navigation }) => ({
        title: '更换绑定',
        headerLeft: (
          <TouchableOpacity onPress={() => {
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
    constructor(props) {
        super(props);
        this.state = {
            phone: '',
            password: '',
            newPassword: '',
            code: ''
        }
    }


    //获取验证码
    forgetPasswordVcode() {
        const that = this;
        const { navigate } = this.props.navigation;
        const promise = this.props.forgetPasswordVcode(this.state.phone);
        promise.then((data) => {
            this.refs.toast.show('验证码发送成功');
        }, (err) => {
            this.refs.toast.show(err || '获取验证码错误');
        });
    }

    //确认
    forgetPassword() {
        const that = this;
        const { navigate } = this.props.navigation;
        that.refs.spinner.loading();
        const promise = this.props.forgetPassword({
            phone: this.state.phone,
            code: this.state.code,
            newPassword: this.state.newPassword
        });
        promise.then(function (data) {
            that.refs.spinner.done();
            navigate('Login');
        }, (err) => {
            that.refs.spinner.done();
            this.refs.toast.show(err);
        });
    }

    render() {
        return (
            <View style={styles.container}>
                <Spinner ref="spinner" />
                <Toast ref="toast" position='top' opacity={0.8} />
                <View style={styles.phoneItem}><Text style={styles.textStyle}>手机号码</Text>
                    <TextInput
                        ref="phone"
                        autoFocus={true}
                        underlineColorAndroid="red"
                        /* keyboardType={numeric} */
                        clearTextOnFocus={true}
                        clearButtonMode="while-editing"
                        underlineColorAndroid='transparent'
                        style={{ flex: 1 }}
                        onChangeText={(text) => this.setState({ phone: text })}
                    ></TextInput>
                </View>
                <View style={styles.line}></View>
                <View style={styles.item}><Text style={styles.textStyle}>验证码</Text>
                    <TextInput
                        ref="code"
                        underlineColorAndroid="gray"
                        /* keyboardType={numeric} */
                        clearTextOnFocus={true}
                        clearButtonMode="while-editing"
                        underlineColorAndroid='transparent'
                        style={{ flex: 1 }}
                        onChangeText={(text) => this.setState({ code: text })}
                    ></TextInput>
                    <TouchableOpacity style={styles.vcode} onPress={() => this.forgetPasswordVcode()} underlayColor='gray'>
                        <Text style={styles.vcodeText}>获取验证码</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.line}></View>
                <View style={styles.item}><Text style={styles.textStyle}>设置新密码</Text>
                    <TextInput
                        ref="newPassword"
                        underlineColorAndroid="gray"
                        secureTextEntry={true}
                        clearTextOnFocus={true}
                        clearButtonMode="while-editing"
                        underlineColorAndroid='transparent'
                        style={{ flex: 1 }}
                        onChangeText={(text) => this.setState({ password: text })}
                    ></TextInput>
                </View>
                <View style={styles.line}></View>
                <View style={styles.item}><Text style={styles.textStyle}>确认新密码</Text>
                    <TextInput
                        ref="confirmPassword"
                        underlineColorAndroid="gray"
                        secureTextEntry={true}
                        clearTextOnFocus={true}
                        clearButtonMode="while-editing"
                        underlineColorAndroid='transparent'
                        style={{ flex: 1 }}
                        onChangeText={(text) => this.setState({ newPassword: text })}
                    ></TextInput>
                </View>
                <View style={styles.line}></View>
                <TouchableOpacity style={styles.forgetPwd}
                    underlayColor='gray'
                    onPress={() => this.forgetPassword()}>
                    <Text style={styles.confirmText}>确认</Text>
                </TouchableOpacity>
            </View>
        )
    }

}
const styles = StyleSheet.create({
    container: {
        paddingTop: 0,
        backgroundColor: 'white',
        height: screenHeight
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        margin: 10
    },
    line: {
        borderBottomWidth: 1,
        borderBottomColor: '#bbb',
        marginLeft: 20,
        marginRight: 20
    },
    textStyle: {
        fontSize: 16,
        color: 'gray',
        margin: 5,
        marginLeft: 10
    },
    phoneItem: {
        flexDirection: 'row',
        alignItems: 'center',
        margin: 10,
        marginTop: 30
    },
    forgetPwd: {
        height: 40,
        backgroundColor: '#0076ff',
        margin: 20,
        justifyContent: 'center',
        borderRadius: 6,
        marginTop: 30
    },
    confirmText: {
        fontSize: 16,
        alignSelf: 'center',
        color: '#FFF'
    },
    vcode: {
        height: 36,
        backgroundColor: '#0076ff',
        width: 100,
        justifyContent: 'center',
        marginRight: 10,
        borderRadius: 6
    },
    vcodeText: {
        fontSize: 14,
        alignSelf: 'center',
        color: '#FFF'
    }
})

/**
 * 这里是知道map到props的state
 * @param {*} state 
 */
const mapStateToProps = state => ({
    status: state.user.status,
    error: state.user.error
});

/**
 * 这里指定要map到props的事件
 * 一般情况下该conponent需要发送的action事件都应该定义在这里
 * 如果偷懒不定义这个方法，那么在component中，直接引用dispatch去发送action
 * @param {*} dispatch 
 */
const mapDispatchToProps = dispatch => ({
    dispatch: dispatch,
    forgetPasswordVcode: (phone) => dispatch(user.forgetPasswordVcode(phone)),
    forgetPassword: (scope) => dispatch(user.forgetPassword(scope))
});

/**
 * 如果没有传入mapDispatchToProps，默认会把dispatch map到props
 * 如果传入的话，必须显示的指定，否则会undefined
 */
export default connect(mapStateToProps, mapDispatchToProps)(Banding);