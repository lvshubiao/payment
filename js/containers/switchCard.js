/**
 * 银行卡
 * **/
import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image,
    FlatList,
    InteractionManager,
    Platform,
    ListView,
    Dimensions,
    PixelRatio,
    TouchableOpacity,
    ScrollView,
    Keyboard,
    TextInput,
    TouchableWithoutFeedback
} from 'react-native';

import {
    Grid,
    Row,
    Col,
    Card,
    Avatar,

} from 'react-native-elements';
import { connect } from 'react-redux';
import { ACTION_LOADINGD, ACTION_SUCCESS, ACTION_FAILED } from '../constants';
import { user, card } from '../actions';
import Session from '../common/session';
import { List, ListItem } from 'react-native-elements';
import Resource from '../../resource/index';
import { Button } from 'react-native-elements';
import CountDown from '../components/count_button';
import Spinner from '../components/spinner';
import Toast, { DURATION } from 'react-native-easy-toast';
import { NavigationActions } from 'react-navigation'
var screenWidth = Dimensions.get("window").width;
var screenHeight = Dimensions.get("window").height;


class switchCard extends Component {
    static navigationOptions  = ({ navigation }) => ({
        title: '更换银行卡',
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
                seconds: 60,
                isDisabled: false,
                phone: '',
                bankName: '',
                bankCardNumber: '',
                code: '',
                status: true,
                isUpdate:true
        };
    }
   
    //发送验证码
    sendVcode() {
        const that = this;
        this.props.sendVcode().then(
            data => {
                this.refs.toast.show('验证码发送成功');
            },
            err => {
                this.refs.toast.show(err || '验证码发送失败');
            }
        );
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
    confirm(){
        this.lostBlur();
        const that = this;
        const { navigate } = this.props.navigation;
        that.refs.spinner.loading();
        this.props.putIdentification({
            bankCardNumber:this.state.bankCardNumber,
            bankName:this.state.bankName,
            code:this.state.code,
        }).then((result) => {
            that.refs.spinner.done();
            that.refs.toast.show("更换储蓄卡成功");
            this.timer = setTimeout(
                () => {
                    this.props.navigation.goBack();
                },
                1000
            );
           
        }, (err) => {
            that.refs.spinner.done();
            if(err.length > 50){
                let data = JSON.parse(err);
                let obj = data.data.fieldErrors;
                for (var key in obj){  
                    this.refs.toast.show(obj[key]);  
                    return;
                }  
              }else{
                this.setState({disabled:false});
                that.refs.toast.show(err || "更换绑定失败，请检测您的卡号");
              }
        });
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

    _keyboardDidShow() {
        keyBoardIsShow = true;
    }

    _keyboardDidHide() {
        keyBoardIsShow = false;
    }

    render() {
        const { navigate } = this.props.navigation;
        return (
            <View 
            style={styles.container}>
            <Spinner ref="spinner" />
                <Toast ref="toast" position='top' opacity={0.8} />
                <TouchableWithoutFeedback
                         onPress={this.lostBlur.bind(this)}>
                <ScrollView 
                keyboardShouldPersistTaps="always"
                style={styles.container}>
                <View style={styles.form}>
                        <View style={styles.item}><Text style={styles.textStyle}>储蓄卡卡号</Text>
                            <TextInput
                                style={{ flex: 1, padding: 5 }}
                                autoCapitalize='none'
                                underlineColorAndroid='transparent'
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

                        <View style={styles.item}>
                        <Text style={styles.textStyle}>验证码</Text>
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
                            onPress={() => this.confirm()}
                        />

                    </View>
                </ScrollView>
                </TouchableWithoutFeedback>
            </View>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        paddingLeft: 0,
        height: screenHeight - 70,
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
        paddingTop: 5,
        paddingLeft: 10
    },
    phoneItem: {
        flexDirection: 'row',
        alignItems: 'center',
        //padding: 10,
    },
    btnConfirm: {
        height: 40,
        backgroundColor: '#0076ff',
        margin: 20,
        justifyContent: 'center',
        borderRadius: 6,
        //marginTop: 30
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
        shadowOpacity: 1,
        shadowRadius: 1,
        shadowColor: "black",
        shadowOffset: { width: 0, height: 1 }
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
        justifyContent: 'center'
    },
});

const mapStateToProps = state => ({
    bankName: state.card.bankName
});

/**
 * 这里指定要map到props的事件
 * 一般情况下该conponent需要发送的action事件都应该定义在这里
 * 如果偷懒不定义这个方法，那么在component中，直接引用dispatch去发送action
 * @param {*} dispatch 
 */
const mapDispatchToProps = dispatch => ({
    dispatch: dispatch,
    sendVcode: () => dispatch(user.sendSmsCode4Identification("1")),
    putIdentification: (scope) => dispatch(user.putIdentification(scope)),
    getBankName: (cardNumber) => dispatch(card.getBankName(cardNumber)),
});

/**
 * 如果没有传入mapDispatchToProps，默认会把dispatch map到props
 * 如果传入的话，必须显示的指定，否则会undefined
 */
export default connect(mapStateToProps, mapDispatchToProps)(switchCard);