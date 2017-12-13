import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Image,
  TouchableHighlight,
  TouchableOpacity,
  ScrollView
} from 'react-native';
import { connect } from 'react-redux';
import Resource from '../../resource';

class About extends Component {
  static navigationOptions  = ({ navigation }) => ({
    title: '关于',
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
  }

  render() {
    return (
      <ScrollView style={styles.container}>
        <View style={[styles.row, styles.logoContainer]}>
          <Image
            style={styles.logo}
            source={Resource.image.LOGO}
            />
        </View>
        <View style={styles.row}>
          <Text style={styles.storeName}>乐惠品</Text>
        </View>
        <View style={styles.dec}>
          <Text style={styles.text}>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;乐惠品管家是创新技术服务在聚合收款业务模拟人工智能管理。中国银联直接授权，所有的资金流都由浦发银行监控，并且有安全保障。信用卡是用来预期消费，有时会缺乏还款资金压力，乐惠通过技术保证用户征信不会受到影响，帮助用户解决解决问题。
            </Text>
            <Text style={styles.text}>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;乐惠是一家针对线下商户扫码支付的服务商，致力于为广大的线下商户提供移动支付、O2O及金融等云服务。公司拥有深厚的支付行业背景经验及强大的软件自主研发能力，服务范围全面涵盖：移动支付平台的运营、管理、支撑与服务；移动支付行业解决方案的完整提供。
            </Text>
        </View>
        <View style={[styles.row,styles.version]}>
          <Text style={styles.storeVersion}>版本号:   V1.0.0</Text>
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  
  container: {
    backgroundColor: '#FFF',
    flex: 1
  },
  row: {
    alignItems: 'center',
  },
  version:{
    marginTop:20,
    marginBottom:20
  },
  logoContainer: {
    marginTop: 20
  },
  logo: {
    width: 90,
    height: 90
  },
  storeName: {
    color: '#0076ff',
    fontSize: 19,
    paddingTop: 20,
    paddingBottom: 10,
  },
  storeVersion: {
    color: 'black',
    fontSize: 16    
  },
  text:{
    fontSize:16,
    lineHeight:28
  },
  dec:{
    paddingLeft:20,
    paddingRight:20
  }

});

/**
 * 这里是知道map到props的state
 * @param {*} state 
 */
const mapStateToProps = state => ({
  status: state.user.status,
  error: state.user.error
});

/**
 * 这里指定要map到props的事件
 * 一般情况下该conponent需要发送的action事件都应该定义在这里
 * 如果偷懒不定义这个方法，那么在component中，直接引用dispatch去发送action
 * @param {*} dispatch 
 */
const mapDispatchToProps = dispatch => ({
  dispatch: dispatch,
  modifyPassword: (scope) => dispatch(user.modifyPassword(scope))
});

/**
 * 如果没有传入mapDispatchToProps，默认会把dispatch map到props
 * 如果传入的话，必须显示的指定，否则会undefined
 */
export default connect(mapStateToProps, mapDispatchToProps)(About);