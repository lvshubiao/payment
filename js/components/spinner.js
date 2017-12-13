
'use strict';

import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator
} from 'react-native';

export default class Spinner extends Component {
  
  constructor() {
    super();
    this.state = {
      loading: false,
      text: null
    };
  }

  loading(text) {
    this.setState({ loading: true, text: text });
    this.timeoutClose();
  }

  done() {
    this.setState({ loading: false });
    this.timer && clearTimeout(this.timer);
  }
  timeoutClose() {
    const that = this;
    this.timer = setTimeout(
      () => {
        setTimeout(()=>{ that.setState({ loading: false }); 
      }, 1000);
      },
      30000
    );
  }

  render() {
    if (this.state.loading) {
      return (
        <View style={styles.container}>
          <View style={styles.loadingContainer}>
            <View style={styles.spinnerContainer}>
              <ActivityIndicator
                style={[styles.centering, styles.horizontal]}
                animating={true}
                size='large'
                color="#fff"
              />
            </View>
            {
              (this.state.text) && (
                <Text style={styles.loadingText}>{this.state.text}</Text>)
            }
          </View>
        </View>
      );
    } else {
      return null;
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 999999,
  },
  loadingContainer: {
    padding: 8,
    backgroundColor: '#000',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0.6
  },
  loadingText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
  },
  spinnerContainer: {
    padding: 4
  },
  centering: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 0,
    margin: 0,
  },
  horizontal: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 0,
  },
});