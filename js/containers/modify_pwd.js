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
    Navigator,
    TextInput,
    Dimensions,
    PixelRatio,
    TouchableOpacity,
    TouchableHighlight,
    Keyboard,
    Image,
    TouchableWithoutFeedback,
    ScrollView
} from 'react-native';
import { CheckBox, Button } from 'react-native-elements';
import { connect } from 'react-redux';
import { user } from '../actions';
import Session from '../common/session';
import { ACTION_LOADINGD, ACTION_SUCCESS, ACTION_FAILED } from '../constants';
import Toast, { DURATION } from 'react-native-easy-toast';
import Spinner from '../components/spinner';
import CountDown from '../components/count_button';
import SHA512 from 'crypto-js/sha512';
import Resource from '../../resource';
import { NavigationActions } from 'react-navigation'
var screenHeight = Dimensions.get("window").height;

let keyBoardIsShow = true;

class ModifyPWD extends Component {

    static navigationOptions = ({ navigation }) => ({
        title: '修改密码',
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
    constructor(props) {
        super(props);
        this.state = {
            password: '',
            newPassword: '',
            oldPassword: '',
            code: '',
            status: true,
            text: '获取验证码',
            disabled: false,
            time: 60
        }
    }

    //获取验证码
    modifyPasswordVcode() {

        const that = this;
        const { navigate } = this.props.navigation;
        const promise = this.props.modifyPasswordVcode();
        promise.then((data) => {
            this.refs.toast.show('验证码发送成功');
            this.setState({ disabled: true, time: 60, text: "60秒后重新获取" });
            this.runTimer();
        }, (err) => {
            this.setState({ disabled: false, text: "获取验证码" });
            this.refs.toast.show(err || '验证码发送失败');
        });
    }

    //确认
    modifyPassword() {
        Keyboard.dismiss();
        const that = this;
        if (that.state.password !== that.state.newPassword) {
            this.refs.toast.show('两次新密码输入的不一致');
            return;
        }
        if (that.state.code.length != 6) {
            this.refs.toast.show('验证码格式不正确');
            return;
        }
        that.refs.spinner.loading();
        const { navigate } = this.props.navigation;
        const promise = this.props.modifyPassword({
            code: this.state.code,
            newPassword: SHA512(this.state.newPassword).toString(),
            oldPassword: SHA512(this.state.oldPassword).toString()
        });
        promise.then((data) => {
            this.refs.toast.show('修改密码成功,请重新登录');
            this.refs.spinner.done();
            this.lostBlur();
            setTimeout(() => {
                this.props.logout();
                Session.clearSession();
                const resetAction = NavigationActions.reset({
                    index: 1,
                    actions: [
                        NavigationActions.navigate({ routeName: 'TabBar' }),
                        NavigationActions.navigate({ routeName: 'Login' }),
                    ]
                });
                this.props.navigation.dispatch(resetAction);
            }, 1000);
        }, (err) => {
            this.refs.spinner.done();
            if(err.length > 20){
                let data = JSON.parse(err);
                let obj = data.fieldErrors;
                for (var key in obj){  
                    this.refs.toast.show(obj[key]);  
                }  
            }else{
                this.refs.toast.show(err);
            }
        });
    }

    lostBlur() {
            Keyboard.dismiss();
    }

    componentWillMount() {
        this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow);
        this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);
    }

    componentWillUnmount() {
        this.timer && clearTimeout(this.timer);
        this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener.remove();
    }

    runTimer() {
        this.timer = setTimeout(
            () => {
                var time = this.state.time - 1;
                this.setState({ disabled: true, time: time, text: time + "秒后重新获取" });
                if (this.state.time >= 1) {
                    this.runTimer();
                } else {
                    this.timer && clearTimeout(this.timer);
                    this.setState({ disabled: false, time: 60, text: "获取验证码" });
                }
            },
            1000
        );
    }

    _keyboardDidShow() {
        keyBoardIsShow = true;
    }

    _keyboardDidHide() {
        keyBoardIsShow = false;
    }

    render() {
        return (
            <TouchableWithoutFeedback
                onPress={() => this.lostBlur()}>
                    <ScrollView
                        keyboardShouldPersistTaps="always"
                        style={styles.container}>
                        <Spinner ref="spinner" />
                        <Toast ref="toast" position='top' opacity={0.8} />
                        <View style={styles.item}><Text style={styles.textStyle}>验证码</Text>
                            <TextInput
                                ref="code"
                                underlineColorAndroid="gray"
                                keyboardType="numeric"
                                clearButtonMode="while-editing"
                                underlineColorAndroid='transparent'
                                style={{ flex: 1,height:40 }}
                                onChangeText={(text) => {
                                    if (text.length === 0 ||
                                        this.state.password.length === 0 ||
                                        this.state.newPassword.length === 0 ||
                                        this.state.oldPassword.length === 0) {
                                        this.setState({ status: true })
                                    } else {
                                        this.setState({ status: false })
                                    }
                                    this.setState({ code: text })
                                }}
                            ></TextInput>
                            {/* <TouchableOpacity style={styles.vcode} onPress={() => this.modifyPasswordVcode()} underlayColor='gray'>
                        <Text style={styles.vcodeText}>获取验证码</Text>
                    </TouchableOpacity> */}
                            <Button
                                title={this.state.text}
                                color="#fff"
                                backgroundColor="#0076ff"
                                disabled={this.state.disabled}
                                borderRadius={4}
                                containerViewStyle={{
                                    marginLeft: 0, marginRight: 10, height: 44, justifyContent: 'center', shadowOpacity: 1,
                                    shadowRadius: 1,
                                    shadowColor: "black",
                                    shadowOffset: { width: 0, height: 1 }
                                }}
                                onPress={this.modifyPasswordVcode.bind(this)}
                            />
                        </View>
                        <View style={styles.line}></View>
                        <View style={styles.item}><Text style={styles.textStyle}>旧密码</Text>
                            <TextInput
                                ref="oldPassword"
                                underlineColorAndroid="gray"
                                secureTextEntry={true}
                                clearButtonMode="while-editing"
                                underlineColorAndroid='transparent'
                                style={{ flex: 1,height:40}}
                                onChangeText={(text) => {
                                    if (text.length === 0 ||
                                        this.state.code.length === 0 ||
                                        this.state.newPassword.length === 0 ||
                                        this.state.password.length === 0) {
                                        this.setState({ status: true })
                                    } else {
                                        this.setState({ status: false })
                                    }
                                    this.setState({ oldPassword: text })
                                }}
                            ></TextInput>
                        </View>
                        <View style={styles.line}></View>
                        <View style={styles.item}><Text style={styles.textStyle}>新密码</Text>
                            <TextInput
                                ref="newPassword"
                                underlineColorAndroid="gray"
                                secureTextEntry={true}
                                clearButtonMode="while-editing"
                                underlineColorAndroid='transparent'
                                style={{ flex: 1,height:40 }}
                                onChangeText={(text) => {
                                    if (text.length === 0 ||
                                        this.state.code.length === 0 ||
                                        this.state.oldPassword.length === 0 ||
                                        this.state.password.length === 0) {
                                        this.setState({ status: true })
                                    } else {
                                        this.setState({ status: false })
                                    }
                                    this.setState({ newPassword: text })
                                }}
                            ></TextInput>
                        </View>
                        <View style={styles.line}></View>
                        <View style={styles.item}><Text style={styles.textStyle}>确认新密码</Text>
                            <TextInput
                                ref="confirmPassword"
                                underlineColorAndroid="gray"
                                secureTextEntry={true}
                                clearButtonMode="while-editing"
                                underlineColorAndroid='transparent'
                                style={{ flex: 1,height:40 }}
                                onChangeText={(text) => {
                                    if (text.length === 0 ||
                                        this.state.code.length === 0 ||
                                        this.state.oldPassword.length === 0 ||
                                        this.state.newPassword.length === 0) {
                                        this.setState({ status: true })
                                    } else {
                                        this.setState({ status: false })
                                    }
                                    this.setState({ password: text })
                                }}
                            ></TextInput>
                        </View>
                        <View style={styles.line}></View>
                        {/* <TouchableOpacity style={styles.forgetPwd}
                    underlayColor='gray'
                    onPress={() => this.modifyPassword()}>
                    <Text style={styles.confirmText}>确认</Text>
                </TouchableOpacity>
                 */}
                        <Button
                            title='确认'
                            color="#fff"
                            backgroundColor="#0076ff"
                            disabled={this.state.status}
                            borderRadius={4}
                            containerViewStyle={{
                                marginLeft: 20, marginRight: 20, marginTop: 30, marginBottom: 20, shadowOpacity: 1,
                                shadowRadius: 1,
                                shadowColor: "black",
                                shadowOffset: { width: 0, height: 1 }
                            }}
                            onPress={() => this.modifyPassword()}
                        />
                    </ScrollView>
            </TouchableWithoutFeedback>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 0,
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
    modifyPasswordVcode: () => dispatch(user.modifyPasswordVcode()),
    modifyPassword: (scope) => dispatch(user.modifyPassword(scope)),
    logout: () => dispatch(user.logout())
});

/**
 * 如果没有传入mapDispatchToProps，默认会把dispatch map到props
 * 如果传入的话，必须显示的指定，否则会undefined
 */
export default connect(mapStateToProps, mapDispatchToProps)(ModifyPWD);