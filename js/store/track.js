
'use strict';

function track(action) { 
  switch (action.type) {
    case 'LOGGED_IN':
      //todo:
      console.log('track logged in done.');
      //AppEventsLogger.logEvent('Login', 1, {source: action.source || ''});
      break;
    case 'LOGGED_OUT':
      //todo:
      //AppEventsLogger.logEvent('Logout', 1);
      break;
  }
}

export default track;