import React, {useLayoutEffect} from 'react';
import RouteNavigation from './src/route/RouteNavigation';
import {Provider} from 'react-redux';
import store from './src/redux/store';
import Heartbeat from './Heartbeat';

const App = () => {
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
