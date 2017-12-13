/**
 * 银行信息填写
 * 2017年11月6日14:53:51
 */

import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image,
    InteractionManager,
    Platform,
    Dimensions,
    TextInput,
    ScrollView,
    TouchableOpacity
} from 'react-native';
import { CheckBox } from 'react-native-elements';
import { Button } from 'react-native-elements';
import Resource from '../../resource/index';
import ModalDropdown from 'react-native-modal-dropdown';
let ScreenWidth = Dimensions.get('window').width;
let ScreenHeight = Dimensions.get('window').height
export default class FormCard extends Component {
    constructor(props) {
        super(props);
        this.state={
            checked:true,
        }
    }
    componentDidMount() {
        
    }
    componentWillUnmount() {

    }
    _onSelect(index,value){
     
    }
    render() {
        const { navigate } = this.props.navigation;
        return (
                <View style={[styles.border]}>
                    
                      <View style={[styles.row,styles.marginBottom]}>
                      <Text  style={styles.centerText}>
                        银行卡号:
                      </Text>
                      <TextInput style={styles.input} placeholder= "请输入银行卡号" underlineColorAndroid = {'transparent'}>
                      </TextInput>
                    </View>
                    <View style={[styles.row,styles.marginBottom]}>
                      <Text  style={styles.centerText}>
                        开户银行:
                      </Text>
                      <ModalDropdown 
                      options={['中国银行', '中国工商银行','中国农业银行']} 
                      style={[styles.input,styles.dropdownStyle]}
                      textStyle={{fontSize:16}}
                      dropdownStyle={{width:250}}
                      dropdownTextStyle={{fontSize:16}}
                      defaultIndex={0}
                      defaultValue={'请选择开户银行'}
                      onSelect = {(index,value)=>this._onSelect(index,value)}
                      />
                    </View>
                     <View style={[styles.row,styles.marginBottom]}>
                      <Text  style={styles.centerText}>
                        持卡人姓名:
                      </Text>
                      <TextInput style={styles.input} placeholder= "请输入持卡人姓名" underlineColorAndroid = {'transparent'}>
                      </TextInput>
                    </View>

                     <View style={[styles.row,styles.marginBottom]}>
                      <Text  style={styles.centerText}>
                        CVN2:
                      </Text>
                      <TextInput style={styles.input} placeholder= "请输入CVN2,卡背签名栏后三位" underlineColorAndroid = {'transparent'}>
                      </TextInput>
                    </View>

                     <View style={[styles.row,styles.marginBottom]}>
                      <Text  style={styles.centerText}>
                        有效期:
                      </Text>
                      <TextInput style={styles.input} placeholder= "格式为月/年,如0821" underlineColorAndroid = {'transparent'}>
                      </TextInput>
                    </View>

                     <View style={[styles.row,styles.marginBottom1]}>
                      <Text  style={styles.centerText}>
                        证件号码:
                      </Text>
                      <TextInput style={styles.input} placeholder= "请输入持卡人身份证号" underlineColorAndroid = {'transparent'}>
                      </TextInput>
                    </View>
                 </View>
        );
    }

}
const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#F5FCFF',
    },
    row:{
      flexDirection:'row'
    },
    icon:{
        width:36,
        height:36
    },
    alignItems:{
        alignItems:'center'
    },
    info:{
        justifyContent:'space-between',
        height:40,
        alignItems:'center',
        backgroundColor:'#f5f5f5',
        padding:10
    },
    marginBottom:{
      marginBottom:8,
      alignItems:'center',
      borderWidth:1,
      borderColor:'#bbb',
      borderStyle:'solid',
      borderLeftColor:'transparent',
      borderRightColor:'transparent',
      borderTopColor:'transparent',
      justifyContent:'center',
      paddingTop:5,
      paddingBottom:5
    },
    marginBottom1:{
      alignItems:'center',
      borderWidth:1,
      borderColor:'#bbb',
      borderStyle:'solid',
      borderLeftColor:'transparent',
      borderRightColor:'transparent',
      borderTopColor:'transparent',
      justifyContent:'center',
      paddingTop:5,
      paddingBottom:5
    },
    border:{
      borderWidth:1,
      borderColor:'#bbb',
      borderStyle:'solid',
      borderLeftColor:'transparent',
      borderRightColor:'transparent',
    },
    title:{
         width:ScreenWidth,
         height:70,
         justifyContent:'center'
    },
    text:{
      textAlign:'center',
      fontSize:20
    },
    position:{
      position:'absolute',
      right:20,
      bottom:15
    },
    centerText:{
      fontSize:16,
      width:100,
      textAlign:'left'
    },
    input:{
      width:250,
      height:40,
      //color:'#eee',
      //fontSize:16,
    },
    dropdownStyle:{
      justifyContent:'center'
    },
    change:{
      position:'absolute',
      right:20,
      bottom:15
    },
    cards:{
      justifyContent:'center',
      paddingTop:30,
      paddingBottom:30,

    },
    cardsText:{
      textAlign:'center',
      fontSize:16,
      marginBottom:5
    },
    tip:{
      width:ScreenWidth,
      height:200,
      overflow: 'visible',
      
      paddingLeft:10,
      paddingRight:10,
      paddingTop:5,
      paddingBottom:5,
    },
    tipText:{
      fontSize:16,
      color:'#888888',
      flexWrap:'wrap',
    },
    header:{
        height:80,
        padding:10,
        alignItems:'center',
        justifyContent:'space-between',
        backgroundColor:'#5677FC'
    },
    headerText:{
        fontSize:26,
        color:'#fff',
        fontWeight:'bold'
    }
  });