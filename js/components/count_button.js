
'use strict';

import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    ActivityIndicator,
} from 'react-native';
import { Button } from 'react-native-elements';
export default class CountDown extends Component {

    constructor(props) {
        super(props);
        this.state = {
            time: 60,
            disabled:false,
            text:"获取验证码",
        };
    }
    _onPress() {
        if (this.state.disabled) {
            //nothing
        } else {
            this.setState({ disabled: true,time:60,text:"60秒后重新获取"});
            this.runTimer();
            if (this.props.onPress) {
                this.props.onPress();
            }
        }
    }
    runTimer() {
        this.timer = setTimeout(
            () => {
                var time = this.state.time - 1;
                this.setState({ time: time,text:time+"秒后重新获取"});
                if (this.state.time >= 1) {
                    this.runTimer();
                } else {
                    this.timer && clearTimeout(this.timer);
                    this.setState({ disabled: false,time:60,text:"获取验证码"});
                }
            },
            1000
        );
    }
    componentWillUnmount() {
        this.timer && clearTimeout(this.timer);
    }
    render() {
        return (
            <View style={styles.container}>
                <Button
                    // style={{height: 20, margin: 0}}
                    title={this.state.text}
                    color="#fff"
                    backgroundColor="#0076ff"
                    disabled={this.state.disabled}
                    borderRadius={4}
                    containerViewStyle={{ marginLeft: 0, marginRight: 10,shadowOpacity: 1,
                        shadowRadius: 1,
                        shadowColor:"black",
                        shadowOffset:{width:0,height:1}}}
                    onPress={this._onPress.bind(this)}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({

});
/*

export default function<S: *>(navigation: NavigationProp<S, NavigationAction>) {
    // 添加点击判断
    let debounce = true;
    return {
        ...navigation,
        goBack: (key?: ?string): boolean =>
            navigation.dispatch(
                NavigationActions.back({
                    key: key === undefined ? navigation.state.key : key,
                }),
            ),
        navigate: (routeName: string,
                   params?: NavigationParams,
                   action?: NavigationAction,): boolean => {
            if (debounce) {
                debounce = false;
                navigation.dispatch(
                    NavigationActions.navigate({
                        routeName,
                        params,
                        action,
                    }),
                );
                setTimeout(
                    () => {
                        debounce = true;
                    },
                500,
                );
                return true;
            }
            return false;
        },
      setParams: (params: NavigationParams): boolean =>
        navigation.dispatch(
          NavigationActions.setParams({
            params,
            key: navigation.state.key,
          }),
        ),
    };
  }
  */