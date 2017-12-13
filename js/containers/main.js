import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image,
    FlatList,
    TouchableOpacity,
    InteractionManager,
    Platform,
    ScrollView,
    Dimensions,
    PixelRatio,
    RefreshControl,
    ListView,
    ActivityIndicator
} from 'react-native';
import { connect } from 'react-redux';
import {
    Grid,
    Row,
    Col,
    Button,
    Card
} from 'react-native-elements';

import Resource from '../../resource/index';
import { NavigationActions } from 'react-navigation'
import Session from '../common/session';
import Service from '../common/service';
import commonStyle from '../common/style';

import { user } from '../actions';
const moment = require('moment');
import PubSub from 'pubsub-js';
import { TOPIC_TOKEN_EXPIRED } from '../constants';
import Toast, { DURATION } from 'react-native-easy-toast';
const debounce = require('debounce');
var screenWidth = Dimensions.get("window").width;
var screenHeight = Dimensions.get("window").height;
let receivableItem = null;
let spendItem = null;
let profitItem = null;
class Main extends Component {
    static navigationOptions = {
        title: '乐惠品',
        headerTitleStyle: { alignSelf: 'center' }
    }
    constructor(props) {
        super(props);
        this.state = {
            debounce: false,
            dbclick:false,
            isRefreshing: false,
            isLoggedIn:false,
            receivable: {
                "paymentId": 0,
                "orderId": 0,
                "paymentMethod": "",
                "subject": "",
                "amount": 0,
                "createAt": 0,
                "updateAt": 0,
                "endAt": 0,
                "status": 0,
                "payerId": 0,
            },
            spend: {
                "paymentId": 0,
                "orderId": 0,
                "paymentMethod": "",
                "subject": "",
                "amount": 0,
                "createAt": 0,
                "updateAt": 0,
                "endAt": 0,
                "status": 0,
                "payerId": 0,
            },
            profit: {
                "amount": 0,
                "commissionSource": 0,
                "commission": 0,
                "orderId": 0,
                "last4NumberPhone": "",
            },
        }
    }
    componentDidMount() {
       Session.hasLoggedIn().then((result)=>{
            this.setState({
                isLoggedIn:result
            })
        },(err)=>{
            this.setState({
                isLoggedIn:false
            })
        })
        this.receivable();
        this.spend();
        this.profit();
        this.runTimer();
        PubSub.subscribe(TOPIC_TOKEN_EXPIRED, this.handleTokenExpired.bind(this));
    }
    componentWillUnmount() {
        this.timer && clearInterval(this.timer);
        PubSub.unsubscribe(TOPIC_TOKEN_EXPIRED);
    }

    handleTokenExpired(msg, data) {
        const { navigate } = this.props.navigation;
        // 同时触发的问题
        // debounce
        this.setState({ debounce: true });
        const runDebounce = debounce(() => {
            if (this.state.debounce) {
                // 判断当前是否在登录页面,如果是，不需要再跳转
                const navigation = this.props.navigation;
                if (navigation.state.routeName == 'Login') {
                    return;
                }
                setTimeout(() => {
                    if (this.state.debounce) {
                        this.setState({ debounce: false });
                        PubSub.unsubscribe(TOPIC_TOKEN_EXPIRED);
                        let promise = this.props.logout();
                        promise.then((res) => {
                            Session.clearSession();
                            const resetAction = NavigationActions.reset({
                                index: 1,
                                actions: [
                                    NavigationActions.navigate({ routeName: 'TabBar' }),
                                    NavigationActions.navigate({ routeName: 'Login' }),
                                ]
                            });
                            this.props.navigation.dispatch(resetAction);
                        });
                    }
                }, 1000);
            }
        }, 500);

        runDebounce();
    }

    runTimer() {
        const that = this;
        this.timer = setInterval(() => {
            this.receivable();
            this.spend();
            this.profit();
        }, 30000)
    }
    receivable() {
        return Session.getUserInfo().then((result) => {
            this.props.receivable().then((receivable) => {
                if (receivable != null) {
                    this.setState({
                        receivable: receivable
                    });
                }
            }, (err) => {
                
            });
        })

    }
    spend() {
        return Session.getUserInfo().then((result) => {
            this.props.spend().then((spend) => {
                if (spend != null) {
                    this.setState({
                        spend: spend
                    })
                }
            }, (err) => {
                
            });
        })
    }
    profit() {
        return Session.hasLoggedIn().then((result) => {
            this.props.profit().then((profit) => {
                if (profit != null) {
                    this.setState({
                        profit: profit
                    })
                }
            }, (err) => {
                
            });
        })
    }
    goPayByCode() {
        const { navigate } = this.props.navigation;
        Session.hasLoggedIn().then((result) => {
            Session.getUserInfo().then((user) => {
                if(user.idCardChecked === true 
                    && user.pictureIdentification === true){
                        navigate('PayByCode');
                             return;
                    }
                if(user.idCardChecked != true){
                    this.refs.toast.show("您当前尚未完成实名认证,点击我的-实名认证和银行卡绑定完善信息");
                    return;
                }
                if(user.pictureIdentification != true){
                    this.refs.toast.show("您当前尚未完成身份证上传，点击我的-上传身份证去完成身份证审核");
                    return;
                }
            });
        },(err)=>{
            navigate('Login');
        });
            }
    goPayByCard() {
        const { navigate } = this.props.navigation;
            Session.hasLoggedIn().then((result) => {
                Session.getUserInfo().then((user) => {
                    if(user.idCardChecked === true 
                        && user.pictureIdentification === true
                        && user.attributes.paymentMethod.UNIONPAY ===1 ){
                            navigate('PayByCard');
                            return;
                        }
                    if(user.idCardChecked != true){
                        this.refs.toast.show("您当前尚未完成实名认证,点击我的-实名认证和银行卡绑定完善信息");
                        return;
                    }
                    if(user.pictureIdentification != true){
                        this.refs.toast.show("您当前尚未完成身份证上传，点击我的-上传身份证去完成身份证审核");
                        return;
                    }
                    if(user.attributes.paymentMethod.UNIONPAY !=1 )
                    {
                    if(user.attributes.paymentMethod.UNIONPAY == 2 )
                    {
                        this.refs.toast.show("收款银行卡不支持");
                    }
                    if(user.attributes.paymentMethod.UNIONPAY == 3 )
                    {
                        this.refs.toast.show("审核中");
                    }
                    if(user.attributes.paymentMethod.UNIONPAY == 4 )
                    {
                        this.refs.toast.show("证件不可用");
                    }
                    if(user.attributes.paymentMethod.UNIONPAY == 5 )
                    {
                        this.refs.toast.show("收款银行卡无效");
                    }
                    if(user.attributes.paymentMethod.UNIONPAY == 6 )
                    {
                        this.refs.toast.show("身份证不可用");
                    }
                    if(user.attributes.paymentMethod.UNIONPAY == 7 )
                    {
                        this.refs.toast.show("审核失败");
                    }
                    if(user.attributes.paymentMethod.UNIONPAY == 0 )
                    {
                        this.refs.toast.show("银联支付正在审核");
                    }
                    if(user.attributes.paymentMethod.UNIONPAY == 8 )
                    {
                        this.refs.toast.show("无可用通道");
                    }
                        return;
                    }
                });
            },(err)=>{
                navigate('Login');
            });
    }
    goPayDetail(paymentId) {
        const { navigate } = this.props.navigation;
        if (paymentId !== 0) {
            navigate('Receivables_detail', { paymentId: paymentId })
        } else {
        }
    }
    goBill(){
        const { navigate } = this.props.navigation;
            Session.hasLoggedIn().then((result) => {
                navigate('Bill', { name: 'Bill' });
            },(err)=>{
                navigate('Login');
            });
    }
    goDetail(){
        const { navigate } = this.props.navigation;
            Session.hasLoggedIn().then((result) => {
                navigate('Detail', { name: 'Detail' })
            },(err)=>{
                navigate('Login');
            });
    }
    _onRefresh() {
    }
    showLo() {
        this.refs.toast.show("该功能尚未开放，敬请期待");
    }
    render() {
        const { navigate } = this.props.navigation;
        let noDataView = (
                <View style={{alignItems:'center', height: screenHeight - 300}}>
                    <Image style={styles.listNoDataIcon} source={Resource.image.ICON_NO_DATA}/>
                    <Text style={styles.listNoData}>你还没有数据</Text>
                </View>
        )
        let  receivableItem = (
            <TouchableOpacity style={styles.listItem} onPress={() => navigate('RealReceivablesDetail')}>
            <View style={styles.pannel}>
                <View style={styles.pannelLeft}>
                    <Image style={styles.listItemIcon} source={Resource.image.ICON_STAR1} />
                </View>
                <View style={styles.pannelRight}>
                    <Text style={[commonStyle.text,styles.listItemTitle]}>{this.state.receivable.subject}</Text>
                    <Text style={styles.listItemTime}>{moment(this.state.receivable.createAt * 1000).format('YYYY-MM-DD HH:mm:ss')}</Text>
                    <Text style={[commonStyle.text,styles.listItemContent]}>收款{this.state.receivable.amount}元</Text>
                </View>
            </View>
            <View style={styles.listItemMore}>
                <Text style={styles.detail}>...</Text>
            </View>
        </TouchableOpacity>
        )
        let  spendItem = (
            <TouchableOpacity style={styles.listItem} onPress={() => this.goPayDetail(this.state.spend.paymentId)}>
                <View style={styles.pannel}>
                    <View style={styles.pannelLeft}>
                        <Image style={styles.listItemIcon} source={Resource.image.ICOM_CONSUME} />
                    </View>
                    <View style={styles.pannelRight}>
                        <Text style={styles.listItemTitle}>{this.state.spend.subject}</Text>
                        <Text style={styles.listItemTime}>{moment(this.state.spend.createAt * 1000).format('YYYY-MM-DD HH:mm:ss')}</Text>
                        <Text style={styles.listItemContent}>消费{this.state.spend.amount}元</Text>
                    </View>
                </View>
                <View style={styles.listItemMore}>
                    <Text style={styles.detail}>...</Text>
                </View>
            </TouchableOpacity>
        )
        let profitItem = (
            <TouchableOpacity style={styles.listItem} onPress={() => this.goDetail()}>
                <View style={styles.pannel}>
                    <View style={styles.pannelLeft}>
                        <Image style={styles.listItemIcon} source={Resource.image.ICOM_SHOUYI} />
                    </View>
                    <View style={styles.pannelRight}>
                        <Text style={styles.listItemTitle}>实时收益</Text>
                        <Text style={styles.listItemContent}>{this.state.profit.last4NumberPhone}消费{this.state.profit.commissionSource}元</Text>
                        <Text style={commonStyle.text}>+ {this.state.profit.commission} 元</Text>
                    </View>
                </View>
                <View style={styles.listItemMore}>
                    <Text style={styles.detail}>...</Text>
                </View>
            </TouchableOpacity>
            )
            let receivableAmount = this.state.receivable.amount;
            let spendAmount = this.state.spend.amount;
            let profitAmount = this.state.profit.amount;
        return (
            <ScrollView style={commonStyle.container}>
            <Toast ref="toast" position='top' opacity={0.8} />
                <View style={[styles.row, styles.primary]}>
                    <TouchableOpacity onPress={() => this.goPayByCode()} disabled={this.state.dbclick} style={styles.col6}>
                        <View style={{ alignItems: "center" }}>
                            <Image style={styles.icon} source={Resource.image.ICON_BARCODE} />
                            <Text style={[commonStyle.text, styles.text]}>二维码收款</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() =>this.goPayByCard()} disabled={this.state.dbclick} style={styles.col6}>
                        <View style={{ alignItems: "center" }}>
                            <Image style={styles.icon} source={Resource.image.ICON_SHIELD} />
                            <Text style={[commonStyle.text, styles.text]}>银联快捷</Text>
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={[styles.row1, styles.pannelRight]}>
                    <View style={styles.col3}>
                        <TouchableOpacity disabled={this.state.dbclick}
                         onPress={() =>this.goBill()}>
                            <View style={{ alignItems: "center" }}>
                                <Image style={styles.bottomIcon} source={Resource.image.ICON_BILL} />
                                <Text style={[commonStyle.text, styles.textNew]}>我的账单</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.col3}>
                        <TouchableOpacity disabled={this.state.dbclick}
                         onPress={() =>this.goDetail()}>
                            <View style={{ alignItems: "center" }}>
                                <Image style={styles.bottomIcon} source={Resource.image.ICON_INCOME} />
                                <Text style={[commonStyle.text, styles.textNew]}>分润明细</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.col3}>
                    <TouchableOpacity disabled={this.state.dbclick}
                         onPress={() =>this.showLo()}>
                        <View style={{ alignItems: "center" }}>
                            <Image style={styles.bottomIcon} source={Resource.image.ICON_TIMES} />
                            <Text style={[commonStyle.text, styles.textNew]}>账单还款</Text>
                        </View>
                    </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.row2}>
                   {receivableAmount == 0&&spendAmount == 0&&profitAmount == 0||this.state.isLoggedIn==false ? noDataView :null} 
                   {this.state.isLoggedIn==true&&receivableAmount !=0?receivableItem:null}
                   { this.state.isLoggedIn==true&&spendAmount!=0?spendItem:null}
                   { this.state.isLoggedIn==true&&profitAmount!=0?profitItem:null}
                </View>
            </ScrollView >
        );
    }
}
    const styles = StyleSheet.create({
        container: {
            paddingLeft: 0,
            backgroundColor: "#F4F4F4",
            height: screenHeight,
        },
        primary: {
            height: 140,
            backgroundColor: "#0076ff",
        },
        row: {
            flex: 0,
            flexDirection: 'row',
            flexWrap: 'nowrap',
            height: 80,
            backgroundColor: "#fff"
        },
        row1: {
            flex: 0,
            height: 100,
            flexDirection: 'row',
            backgroundColor: "#fff",
            marginTop: 10,
        },
        row2: {
            flex: 0,
            backgroundColor: "#fff",
            marginTop: 10,
        },

        col6: {
            alignSelf: 'center',
            alignItems: 'center',
            width: '50%',
        },
        col3: {
            alignSelf: 'center',
            alignItems: 'center',
            width: '33%',
        },
        icon: {
            height: 45,
            width: 45,
            shadowOpacity: 1,
            shadowRadius: 1,
            shadowColor: "black",
            shadowOffset: { width: 0, height: 1 }
        },
        bottomIcon: {
            height: 30,
            width: 30,
        },
        text: {
            marginTop: 10,
            color: "#fff",
        },
        textNew: {
            marginTop: 10,
            color: "#4D5256",
        },
        list: {
            marginTop: 10,
            //height: screenHeight - 150 - 200 - 32,
        },
        scrollViewContainer: {

        },
        listItem: {
            marginBottom: 5,
        },
        pannel: {
            flex: 0,
            flexDirection: 'row',
            flexWrap: 'nowrap',
            backgroundColor: "#fff"
        },
        pannelLeft: {
            padding: 15,
        },
        listItemIcon: {
            height: 30,
            width: 30,
        },
        pannelRight: {
            paddingTop: 10,
            paddingBottom: 10,
        },
        listNoDataIcon: {
            width: 60,
            height: 60,
            marginTop: 90
        },
        listNoData: {
            marginTop: 10,
        },
        listItemTitle: {
            marginBottom: 5,
        },
        listItemTime: {
            fontSize: 14,
            color: "#999",
            marginBottom: 5,
        },
        listItemContent: {
            marginBottom: 5,
        },
        listItemMore: {
            margin: 0,
            position: 'absolute',
            right: 20,
            top: 5
        },
        detail: {
            fontSize: 30,
        }
    });

    const mapStateToProps = state => ({
        isLoggedIn: state.user.login.isLoggedIn
    });
    const mapDispatchToProps = dispatch => ({
        dispatch: dispatch,
        // 收款
        receivable: () => dispatch(user.realReceivable()),
        // 消费
        spend: () => dispatch(user.realSpend()),
        // 收益
        profit: () => dispatch(user.realProfit()),
        //退出
        logout: () => dispatch(user.logout())
    });
    export default connect(mapStateToProps, mapDispatchToProps)(Main);