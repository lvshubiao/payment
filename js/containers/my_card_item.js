/**
 * 
我的卡片
2017年11月9日16:59:43
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
let screenWidth = Dimensions.get('window').width;
import { CheckBox,Button} from 'react-native-elements';
import Resource from '../../resource/index';
export default class My_card_item extends Component {
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
    render() {
        return (
               <View style={styles.itemStyle}>
                     <Text style={styles.titleStyle}>工商银行</Text>
                      <Image style={styles.icon}
                                    source={Resource.image.ICON_ICBC}
                                />
                      <Text style={styles.subStyle}>储蓄卡</Text>
                      <Text style={styles.numberStyle}>**** **** **** 8689</Text>
                      <TouchableOpacity style={styles.touchStyle} underlayColor={'#FFFFFF'} >
                      <Image style={styles.btnStyle}
                             source={Resource.image.ICON_CLOSE}
                         />
                        </TouchableOpacity>
                  </View>
        );
    }
}
const styles = StyleSheet.create({
    itemStyle:{
        marginTop:20,
        backgroundColor:"#EE2C2C",
        marginLeft:10,
        position:"relative",
        width:screenWidth - 20,
        height:100,
        borderRadius:5,
    },
    titleStyle:{
        marginTop:10,
        marginLeft:screenWidth / 4,
        color:"#FFFFFF",
        fontSize:23,
        position:"absolute",
    },
    icon:{
        marginTop:20,
        marginLeft:20,
        width:60,
        height:60,
        borderRadius: 30,
        backgroundColor:"#FFFFFF",
        position:"absolute",
    },
    subStyle:{
        marginTop:40,
        marginLeft:screenWidth / 4,
        color:"#F4F4F4",
        fontSize:18,
        position:"absolute",
    },
    numberStyle:{
        marginTop:70,
        marginLeft:screenWidth / 4,
        color:"#FFFFFF",
        fontSize:23,
        position:"absolute",
    },
    btnStyle:{
        width:20,
        height:20,
        borderRadius:10,
        marginLeft:screenWidth - 60,
        marginTop:40,
        borderColor:"#FFFFFF",
    },
    touchStyle:{
        alignItems: 'center',
        height:10,
        maxWidth:10,
        marginLeft:screenWidth - 60,
        position:"relative",
    }
  });