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
  TouchableOpacity,
  Keyboard,
  WebView
} from 'react-native';
import { connect } from 'react-redux';
import { List, ListItem } from 'react-native-elements';
import Resource from '../../resource/index';
var screenWidth = Dimensions.get("window").width;
var screenHeight = Dimensions.get("window").height;
class ShareDetail extends Component {
    
    static navigationOptions = ({navigation}) => ({
      title: navigation.state.params.title,
      headerRight: (<Image style={{width:25,height:25,marginRight:15}}
        source={Resource.image.ICON_SHAREDETAIL}
    />),
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
headerTitleStyle:{alignSelf:'center'},
    });
    constructor() {
      super();
    }
    render() {
        const { params } = this.props.navigation.state;
        //{}
      return (
        <View style={styles.container}>
        <WebView bounces={false}
                scalesPageToFit={true}
                source={{uri:`http://payment.mosainet.com/${params.url}`,method: 'GET'}}
                style={{width:screenWidth, height:screenHeight}}>
              </WebView>
        </View>
      );
    }
  }
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#F4F4F4',
    },
    titleStyle:{
        marginTop:10,
        width:screenWidth - 40,
        fontSize:25,
        color:"#0076ff",
        marginLeft:20
    },
    timeStyle:{
        color:"#A9A9A9",
        fontSize:17,
        marginTop:10,
        marginLeft:20,
        width:screenWidth - 40,
    },
    subTitleStyle:{
        color:"#000000",
        fontSize:17,
        marginLeft:20,
        width:screenWidth - 40,
        height:screenHeight,
        marginTop:10,
    }
  });
  
  /**
   * 这里是知道map到props的state
   * @param {*} state 
   */
  const mapStateToProps = state => ({

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
  export default connect(mapStateToProps, mapDispatchToProps)(ShareDetail);