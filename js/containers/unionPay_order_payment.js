/**
 * 
银联订单支付页面
2017年11月6日14:54:47
 */
import React, { Component } from 'react';
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
    TouchableHighlight,
    TouchableOpacity,
    Alert
} from 'react-native';
import { CheckBox } from 'react-native-elements';
import { Button } from 'react-native-elements';
import Resource from '../../resource/index';
import My_card_item from './my_card_item';
import { connect } from 'react-redux';
import { card } from '../actions';
import { payload } from '../actions/creator';
import Toast, { DURATION } from 'react-native-easy-toast';
import Spinner from '../components/spinner';

let screenWidth = Dimensions.get('window').width;
let screenHeight = Dimensions.get('window').height;
class UnionPayOrderPayment extends Component {
    constructor(props) {
        super(props);
        this.state = {
            amount: null,
            paymentMethod: null
        }
    }
    static navigationOptions  = ({ navigation }) => ({
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
      });
    componentDidMount() {
        const { navigate } = this.props.navigation;
        const navigation = this.props.navigation;
        const amount = navigation.state.params.amount;
        const paymentMethod = navigation.state.params.paymentMethod;
        this.setState({ amount: amount, paymentMethod: paymentMethod});

        this.getCreditCards();
    }

    getCreditCards() {
        this.props.getCreditCards();
    }

    goUnionPayOrder(cardId, maskCardNumber, bankName) {
        const { navigate } = this.props.navigation;
        navigate('Unionpay_order', {
            amount: this.state.amount,
            paymentMethod: this.state.paymentMethod,
            bankId: cardId,
            maskCardNumber: maskCardNumber,
            bankName: bankName
        });
    }

    render() {
        let creditCards = this.props.creditCards || [];
        let creditCardItems = [];
        creditCardItems = creditCards.map((creditCard, index) => {
            return (
                <TouchableHighlight key={creditCard.cardId}
                    onPress={() => 
                    {
                        this.goUnionPayOrder(creditCard.cardId, creditCard.maskCardNumber, creditCard.bankName);
                    }
                }>
                    <View style={styles.itemStyle} >
                        <Text style={styles.titleStyle}>{creditCard.bankName}</Text>
                        <Text style={styles.subStyle}>信用卡</Text>
                        <Text style={styles.numberStyle}>**** **** **** {creditCard.maskCardNumber}</Text>
                        <TouchableOpacity style={Platform.OS ==='ios'?styles.touchStyle:styles.touchStyle1} underlayColor={'#FFFFFF'} onPress={() => 
                    {
                        Alert.alert(
                            "确定要删除该信用卡吗",
                            "点击确定将删除该信用卡",
                            [
                              {text: '取消'},
                              {text: '确定', onPress: () => this.props.deleteCreditCards(creditCard.cardId).then((result) => {
                                this.getCreditCards();
                            }, (err) => {
                                if(err.length > 30){
                                    let data = JSON.parse(err);
                                    let obj = data.data.fieldErrors;
                                    for (var key in obj){  
                                        this.refs.toast.show(key+ ":" + obj[key]);  
                                        return;
                                    }  
                                  }else{
                                    this.refs.toast.show(err);
                                  }
                            })},
                            ]
                          )
                        
                    }
                }>
                        <Image style={Platform.OS ==='ios'?styles.btnStyle:styles.btnStyle1}
                            source={Resource.image.ICON_CLOSE}
                        />
                    </TouchableOpacity> 
                    </View>
                </TouchableHighlight>
            )
        });

        return (
            <ScrollView>
                <View style={styles.container}>
                <Spinner ref="spinner" />
            <Toast ref="toast" position='top' opacity={0.8} />
                    <View style={[styles.header, styles.row]}>
                        <Text style={styles.headerText}>支付金额</Text>
                        <Text style={styles.headerAmount}>￥ {this.state.amount}</Text>
                    </View>
                    <View style={styles.tip}>
                        <Text style={styles.tipText}>选择一张信用卡或使用新卡</Text>
                    </View>

                    {creditCardItems}

                    <View style={styles.btnPanel}>
                        <Button
                            title="使用新卡"
                            backgroundColor="#5068E6"
                            borderRadius={4}
                            buttonStyle={[{ marginBottom: 15, marginTop: 10, width: screenWidth * 0.94 }]}
                            onPress={() => this.goUnionPayOrder()}
                        />
                    </View>
                </View>
            </ScrollView>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5FCFF',
    },
    row: {
        flexDirection: 'row'
    },
    icon: {
        width: 36,
        height: 36
    },
    header: {
        height: 60,
        padding: 10,
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#5677FC'
    },
    headerText: {
        fontSize: 18,
        color: '#fff',
    },
    headerAmount: {
        fontSize: 26,
        color: '#fff',
    },
    headerText: {
        fontSize: 26,
        color: '#fff',
        fontWeight: 'bold'
    },
    tip: {
        height: 40,
        justifyContent: 'center',
        padding: 10
    },
    tipText: {
        fontSize: 16,
        color: '#666'
    },
    buttonStyle: {
        backgroundColor: "#fff",
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: '#0076FF',
        width: '96%',
        borderRadius: 5,
        alignItems: 'center',
        height: 50,
        justifyContent: 'center',
        marginLeft: 10,
        marginTop: 20
    },
    btnText: {
        color: "#0076FF",
        textAlign: "center",
        fontSize: 26,
    },

    itemStyle: {
        marginTop: 5,
        marginBottom: 5,
        backgroundColor: "#EE2C2C",
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
        fontSize: 16,
        position: "absolute",
    },
    icon: {
        marginTop: 20,
        marginLeft: 10,
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: "#FFFFFF",
        position: "absolute",
    },
    subStyle: {
        marginTop: 40,
        marginLeft: screenWidth / 8,
        color: '#efefef',
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
        marginLeft: screenWidth - 60,
        marginTop: 40,
        borderColor: "#FFFFFF",
    },
    touchStyle: {
        alignItems: 'center',
        height: 10,
        maxWidth: 10,
        marginLeft: screenWidth - 60,
        position: "relative",
    },

    btnPanel: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 20,
        paddingBottom: 50,
    },
    btnStyle1: {
        width: 20,
        height: 20,
        borderRadius: 10,
    },
    touchStyle1: {
        marginLeft: screenWidth - 60,
        marginTop: 40,
        borderColor: "#FFFFFF",
    },
});

const mapStateToProps = state => ({
    creditCards: state.card.creditCards.data
});

const mapDispatchToProps = dispatch => ({
    dispatch: dispatch,
    getCreditCards: () => dispatch(card.getCreditCards()),
    deleteCreditCards: (cardId) => dispatch(card.deleteBankCard(cardId))
});

export default connect(mapStateToProps, mapDispatchToProps)(UnionPayOrderPayment);