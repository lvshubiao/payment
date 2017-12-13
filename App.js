/**
 * React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import { AsyncStorage, AppState } from 'react-native';
import { Provider } from 'react-redux';
import Storage from 'react-native-storage';
import configureStore from './js/store/configureStore';
import Route from './js/navigators/index';


function App() {

  // init app

  // disabled YellowBox
  console.disableYellowBox = true;

  // 配置本地存储
  var storage = new Storage({
    // 最大容量，默认值1000条数据循环存储
    size: 1000,
    // 存储引擎：对于RN使用AsyncStorage，对于web使用window.localStorage
    // 如果不指定则数据只会保存在内存中，重启后即丢失
    storageBackend: AsyncStorage,
    // 数据过期时间，默认一整天（1000 * 3600 * 24 毫秒），设为null则永不过期
    defaultExpires: null,
    // 读写时在内存中缓存数据。默认启用。
    enableCache: true,
    // 如果storage中没有相应数据，或数据已过期，
    // 则会调用相应的sync方法，无缝返回最新数据。
    // sync方法的具体说明会在后文提到
    // 你可以在构造函数这里就写好sync的方法
    // 或是在任何时候，直接对storage.sync进行赋值修改
    // 或是写到另一个文件里，这里require引入
    //sync: require('你可以另外写一个文件专门处理sync')  
  });
  // 在全局范围内创建一个（且只有一个）storage实例，方便直接调用
  global.storage = storage;


  // create root component
  class Root extends Component<{}> {
    state: {
      isLoading: false,
      store: null,
    }

    constructor() {
      super();
      this.state = {
        isLoading: true,
        store: configureStore,
        currentAppState: AppState.currentState,
      };
    }

    componentDidMount() {
      AppState.addEventListener('change', this._handleAppStateChange);
    
    }

    componentWillUnmount() {
      AppState.removeEventListener('change', this._handleAppStateChange);
    }

    _handleAppStateChange = (nextAppState) => {
      if (this.state.currentAppState.match(/inactive|background/)
        && nextAppState === 'active') {
        console.log('App has come to the foreground!')
        // 这一个恢复工作或者刷新token
      }
      this.setState({ currentAppState: nextAppState });
    }

    render() {
      return (
        <Provider store={this.state.store}>
          <Route />
        </Provider>
      );
    }
  }

  return Root;
}


global.LOG = (...args) => {
  return args[args.length - 1];
};

export default App;