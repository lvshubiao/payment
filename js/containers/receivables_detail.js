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
import { List, ListItem, Card } from 'react-native-elements'
import { connect } from 'react-redux';
import Resource from '../../resource/index';
import { payment } from '../actions';
import { PAY_RESULT_OK, PAY_RESULT_FAIL, PAY_RESULT_PRE, PAY_RESULT_UNION_CONFORM } from '../constants';
const moment = require('moment');


class ReceivablesDetail extends Component {

  static navigationOptions  = ({ navigation }) => ({
    title: '收款详情',
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

  componentDidMount() {
    const navigation = this.props.navigation;
    const paymentId = navigation.state.params.paymentId;
    this.getPayResultDetails(paymentId);
  }

  getPayResultDetails(paymentId) {
    this.props.getPayResultDetails(paymentId);
  }

  render() {
    const { navigate } = this.props.navigation;
    const details = this.props.details || {};
    const order = details.order ? details.order : {};

    let payStatusTitle = '';
    if (details.status === PAY_RESULT_OK) {
      payStatusTitle = '交易成功';
    }
    if (details.status === PAY_RESULT_FAIL) {
      payStatusTitle = '交易失败';
    }
    if (details.status === PAY_RESULT_PRE
      || details.status === PAY_RESULT_UNION_CONFORM) {
      payStatusTitle = '未付款';
    }
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.txt1}>{payStatusTitle}</Text>
          <Text style={styles.txt2}>{order.amount || ''}</Text>
        </View>


        <List containerStyle={{ marginBottom: 20, backgroundColor: '#fff' }}>
          <ListItem
            roundAvatar
            key={1}
            title='交易内容'
            titleStyle={styles.listItem}
            hideChevron={true}
            subtitle={
              <View style={styles.right}>
                <Text style={styles.font16}>{order.subject || ''}</Text>
              </View>
            }
          />
          <ListItem
            roundAvatar
            key={2}
            title='交易流水号'
            titleStyle={styles.listItem}
            hideChevron={true}
            subtitle={
              <View style={styles.right}>
                <Text style={styles.font16}>{order.orderId || ''}</Text>
              </View>
            }
          />
          <ListItem
            roundAvatar
            key={3}
            title='交易时间'
            titleStyle={styles.listItem}
            hideChevron={true}
            subtitle={
              <View style={styles.right}>
                <Text style={styles.font16}>{moment(details.createAt * 1000 || '').format('YYYY-MM-DD HH:mm:ss')}</Text>
              </View>
            }
          />
        </List>
        <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center' }} onPress={() => navigate('Help')}>
          <Text style={{ fontSize: 16, color: '#4D76FD' }}>对此订单有疑问？</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  right: {
    position: "absolute",
    right: 2,
    bottom: 0
  },
  font16: {
    fontSize: 16
  },
  header: {
    marginBottom: 10,
    backgroundColor: '#fff',
    padding: 20
  },
  txt1: {
    fontSize: 20,
    marginBottom: 10,
    color:'#bbb'
  },
  txt2: {
    fontSize: 30,
    color: '#000',
  },
  listItem: {
    color: '#333',
    padding: 3,
  }
});

const mapStateToProps = state => ({
  details: state.payment.paymentResult.data
});

const mapDispatchToProps = dispatch => ({
  dispatch: dispatch,
  getPayResultDetails: (paymentId) => dispatch(payment.getPaymentResult(paymentId))
});

export default connect(mapStateToProps, mapDispatchToProps)(ReceivablesDetail);

