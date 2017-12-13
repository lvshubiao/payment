
'use strict';

import {
  Platform,
  StyleSheet
} from 'react-native';

/**
 * 改造StyleSheet，支持ios，android
 * eg：
 * button: {
    borderColor: 'transparent',
    ios: {
      height: HEIGHT
    },
    android: {
      paddingBottom: 6,
    }
  }
 * @param {*} styles 
 */

export function create(styles){
  const platformStyles = {};
  Object.keys(styles).forEach((name) => {
    let {ios, android, ...style} = {...styles[name]};
    if (ios && Platform.OS === 'ios') {
      style = {...style, ...ios};
    }
    if (android && Platform.OS === 'android') {
      style = {...style, ...android};
    }
    platformStyles[name] = style;
  });
  return StyleSheet.create(platformStyles);
}