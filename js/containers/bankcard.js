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
    ScrollView
} from 'react-native';

import {
    Grid,
    Row,
    Col,
    Button,
    Card,
    Avatar,

} from 'react-native-elements';
import { connect } from 'react-redux';
import { ACTION_LOADINGD, ACTION_SUCCESS, ACTION_FAILED } from '../constants';
import { card, user } from '../actions';
import Session from '../common/session';
import Service from '../common/service';
import { List, ListItem } from 'react-native-elements';
import Resource from '../../resource/index';
var screenWidth = Dimensions.get("window").width;
var screenHeight = Dimensions.get("window").height;


class bankcard extends Component {
    static navigationOptions  = ({ navigation }) => ({
        title: '银行卡',
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
    //   headerRight: (
    //     <TouchableOpacity onPress={() => {
    //         let { navigate } = navigation;
    //             navigate("AddCard");
    //     }}
    //     >
    //         <Image style={{ width: 25, height: 25, marginRight: 10 }}
    //             source={Resource.image.ICON_ADD}
    //         />
    //     </TouchableOpacity>
    // ),
         headerRight: (
        <TouchableOpacity style={{ width: 25, height: 25, marginRight: 10 }}>
        </TouchableOpacity>
    ),
    headerTitleStyle:{alignSelf:'center'},
      });
    constructor(props) {
        super(props);
        this.state = {
            bankcard: null,
            debitCardBankName: null,
            maskDebitCard: null,
            maskIdCard: null,
            list:[]
        };
    }
    ClickBtn() {
        const { navigate } = this.props.navigation;
        navigate("SwitchCard");
    }
    _renderRow(rowData, sectionID, rowID) {
        if (rowID == 0) {
            var cardTitle = rowData.bankName;
            var subTitle = "信用卡";
            var cardNumber = rowData.maskCardNumber;
            return (
                <View style={styles1.itemStyle}>
                    <Text style={styles1.titleStyle}>{cardTitle}</Text>
                    <Text style={styles1.subStyle}>{subTitle}</Text>
                    <Text style={styles1.numberStyle}>{"************" + cardNumber}</Text>
                    {/* <TouchableOpacity style={styles1.touchStyle} underlayColor={'#FFFFFF'} onPress={ClickBtn}>
                        <Image style={styles1.btnStyle}
                            source={Resource.image.ICON_CLOSE}
                        />
                    </TouchableOpacity> */}
                </View>
            );
        }
        if (rowID == 1) {
            var cardTitle = rowData.bankName;
            var subTitle = "信用卡";
            var cardNumber = rowData.maskCardNumber;
            return (
                <View style={styles2.itemStyle}>
                    <Text style={styles1.titleStyle}>{cardTitle}</Text>
                    <Text style={styles1.subStyle}>{subTitle}</Text>
                    <Text style={styles1.numberStyle}>{"************" + cardNumber}</Text>
                    {/* <TouchableOpacity style={styles1.touchStyle} underlayColor={'#FFFFFF'} onPress={ClickBtn}>
                        <Image style={styles1.btnStyle}
                            source={Resource.image.ICON_CLOSE}
                        />
                    </TouchableOpacity> */}
                </View>
            );
        }
        else {
            var cardTitle = rowData.bankName;
            var subTitle = "信用卡";
            var cardNumber = rowData.maskCardNumber;
            return (
                <View style={styles2.itemStyle}>
                    <Text style={styles1.titleStyle}>{cardTitle}</Text>
                    <Text style={styles1.subStyle}>{subTitle}</Text>
                    <Text style={styles1.numberStyle}>{"************" + cardNumber}</Text>
                    {/* <TouchableOpacity style={styles1.touchStyle} onPress={ClickBtn}>
                        <Image style={styles1.btnStyle}
                            source={Resource.image.ICON_CLOSE}
                        />
                    </TouchableOpacity> */}
                </View>
            );
        }
    }
    componentWillUnmount(){
        this.timer && clearTimeout(this.timer);
    }
    
    runTimer() {
        this.timer = setTimeout(
            () => {
                this.props.getCreditCards().then((user) => {
                    if(user){
                        this.setState({
                            list:user
                        });
                    }
                });
                Session.getUserInfo().then((user) => {
                    this.setState({
                        bankcard: user.attributes,
                        debitCardBankName: user.attributes.debitCardBankName,
                        maskDebitCard: user.attributes.maskDebitCard,
                        maskIdCard: user.attributes.maskIdCard
                    });
                    if(!user.attributes.maskDebitCard){
                        this.setState({bankcard:null});
                    }
                });
                this.runTimer();
            },
           10000
        );
    }
    componentDidMount() {
       this.runTimer();
       this.props.getCreditCards().then((user) => {
        if(user){
            this.setState({
                list:user
            });
        }
    });
    Session.getUserInfo().then((user) => {
        this.setState({
            bankcard: user.attributes,
            debitCardBankName: user.attributes.debitCardBankName,
            maskDebitCard: user.attributes.maskDebitCard,
            maskIdCard: user.attributes.maskIdCard
        });
        if(!user.attributes.maskDebitCard){
            this.setState({bankcard:null});
        }
    });
    }
    render() {
        const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        const { navigate } = this.props.navigation;
        let noDataView = (
            <View style={{alignItems:'center'}}>
                <Image style={{  width: 60,height: 60, marginTop: 240}} source={Resource.image.ICON_NO_DATA}/>
                <Text style={{marginTop: 10}}>你还没有银行卡信息</Text>
            </View>
        )
        return (
            <View style={styles.container}>
                <ScrollView style={styles.container}>
                    {
                        (this.state.bankcard) ? (
                                <View style={styles.defultCardStyle}>
                                    <Text style={styles.titleStyle}>{this.state.debitCardBankName}</Text>
                                    <Text style={styles.subStyle}>储蓄卡</Text>
                                    <Text style={styles.numberStyle}>{"***************" + this.state.maskDebitCard}</Text>
                                    <TouchableOpacity style={Platform.OS ==='ios'?styles1.touchStyle:styles1.touchStyle1} onPress={this.ClickBtn.bind(this)} underlayColor={'#FFFFFF'}>
                                        <Text style={Platform.OS ==='ios'?styles.btnStyle:styles.btnStyle1}>换绑</Text>
                                    </TouchableOpacity>
                                </View>
                        ) : (
                                <Text></Text>
                            )
                    }

                    {this.state.bankcard===null&&this.state.list.length===0?noDataView:<ListView style={styles.ListView}
                        dataSource={ds.cloneWithRows(this.state.list)}
                        renderRow={this._renderRow}
                    />}
                </ScrollView>
            </View>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        paddingLeft: 0,
        height: screenHeight - 70,
    },
    defultCardStyle: {
        height: screenHeight / 6,
        backgroundColor: '#0076ff',
        width: screenWidth,
        marginTop:0
    },
    titleStyle: {
        marginTop: 20,
        marginLeft: screenWidth / 8,
        color: "#FFFFFF",
        fontSize: 18,
        position: "absolute",
    },
    icon: {
        marginTop: 30,
        marginLeft: 20,
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: "#FFFFFF",
        position: "absolute",
    },
    subStyle: {
        marginTop: 50,
        marginLeft: screenWidth / 8,
        color: "#F4F4F4",
        fontSize: 16,
        position: "absolute",
    },
    numberStyle: {
        marginTop: 80,
        marginLeft: screenWidth / 8,
        color: "#FFFFFF",
        fontSize: 16,
        position: "absolute",
    },
    btnStyle: {
        borderWidth: 1,
        borderColor: "#FFFFFF",
        width: 100,
        height: 40,
        borderRadius: 5,
        marginLeft: screenWidth - 120,
        marginTop: 40,
        fontSize: 16,
        color: "#FFFFFF",
        textAlign: 'center',
        lineHeight: 37,
    },
    btnStyle1:{
        fontSize: 16,
        color: "#FFFFFF",
        textAlign: 'center',
        lineHeight: 30,
    }
});

const styles1 = StyleSheet.create({
    itemStyle: {
        marginTop: 20,
        backgroundColor: "#E86F76",
        marginLeft: 10,
        position: "relative",
        width: screenWidth - 20,
        height: 100,
        borderRadius: 5,
    },
    titleStyle: {
        marginTop: 10,
        marginLeft: screenWidth / 8,
        color: "#FFFFFF",
        fontSize: 18,
        position: "absolute",
    },
    icon: {
        marginTop: 20,
        marginLeft: 20,
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: "#FFFFFF",
        position: "absolute",
    },
    subStyle: {
        marginTop: 40,
        marginLeft: screenWidth / 8,
        color: "#F4F4F4",
        fontSize: 16,
        position: "absolute",
    },
    numberStyle: {
        marginTop: 70,
        marginLeft: screenWidth / 8,
        color: "#FFFFFF",
        fontSize: 16,
        position: "absolute",
    },
    btnStyle: {
        width: 20,
        height: 20,
        borderRadius: 10,
        marginLeft: screenWidth - 50,
        marginTop: 40,
        borderColor: "#FFFFFF",
    },
    touchStyle: {
        alignItems: 'center',
        height: 15,
        maxWidth: 15,
        marginLeft: screenWidth - 60,
        position: "relative",
    },
    touchStyle1:{
        borderWidth: 1,
        borderColor: "#FFFFFF",
        width: 100,
        height: 40,
        borderRadius: 5,
        marginLeft: screenWidth - 120,
        marginTop: 40,
    }
});

//超过3个item用该style,包含第三个
const styles2 = StyleSheet.create({
    itemStyle: {
        marginTop: 20,
        backgroundColor: "#E86F76",
        marginLeft: 10,
        position: "relative",
        width: screenWidth - 20,
        height: 100,
        borderRadius: 5,
    },
});

const mapStateToProps = state => ({
    creditCards: state.card.creditCards,
    debitCard: state.card.debitCard,
});

/**
 * 这里指定要map到props的事件
 * 一般情况下该conponent需要发送的action事件都应该定义在这里
 * 如果偷懒不定义这个方法，那么在component中，直接引用dispatch去发送action
 * @param {*} dispatch 
 */
const mapDispatchToProps = dispatch => ({
    dispatch: dispatch,
    getCreditCards: () => dispatch(card.getCreditCards())
});

/**
 * 如果没有传入mapDispatchToProps，默认会把dispatch map到props
 * 如果传入的话，必须显示的指定，否则会undefined
 */
export default connect(mapStateToProps, mapDispatchToProps)(bankcard);