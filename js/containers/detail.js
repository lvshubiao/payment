/**
 * 我的店铺
 * **/
import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image,
    FlatList,
    InteractionManager,
    Platform,
    TouchableOpacity,
    ListView,
    ScrollView,
    Dimensions
} from 'react-native';

import {
    Grid,
    Row,
    Col,
    Button,
    Card,
    Avatar
} from 'react-native-elements';
import { connect } from 'react-redux';
import Resource from '../../resource/index';
import { bill } from '../actions';
const moment = require('moment');
import  {PullList}  from  'react-native-pull';
import  Spinner  from  '../components/spinner';
var screenWidth = Dimensions.get("window").width;
var screenHeight = Dimensions.get("window").height;
var pageNum = 0;
var totalList = new Array();
class Detail extends Component {
      static navigationOptions  = ({ navigation }) => ({
        title: '分润明细',
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
        this.dataSource  =  [];
        this.state = {
            mySharedProfit:0,
            myAllSharedProfit:0,
            mySharedProfitDetail:new ListView.DataSource({rowHasChanged: (r1, r2)=>r1 != r2}),
            limit:0
        }
      }
      componentDidMount() {
        this.refs.spinner.loading();
        this.getSharedProfit(10, 0).then((data)=>{
            var mySharedProfitDetail = data.mySharedProfitDetail;
            if(mySharedProfitDetail!=null){
                for (var i = 0; i < 10; i++) {
                    if(mySharedProfitDetail[i] != undefined){
                      totalList.push(mySharedProfitDetail[i]);
                    }
                }
                this.setState({
                    mySharedProfit:data.mySharedProfit,
                    myAllSharedProfit: data.myAllSharedProfit,
                    mySharedProfitDetail:this.state.mySharedProfitDetail.cloneWithRows(totalList),
                    limit:totalList.length
                })
            }
            this.refs.spinner.done();
        },(err)=>{
            this.refs.spinner.done();
        });
      }
      onPullRelease(resolve)  {
        //do  something
        setTimeout(()=>{
            this.getSharedProfit(10,  0).then((data)=>{
              var mySharedProfitDetail = data.mySharedProfitDetail;
              if(mySharedProfitDetail!=null){
                totalList = new Array();
                for (var i = 0; i < 10; i++) {
                    if(mySharedProfitDetail[i] != undefined){
                      totalList.push(mySharedProfitDetail[i]);
                    }
                }
                this.setState({
                    mySharedProfitDetail:this.state.mySharedProfitDetail.cloneWithRows(totalList),
                })
            }
            });
            resolve();
        },2000)
    }
    getSharedProfit(limit,offset){
        return this.props.getSharedProfit(limit,offset);
    }
    loadMore(){
        pageNum = pageNum + 1;
        this.getSharedProfit(10,  pageNum).then((data)=>{
            var mySharedProfitDetail = data.mySharedProfitDetail;
            if(mySharedProfitDetail != null){
            for (var i = 0; i < 10; i++) {
                if(mySharedProfitDetail[i] != undefined&& mySharedProfitDetail[i].orderId){
                    let orderIds = mySharedProfitDetail[i].orderId;
                    let isAdd = false;
                   for (var i in totalList) {
                       if(totalList[i].orderId){
                        let localOrderId = totalList[i].orderId;
                        if(localOrderId === orderIds){
                            isAdd = true;
                        }
                       }
                   }
                   if(isAdd === false){
                    totalList.push(mySharedProfitDetail[i]); 
                   }
                }
            }
            this.setState({
                mySharedProfitDetail: this.state.mySharedProfitDetail.cloneWithRows(totalList),
        });
        }
            this.refs.spinner.done();
        },(error) => {
        this.refs.spinner.done();
        });
  }
  renderRow(profit, sectionID, rowID, highlightRow){
    if(!profit){
        return;
      }
    return (
                <Card style={styles.listItem}>
                    <View style={styles.pannel}>
                    <View>
                        <Text style={styles.listItemMoney}>{profit.last4NumberPhone}消费{profit.commissionSource}元，获得分润</Text>
                        <Text style={styles.listItemTime}>{moment(profit.createAt * 1000).format('YYYY-MM-DD HH:mm:ss')}</Text>
                    </View>
                    <View>
                        <Text style={styles.listItemAddMoney}>+{profit.commission}元</Text>
                    </View>
                    </View>
                </Card>
    )
  }
    render() {
        const { navigate } = this.props.navigation;
        let profits = this.state.list || [];
        let noDataView = (
            <View style={{alignItems:'center'}}>
                <Image style={{  width: 60,height: 60, marginTop: 160}} source={Resource.image.ICON_NO_DATA}/>
                <Text style={{marginTop: 10}}>你还没有分润记录</Text>
            </View>
            )
        return (
                <View >
                    <Spinner ref="spinner"/>
                    <View style={styles.container}>
                        <View style={styles.primary}>
                            <View style={styles.mt}>
                                <Text style={styles.title}>我的分润</Text>
                            </View>
                            <View>
                                <Text style={styles.remind}>{this.state.mySharedProfit}</Text>
                            </View>
                        </View>
                        <TouchableOpacity style={styles.width100} 
                        onPress={() => navigate('TakeCash',{mySharedProfit:this.state.mySharedProfit})}
                        >
                        <Text style={styles.white}>提现</Text>
                        </TouchableOpacity>
                    </View>
                <View style={styles.profit}>
                    <Text style={styles.profitText}>累计总分润:</Text>
                    <Text style={styles.profitRedText}>{this.state.myAllSharedProfit}</Text>
                </View>
                <View style={styles.list}>
                    <ScrollView style={styles.scrollViewContainer} >
                        {this.state.limit===0&&profits.length===0?noDataView:
                        <PullList
                        style={{height:470}}
                        onPullRelease={this.onPullRelease.bind(this)}
                        dataSource={this.state.mySharedProfitDetail} 
                        renderRow={this.renderRow.bind(this)}
                        onEndReached={this.loadMore.bind(this)}
                        onEndReachedThreshold={0.5}
                        />}
                    </ScrollView>
                </View>

            </View>
        );
    }

}
const styles = StyleSheet.create({
    container: {
        paddingLeft: 0,
    },
    primary: {
        flex: 0,
        height: 80,
        backgroundColor: "#0076ff",
        paddingLeft:15
    },
    mt: {
        marginTop: 10,
    },
    title: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#CDD8FD"
    },
    remind: {
        fontSize: 25,
        color: "#fff",
        marginTop:10,
    },
    pannel: {
        flexDirection: 'row',
        backgroundColor: "#fff",
        padding: 20,
        justifyContent:'space-between',
        marginTop:5
    },
    pannelLeft: {
        padding: 15,
    },
    listItemIcon: {
        height: 25,
        width: 25
    },
    pannelRight: {
        paddingTop: 15,
        paddingBottom: 15,
    },
    listItemTitle: {
        fontSize: 16,
        marginBottom: 5,
    },
    listItemTime: {
        fontSize: 16,
        color: "#999",
        marginTop:15,
    },
    listItemContent: {
        fontSize: 16,
        marginBottom: 5,
    },
    listItemMoney: {
        fontSize: 16
    },
    listItemAddMoney:{
        fontSize:16,
        color:'red'
    },
    white:{
        color:'#fff',
        fontSize:16,
        backgroundColor:'#0076ff'
      },
    width100:{
        width:80,
        justifyContent:'center',
        alignItems:'center',
        position:'absolute',
        right:10,
        bottom:20,
        borderWidth:1,
        borderColor:'#fff',
        borderStyle:'solid',
        paddingBottom:10,
        paddingTop:10,
        borderRadius:10,
    },
    profit:{
        justifyContent:'flex-end',
        alignItems:'center',
        flexDirection: 'row',
        height:40,
        paddingRight:20
    },
    profitText:{
        fontSize:16,
    },
    profitRedText:{
        fontSize:16,
        color:'red',
        paddingLeft:10
    }
});

const mapStateToProps = state => ({
    status: state.bill.profits.status,
    error: state.bill.profits.error,
    profits: state.bill.profits.data,
  });
  
  
  /**
   * 这里指定要map到props的事件
   * 一般情况下该conponent需要发送的action事件都应该定义在这里
   * 如果偷懒不定义这个方法，那么在component中，直接引用dispatch去发送action
   * @param {*} dispatch 
   */
  const mapDispatchToProps = dispatch => ({
    dispatch: dispatch,
    getSharedProfit: (limit, offset) => dispatch(bill.getSharedProfit(limit, offset))
  });
  
  /**
   * 如果没有传入mapDispatchToProps，默认会把dispatch map到props
   * 如果传入的话，必须显示的指定，否则会undefined
   */
  export default connect(mapStateToProps,mapDispatchToProps)(Detail);