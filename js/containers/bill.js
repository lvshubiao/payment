/**
  *  欢迎页
  *  @flow
  *  **/
  import  React,  {  Component  }  from  'react';
  import  {
      StyleSheet,
      View,
      Text,
      Image,
      InteractionManager,
      Platform,
      Dimensions,
      TextInput,
      TouchableOpacity,
      TouchableHighlight,
      ScrollView,
      ListView,
  }  from  'react-native';
  import  {  Button,  List,  ListItem  }  from  'react-native-elements';
  import  Resource  from  '../../resource/index';
  import  {  bill  }  from  '../actions';
  import  {  connect  }  from  'react-redux';
  import  {  RadioGroup,  RadioButton  }  from  'react-native-flexi-radio-button';
  import  {  UNIONPAY,  WEIXIN_SCAN_BY_USER,  ALIPAY_SCAN_BY_USER  }  from  '../constants';
  const  moment  =  require('moment');
  import  {  PAY_RESULT_PRE,  PAY_RESULT_UNION_CONFORM,  PAY_RESULT_OK,  PAY_RESULT_FAIL  }  from  '../constants';
  import  commonStyle  from  '../common/style';
  import  Spinner  from  '../components/spinner';
  import  {PullList}  from  'react-native-pull';
  var  screenWidth  =  Dimensions.get("window").width;
  var  screenHeight  =  Dimensions.get("window").height;
  var pageNum = 0;
  var totalList = new Array();
  class  Bill  extends  Component  {
      static  navigationOptions    =  ({  navigation  })  =>  ({
          title:  '我的账单',
          headerLeft:  (
              <TouchableOpacity  onPress={()  =>  {
                      navigation.goBack();        
              }}
              >
                      <Image  style={{  width:  30,  height:  30,marginLeft:10}}
                              source={Resource.image.ICON_BACK}
                      />
              </TouchableOpacity>
      ),
      headerRight:  (
          <View  style={{height:  30,width:  55,justifyContent:  'center',paddingRight:15}  }/>
  ),
  headerTitleStyle:{alignSelf:'center'},
      });
      constructor()  {
          super();
          this.dataSource  =  [];
          this.state  =  {
              active:  '',
              dataSource : new ListView.DataSource({rowHasChanged: (r1, r2)=>r1 != r2}),
              limit:0
          }
      }
      componentDidMount()  {
          this.refs.spinner.loading();
          this.getBills('',  10,  pageNum).then((bill)=>{
            console.log(bill);
              if(bill != null){
                for (let i = 0; i < 10; i++) {
                  if(bill[i] != undefined){
                    totalList.push(bill[i]);
                  }
              }
              this.setState({
                dataSource: this.state.dataSource.cloneWithRows(totalList),
                limit:totalList.length
            });
            }
              this.refs.spinner.done();
          },(error) => {
            this.refs.spinner.done();
          }
        );
      }
     
      componentWillUnmount()  {
  
      }
  
      _handClick(way)  {
          this.setState({
              active:way,
          })
          this.getBills(way,  10,  0).then((bill)=>{
            if(bill != null){
              totalList = new Array();
              this.setState({
                limit:0
              })
              pageNum = 1;
              for (let i = 0; i < 10; i++) {
                if(bill[i] != undefined){
                  totalList.push(bill[i]);
                }
            }
            this.setState({
              dataSource: this.state.dataSource.cloneWithRows(totalList),
              limit:totalList.length
          });
          }
            this.refs.spinner.done();
        },(error) => {
          this.refs.spinner.done();
        });
      }
  
      getBills(paymentMethod,  limit,  offset)  {
          return  this.props.getBills({  paymentMethod,  limit,  offset  });
      }
  
      goPayDetail(paymentId)  {
          const  {  navigate  }  =  this.props.navigation;
          navigate('Receivables_detail',  {paymentId:  paymentId})
      }
      onPullRelease(resolve)  {
          setTimeout(()=>{
            this.getBills(this.state.active,  10,  0).then((bill)=>{
              if(bill != null){
                totalList = new Array();
                for (let i = 0; i < 10; i++) {
                  if(bill[i] != undefined){
                    totalList.push(bill[i]);
                  }
              }
              this.setState({
                dataSource: this.state.dataSource.cloneWithRows(totalList),
            });
            }
              this.refs.spinner.done();
          },(error) => {
            this.refs.spinner.done();
          });
            resolve();
          },2000)
      }
      loadMore(){
              pageNum = pageNum + 1;
              this.getBills(this.state.active,  10,  pageNum).then((bill)=>{
                if(bill != null){
                  for (let i = 0; i < 10; i++) {
                    if(bill[i] != undefined && bill[i].orderId){
                      let orderIds = bill[i].orderId;
                      let canAdd = false;
                      for (const key in totalList) {
                        let localId = totalList[key].orderId;
                        if(orderIds === localId){
                          canAdd = true;
                        }
                      }
                      if(canAdd === false){
                        totalList.push(bill[i]); 
                      }
                    }
                }
                this.setState({
                  dataSource: this.state.dataSource.cloneWithRows(totalList),
              });
              }
                this.refs.spinner.done();
            },(error) => {
              this.refs.spinner.done();
            }
          );
    }
    renderRow(bill, sectionID, rowID, highlightRow){
      if(!bill){
        return;
      }
      let avatar = Resource.image.ICON_WEBCHAT;
      let title = '';
      if (bill.paymentMethod === WEIXIN_SCAN_BY_USER) {
        avatar = Resource.image.ICON_WEBCHAT;
        title = '微信扫码付款';
      }
      if (bill.paymentMethod === ALIPAY_SCAN_BY_USER) {
        avatar = Resource.image.ICON_ALIPAY;
        title = '支付宝扫码付款';
      }
      if (bill.paymentMethod === UNIONPAY) {
        avatar = Resource.image.ICON_UNION;
        title = '银联快捷支付';
      }
  
      let status = null;
      
      if (bill.status === PAY_RESULT_PRE) {
        status =  ( <Text style={[styles.loading,commonStyle.text]}>未付款</Text> )
      }
      if (bill.status === PAY_RESULT_UNION_CONFORM) {
        status = ( <Text style={[styles.loading,commonStyle.text]}>未付款</Text> )
      }
      if (bill.status === PAY_RESULT_OK) {
        status = ( <Text style={[styles.success,commonStyle.text]}>成功</Text> )
      }
      if (bill.status === PAY_RESULT_FAIL) {
        status = ( <Text style={[styles.error,commonStyle.text]}>失败</Text> )
      }
  
      return (
        <TouchableOpacity onPress={() => this.goPayDetail(bill.paymentId)} key={bill.paymentId} >
          <ListItem
            avatar={avatar}
            avatarStyle={styles.avatarStyle}
            title={title}
            subtitle={
              <View >
                <View>
                  <Text style={styles.time1}>{moment(bill.createAt * 1000).format('YYYY-MM-DD HH:mm:ss')}</Text>
                  <Text style={[styles.money,commonStyle.text]}>¥{bill.amount}</Text>
                </View>
                {status}
              </View>
            }
          />
        </TouchableOpacity>
      )
    }
  
    render() {
      let bills = this.props.bills || [];
      let noDataView = (
        <View style={{ alignItems: 'center',height:screenHeight }}>
            <Image style={styles.listNoDataIcon} source={Resource.image.ICON_NO_DATA} />
            <Text style={styles.listNoData}>你还没有账单数据</Text>
        </View>
    )
      return (
        <View style={styles.container}>
         <Spinner ref="spinner"/>
          <View style={[styles.row, styles.nav]}>
            <TouchableOpacity style={[styles.col3, this.state.active == '' ? styles.active : '']} onPress={() => this._handClick('')}>
              <Text style={this.state.active == '' ? [styles.white,commonStyle.text] : [styles.gray,commonStyle.text]}>全部</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.col3, this.state.active == WEIXIN_SCAN_BY_USER ? styles.active : '']} onPress={() => this._handClick(WEIXIN_SCAN_BY_USER)}>
              <Text style={this.state.active == WEIXIN_SCAN_BY_USER ? [styles.white,commonStyle.text] : [styles.gray,commonStyle.text]}>微信收款</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.col3, this.state.active == ALIPAY_SCAN_BY_USER ? styles.active : '']} onPress={() => this._handClick(ALIPAY_SCAN_BY_USER)}>
              <Text style={this.state.active == ALIPAY_SCAN_BY_USER ? [styles.white,commonStyle.text] : [styles.gray,commonStyle.text]}>支付宝收款</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.col3, this.state.active == UNIONPAY ? styles.active : '']} onPress={() => this._handClick(UNIONPAY)}>
              <Text style={this.state.active == UNIONPAY ? [styles.white,commonStyle.text] : [styles.gray,commonStyle.text]}>银联快捷</Text>
            </TouchableOpacity>
          </View>
          {/* <Text style={[styles.time,commonStyle.text]}>本月{new Date().getMonth() + 1}月</Text> */}
         <ScrollView> 
             {this.state.limit=== 0&& bills.length===0?noDataView:
             <PullList  
            style={{height:screenHeight-160}} 
             onPullRelease={this.onPullRelease.bind(this)}
             dataSource={this.state.dataSource} 
             renderRow={this.renderRow.bind(this)}
             onEndReached={this.loadMore.bind(this)}
             onEndReachedThreshold={0.5}
             />}
          </ScrollView>
        </View>
      );
    }
  
  }
  
  const styles = StyleSheet.create({
    container:{
      flex: 1,
      backgroundColor: '#F4F4F4',
      height: screenHeight,
    },
    row: {
      flexDirection: 'row',
    },
    nav: {
      backgroundColor: '#0076ff',
      height: 60,
    },
    active: {
      borderWidth: 3,
      borderStyle: 'solid',
      borderBottomColor: 'yellow',
      borderTopColor: 'transparent',
      borderLeftColor: 'transparent',
      borderRightColor: 'transparent',
    },
    avatarStyle: {
      backgroundColor: "#FFFFFF",
      borderRadius: 0,
    },
    col3: {
      width: '25%',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%'
    },
    white: {
      color: '#fff',
    },
    gray: {
      color: '#CDD8FD',
    },
    time: {
      marginLeft: 15,
      marginTop: 20,
      justifyContent:'center'
    },
    money: {
      position: 'absolute',
      bottom: 20,
      left: 140,
      color: 'red',
    },
    time1: {
      paddingLeft: 10,
      fontSize: 13,
      paddingTop: 5
    },
    success: {
      position: 'absolute',
      right: -13,
      bottom: 14.2,
      color: 'green'
    },
    loading: {
      position: 'absolute',
      right: -13,
      bottom: 14.2,
      color: 'blue'
    },
    error: {
      position: 'absolute',
      right: -13,
      bottom: 14.2,
      color: 'red'
    },
    listNoDataIcon: {
      width: 60,
      height: 60,
      marginTop: 160,
      
    },
    listNoData: {
    marginTop: 10,
    },
  
  });
  
  const mapStateToProps = state => ({
    status: state.bill.bills.status,
    error: state.bill.bills.error,
    bills: state.bill.bills.data,
  });
  
  /**
   * 这里指定要map到props的事件
   * 一般情况下该conponent需要发送的action事件都应该定义在这里
   * 如果偷懒不定义这个方法，那么在component中，直接引用dispatch去发送action
   * @param {*} dispatch 
   */
  const mapDispatchToProps = dispatch => ({
    dispatch: dispatch,
    getBills: ({ paymentMethod, limit, offset }) => dispatch(bill.getBill({ paymentMethod, limit, offset }))
  });
  
  /**
   * 如果没有传入mapDispatchToProps，默认会把dispatch map到props
   * 如果传入的话，必须显示的指定，否则会undefined
   */
  export default connect(mapStateToProps, mapDispatchToProps)(Bill);