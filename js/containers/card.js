/**
 * 欢迎页
 * @flow
 * **/
import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image,
    InteractionManager,
    Platform,
    Dimensions
} from 'react-native';
let ScreenWidth = Dimensions.get('window').width;
let ScreenHeight = Dimensions.get('window').height
export default class Card extends Component {
      static navigationOptions  = ({ navigation }) => ({
        title: '我的卡片',
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
    constructor({ navigation }) {
        super();
    }
    render() {
        return (
            <View style={styles.container}>
                <View style={styles.code}>
                   <View style={styles.myCards}>
                      <Text style={styles.cardText}>
                      我的银行卡
                      </Text>
                      <View style={[styles.row,styles.center]}>
                        <Text style={styles.text}>你已添加借记卡确认身份</Text>
                        <Text style={styles.addCard}>添加新卡</Text>
                      </View>
                   </View>
                </View>
            </View>
        );
    }

}
  

const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      backgroundColor: '#F5FCFF',
    },
    center:{
      alignItems:'center',
      marginTop:20,

    },
    code:{
      width:ScreenWidth,
      height:ScreenWidth/3,
      borderWidth:1,
      borderColor:'#4E6CEF',
      borderStyle:'solid',
      backgroundColor:'#738FFE',
      justifyContent:'center',
      alignItems: 'center',
    },
    row:{
      flexDirection:'row',
    },
    myCards:{
      width:ScreenWidth*0.8,
      height:ScreenWidth/3*0.8,
    },
    cardText:{
      fontSize:20,
      fontWeight:'bold',
      textAlign:'center',
      color:'#fff'
    },
    text:{
      color:'#E4D1AE',
      fontSize:16
    },
    addCard:{
      fontSize:16,
      color:'#fff',
      marginLeft:20
    }
  });