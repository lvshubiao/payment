import React, { Component } from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    TextInput,
    ListView,
    Dimensions,
    PixelRatio,
    Image,
    TouchableOpacity,
    TouchableWithoutFeedback,
    Keyboard,
} from 'react-native';
import { connect } from 'react-redux';
import { List, ListItem,Button } from 'react-native-elements';
import Resource from '../../resource/index';
import Toast, { DURATION } from 'react-native-easy-toast';
import { cashout } from '../actions';
import AnalyticsUtil from '../utils/AnalyticsUtil';
import Session from '../common/session';

var screenWidth = Dimensions.get("window").width;
var screenHeight = Dimensions.get("window").height;
var dismissKeyboard = require('dismissKeyboard');

function clickClose(){
    dismissKeyboard();
}
class takecash extends Component {

    static navigationOptions  = ({ navigation }) => ({
        title: '提现',
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
    constructor() {
        super();

        this.state={
            disabled:true,
            mySharedProfit:0,
            textInputValue:'',
            inputDisabled:true
        }
    }
    componentDidMount() {
        let params = this.props.navigation.state.params;
        this.setState({
            mySharedProfit:params.mySharedProfit
        })
      }
    textChange(text){
        if(text.length>=0){
            if(text.length===0){
                this.setState({
                    disabled:true,
                    textInputValue:text
                })  
            }else{
                this.setState({
                    disabled:false,
                    textInputValue:text
                })
            }
        }   
    }
    _onPress(){
        let textInputValue = this.state.textInputValue;
        let allMOney = this.state.mySharedProfit
        if(textInputValue < 3 ){
            this.refs.toast.show('提现额度要大于两元！');
            return;
        }
        if(textInputValue > allMOney){
            this.refs.toast.show('提现金额不能大于可提现金额哦！！');
            return;
        }
      
        var map = {
            userId:'1',
            cash:textInputValue,
            code:'0'
        }
        
        Session.getUserInfo().then((user) => {
            map.userId = user.userId;
        });

        this.props.cashout(textInputValue).then((data)=>{
            map.code='0';
            AnalyticsUtil.onEventWithMap('cashout',map);
            this.refs.toast.show('提现成功');
        },(err)=>{
            map.code='1';
            AnalyticsUtil.onEventWithMap('cashout',map);
            if(err){
                let data = JSON.parse(err);
                let obj = data.data.fieldErrors;
                for (var key in obj){  
                    this.refs.toast.show(obj[key]);  
                }  
            }else{
                this.refs.toast.show('提现失败');
            }
        })
        if(this.props.error !==undefined){
            this.refs.toast.show(this.props.error);
        }
    }
    cashAll(){
        this.setState({
            textInputValue:this.state.mySharedProfit,
            disabled:false
        })
    }
    lostBlur(){
           Keyboard.dismiss();
    }
    componentWillMount () {
        this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow);
        this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);
      }
    
      componentWillUnmount () {
        this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener.remove();
      }
    
      _keyboardDidShow () {
          keyBoardIsShow = true;
      }
    
      _keyboardDidHide () {
          keyBoardIsShow = true;
      }

    render() {
        return (
        <TouchableWithoutFeedback
            onPress={this.lostBlur.bind(this)}>
            <View style={styles.container}>
            <Toast ref="toast" position='top' opacity={0.8} />
                <View style={styles.header}>
                    <Text style={styles.numStyle}>可提现金额</Text>
                    <Text style={styles.numStyle1}>{this.state.mySharedProfit}</Text>
                </View>
                <View style={styles.cashStyle}>
                    <View style={styles.tip}>
                    <Text style={styles.getCashStyle}>提现金额</Text>
                    <TouchableOpacity onPress = {()=>this.cashAll()}>
                        <Text style={styles.all}>全部提现</Text>
                    </TouchableOpacity>
                    </View>
                    <View style={[styles.row,styles.moneyInput]}>
                    <Image style={styles.icon}
                        source={Resource.image.ICON_RMB}
                    />
                    <TextInput
                        underlineColorAndroid = {'transparent'}
                        style={styles.input1}
                        keyboardType="numeric"
                        placeholder="请输入提现金额"
                        keyboardType="numeric"
                        value = {this.state.textInputValue}
                        onChangeText={(text) => {
                            this.textChange(text);
                        }}
                    />
                    </View>
                </View>
                <View style={styles.superwarn}>
                    <Text style={styles.warn1}>注意:提现满200免手续费，200以下手续费2元。</Text>
                </View>
                <Button
                    title='提交'
                    color="#fff"
                    backgroundColor="#0076ff"
                    disabled={this.state.disabled}
                    borderRadius={4}
                    containerViewStyle={{ marginLeft: 0, marginRight: 0,marginTop:20}}
                    onPress={this._onPress.bind(this)}
                />
                <Text style={styles.warn1}>温馨提示:{'\n'}您正在进行一笔交易，请认真核实并确认收款账号是否正确。交易信息不要泄漏给任何人，如有任何疑问，请联系客服</Text>
                {/* <Text style={styles.text2}>留言给我们在第一时间内回复。</Text> */}
            </View>
        </TouchableWithoutFeedback>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F4F4F4',
    },
    row:{
        flexDirection:'row'
    },
    moneyInput:{
        marginTop:10,
        padding:10,
        justifyContent:'center'
    },
    header: {
        marginTop: 0,
        marginLeft: 0,
        width: screenWidth,
        height: screenHeight / 7,
        backgroundColor: "#0076ff",
    },
    numStyle: {
        marginLeft: 10,
        marginTop: 10,
        color: "#CDD8FD",
        fontSize: 17,
    },
    numStyle1: {
        fontSize: 25,
        color: "#FFFFFF",
        marginLeft: 10,
        marginTop: 10,
    },
    cashStyle: {
        marginTop: 10,
        marginLeft: 0,
        backgroundColor: "#FFFFFF",
    },
    getCashStyle: {
        color: "#C2C2C2",
        fontSize: 17,
        marginLeft: 10,
        marginTop: 15,
    },
    all:{
        color: "#00A0FF",
        fontSize: 17,
        marginRight: 10,
        marginTop: 15,
    },
    text1: {
        marginLeft: screenWidth - 100,
        marginTop: -18,
        color: "#0076ff",
        fontSize: 17,
    },
    buttonStyle1: {
        marginLeft: screenWidth - 100,
        marginTop: 0,
    },
    icon: {
        width: 15,
        height: 15,
        marginTop:13
    },
    input1: {
        width: "90%",
        height: 40,
        fontSize: 16,
        justifyContent:'center'
    },
    buttonStyle: {
        marginTop: 30,
        backgroundColor: "#6495ED",
        borderRadius: 10,
        width: screenWidth - 40,
        alignItems: 'center',
        height: 40,
        marginLeft: 20,
    },
    text: {
        color: "#FFFFFF",
        textAlign: "center",
        fontSize: 17,
        lineHeight: 37,
    },
    warn1: {
        color: "#C2C2C2",
        fontSize: 15,
        marginTop: 20,
        marginLeft: 10,
        lineHeight: 20,
    },
    text2:{
        color:"#0076ff",
        fontSize:17,
        marginLeft:20,
        marginTop:40,
    },
    tip:{
        justifyContent:'space-between',
        flexDirection: 'row',
    },
    superwarn: {
        marginTop: -5,
        padding: 0      
    },
});
/**
 * 这里是知道map到props的state
 * @param {*} state 
 */
const mapStateToProps = state => ({
    status: state.cashout.cashouts.status,
    error: state.cashout.cashouts.error,
    profits: state.cashout.cashouts.data,
});

/**
 * 这里指定要map到props的事件
 * 一般情况下该conponent需要发送的action事件都应该定义在这里
 * 如果偷懒不定义这个方法，那么在component中，直接引用dispatch去发送action
 * @param {*} dispatch 
 */
const mapDispatchToProps = dispatch => ({
    dispatch: dispatch,
    cashout:(drawMoneyAmount) => dispatch(cashout.cashout(drawMoneyAmount))
});

/**
 * 如果没有传入mapDispatchToProps，默认会把dispatch map到props
 * 如果传入的话，必须显示的指定，否则会undefined
 */
export default connect(mapStateToProps, mapDispatchToProps)(takecash);