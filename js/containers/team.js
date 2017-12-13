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
import { user } from '../actions';
import { List, ListItem } from 'react-native-elements';
import Resource from '../../resource/index';
import Session from '../common/session';
var screenWidth = Dimensions.get("window").width;
var screenHeight = Dimensions.get("window").height;
var token = null;
class team extends Component {

    static navigationOptions  = ({ navigation }) => ({
        title: '我的团队',
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
            allCount: 0,
            dayNew: 0,
            firstLevel:0,
            secondLevel:0,            
            thirdLevel:0                        
        };
    }
    componentDidMount() {
        const that = this;
        const promise = this.props.getTeam();
        promise.then( (data)=> {
            that.setState({
                allCount: data.allCount,
                dayNew: data.dayNew
            });
            if (data.levelUser.length > 0) {
                data.levelUser.forEach(x => {
                    if (x.level == 1) {
                        this.setState({
                            firstLevel: x.humannumbers || 0
                        })
                    }else if(x.level == 2) {
                        this.setState({
                            secondLevel: x.humannumbers || 0                 
                        })
                    }else {
                        this.setState({
                            thirdLevel: x.humannumbers || 0                    
                        })
                    }
                });
            }
        }, (err) => {
            
        });
    }
    render() {
        Session.getToken().then((kToken) => {
            token = kToken;
        });
        return (
            <View style={styles.container}>
                <Image style={styles.image}  source={Resource.image.ICOM_PLACEHOLDER_IMG} />
                <View style={styles.secStyle}>
                    <Text style={styles.numStyle}>{this.state.dayNew}</Text>
                    <Text style={styles.numStyle1}>今日新增</Text>
                    <Text style={styles.numStyle2}>{this.state.allCount}</Text>
                    <Text style={styles.numStyle3}>团队总数</Text>
                </View>
                <List style={{ backgroundColor: "#F4F4F4" }}>
                    <ListItem
                        style={styles1.itemStyle}
                        hideChevron={true}                        
                        subtitle={
                            <View style={styles1.subtitleView}>
                                <Image style={styles1.icon}
                                    source={Resource.image.ICON_FIRST} />
                                <Text style={styles1.title}>天使伙伴商户</Text>
                                <Text style={styles1.subtitle}>一级</Text>
                                <Text style={styles1.subT}>{this.state.firstLevel}</Text>
                            </View>
                        }
                    />
                    <ListItem
                        style={styles1.itemStyle}
                        hideChevron={true}                        
                        subtitle={
                            <View style={styles1.subtitleView}>
                                <Image style={styles1.icon}
                                    source={Resource.image.ICON_SEC} />
                                <Text style={styles1.title1}>大使伙伴商户</Text>
                                <Text style={styles1.subtitle}>二级</Text>
                                <Text style={styles1.subT}>{this.state.secondLevel}</Text>
                            </View>
                        }
                    />
                    <ListItem
                        style={styles1.itemStyle}
                        hideChevron={true}                        
                        subtitle={
                            <View style={styles1.subtitleView}>
                                <Image style={styles1.icon}
                                    source={Resource.image.ICON_THREAD} />
                                <Text style={styles1.title2}>信使伙伴商户</Text>
                                <Text style={styles1.subtitle}>三级</Text>
                                <Text style={styles1.subT}>{this.state.thirdLevel}</Text>
                            </View>
                        }
                    />
                </List>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F4F4F4',
    },
    image: {
        marginTop: 0,
        marginLeft: 0,
        width: screenWidth,
        height: screenHeight / 6,
        backgroundColor: "#0076ff",
    },
    secStyle: {
        marginTop: 10,
        marginLeft: 0,
        width: screenWidth,
        height: screenHeight / 7,
        backgroundColor: "#0076ff",
    },
    numStyle: {
        marginLeft: screenWidth / 4,
        marginTop: 20,
        width: 40,
        height: 30,
        color: "#FFFFFF",
        fontSize: 20,
        textAlign: 'center',
    },
    numStyle1: {
        marginLeft: screenWidth / 7,
        marginTop: 20,
        width: screenWidth / 3,
        height: 20,
        color: "#FFFFFF",
        textAlign: 'center',
    },
    numStyle2: {
        marginLeft: screenWidth / 3 * 2,
        marginTop: - 70,
        width: 40,
        height: 30,
        color: "#FFFFFF",
        fontSize: 20,
        textAlign: 'center',
    },
    numStyle3: {
        marginLeft: screenWidth / 3 * 1.65,
        marginTop: 20,
        width: screenWidth / 3,
        height: 20,
        color: "#FFFFFF",
        textAlign: 'center',
    }
});
const styles1 = StyleSheet.create({
    itemStyle: {
        marginTop: 10,
        marginLeft: 0,
        backgroundColor: "#FFFFFF",
    },
    title: {
        color: "red",
        fontSize: 23,
        width: 150,
        height: 30,
        marginTop: -50,
        marginLeft: 90,
    },
    title1: {
        color: "blue",
        fontSize: 23,
        width: 150,
        height: 30,
        marginTop: -50,
        marginLeft: 90,
    },
    title2: {
        color: "green",
        fontSize: 23,
        width: 150,
        height: 30,
        marginTop: -50,
        marginLeft: 90,
    },
    subtitle: {
        color: "#CDC9C9",
        fontSize: 20,
        marginTop: 0,
        marginLeft: 90,
    },
    subT: {
        marginLeft: screenWidth - 100,
        marginTop: 30,
        fontSize: 16,
        width: 80,
        height: 20,
        position: "absolute",
        color: "#FF3030",
        textAlign: "right",
    },
    icon: {
        width: 50,
        height: 50,
        marginLeft: 30,
        marginTop: 10,
    },
    subtitleView: {
        height: 80,
    }
});
/**
 * 这里是知道map到props的state
 * @param {*} state 
 */
const mapStateToProps = state => ({
    teamData: state.user.team
});

/**
 * 这里指定要map到props的事件
 * 一般情况下该conponent需要发送的action事件都应该定义在这里
 * 如果偷懒不定义这个方法，那么在component中，直接引用dispatch去发送action
 * @param {*} dispatch 
 */
const mapDispatchToProps = dispatch => ({
    dispatch: dispatch,
    getTeam: () => dispatch(user.getTeam())
});

/**
 * 如果没有传入mapDispatchToProps，默认会把dispatch map到props
 * 如果传入的话，必须显示的指定，否则会undefined
 */
export default connect(mapStateToProps, mapDispatchToProps)(team);