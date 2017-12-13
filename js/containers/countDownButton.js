
import React from 'react';
import {View,Text,TouchableOpacity} from 'react-native';

export default class Verfiy extends Component {
	
	  constructor(props) {
		super(props);
	  }
	
	  componentWillReceiveProps(nextProps) {
		if(nextProps.seconds==0) {
		  this.interval && clearInterval(this.interval);
		  this.props.resetCount();
		}
	  }
	
	  onPress() {
		this.interval = setInterval(() => {
		  this.props.countdown(this.props.seconds - 1,true);
		}, 1000);
		this.props.onVerfiy();
	  }
	
	
	  render() {
		var content;
		if(this.props.seconds == 60) {
		  content = '获取验证码';
		} else {
		  content = '('+ this.props.seconds + ')重新获取';
		}
		return (
		  <Button onPress={()=>this.onPress()}
				  style={{backgroundColor: '#ff5a37',width:150}}
				  textStyle={{fontSize: 18}}
				  isDisabled={this.props.isDisabled}>
			{content}
		  </Button>
		);
	  }
	}
