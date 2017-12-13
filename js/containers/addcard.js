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
    Keyboard,
    TouchableWithoutFeedback,
    ScrollView,
    TextInput
} from 'react-native';
import Resource from '../../resource/index';
import { connect } from 'react-redux';
import { List, ListItem,Button } from 'react-native-elements';
import Session from '../common/session';
import { NavigationActions } from 'react-navigation';
import Toast, { DURATION } from 'react-native-easy-toast';
import Spinner from '../components/spinner';
import { payment, card } from '../actions';
import { ACTION_LOADINGD, ACTION_SUCCESS, ACTION_FAILED } from '../constants';
var screenWidth = Dimensions.get("window").width;
var screenHeight = Dimensions.get("window").height;
class AddCard extends Component {
    static navigationOptions  = ({ navigation }) => ({
        title: '添加信用卡',
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
            bankName: '',
            cvv2: "",
            expiredMonth: "",
            expiredYear: '2018',
            cardNumber:""
        }
    }
    lostBlur() {
        Keyboard.dismiss();
    }
    componentWillMount() {
        this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', 
        this._keyboardDidShow.bind(this));
        this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', 
        this._keyboardDidHide.bind(this));
      }
    componentWillUnmount() {
        this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener.remove();
      }
    
      _keyboardDidShow(e) {
        if (Platform.OS === 'android') {  
          }else{  
            
         }     
      }
      confirm(){
        Keyboard.dismiss();
        if(this.state.cardNumber.length <= 0){
            this.refs.toast.show('请输入正确的银行卡号');
            return;
        }
        if(this.state.bankName.length <= 0){
            this.refs.toast.show('请输入正确的银行名称');
            return;
        }
        if(this.state.bankName.cvv2 <= 0){
            this.refs.toast.show('请输入正确的cvv2号码');
            return;
        }
        if(this.state.expiredMonth.length <= 0){
            this.refs.toast.show('请输入正确的月/年');
            return;
        }
        this.props.addCreditCards(this.state).then((result) => {
            this.refs.toast.show('绑定信用卡成功');
            this.props.navigation.goBack();
        },(err) => {
            if(err){
                let data = JSON.parse(err);
                let obj = data.data.fieldErrors;
                for (var key in obj){  
                    this.refs.toast.show(obj[key]);  
                    return;
                }  
              }else{
                this.setState({disabled:false});
                that.refs.toast.show('信用卡换绑失败');
              }
        });
      }
    _keyboardDidHide(e) {
       
      }
    render() {
        const { navigate } = this.props.navigation;
        return (
            <TouchableWithoutFeedback
            onPress={this.lostBlur.bind(this)}>
            <View style={styles.container}>
            <Spinner ref="spinner" />
            <Toast ref="toast" position='top' opacity={0.8} />
          <ScrollView ref="scrollView" keyboardShouldPersistTaps="always">
            <View style={[styles.border, styles.cardForm]}>
              <View style={[styles.row, styles.marginBottom]}>
                <Text style={styles.centerText}>
                  银行卡号:
                  </Text>
              <TextInput style={styles.input}
                placeholder="请输入信用卡卡号"
                autoCapitalize='none'
                keyboardType="numeric"
                clearButtonMode="while-editing"
                underlineColorAndroid='transparent'
                onChangeText={(text) => this.setState({ cardNumber: text })}>
              </TextInput>
            </View>
            <View style={[styles.row, styles.marginBottom]}>
              <Text style={styles.centerText}>
                开户银行:
          </Text>
              <TextInput style={styles.input}
                placeholder="请输入开户银行"
                autoCapitalize='none'
                underlineColorAndroid='transparent'
                value={this.state.bankName}
                onChangeText={(text) => this.setState({ bankName:text})}>
              </TextInput>
            </View>

              <View style={[styles.row, styles.marginBottom]}>
                <Text style={styles.centerText}>
                  CVV2:
                 </Text>
                <TextInput
                  style={styles.input}
                  placeholder="请输入CVV2,卡背签名栏后三位"
                  autoCapitalize='none'
                  underlineColorAndroid='transparent'
                  onChangeText={(text) => this.setState({ cvv2: text })}>
                </TextInput>
              </View>
              <View style={[styles.row, styles.marginBottom]}>
                <Text style={styles.centerText}>
                  有效期:
                  </Text>
                <TextInput
                  style={styles.input}
                  placeholder="格式为月/年,如08/21"
                  autoCapitalize='none'
                  underlineColorAndroid='transparent'
                  onChangeText={(text) => 
                  this.setState({ expiredMonth: text.split('/')[0], expiredYear: "20" + text.split('/')[1] })}>
                </TextInput>
              </View>
            </View>
            <View style={styles.btnPanel}>
              <Button
                title="确认绑定"
                backgroundColor="#5068E6"
                borderRadius={4}
                buttonStyle={[{ marginBottom: 15, marginTop: 10, width: screenWidth * 0.94,shadowOpacity: 1,
                  shadowRadius: 1,
                  shadowColor:"black",
                  shadowOffset:{width:0,height:1} }]}
                onPress={() => this.confirm()}
              />

            </View>
          </ScrollView>
       
            </View>
            </TouchableWithoutFeedback>
        );
    }

}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F4F4F4',
        height: screenHeight,
    },
    war: {
        marginLeft: 20,
        marginRight: 20,
        color: "#6A737D",
        fontSize: 16,
      },
      row: {
        flexDirection: 'row'
      },
      unionIcon: {
        width: 36,
        height: 36
      },
      alignItems: {
        alignItems: 'center'
      },
      cardForm: {
        backgroundColor: '#fff',
      },
      info: {
        justifyContent: 'space-between',
        //height: 60,
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        padding: 10
      },
      marginBottom: {
        //marginBottom: 8,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#efefef',
        borderStyle: 'solid',
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderTopColor: 'transparent',
        justifyContent: 'center',
        paddingTop: 5,
        paddingBottom: 5
      },
      border: {
        borderWidth: 1,
        borderColor: '#bbb',
        borderStyle: 'solid',
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
      },
      title: {
        width: screenWidth,
        height: 70,
        justifyContent: 'center'
      },
      text: {
        textAlign: 'center',
        fontSize: 20
      },
      position: {
        position: 'absolute',
        right: 20,
        bottom: 15
      },
      centerText: {
        fontSize: 16,
        width: 100,
        textAlign: 'left',
        color: '#666'
      },
      input: {
        width: 250,
        height: 40,
        //color: '#eee',
        //fontSize: 16,
      },
      verification: {
        width: 130,
        height: 40,
        color: '#eee',
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#bbb',
        borderStyle: 'solid',
        borderRadius: 5
      },
      v2: {
        paddingLeft: 20
      },
      m2: {
        marginLeft: 20
      },
      change: {
        position: 'absolute',
        right: 20,
        bottom: 15
      },
      cards: {
        justifyContent: 'center',
        paddingTop: 30,
        paddingBottom: 30,
    
      },
      cardsText: {
        textAlign: 'center',
        fontSize: 16,
        marginBottom: 5
      },
      tip: {
        width: screenWidth,
        height: 200,
        overflow: 'visible',
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 5,
        paddingBottom: 5,
      },
      tipText: {
        fontSize: 16,
        color: '#888888',
        flexWrap: 'wrap',
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
      buttonStyle: {
        backgroundColor: "#5677FC",
        width: 115,
        alignItems: 'center',
        height: 40,
        justifyContent: 'center',
        position: 'absolute',
        right: 0,
        borderRadius: 4,
      },
      btnText: {
        color: "#FFFFFF",
        textAlign: "center",
        fontSize: 17,
      },
      rememberMe: {
        borderWidth: 0,
        padding: 10
      },
      btnPanel: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 20,
        paddingBottom: 50,
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
});

const mapStateToProps = state => ({
});

const mapDispatchToProps = dispatch => ({
    dispatch: dispatch,
    addCreditCards:(scope) => dispatch(card.addBankCard(scope))
});


export default connect(mapStateToProps, mapDispatchToProps)(AddCard);