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
    WebView
} from 'react-native';
import Resource from '../../resource/index';
import { connect } from 'react-redux';
import Session from '../common/session';
const moment = require('moment');
var screenWidth = Dimensions.get("window").width;
var screenHeight = Dimensions.get("window").height;

class Service extends Component {
    static navigationOptions  = ({ navigation }) => ({
        title: '客服中心',
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
        
        }
    }
    render() {
        const { navigate } = this.props.navigation;
        return (
            <View style={styles.container}>
                <WebView bounces={false}
                scalesPageToFit={true}
                source={{uri:"http://payment.mosainet.com/help.html",method: 'GET'}}
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
        height: screenHeight,
    },
});

const mapStateToProps = state => ({

});

const mapDispatchToProps = dispatch => ({
    dispatch: dispatch,
});


export default connect(mapStateToProps, mapDispatchToProps)(Service);