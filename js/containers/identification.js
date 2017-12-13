/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    Alert,
    Dimensions,
    TouchableOpacity,
    Image,
    TouchableHighlight,
    Keyboard,
    TouchableWithoutFeedback,
    ScrollView,
    AppState
} from 'react-native';
import { Button } from 'react-native-elements';
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation'
import { user, card } from '../actions';
import Session from '../common/session';
import Service from '../common/service';
import Toast, { DURATION } from 'react-native-easy-toast';
import Resource from '../../resource';
import Spinner from '../components/spinner';
import CountDown from '../components/count_button';

let screenWidth = Dimensions.get('window').width;
let screenHeight = Dimensions.get('window').height
let keyBoardIsShow = true;

class Identification extends Component {

    static navigationOptions  = ({ navigation }) => ({
        title: '实名认证',
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
    constructor(props) {
        super(props);
        this.state = {
            seconds: 60,
            isDisabled: false,
            phone: '',
            bankName: '',
            bankCardNumber: '',
            cardholder: '',
            code: '',
            idCardNumber: '',
            idCardChecked: false,
            pictureIdentification: false,
            status: true,
            currentAppState: AppState.currentState,
        }
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
    componentDidMount() {
        AppState.addEventListener('change', this._handleAppStateChange.bind(this));
        const that = this;
        Session.getLocalUserInfo().then((user) => {
            that.setState({
                phone: user.phone,
                // 实名
                idCardChecked: user.idCardChecked,
                // 是否上传身份证
                pictureIdentification: user.pictureIdentification,
                cardholder: user.realName
            });

            if (user.attributes && user.attributes.maskDebitCard) {
                that.setState({ bankCardNumber: user.attributes.maskDebitCard });
            }
            if (user.attributes && user.attributes.maskIdCard) {
                that.setState({ idCardNumber: user.attributes.maskIdCard });
            }
            if (user.attributes && user.attributes.debitCardBankName) {
                that.setState({ bankName: user.attributes.debitCardBankName });
            }
        });
    }

    //发送验证码
    sendVcode() {
        const that = this;
        this.props.sendVcode().then(
            data => {
                this.refs.toast.show('验证码发送成功');
            },
            err => {
                // TODO: 
                this.refs.toast.show(err || '验证码发送失败');
            }
        );
    }

    confirm() {
        Keyboard.dismiss();
        const that = this;
        if (that.state.code == '') {
            this.refs.toast.show('验证码不能为空');
            return;
        }
        const { navigate } = this.props.navigation;
        that.refs.spinner.loading();
        this.props.identification(this.state).then((result) => {
            that.refs.spinner.done();
            this.lostBlur();
            this.refs.toast.show('实名认证成功');
            Service.getUserInfo();
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
            that.refs.spinner.done();
            if(err.length > 20){
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

    goUploadIdcard() {
        const { navigate } = this.props.navigation;
        navigate('UploadIdcard');
    }

    getBankName(bankCardNumber) {
        this.props.getBankName(bankCardNumber)
            .then((data) => {
                this.setState({ bankName: data });
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
        this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener.remove();
        AppState.removeEventListener('change', this._handleAppStateChange);
    }

    _keyboardDidShow() {
        keyBoardIsShow = true;
    }

    _keyboardDidHide() {
        keyBoardIsShow = false;
    }

    render() {

        let detailsView = (
            <View>
                <View style={styles.legend}>
                    <Text style={styles.legendLabel}>身份证银行卡信息</Text>
                </View>

                <View style={[styles.item, styles.phoneItem]}>
                    <Text style={styles.textStyle}>姓名</Text>
                    <Text style={{ flex: 1, padding: 5 }}>{this.state.cardholder}</Text>
                </View>

                <View style={styles.line}></View>

                <View style={styles.item}>
                    <Text style={styles.textStyle}>身份证号码</Text>
                    <Text style={{ flex: 1, padding: 5 }}>{this.state.idCardNumber}</Text>
                </View>

                <View style={styles.line}></View>

                <View style={styles.item}>
                    <Text style={styles.textStyle}>储蓄卡卡号</Text>
                    <Text style={{ flex: 1, padding: 5 }}>**** **** **** {this.state.bankCardNumber}</Text>
                </View>

                <View style={styles.line}></View>

                <View style={styles.item}>
                    <Text style={styles.textStyle}>银行名称</Text>
                    <Text style={{ flex: 1, padding: 5 }}>{this.state.bankName}</Text>
                </View>
                {  
                (this.state.idCardChecked && this.state.pictureIdentification===false)?<Button
                    title='上传身份证照片'
                    color="#fff"
                    backgroundColor="#0076ff"
                    borderRadius={4}
                    containerViewStyle={{ marginTop: 20, marginLeft: 20, marginRight: 20}}
                    onPress={() => this.goUploadIdcard()}/>:null
                }
            </View>
        );

        let formView = (
            <View>
                <View style={styles.legend}>
                    <Text style={styles.legendLabel}>身份证银行卡信息</Text>
                </View>

                <View style={[styles.item, styles.phoneItem]}><Text style={styles.textStyle}>姓名</Text>
                    <TextInput
                        style={{ flex: 1, padding: 5 }}
                        autoCapitalize='none'
                        underlineColorAndroid='transparent'
                        placeholder="请输入您的真实姓名"
                        onChangeText={(input) => this.setState({ cardholder: input })}
                    ></TextInput>
                </View>

                <View style={styles.line}></View>

                <View style={styles.item}><Text style={styles.textStyle}>身份证号码</Text>
                    <TextInput
                        style={{ flex: 1, padding: 5 }}
                        autoCapitalize='none'
                        underlineColorAndroid='transparent'
                        placeholder="请输入您的身份证号码"
                        onChangeText={(input) => this.setState({ idCardNumber: input })}>
                    </TextInput>
                </View>

                <View style={styles.line}></View>

                <View style={styles.item}><Text style={styles.textStyle}>储蓄卡卡号</Text>
                    <TextInput
                        style={{ flex: 1, padding: 5 }}
                        autoCapitalize='none'
                        underlineColorAndroid='transparent'
                        placeholder="请输入您要绑定的储蓄卡卡号"
                        keyboardType="numeric"
                        onBlur={() => this.getBankName(this.state.bankCardNumber)}
                        onChangeText={(input) => this.setState({ bankCardNumber: input })}>
                    </TextInput>
                </View>

                <View style={styles.line}></View>

                <View style={styles.item}><Text style={styles.textStyle}>银行名称</Text>
                    <TextInput
                        style={{ flex: 1, padding: 5 }}
                        autoCapitalize='none'
                        underlineColorAndroid='transparent'
                        value={this.state.bankName}
                        onChangeText={(input) => this.setState({ bankName: input })}>
                    </TextInput>
                </View>

                <View style={styles.line}></View>

                <View style={styles.item}><Text style={styles.textStyle}>手机号码</Text>
                    <TextInput
                        style={{ flex: 1, padding: 5 }}
                        value={this.state.phone}
                        keyboardType="numeric"
                        editable={false}
                        placeholder="请输入您的手机号码"
                        underlineColorAndroid='transparent'
                        onChangeText={(input) => this.setState({ phone: input })}>
                    </TextInput>
                </View>

                <View style={styles.line}></View>

                <View style={styles.item}><Text style={styles.textStyle}>验证码</Text>
                    <TextInput
                        style={{ flex: 1, padding: 5 }}
                        autoCapitalize='none'
                        keyboardType="numeric"
                        underlineColorAndroid='transparent'
                        onChangeText={(text) => {
                            if (text.length < 4) {
                                this.setState({ status: true })
                            } else {
                                this.setState({ status: false })
                            }
                            this.setState({ code: text })
                        }}
                    ></TextInput>
                    <CountDown onPress={() => this.sendVcode()} style={styles.vcode} />
                </View>

                <View style={styles.line}></View>
              
                {  
                (this.state.idCardChecked && this.state.pictureIdentification===false)?<Button
                    title='上传身份证照片'
                    color="#fff"
                    backgroundColor="#0076ff"
                    borderRadius={4}
                    containerViewStyle={{ marginTop: 20, marginLeft: 20, marginRight: 20}}
                    onPress={() => this.goUploadIdcard()}/>
                    :
                     <Button
                     title='确认'
                     color="#fff"
                     backgroundColor="#0076ff"
                     disabled={this.state.status}
                     borderRadius={4}
                     containerViewStyle={{ marginLeft: 20, marginRight: 20, marginTop: 30, marginBottom: 20}}
                     onPress={() => this.confirm()}
                 />
                }
            </View>
        );
        return (
            <ScrollView style={styles.container} keyboardShouldPersistTaps="always">
                <Spinner ref="spinner" />
                <Toast ref="toast" position='top' opacity={0.8} />
                {this.state.idCardChecked ? detailsView : formView}
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 0,
        backgroundColor: '#F4F4F4',
        height: screenHeight
    },
    legend: {
        paddingTop: 15,
        paddingBottom: 15,
        paddingLeft: 20,
        paddingRight: 20,
        backgroundColor: '#efefef'
    },
    legendLabel: {
        color: '#666',
        fontSize: 16,
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 20,
        paddingRight: 20,
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
    },
    phoneItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    btnConfirm: {
        height: 40,
        backgroundColor: '#0076ff',
        margin: 20,
        justifyContent: 'center',
        borderRadius: 6,
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
        borderRadius: 6,
    },
    vcodeText: {
        fontSize: 14,
        alignSelf: 'center',
        color: '#FFF'
    },
    input: {
        width: 250,
        height: 40,
        color: '#eee',
        fontSize: 16
    },
    dropdownStyle: {
        justifyContent: 'center',
    },
})

const mapStateToProps = state => ({
});

const mapDispatchToProps = dispatch => ({
    dispatch: dispatch,
    sendVcode: () => dispatch(user.sendSmsCode4Identification()),
    identification: (scope) => dispatch(user.identification(scope)),
    getBankName: (cardNumber) => dispatch(card.getBankName(cardNumber)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Identification);
