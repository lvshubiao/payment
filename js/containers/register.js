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
    Alert,
    Dimensions,
    PixelRatio,
    TouchableOpacity,
    Keyboard,
    Image,
    TouchableWithoutFeedback,
    ScrollView
} from 'react-native';
import { CheckBox, Button } from 'react-native-elements';
import { connect } from 'react-redux';
import { user } from '../actions';
import { ACTION_LOADINGD, ACTION_SUCCESS, ACTION_FAILED } from '../constants';
import Toast, { DURATION } from 'react-native-easy-toast';
import Spinner from '../components/spinner';
import CountDown from '../components/count_button';
import SHA512 from 'crypto-js/sha512';
import Resource from '../../resource';

var screenHeight = Dimensions.get("window").height;
var codeTime = 60;//倒计时60s设定
let keyBoardIsShow = true;

class Register extends Component {

    static navigationOptions = ({ navigation }) => ({
        title: '注册',
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
            timerCount: codeTime,
            phone: '',
            password: '',
            newpassword: '',
            code: '',
            userRefereePhone: '',
            status: true,
            btnBackColor: '#0076ff',
            text: '获取验证码',
            disabled: true,
            time: 60
        }
    }

    phoneValue(text) {
        if (text.length === 0) {
            this.setState({
                status: true,
                disabled: true,
                phone: text
            })
            if (this.state.code.length === 0 ||
                this.state.password.length === 0 || this.state.newpassword.length === 0) {
                this.setState({
                    status: true
                })
            }
        } else {
            this.setState({
                disabled: false,
                phone: text
            })
            if (this.state.code.length === 0 ||
                this.state.password.length === 0 || this.state.newpassword.length === 0) {
                this.setState({
                    status: true
                })
            } else {
                this.setState({
                    status: false
                })
            }
        }
    }

    //去登录
    pushToLogin() {
        Keyboard.dismiss();
        const { navigate } = this.props.navigation;
        this.props.navigation.goBack();
    }
    //获取验证码
    registerVcode() {
        const that = this;
        if (that.state.phone == '') {
            this.refs.toast.show('手机号不能为空');
            return;
        }
        const { navigate } = this.props.navigation;
        const promise = this.props.registerVcode(this.state.phone);
        promise.then((data) => {
            this.refs.toast.show('验证码发送成功');
            this.setState({ disabled: true, time: 60, text: "60秒后重新获取" });
            this.runTimer();
        }, (err) => {
            this.setState({ disabled: false, text: "获取验证码" });
            this.refs.toast.show(err || '验证码发送失败');
        });
    }

    //注册确认
    register() {
        Keyboard.dismiss();
        const that = this;
        if (that.state.phone.length != 11) {
            that.refs.toast.show('手机号格式不正确');
            return;
        }
        if (that.state.password !== that.state.newpassword) {
            that.refs.toast.show('两次密码输入的不一致');
            return;
        }
        if(that.state.code.length != 6){
            that.refs.toast.show('验证码格式不对');
            return;
        }
        const { navigate } = this.props.navigation;
        that.refs.spinner.loading();
        if (this.state.userRefereePhone != '') {
            const promise = this.props.register({
                phone: this.state.phone,
                code: this.state.code,
                password: SHA512(this.state.password).toString(),
                userRefereePhone: this.state.userRefereePhone || ''
            });
            promise.then((data) => {
                this.refs.toast.show('注册成功');
                this.lostBlur();
                this.refs.spinner.done();
                setTimeout(() => {
                    this.props.navigation.goBack();
                }, 2000);
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
        } else {
            const promise = this.props.register({
                phone: this.state.phone,
                code: this.state.code,
                password: SHA512(this.state.password).toString()
            });
            promise.then((data) => {
                this.refs.spinner.done();
                this.refs.toast.show('注册成功');
                this.lostBlur();
                setTimeout(() => {
                    this.props.navigation.goBack();
                }, 1500);
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
                        <View style={styles.phoneItem}><Text style={styles.textStyle}>手机号码</Text>
                            <TextInput
                                ref="phone"
                                underlineColorAndroid="red"
                                keyboardType="numeric"
                                clearButtonMode="while-editing"
                                underlineColorAndroid='transparent'
                                style={{ flex: 1,height:40}}
                                onChangeText={(text) => this.phoneValue(text)}
                            ></TextInput>
                        </View>
                        <View style={styles.line}></View>
                        <View style={styles.item}><Text style={styles.textStyle}>验证码</Text>
                            <TextInput
                                ref="code"
                                underlineColorAndroid="gray"
                                keyboardType="numeric"
                                clearButtonMode="while-editing"
                                underlineColorAndroid='transparent'
                                style={{ flex: 1,height:40}}
                                onChangeText={(text) => {
                                    if (text.length === 0 || this.state.phone.length === 0 ||
                                        this.state.password.length === 0 || this.state.newpassword.length === 0) {
                                        this.setState({ status: true })
                                    } else {
                                        this.setState({ status: false })
                                    }
                                    this.setState({ code: text })
                                }}
                            ></TextInput>
                            {/* <TouchableOpacity style={{
                        height: 36,
                        backgroundColor: this.state.btnBackColor,
                        width: 100,
                        justifyContent: 'center',
                        marginRight: 10,
                        borderRadius: 6
                    }}
                        disabled={this.state.status}
                        onPress={() => this.registerVcode()}
                        underlayColor='#B5B5B5'>
                        <Text style={styles.vcodeText}>{this.state.codeTitle}</Text>
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
                                onPress={this.registerVcode.bind(this)}
                            />
                        </View>
                        <View style={styles.line}></View>
                        <View style={styles.item}><Text style={styles.textStyle}>推荐人手机号</Text>
                            <TextInput
                                ref="userRefereePhone"
                                keyboardType="numeric"
                                placeholder="(非必填项)"
                                underlineColorAndroid="gray"
                                clearButtonMode="while-editing"
                                underlineColorAndroid='transparent'
                                style={{ flex: 1,height:40}}
                                onChangeText={(text) => this.setState({ userRefereePhone: text })}
                            ></TextInput>
                        </View>
                        <View style={styles.line}></View>
                        <View style={styles.item}><Text style={styles.textStyle}>密码</Text>
                            <TextInput
                                ref="newPassword"
                                underlineColorAndroid="gray"
                                secureTextEntry={true}
                                clearButtonMode="while-editing"
                                underlineColorAndroid='transparent'
                                style={{ flex: 1,height:40}}
                                onChangeText={(text) => {
                                    if (text.length === 0 || this.state.phone.length === 0 ||
                                        this.state.code.length === 0 || this.state.newpassword.length === 0) {
                                        this.setState({ status: true })
                                    } else {
                                        this.setState({ status: false })
                                    }
                                    this.setState({ password: text })
                                }}
                            ></TextInput>
                        </View>
                        <View style={styles.line}></View>
                        <View style={styles.item}><Text style={styles.textStyle}>确认密码</Text>
                            <TextInput
                                ref="confirmPassword"
                                underlineColorAndroid="gray"
                                secureTextEntry={true}
                                clearButtonMode="while-editing"
                                underlineColorAndroid='transparent'
                                style={{ flex: 1,height:40}}
                                onChangeText={(text) => {
                                    if (text.length === 0 || this.state.phone.length === 0 ||
                                        this.state.code.length === 0 || this.state.password.length === 0) {
                                        this.setState({ status: true })
                                    } else {
                                        this.setState({ status: false })
                                    }
                                    this.setState({ newpassword: text })
                                }}
                            ></TextInput>
                        </View>
                        <View style={styles.line}></View>
                        {/* <TouchableOpacity style={styles.forgetPwd}
                    underlayColor='#B5B5B5'
                    onPress={() => this.register()}>
                    <Text style={styles.confirmText}>确认</Text>
                </TouchableOpacity> */}
                        <View style={styles.itemCheckbox}>
                            <CheckBox
                                style={styles.remember}
                                checked={this.state.remember}
                                checkedIcon='dot-circle-o'
                                uncheckedIcon='circle-o'
                                textStyle={{color:'#0076ff'}}
                                onPress={() => this.rememberPwd()}
                                title='本人同意并确认《用户服务协议》'
                            />
                        </View>

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
                            onPress={() => this.register()}
                        />
                        <TouchableOpacity
                            style={styles.btn}
                            underlayColor='#B5B5B5'
                            onPress={() => this.pushToLogin()}>
                            <Text style={styles.btncolor}>已有账号，去登录</Text>
                        </TouchableOpacity>
                        <View style={[styles.errMsgBox]}>
                            {
                                (this.props.status === ACTION_FAILED) && (
                                    <Text style={{ color: '#f00' }}>
                                        {this.props.error}
                                    </Text>)
                            }
                        </View>
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
    },
    btn: {
        //fontSize:6,
        alignSelf: 'center'
    },
    btncolor: {
        color: '#0076ff'
    },
    errMsgBox: {
        padding: 20
    },
    buttonGroup: {
        marginTop: 0
    },
    remember: {
        width: '90%',
        alignItems: 'flex-start'
    },
    itemCheckbox: {
        margin: 20,
        marginBottom: -10
        // color:'#0076ff'        
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
    registerVcode: (phone) => dispatch(user.registerVcode(phone)),
    register: (scope) => dispatch(user.register(scope))
});

/**
 * 如果没有传入mapDispatchToProps，默认会把dispatch map到props
 * 如果传入的话，必须显示的指定，否则会undefined
 */
export default connect(mapStateToProps, mapDispatchToProps)(Register);