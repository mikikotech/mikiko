import React from 'react';
import RouteNavigation from './src/route/RouteNavigation';
import {Provider} from 'react-redux';
import store from './src/redux/store';

const App = () => {
  return (
    <Provider store={store}>
      <RouteNavigation />
    </Provider>
  );
};

export default App;
