import React, {useEffect} from 'react';
import RouteNavigation from './src/route/RouteNavigation';
import {Provider} from 'react-redux';
import store from './src/redux/store';
import {AppState} from 'react-native';
import mqtt from 'sp-react-native-mqtt';

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
  return (
    <Provider store={store}>
      <RouteNavigation />
    </Provider>
  );
};

export default App;
