/**
 * 欢迎页
 * @flow
 * **/
import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image,
    InteractionManager,
    Platform,
    Dimensions,
    PixelRatio,
    ListView,
    TouchableOpacity,
    Button,
    ScrollView,
} from 'react-native';
import Resource from '../../resource/index';
import { connect } from 'react-redux';
import { List, ListItem, colors } from 'react-native-elements';
import Session from '../common/session';
import { user } from '../actions';
import Toast, { DURATION } from 'react-native-easy-toast';
import PubSub from 'pubsub-js';
import { TOPIC_HTTP_STATUS } from '../constants';

var screenWidth = Dimensions.get("window").width;
var screenHeight = Dimensions.get("window").height;
var navigate = null;
class Profile extends Component {

    static navigationOptions = ({ navigation }) => ({
        title: '我的',
        headerRight: (
            <TouchableOpacity onPress={() => {
                let { navigate } = navigation;
                Session.hasLoggedIn().then((result) => {
                    navigate('Settings');
                }, (err) => {
                    navigate('Login');
                });
            }}
            >
                <Image style={{ width: 30, height: 30, marginRight: 10 }}
                    source={Resource.image.ICON_SET}
                />
            </TouchableOpacity>
        ),
        headerLeft: (
            <View style={{height: 30,width: 55,justifyContent: 'center',paddingRight:15} }/>
        ),
        headerTitleStyle:{alignSelf:'center'},
    });

    constructor(props) {
        super(props);
        this.state = {
            realName: null,
            phone: null,
            idCardChecked: false,
            settlementAmount: 0,
            receivableAmount: 0,
            isLogin: false,
            idCardChecked: false,
            ispicChecked: false,
        };
    }
    runTimer() {
        this.timer = setTimeout(
            () => {
                Session.getUserInfo().then((user) => {
                    this.setState({ realName: user.realName, phone: user.phone, idCardChecked: user.idCardChecked });
                    this.props.getMonthBill().then((bill) => {
                        this.setState({ settlementAmount: bill.commissionAmount, receivableAmount: bill.receivableAmount });
                    });
                }, (err) => {
                    this.setState({ realName: "未实名", phone: null, idCardChecked: null, settlementAmount: 0, receivableAmount: 0 });
                });
                this.runTimer();
            },
            10000
        );
    }

    componentDidMount() {
        Session.hasLoggedIn().then((result) => {
            this.setState({ isLogin: true});
            this.runTimer();
            Session.getUserInfo().then((user) => {
                this.setState({ realName: user.realName, phone: user.phone, idCardChecked: user.idCardChecked,ispicChecked:user.pictureIdentification});
                this.props.getMonthBill().then((bill) => {
                    this.setState({ settlementAmount: bill.commissionAmount, receivableAmount: bill.receivableAmount });
                });
            }, (err) => {
                this.setState({ realName: "未实名", phone: null, idCardChecked: null, settlementAmount: 0, receivableAmount: 0 });
            });
        }, (err) => {
            this.setState({ isLogin: false ,settlementAmount: 0, receivableAmount: 0});
            this.timer && clearTimeout(this.timer);
        });
    }
    componentWillUnmount() {
        this.timer && clearTimeout(this.timer);
    }

    render() {
        const { navigate } = this.props.navigation;
        if (this.state.isLogin === true) {
            header = (
                <View>
                    {
                        (!this.state.ispicChecked && this.state.idCardChecked) && (
                            <TouchableOpacity style={styles.touchWarn} onPress={() => navigate('UploadIdcard')}>
                                <Text style={styles.warns}>您尚未上传身份证，点击前往</Text>
                            </TouchableOpacity>
                        )
                    }
                    {
                        (!this.state.idCardChecked) && (
                            <TouchableOpacity style={styles.touchWarn} 
                            onPress={() => {   
                                Session.hasLoggedIn().then((result) => {
                                Session.getUserInfo().then((user) =>{
                                    Session.setUserInfo(user).then(()=>{
                                        navigate('Identification');
                                    });
                                },(err)=>{
                                    navigate('Login');
                                });
                            }, (err) => {
                                navigate('Login');
                            });
                            }}>
                                <Text style={styles.warns}>您尚未进行实名认证，点击前往</Text>
                            </TouchableOpacity>
                        )
                    }
                    <List style={styles.header}>
                        <ListItem
                            style={styles.headerListItem}
                            roundAvatar
                            hideChevron={true}
                            subtitle={
                                <View>
                                    <Image style={styles.icon}
                                        source={Resource.image.ICON_AVATAR}
                                    />
                                    {
                                        (!this.state.idCardChecked) ? (
                                            <Text style={styles.name}>未实名</Text>
                                        ) : (
                                                <Text style={styles.name}>{this.state.realName}</Text>
                                            )
                                    }
                                    {
                                        (this.state.phone) && (
                                            <Text style={styles.phoneNumber}>{this.state.phone}</Text>
                                        )
                                    }

                                </View>
                            }
                        />
                    </List>
                </View>
            );
        } else {
            header = (

                <List style={styles.header}>
                    <ListItem
                        style={styles.headerListItem1}
                        hideChevron={true}
                        subtitle={
                            <View>
                                <Image style={styles.icon}
                                        source={Resource.image.ICON_AVATAR}
                                    />
                                <TouchableOpacity style={styles.touch} onPress={() => navigate('Login')}>
                                    <Text style={styles.name1}>点击去登录</Text>
                                </TouchableOpacity>
                            </View>
                        }
                    />
                </List>
            );
        }
        return (
            <View style={styles.container}>
                <Toast ref="toast" position='top' opacity={0.8} />
                <ScrollView style={styles.container}>
                    <View>
                        {header}
                    </View>
                    <View>
                        <List style={styles.list}>
                            <TouchableOpacity onPress={() => {
                                Session.hasLoggedIn().then((result) => {
                                    navigate('Bill');
                                }, (err) => {
                                    navigate('Login');
                                });
                            }
                            }>
                                <ListItem
                                    style={styles.listItem}
                                    roundAvatar
                                    title="本月收账"
                                    titleStyle={styles.fontstyle}
                                    avatar={Resource.image.ICON_BILL}
                                    avatarStyle={styles1.avatarStyle}
                                    avatarOverlayContainerStyle={styles1.avatarOverlayContainerStyle}
                                    subtitle={
                                        <View>
                                            <Text style={styles1.subTitle}>{"¥ " + this.state.receivableAmount}</Text>
                                        </View>
                                    }
                                />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => {
                                Session.hasLoggedIn().then((result) => {
                                    navigate('Detail');
                                }, (err) => {
                                    navigate('Login');
                                });
                            }
                            }>
                                <ListItem
                                    style={styles.listItem}
                                    roundAvatar
                                    title="近期分润"
                                    titleStyle={styles.fontstyle}
                                    avatar={Resource.image.ICON_PAYMENT}
                                    avatarStyle={styles1.avatarStyle}
                                    avatarOverlayContainerStyle={styles1.avatarOverlayContainerStyle}
                                    subtitle={
                                        <View>
                                            <Text style={styles1.subTitle2}>{"¥ " + this.state.settlementAmount}</Text>
                                        </View>
                                    }
                                />
                            </TouchableOpacity>
                        </List>
                        <List style={styles.list}>
                            <TouchableOpacity onPress={() => {
                                Session.hasLoggedIn().then((result) => {
                                    navigate('BankCard');
                                }, (err) => {
                                    navigate('Login');
                                });
                            }
                            }>
                                <ListItem
                                    style={styles.listItem}
                                    roundAvatar
                                    title="银行卡"
                                    titleStyle={styles.fontstyle}
                                    avatar={Resource.image.ICON_BANKCARD}
                                    avatarStyle={styles1.avatarStyle}
                                    avatarOverlayContainerStyle={styles1.avatarOverlayContainerStyle}
                                />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => {
                                Session.hasLoggedIn().then((result) => {
                                    Session.getUserInfo().then((user) =>{
                                        Session.setUserInfo(user).then(()=>{
                                            navigate('Identification');
                                        });
                                    },(err)=>{
                                        navigate('Login');
                                    });
                                }, (err) => {
                                    navigate('Login');
                                });
                            }
                            }>
                                <ListItem
                                    style={styles.listItem}
                                    roundAvatar
                                    title="实名认证和银行卡绑定"
                                    titleStyle={styles.fontstyle}
                                    avatar={Resource.image.ICON_NAMEREG}
                                    avatarStyle={styles1.avatarStyle}
                                    avatarOverlayContainerStyle={styles1.avatarOverlayContainerStyle}
                                />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => {
                                Session.hasLoggedIn().then((result) => {
                                    Session.getUserInfo().then((user) => {
                                        this.setState({
                                            idCardChecked: user.idCardChecked,
                                            ispicChecked: user.pictureIdentification
                                        });
                                        if (this.state.idCardChecked === false) {
                                            this.refs.toast.show('请先完成实名认证!');
                                        } else {
                                            if (this.state.ispicChecked === true) {
                                                this.refs.toast.show('您已完成实名认证!');
                                            } else {
                                                navigate('UploadIdcard');
                                            }
                                        }
                                    });
                                }, (err) => {
                                    navigate('Login');
                                });
                            }
                            }>
                                <ListItem
                                    style={styles.listItem}
                                    roundAvatar
                                    title="上传身份证"
                                    titleStyle={styles.fontstyle}
                                    avatar={Resource.image.ICON_NAMEREG}
                                    avatarStyle={styles1.avatarStyle}
                                    avatarOverlayContainerStyle={styles1.avatarOverlayContainerStyle}
                                />
                            </TouchableOpacity>
                        </List>
                        <List style={styles.list}>
                            <TouchableOpacity onPress={() => {
                                Session.hasLoggedIn().then((result) => {
                                    navigate('Team');
                                }, (err) => {
                                    navigate('Login');
                                });
                            }
                            }>
                                <ListItem
                                    style={styles.listItem}
                                    roundAvatar
                                    title="我的团队"
                                    titleStyle={styles.fontstyle}
                                    avatar={Resource.image.ICON_TEAM}
                                    avatarStyle={styles1.avatarStyle}
                                    avatarOverlayContainerStyle={styles1.avatarOverlayContainerStyle}
                                />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => {
                                Session.hasLoggedIn().then((result) => {
                                    navigate('MyCode');
                                }, (err) => {
                                    navigate('Login');
                                });
                            }
                            }>
                                <ListItem
                                    style={styles.listItem}
                                    roundAvatar
                                    title="我的二维码"
                                    titleStyle={styles.fontstyle}
                                    avatar={Resource.image.ICON_BCODE}
                                    avatarStyle={styles1.avatarStyle}
                                    avatarOverlayContainerStyle={styles1.avatarOverlayContainerStyle}
                                />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => {
                                Session.hasLoggedIn().then((result) => {
                                    navigate('Share');
                                }, (err) => {
                                    navigate('Login');
                                });
                            }
                            }>
                                <ListItem
                                    style={styles.listItem}
                                    roundAvatar
                                    title="分享推广"
                                    titleStyle={styles.fontstyle}
                                    avatar={Resource.image.ICON_GENERA}
                                    avatarStyle={styles1.avatarStyle}
                                    avatarOverlayContainerStyle={styles1.avatarOverlayContainerStyle}
                                />
                            </TouchableOpacity>
                        </List>
                        <List style={styles.list}>
                        <TouchableOpacity onPress={() => {
                                Session.hasLoggedIn().then((result) => {
                                    navigate('Service');
                                }, (err) => {
                                    navigate('Login');
                                });
                            }
                            }>
                            <ListItem
                                style={styles.listItem}
                                roundAvatar
                                title="客服中心"
                                titleStyle={styles.fontstyle}
                                avatar={Resource.image.ICON_SERVICE}
                                avatarStyle={styles1.avatarStyle}
                                avatarOverlayContainerStyle={styles1.avatarOverlayContainerStyle}
                            />
                            </TouchableOpacity>
                        </List>
                    </View>
                </ScrollView>
            </View>
        );
    }

}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F4F4F4',
        height: screenHeight,
    },
    warns: {
        color: "#fff",
        fontSize: 14,
        textAlign: "center",
        width: screenWidth,
        backgroundColor: "#F7D731",
        height:30,
        lineHeight:24
    },
    touchWarn: {
        marginTop: 0,
        height: 30,
        width: screenWidth,
        alignItems: 'center',
        justifyContent:'center'
    },
    header: {
        backgroundColor: '#0076ff',
    },
    headerListItem: {
        borderWidth: 0,
        paddingTop: 20,
        paddingBottom: 30,
        // shadowOpacity: 1,
        // shadowRadius: 1,
        // shadowColor: "black",
        // shadowOffset: { width: 0, height: 1 }
    },
    headerListItem1: {
        borderWidth: 0,
        paddingTop: 20,
        paddingBottom: 30,
        shadowOpacity: 1,
        shadowRadius: 5,
        shadowColor: "black",
        height: 100,
        shadowOffset: { width: 0, height: 1 }
    },
    icon: {
        width: 60,
        height: 60,
        borderRadius: 30,
        marginTop: 10,
        marginLeft: 20,
        position: "relative",
    },
    fontstyle: {
        fontSize: 14,
    },
    name: {
        marginLeft: 105,
        marginTop: 10,
        fontSize: 23,
        width: screenWidth / 4,
        height: 30,
        position: "absolute",
        color: "#FFFFFF",
    },
    name1: {
        fontSize: 18,
        color: "#FFFFFF",
        textAlign: "center",
        lineHeight:30
    },
    touch: {
        marginTop: 15,
        height: 30,
        position: "absolute",
        marginLeft: (screenWidth - 150) / 2 - 10,
        width: 150,
    },
    phoneNumber: {
        marginTop: 45,
        marginLeft: 105,
        width: screenWidth / 2,
        height: 30,
        fontSize: 16,
        color: "#FFFFFF",
        position: "absolute",
    },
    list: {
        borderTopWidth: 0,
        marginTop: 19,
        backgroundColor: '#fff'
    },
    listItem: {
        paddingTop: 5,
        paddingBottom: 5,
        borderBottomWidth: 1,
        borderColor: '#efefef'
    },
    mTop10: {
        marginTop: 10,
    }
});

const styles1 = StyleSheet.create({
    itemStyle: {
        marginTop: 10,
        backgroundColor: '#FFFFFF',
        height: 40,
        position: "relative",
        borderWidth: 1,
        borderColor: "#FFFFFF",
    },
    itemStyle1: {
        marginTop: 2,
        backgroundColor: '#FFFFFF',
        height: 40,
        position: "relative",
        borderWidth: 1,
        borderColor: "#FFFFFF",
    },
    subTitle: {
        marginLeft: 105,
        marginTop: -17,
        fontSize: 16,
        width: screenWidth - 180,
        height: 30,
        position: "absolute",
        color: "#FF3030",
        textAlign: "right",
    },
    subTitle2: {
        marginLeft: 105,
        marginTop: -17,
        fontSize: 16,
        width: screenWidth - 180,
        height: 30,
        position: "absolute",
        color: "#0076ff",
        textAlign: "right",
    },
    avatarStyle: {
        backgroundColor: "#fff",
        borderRadius: 0,
        width: 25,
        height: 25,
    },
    avatarOverlayContainerStyle: {
        backgroundColor: "#fff",
    }
});
/**
 * 这里是知道map到props的state
 * @param {*} state 
 */
const mapStateToProps = state => ({
    monthBill: state.user.monthBill
});

/**
 * 这里指定要map到props的事件
 * 一般情况下该conponent需要发送的action事件都应该定义在这里
 * 如果偷懒不定义这个方法，那么在component中，直接引用dispatch去发送action
 * @param {*} dispatch 
 */
const mapDispatchToProps = dispatch => ({
    dispatch: dispatch,
    getMonthBill: () => dispatch(user.getMonthBill())
});

/**
 * 如果没有传入mapDispatchToProps，默认会把dispatch map到props
 * 如果传入的话，必须显示的指定，否则会undefined
 */
export default connect(mapStateToProps, mapDispatchToProps)(Profile);