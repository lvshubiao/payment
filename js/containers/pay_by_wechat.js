import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image,
    InteractionManager,
    Platform,
    Dimensions,
    TouchableOpacity
} from 'react-native';
import { connect } from 'react-redux';
import Resource from '../../resource/index';
import { Button } from 'react-native-elements';
import { payment } from '../actions';
import config from '../config';
import Session from '../common/session';
import Toast, { DURATION } from 'react-native-easy-toast';
import {
    ACTION_LOADINGD,
    ACTION_SUCCESS,
    ACTION_FAILED,
    PAY_RESULT_PRE,
    PAY_RESULT_UNION_CONFORM,
    PAY_RESULT_OK,
    PAY_RESULT_FAIL,
    UNIONPAY,
    WEIXIN_SCAN_BY_USER,
    ALIPAY_SCAN_BY_USER
} from '../constants';


let ScreenWidth = Dimensions.get('window').width;
let ScreenHeight = Dimensions.get('window').height

class PayByWeChat extends Component {

    static navigationOptions  = ({ navigation }) => ({
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

    constructor() {
        super();

        this.state = {
            qrcodeUrl: '',
            amount: 0,
            paymentMethod: '',
        };
    }

    runTimer() {

        const { navigate } = this.props.navigation;
        const navigation = this.props.navigation;
        const paymentId = navigation.state.params.paymentId;
        const that = this;
        this.timer = setTimeout(
            () => {
                this.props.getPaymentResult(paymentId).then((result) => {
                    var map = {
                        paymentId:paymentId,
                        type:'UNIONPAY',
                        state:'1',
                        code:result.status.toString()
                      }
                    if (result.status === PAY_RESULT_OK || result.status === PAY_RESULT_FAIL) {
                        that.timer && clearTimeout(that.timer);
                        navigate('Receivables_results', { paymentId: paymentId, payStatus: result.status, amount: result.order.amount });
                    }
                }, (err) => {
                });

                this.runTimer();
            },
            3000
        );

    }

    componentDidMount() {

        const that = this;
        const { navigate } = this.props.navigation;
        const navigation = this.props.navigation;
        const paymentId = navigation.state.params.paymentId;
        const authorizationCode = navigation.state.params.authorizationCode;
        const amount = navigation.state.params.amount;
        const paymentMethod = navigation.state.params.paymentMethod;

        this.setState({ amount: amount, paymentMethod: paymentMethod });

        this.runTimer();

        // get qrcode 
        Session.getUserInfo().then((user) => {
            let userId = user.userId;
            let qrcodeUrl = config.serverURL + `/qrcodes/payee/${userId}?code=${authorizationCode}`;
            that.setState({ qrcodeUrl: qrcodeUrl });
        }, (err) => {
            //todo: 
        });


    }

    componentWillUnmount() {
        this.timer && clearTimeout(this.timer);
    }
    render() {

        let paymentMethodHeader = null;
        if (this.state.paymentMethod === WEIXIN_SCAN_BY_USER) {
            paymentMethodHeader = (
                <View style={[styles.row, styles.way]}>
                    <Image source={Resource.image.ICON_WEBCHAT} style={styles.icon} />
                    <Text style={styles.pay}>微信二维码收款</Text>
                </View>
            )
        }
        if (this.state.paymentMethod === ALIPAY_SCAN_BY_USER) {
            paymentMethodHeader = (
                <View style={[styles.row, styles.way]}>
                    <Image source={Resource.image.ICON_ALIPAY} style={styles.icon} />
                    <Text style={styles.pay}>支付宝二维码收款</Text>
                </View>
            )
        }

        return (
            
            <View style={styles.container}>
                <Toast ref="toast" position='top' opacity={0.8} />
                {paymentMethodHeader}

                <View style={{ alignItems: 'center', marginTop: 20 }}>
                
                    <View style={{ alignItems: 'center' }}>
                    
                        <Text style={styles.font20}>乐惠支付向你发起一笔收款订单</Text>
                        <Text style={styles.font18}>请扫描二维码支付</Text>
                    </View>
                    <View style={styles.code}>
                        <Image source={{ 'uri': this.state.qrcodeUrl }} style={styles.payQrcode}></Image>
                    </View>
                    <View style={styles.totalMoney}>
                        <Text style={styles.red}>￥{this.state.amount}</Text>
                    </View>
                </View>
            </View>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    row: {
        flexDirection: 'row',
    },
    way: {
        padding: 10,
        backgroundColor: '#efefef',
    },
    font20: {
        fontSize: 20,
        color: '#333'
    },
    font18: {
        fontSize: 18,
        padding: 5,
        color: '#333'
    },
    pay: {
        fontSize: 20,
        color: '#333',
        paddingLeft: 5,
        paddingTop: 5
    },
    icon: {
        width: 36,
        height: 36
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
    },
    code: {
        //width: ScreenWidth * 0.6,
        //height: ScreenWidth * 0.6,
        marginTop: 10,
        justifyContent: 'center',
        borderWidth: 0,
    },
    payQrcode: {
        width: ScreenWidth * 0.6,
        height: ScreenWidth * 0.6,
    },
    total: {
        width: ScreenWidth,
        marginTop: 20,
        borderWidth: 1,
        borderColor: '#BBBBBB',
        borderStyle: 'solid',
        borderRadius: 10,
        height: ScreenWidth / 4,
        justifyContent: 'center'

    },
    totalMoney: {
        alignItems: 'center',
        padding: 20
    },
    red: {
        fontSize: 30,
        color: 'red',
        fontWeight: 'bold'
    }

});


const mapStateToProps = state => ({
    paymentResult: state.payment.paymentResult
});

const mapDispatchToProps = dispatch => ({
    dispatch: dispatch,
    getPaymentResult: (paymentId) => dispatch(payment.getPaymentResult(paymentId)),
});

export default connect(mapStateToProps, mapDispatchToProps)(PayByWeChat);
