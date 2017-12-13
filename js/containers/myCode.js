import React, { Component } from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    TextInput,
    Button,
    ListView,
    Dimensions,
    PixelRatio,
    Image,
    TouchableOpacity
} from 'react-native';
import { connect } from 'react-redux';
import { ACTION_LOADINGD, ACTION_SUCCESS, ACTION_FAILED } from '../constants';
import { qrcode } from '../actions';
import Resource from '../../resource/index';
import config from '../config';
import Session from '../common/session';
import { PaymentByYiMaFu } from '../constants';
var screenWidth = Dimensions.get("window").width;
var screenHeight = Dimensions.get("window").height;
var token = null;
var userId = null;
class myCode extends Component {

    static navigationOptions = ({ navigation }) => ({
        title: '我的二维码',
        headerLeft: (
            <TouchableOpacity onPress={() => {
                navigation.goBack();
            }}
            >
                <Image style={{ width: 30, height: 30, marginLeft: 10 }}
                    source={Resource.image.ICON_BACK}
                />
            </TouchableOpacity>
        ),
        headerRight: (
            <View style={{ height: 30, width: 55, justifyContent: 'center', paddingRight: 15 }} />
        ),
        headerTitleStyle: { alignSelf: 'center' },
    });
    constructor() {
        super();
        this.state = {
            realName: null,
            userid: null,
            url1: ""
        };
    }
    componentDidMount() {
        Session.getUserInfo().then((user) => {
            userId = user.userId;
            let myStoreUrl = config.serverURL + `/qrcodes/${userId}/Sign`;
            this.setState({
                url1: myStoreUrl,
                realName: user.realName
            });
        });
    }
    render() {
        return (
            <View style={styles.container}>
                <Image style={styles.backgroundImage} source={Resource.image.ICON_PAYBACK} />
                <Text style={styles.war}>{this.state.realName} 邀请您一起赚钱了</Text>
                <Image style={styles.qrcode} source={{ 'uri': this.state.url1 }} />
                <Text style={styles.war}>打开微信扫一扫</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F4F4F4'
    },
    qrcode: {
        marginTop: 10,
        width: 200,
        height: 200,
        marginLeft: (screenWidth - 200) / 2,
    },
    war: {
        marginLeft: 20,
        marginTop: 10,
        marginRight: 20,
        color: "#6A737D",
        fontSize: 16,
        textAlign: 'center',
    },
    backgroundImage: {
        width: screenWidth,
        height: 200
    }
});
/**
 * 这里是知道map到props的state
 * @param {*} state 
 */
const mapStateToProps = state => ({
    status: state.qrcode.status,
    error: state.qrcode.error,
});

/**
 * 这里指定要map到props的事件
 * 一般情况下该conponent需要发送的action事件都应该定义在这里
 * 如果偷懒不定义这个方法，那么在component中，直接引用dispatch去发送action
 * @param {*} dispatch 
 */
const mapDispatchToProps = dispatch => ({
    dispatch: dispatch,
});

/**
 * 如果没有传入mapDispatchToProps，默认会把dispatch map到props
 * 如果传入的话，必须显示的指定，否则会undefined
 */
export default connect(mapStateToProps, mapDispatchToProps)(myCode);