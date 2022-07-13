import {Box} from 'native-base';
import React from 'react';
import {WebView} from 'react-native-webview';

const ManualUpdate = () => {
  return <WebView source={{uri: 'http://TestClient.local'}} />;
};

export default ManualUpdate;
