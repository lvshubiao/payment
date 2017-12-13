/**
 * 我的店铺
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
    Dimensions,
    TouchableOpacity
} from 'react-native';

import {
    Grid,
    Row,
    Col,
    Button,
    Card
} from 'react-native-elements';
import Session from '../common/session';
import { connect } from 'react-redux';
import { qrcode, user } from '../actions';
import config from '../config';
import { PaymentByYiMaFu } from '../constants';
import Resource from '../../resource/index';
import { NavigationActions } from 'react-navigation'
import { ACTION_LOADINGD, ACTION_SUCCESS, ACTION_FAILED } from '../constants';

let screenWidth = Dimensions.get('window').width;
let screenHeight = Dimensions.get('window').height;

class Store extends Component {
    static navigationOptions = {
        title: '我的店铺',
        headerTitleStyle: { alignSelf: 'center' },
    }
    constructor() {
        super();
        this.state = {
            myStoreUrl: '',
            error: '',
            isLogin:""
        };
    }
    componentDidMount() {
        const { navigate } = this.props.navigation;
        Session.hasLoggedIn().then((result) => {
            this.setState({isLogin:true});
        }, (err) => {
            this.setState({isLogin:false});
        });
        Session.getUserInfo().then((user) => {
            let userId = user.userId;
            let myStoreUrl = config.serverURL + `/qrcodes/${userId}/${PaymentByYiMaFu}`;
            this.setState({
                myStoreUrl: myStoreUrl
            })
            const promise = this.props.getUrl(myStoreUrl);
            promise.then((data) => {
            }, (err) => {
                this.setState({
                    error: err
                })
            });
        });
    }
    componentWillUnmount() {

    }
    render() {
        const { navigate } = this.props.navigation;
        let notLoginView = (
            <View>
                <TouchableOpacity onPress={() => navigate("Login")}>
                <Image style={styles.listNoDataIcon} source={Resource.image.ICON_NO_DATA}/>
                    <Text style={styles.listNoData}>你还没有登录，点击去登录</Text>
                 </TouchableOpacity>
              </View>
        );
        let rightView = (
            <View>
                <View style={[styles.row, styles.mtLg]}>
                    <Text style={styles.title}>扫一扫下面二维码向我付款</Text>
                </View>
                <View style={styles.code}>
                    <Image style={styles.myStorecode} source={{ 'uri': this.state.myStoreUrl }} />
                </View>
                <View style={styles.row}>
                    <Text style={styles.remindDesc}>安全收款码</Text>
                </View>
                <View style={[styles.row, styles.mLg]}>
                    <View style={styles.mr}>
                        <Image style={styles.iconPay} source={Resource.image.ICON_WEBCHAT} />
                    </View>
                    <View style={styles.ml}>
                        <Image style={styles.iconPay} source={Resource.image.ICON_ALIPAY} />
                    </View>
                </View>
            </View>
        );

        let errorView = (
            <View>
                <Image style={styles.listNoDataIcon} source={Resource.image.ICON_NO_DATA}/>
                    <Text style={styles.titleV}>您还尚未开通该服务</Text>
            </View>
        );

        return (
            <View style={styles.container}>
                <View style={styles.primary}>
                    <View style={styles.mt}>
                        <Text style={styles.storeName}>商户收款码</Text>
                    </View>
                    <View style={styles.mt}>
                        <Text style={styles.remind}>该功能用于商户当面收款</Text>
                    </View>
                </View>
                {
                    (this.state.isLogin)?(
                 this.state.error.length > 0 ? errorView : rightView
                    ):(notLoginView)
                }
                
            </View>
        );
    }

}
const styles = StyleSheet.create({
    container: {
        paddingLeft: 0,
        backgroundColor: '#fff',
        flex: 1
    },
    primary: {
        flex: 0,
        alignItems: "center",
        justifyContent: 'center',
        height: 120,
        flexDirection: 'column',
        flexWrap: 'nowrap',
        backgroundColor: "#0076ff",
    },
    listNoDataIcon: {
        width: 120,
        height:120,
        marginTop: 90,
        marginLeft:(screenWidth - 120)/2
    },
    listNoData: {
        marginTop: 30,
        color:"#0076ff",
        fontSize:16,
        textAlign: "center",
        width:screenWidth,
        height:70,
        lineHeight:25
    },
    mt: {
        marginTop: 20,
    },
    mr: {
        marginRight: 10,
    },
    ml: {
        marginLeft: 10,
    },
    mtLg: {
        marginTop: 20,
    },
    errV: {
        marginTop: screenHeight / 2 - 150,
    },
    mLg: {
        margin: 20,
    },
    row: {
        flex: 0,
        alignItems: "center",
        justifyContent: 'center',
        flexDirection: 'row',
        flexWrap: 'nowrap',
        marginTop: 10,
    },
    storeName: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#fff"
    },
    remind: {
        fontSize: 16,
        color: "#D0D4D9"
    },
    remindDesc: {
        fontSize: 16,
        color: "#FD9727"
    },
    title: {
        fontSize: 18,
        paddingTop: 5,
        paddingBottom: 10
    },
    titleV: {
        marginTop: 30,
        color:"#0076ff",
        fontSize:16,
        textAlign: "center",
        width:screenWidth,
        height:70,
        lineHeight:25
    },
    qrcord: {
        width: 50,
        height: 50,
        padding: 10
    },
    iconPay: {
        width: 40,
        height: 40,
        padding: 10,
    },
    buttonGroup: {
        paddingTop: 5,
        paddingLeft: 20,
        paddingRight: 20,
    },
    code: {
        marginTop: 10,
        justifyContent: 'center',
        borderWidth: 0,
        alignItems: "center"
    },
    myStorecode: {
        width: screenWidth * 0.6,
        height: screenWidth * 0.6
    }
});
const mapStateToProps = state => ({
    status: state.qrcode.status,
    error: state.qrcode.error,
    url: state.qrcode.url
});
const mapDispatchToProps = dispatch => ({
    dispatch: dispatch,
    getStoreQrcode: (userId) => dispatch(qrcode.getStoreQrcode(userId)),
    getUrl: (url) => dispatch(user.getUrl(url))
});
export default connect(mapStateToProps, mapDispatchToProps)(Store);