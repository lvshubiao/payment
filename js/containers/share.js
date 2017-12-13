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
  TouchableOpacity,
  Image,
  Keyboard
} from 'react-native';
import { connect } from 'react-redux';
import Resource from '../../resource/index';
import { List, ListItem } from 'react-native-elements';
import { user } from '../actions';
var screenWidth = Dimensions.get("window").width;
var screenHeight = Dimensions.get("window").height;

class Share extends Component {

  static navigationOptions  = ({ navigation }) => ({
    title: "文案分享",
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
      this.state = {
        list:[]
         }
        }
  componentDidMount(){
    this.props.getFaile().then((bill) => {
      this.setState({ list: bill});
  });
  }
    renderRow (rowData, sectionID) {
        const { navigate } = this.props.navigation;
        return (
     <TouchableOpacity onPress={() => navigate('ShareDetail',{url:rowData.spreadUrl,title:rowData.title})}>
          <ListItem
            style={styles.item}
            key={sectionID}
            title={rowData.title}
            titleStyle={styles.titleStyle}
            subtitleStyle={styles.subStyle}
            subtitle={rowData.content}
          />
    </TouchableOpacity>
        )
      }
    render() {
      const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
      return (
        <View style={styles.container}>
          <ListView
            style={styles.listView}
            renderRow={this.renderRow.bind(this)}
            dataSource={ds.cloneWithRows(this.state.list)}
          />
        </View>
      );
    }
  }
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#F4F4F4',
    },
    listView:{
        marginLeft:0,
        marginTop:0,
        width:screenWidth,
        height:screenHeight,
    },
    item:{
        backgroundColor:"#FFFFFF",
        marginTop:5,
    },
    titleStyle:{
        color:"#4D5256",
        fontSize:16,
        marginBottom:7,
        marginTop:7,
    },
    subStyle:{
        color:"#A9A9A9",
        fontSize:12,
        marginBottom:7,
    },
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
    getFaile: () => dispatch(user.getFaile())
  });
  
  /**
   * 如果没有传入mapDispatchToProps，默认会把dispatch map到props
   * 如果传入的话，必须显示的指定，否则会undefined
   */
  export default connect(mapStateToProps, mapDispatchToProps)(Share);