import React, {useEffect, useLayoutEffect} from 'react';
import RouteNavigation from './src/route/RouteNavigation';
import {Provider} from 'react-redux';
import store from './src/redux/store';
import Heartbeat from './Heartbeat';

const App = () => {
  // useEffect(() => {
  //   const appStateListener = AppState.addEventListener('change', res => {
  //     if (res == 'background' || res == 'inactive') {
  //       mqtt.disconnectAll();
  //     }
  //     console.warn(
  //       'app listener =============================================== ',
  //       res,
  //     );
  //   });

  //   return () => appStateListener.remove();
  // }, []);

  useLayoutEffect(() => {
    Heartbeat.startService();
  }, []);

  return (
    <Provider store={store}>
      <RouteNavigation />
    </Provider>
  );
};

export default App;
