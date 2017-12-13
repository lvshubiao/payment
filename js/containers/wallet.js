 /**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  ScrollView
} from 'react-native';


export default class Wallet extends Component<{}> {
  static navigationOptions  = ({ navigation }) => ({
    title: '收银台',
    headerLeft: (
      <TouchableOpacity onPress={() => {
          navigation.goBack();    
      }}
      >
          <Image style={{ width: 15, height: 30,marginLeft:10}}
              source={Resource.image.ICON_BACK}
          />
      </TouchableOpacity>
  ),
  headerRight: (
    <View style={{height: 30,width: 55,justifyContent: 'center',paddingRight:15} }/>
),
headerTitleStyle:{alignSelf:'center'},
  });

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          Welcome WAllet!
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
