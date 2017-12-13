
import React from 'react';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import createLogger from 'redux-logger';
import array from './array';
import analytics from './analytics';
import reducers from '../reducers';

var isDebuggingInChrome = __DEV__ && !!window.navigator.userAgent;

var logger = createLogger({
  predicate: (getState, action) => isDebuggingInChrome,
  collapsed: true,
  duration: false,
});

//var configureStore = createStore(reducers);
var configureStore = applyMiddleware(thunk, array, analytics, logger)(createStore)(reducers);

export default configureStore;