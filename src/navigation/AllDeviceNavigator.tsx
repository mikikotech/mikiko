import React from 'react';
import ElectricalScreen from '../screen/deviceType/ElectricalScreen';
import LightingScreen from '../screen/deviceType/LightingScreen';
import MikikoScreen from '../screen/deviceType/MikikoScreen';
import OtherDeviceScreen from '../screen/deviceType/OtherScreen';
import SecurityScreen from '../screen/deviceType/SecurityScreen';
import SensorScreen from '../screen/deviceType/SensorScreen';
import {CustomNav} from './CustomNav';

export type DeviceTabsParams = {
  Electrical;
  Lighting;
  Sensor;
  Security;
  Mikiko;
  Other;
};

const Tab = CustomNav<DeviceTabsParams>();

const AllDeviceNavigator = () => {
  return (
    <Tab.Navigator initialRouteName="Electrical">
      <Tab.Screen name="Electrical" component={ElectricalScreen} />
      <Tab.Screen name="Lighting" component={LightingScreen} />
      <Tab.Screen name="Sensor" component={SensorScreen} />
      <Tab.Screen name="Security" component={SecurityScreen} />
      <Tab.Screen name="Mikiko" component={MikikoScreen} />
      <Tab.Screen name="Other" component={OtherDeviceScreen} />
    </Tab.Navigator>
  );
};

export default AllDeviceNavigator;
