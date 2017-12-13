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
} from 'react-native';
import Resource from '../../resource/index';
import { connect } from 'react-redux';
import { List, ListItem,Button } from 'react-native-elements';
import { user } from '../actions';
import Session from '../common/session';
import { NavigationActions } from 'react-navigation'
import { ACTION_LOADINGD, ACTION_SUCCESS, ACTION_FAILED } from '../constants';
const moment = require('moment');
var screenWidth = Dimensions.get("window").width;
var screenHeight = Dimensions.get("window").height;
var navigate = null;
class Profile extends Component {
    static navigationOptions  = ({ navigation }) => ({
        title: '设置',
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
            createDate: '',
            systemVersion: ''
        }
    }
    componentDidMount() {
        Session.getUserInfo().then((user) => {
            let time = user.createTime;
            this.setState({
                createDate: moment(time * 1000).format('YYYY-MM-DD HH:mm')
            })
        })
    }
    componentWillUnmount() {

    }

    gotoAbout() {
        const { navigate } = this.props.navigation;
        navigate('About');
    }

    logout() {
        const { navigate } = this.props.navigation;
        let promise = this.props.logout();
        promise.then((res) => {
            Session.clearSession();
            const resetAction = NavigationActions.reset({
                index: 0,
                actions: [
                    NavigationActions.navigate({ routeName: 'TabBar' }),
                ]
            });
            this.props.navigation.dispatch(resetAction);
        }, (err) => {
        });
    }

    gotoModifyPassword() {
        const { navigate } = this.props.navigation;
        navigate('ModifyPassword')
    }

    gotoBanding() {
        const { navigate } = this.props.navigation;
        navigate('Banding')
    }

    render() {
        const { navigate } = this.props.navigation;
        return (
            <View style={styles.container}>
                <TouchableOpacity onPress={() =>
                    this.gotoModifyPassword()
                }>
                    <ListItem
                        titleStyle={styles.titleStyle}
                        style={styles.itemStyle}
                        title="修改密码" />
                </TouchableOpacity>
                <ListItem
                    titleStyle={styles.titleStyle}
                    style={styles.itemStyle1}
                    title="注册日期"
                    hideChevron={true}
                    subtitle={
                        <View>
                            <Text style={styles.subTitle}>{this.state.createDate}</Text>
                        </View>
                    }
                />
                {/* <TouchableOpacity onPress={() => this.gotoBanding()}>
                    <ListItem
                        titleStyle={styles.titleStyle}
                        style={styles.itemStyle3}
                        title="更换绑定"
                    />
                </TouchableOpacity> */}
                <TouchableOpacity onPress={() => navigate('Service')}>
                    <ListItem
                        titleStyle={styles.titleStyle}
                        style={styles.itemStyle2}
                        title="帮助"
                    />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.gotoAbout()}>
                    <ListItem
                        titleStyle={styles.titleStyle}
                        style={styles.itemStyle1}
                        title="关于"
                    />
                </TouchableOpacity>
                <Button  
                title='退出'
                color="#fff"
                backgroundColor="#0076ff"
                borderRadius={4}
                containerViewStyle={{
                  marginTop:20
                }}
                onPress={() => this.logout()}/>
                <View>
                    {
                        (this.props.status === ACTION_FAILED) && (
                            <Text style={{ color: '#f00' }}>
                                {this.props.error}
                            </Text>)
                    }
                </View>
                {/* <CountDown/> */}
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
    itemStyle: {
        backgroundColor: "#FFFFFF",
        marginTop: 20,
        paddingTop: 5,
        paddingBottom: 5,
    },
    itemStyle3: {
        backgroundColor: "#FFFFFF",
        marginTop: 1,
        paddingTop: 5,
        paddingBottom: 5,
    },
    itemStyle1: {
        backgroundColor: "#FFFFFF",
        marginTop: 1,
        paddingTop: 5,
        paddingBottom: 5,
    },
    itemStyle2: {
        backgroundColor: "#FFFFFF",
        marginTop: 20,
        paddingTop: 5,
        paddingBottom: 5,
    },
    titleStyle: {
        marginTop: 10,
        marginBottom: 10,
        fontSize: 15,
        color: "#000000",
    },
    subTitle: {
        marginLeft: screenWidth - 260,
        marginTop: -30,
        fontSize: 15,
        height: 30,
        color: "#0076ff",
        textAlign: "right",
        marginRight: 10,
    },
    buttonStyle: {
        marginTop: 30,
        backgroundColor: "#0076ff",
        borderRadius: 10,
        width: screenWidth - 40,
        alignItems: 'center',
        justifyContent:'center',
        height: 40,
        marginLeft: 20,
        shadowOpacity: 1,
        shadowRadius: 1,
        shadowColor:"black",
        shadowOffset:{width:0,height:1}
    },
    text: {
        color: "#FFFFFF",
        textAlign: "center",
        fontSize: 16,
        lineHeight: 32,
    }
});

const mapStateToProps = state => ({
    status: state.user.login.status,
    error: state.user.login.error
});

const mapDispatchToProps = dispatch => ({
    dispatch: dispatch,
    logout: () => dispatch(user.logout())
});


export default connect(mapStateToProps, mapDispatchToProps)(Profile);