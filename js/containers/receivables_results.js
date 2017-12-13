/**
 * 2017年11月9日10:04:05
 * 收款结果
 */
import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  Image,
  TouchableHighlight,
  TouchableOpacity
} from 'react-native';
import { connect } from 'react-redux';

import { List, ListItem, Card } from 'react-native-elements'
import Resource from '../../resource/index';

import { payment } from '../actions';
import { 
  PAY_RESULT_PRE, 
  PAY_RESULT_UNION_CONFORM, 
  PAY_RESULT_OK, 
  PAY_RESULT_FAIL, 
  PAY_RESULT_TIMEOUT 
} from '../constants';
import { NavigationActions } from 'react-navigation'
class ReceivablesResults extends Component {
  static navigationOptions  = ({ navigation }) => ({
    title: '收款结果',
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
    <TouchableOpacity style={{marginRight:15}} onPress={() => {
      const resetAction = NavigationActions.reset({
        index: 0,
        actions: [
          NavigationActions.navigate({ routeName: 'TabBar' }),
        ]
      });
     navigation.dispatch(resetAction);
    }}
    >
    <Text style={{color:'#0076ff',fontSize:16}}>完成</Text>
    </TouchableOpacity>
),
headerTitleStyle:{alignSelf:'center'},
  });
  constructor() {
    super();
    this.state = {
      payStatus: PAY_RESULT_PRE,
      paymentId: null
    };
  }

  componentDidMount() {
    const navigation = this.props.navigation;
    const paymentId = navigation.state.params.paymentId;
    const payStatus = navigation.state.params.payStatus;
    const amount = navigation.state.params.amount;

    this.setState({
      payStatus: payStatus,
      paymentId: paymentId,
      amount: amount
    });
  }

  viewPayResultDetails() {
    const { navigate } = this.props.navigation;
    navigate('Receivables_detail', { paymentId: this.state.paymentId })
  }

  render() {

    let resultItem = null;

    if (this.state.payStatus === PAY_RESULT_OK) {
      resultItem = (
        <View style={styles.center}>
          <Image source={Resource.image.ICON_YES} style={styles.icon} />
          <Text style={styles.textSuccess}>收款成功</Text>
          <Text style={styles.text2}>{this.state.amount}元</Text>
        </View>
      )
    }

    if (this.state.payStatus === PAY_RESULT_FAIL) {
      resultItem = (
        <View style={styles.center}>
          <Image source={Resource.image.ICON_NO} style={styles.icon} />
          <Text style={styles.textDanger}>收款失败</Text>
          <Text style={styles.text2}>{this.state.amount}元</Text>
        </View>
      )
    }

    if (this.state.payStatus === PAY_RESULT_PRE 
      || this.state.payStatus === PAY_RESULT_UNION_CONFORM
      || this.state.payStatus === PAY_RESULT_TIMEOUT ) {
      resultItem = (
        <View style={styles.center}>
          <Image source={Resource.image.ICON_TIMEOUT} style={styles.icon} />
          <Text style={styles.textTimeout}>收款结果查询超时</Text>
          <Text style={styles.textTimeout}>请稍后到我的账单再一次确认</Text>
          <Text style={styles.text2}>{this.state.amount}元</Text>
        </View>
      )
    }

    return (
      <View style={styles.container}>
        {
          resultItem
        }
        <List>
          <ListItem title='查看收款详情' onPress={() => this.viewPayResultDetails()} />
        </List>
        <View style={styles.tipBox}>
          <Text style={styles.tip}>如有疑问，请联系客服！</Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 20,
    backgroundColor: '#fff',
    marginBottom: 10

  },
  icon: {
    width: 80,
    height: 80
  },
  text1: {
    color: '#1AFA29',
    fontSize: 26,
    padding: 10
  },
  text2: {
    color: 'red',
    fontSize: 26,
    padding: 10,
    fontWeight: 'bold'
  },
  textSuccess: {
    color: '#1AFA29',
    fontSize: 26,
    padding: 10,
    fontWeight: 'bold'
  },
  textDanger: {
    color: '#f00',
    fontSize: 26,
    padding: 10,
    fontWeight: 'bold'
  },
  textTimeout: {
    color: '#f4ea2a',
    fontSize: 16,
    padding: 10,
    fontWeight: 'bold'
  },
  tipBox: {
    alignItems: 'flex-end',
    marginTop: 20
  },
  tip: {
    fontSize: 16,
    color: '#0076ff'
  }
});

const mapStateToProps = state => ({
  paymentResult: state.payment.paymentResult
});

const mapDispatchToProps = dispatch => ({
  dispatch: dispatch,
  getPaymentResult: (paymentId) => dispatch(payment.getPaymentResult(paymentId))
});

export default connect(mapStateToProps, mapDispatchToProps)(ReceivablesResults);

