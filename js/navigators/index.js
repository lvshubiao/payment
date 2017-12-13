
/**
 * 路由配置
 */
import React from 'react';
import { addNavigationHelpers, StackNavigator, TabNavigator, TabBarBottom } from 'react-navigation';
import TabBarItem from './tabBarItem';
import Main from '../containers/main';
import Wallet from '../containers/wallet';
import Profile from '../containers/profile';
import Other from '../containers/other';
import Login from '../containers/login';
import Store from '../containers/store';
import Detail from '../containers/detail';
import Bill from '../containers/bill';
import PayByCode from '../containers/pay_by_code';
import PayByCard from '../containers/pay_by_card';
import PayByWeChat from '../containers/pay_by_wechat';
import UnionpayOrder from '../containers/unionpay_order';
import UnionPayOrderPayment from '../containers/unionPay_order_payment'
import BankCard from '../containers/bankcard';
import Share from '../containers/share';
import ShareDetail from '../containers/shareDetail';
import Team from '../containers/team';
import Settings from '../containers/set';
import TakeCash from '../containers/takecash';
import ReceivablesResults from '../containers/receivables_results';
import ReceivablesDetail from '../containers/receivables_detail';
import ForgetPassword from '../containers/forget_pwd';
import Register from '../containers/register';
import Identification from '../containers/identification';
import ModifyPassword from '../containers/modify_pwd';
import Banding from '../containers/banding';
import About from '../containers/about';
import UploadIdcard from '../containers/upload_idcard';
import MyCode from '../containers/myCode';
import AddCard from '../containers/addcard';
import Help from '../containers/help';
import SwitchCard from '../containers/switchCard';
import Service from '../containers/service';
import RealReceivablesDetail from '../containers/real_receivables_detail'
//底部的tabBar导航
const TabBar = TabNavigator({
  Main: {
    screen: Main,
    
    navigationOptions: ({ navigation }) => ({
      tabBarLabel: '首页',
      tabBarIcon: ({ focused, tintColor }) => (
        <TabBarItem
          tintColor={tintColor}
          focused={focused}
          normalImage={require('../../resource/image/tab_home.png')}
          selectedImage={require('../../resource/image/tab_home_selected.png')}
        />

      )
    }),
  },
  Wallet: {
    screen: Store,
    navigationOptions: ({ navigation }) => ({
      tabBarLabel: '我的店铺',
      tabBarIcon: ({ focused, tintColor }) => (
        <TabBarItem
          tintColor={tintColor}
          focused={focused}
          normalImage={require('../../resource/image/tab_store.png')}
          selectedImage={require('../../resource/image/tab_store_selected.png')}
        />

      )
    }),
  },
  Profile: {
    screen: Profile,
    navigationOptions: ({ navigation }) => ({
      tabBarLabel: '我的',
      tabBarIcon: ({ focused, tintColor }) => (
        <TabBarItem
          tintColor={tintColor}
          focused={focused}
          normalImage={require('../../resource/image/tab_profile.png')}
          selectedImage={require('../../resource/image/tab_profile_selected.png')}
        />
      )
    }),
  },
}, {
    animationEnabled: false, // 切换页面时不显示动画
    tabBarPosition: 'bottom', // 显示在底端，android 默认是显示在页面顶端的
    swipeEnabled: false, // 禁止左右滑动
    backBehavior: 'none', // 按 back 键是否跳转到第一个 Tab， none 为不跳转
    tabBarComponent: TabBarBottom,
    tabBarOptions: {
      labelStyle: {
        fontSize: 12,
      },
      style: {
        height: 55,
        paddingTop: 5,
        paddingBottom: 5,
        backgroundColor: '#fff'
      }
    }

  });

//整个应用的路由栈
export const AppNavigator = StackNavigator({
  TabBar: {
    screen: TabBar
  },
  Service: {
    screen: Service
  },
  AddCard: {
    screen: AddCard
  },
  Other: {
    screen: Other
  },
  SwitchCard: {
    screen: SwitchCard
  },
  Login: {
    screen: Login
  },
  Detail: {
    screen: Detail
  },
  Bill: {
    screen: Bill
  },
  PayByCode: {
    screen: PayByCode
  },
  PayByCard: {
    screen: PayByCard
  },
  PayByWeChat: {
    screen: PayByWeChat
  },
  Unionpay_order: {
    screen: UnionpayOrder
  },
  UnionPay_order_payment: {
    screen: UnionPayOrderPayment
  },
  BankCard: {
    screen: BankCard
  },
  Store: {
    screen: Store
  },
  Share: {
    screen: Share
  },
  ShareDetail: {
    screen: ShareDetail
  },
  Team: {
    screen: Team
  },
  Settings: {
    screen: Settings
  },
  TakeCash: {
    screen: TakeCash
  },
  Receivables_results: {
    screen: ReceivablesResults
  },
  Receivables_detail: {
    screen: ReceivablesDetail,
  },
  Identification: {
    screen: Identification
  },
  ForgetPassword: {
    screen: ForgetPassword
  },
  Register: {
    screen: Register
  },
  ModifyPassword: {
    screen: ModifyPassword
  },
  About: {
    screen: About
  },
  UploadIdcard: {
    screen: UploadIdcard
  },
  Banding: {
    screen: Banding
  },
  MyCode:{
    screen: MyCode
  },
  Help:{
    screen: Help
  },
  RealReceivablesDetail:{
    screen:RealReceivablesDetail
  }
});

const Route = () => (
  <AppNavigator />
);

export default Route;

