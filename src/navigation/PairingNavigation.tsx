import React from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {createStackNavigator, StackScreenProps} from '@react-navigation/stack';
import PairingScreen from '../screen/pairingscreens/PairingScreen';
import BarcodeScreen from '../screen/pairingscreens/BarcodeScreen';
import WifiScreen from '../screen/pairingscreens/WifiScreen';
import SettingsUpScreen from '../screen/pairingscreens/SettingsUpScreen';
import DeviceInfoScreen from '../screen/pairingscreens/DeviceInfoScreen';
import {
  BG_ERROR,
  BG_LIGHT,
  FONT_INACTIVE_LIGHT,
  FONT_TITLE,
  PRIMARY_COLOR,
  TAB_BAR_HEIGHT,
} from '../utils/constanta';
import MapScreen from '../screen/pairingscreens/MapScreen';
import FailedScreen from '../screen/pairingscreens/FailedScreen';
import {Box, Icon, Pressable, Text} from 'native-base';
import ConfirmPairingScreen from '../screen/pairingscreens/ConfirmPairingScreen';
import AllDeviceNavigator from './AllDeviceNavigator';
import CameraPairingScreen from '../screen/pairingscreens/CameraPairingScreen';
import CameraBarcodeScreen from '../screen/pairingscreens/CameraBorcodeScreen';
import TuyaSettingScreen from '../screen/pairingscreens/TuyaSettingScreen';

export type PairingParams = {
  Barcode;
  Confirm;
  Wifi;
  Settingup;
  Map;
  Deviceinfo;
  pairing;
  Failed;
  Alldevices;
  Confirmpairing;
  Camerapairing;
  Camerabarcode;
  Tuyasetting;
};

const Stack = createStackNavigator<PairingParams>();
type Nav = StackScreenProps<PairingParams>;

const PairingNavigation = ({navigation}: Nav) => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {backgroundColor: PRIMARY_COLOR, height: TAB_BAR_HEIGHT},
        headerTitleAlign: 'center',
        headerTitleStyle: {color: FONT_INACTIVE_LIGHT, fontSize: FONT_TITLE},
        headerTintColor: FONT_INACTIVE_LIGHT,
      }}>
      <Stack.Screen
        name="pairing"
        component={PairingScreen}
        options={{
          title: 'Add Device',
          headerRight: () => {
            return (
              <Pressable
                mr={3}
                onPress={() => {
                  navigation.navigate('Alldevices');
                }}>
                <Text color={FONT_INACTIVE_LIGHT}>All Device</Text>
              </Pressable>
            );
          },
        }}
      />
      <Stack.Screen
        name="Barcode"
        component={BarcodeScreen}
        options={{title: 'Add Device', headerShown: false}}
      />
      <Stack.Screen
        name="Wifi"
        component={WifiScreen}
        options={{title: 'Add Device'}}
      />
      <Stack.Screen
        name="Settingup"
        component={SettingsUpScreen}
        options={{title: 'Add Device'}}
      />
      <Stack.Screen
        name="Failed"
        component={FailedScreen}
        options={{
          title: 'Error',
          headerStyle: {backgroundColor: BG_ERROR, height: TAB_BAR_HEIGHT},
          headerTitleStyle: {color: FONT_INACTIVE_LIGHT, fontSize: FONT_TITLE},
          headerLeft: () => (
            <Icon
              as={MaterialCommunityIcons}
              name="close"
              size={5}
              ml={2}
              color={FONT_INACTIVE_LIGHT}
              onPress={() => {
                navigation.navigate('Wifi');
              }}
            />
          ),
        }}
      />
      <Stack.Screen
        name="Map"
        component={MapScreen}
        options={{title: 'Add Device'}}
      />
      <Stack.Screen
        name="Deviceinfo"
        component={DeviceInfoScreen}
        options={{title: 'Add Device', headerLeft: () => <></>}}
      />
      <Stack.Screen
        name="Alldevices"
        component={AllDeviceNavigator}
        options={{
          title: 'Device List',
          headerRight: () => {
            return (
              <Pressable
                mr={3}
                onPress={() => {
                  // navigation.navigate('Alldevices');
                }}>
                <Icon
                  as={MaterialCommunityIcons}
                  name="scan-helper"
                  size={5}
                  color={FONT_INACTIVE_LIGHT}
                />
              </Pressable>
            );
          },
        }}
      />
      <Stack.Screen
        name="Confirmpairing"
        component={ConfirmPairingScreen}
        options={{title: 'Add Device'}}
      />
      <Stack.Screen
        name="Camerapairing"
        component={CameraPairingScreen}
        options={{title: 'Add Device'}}
      />
      <Stack.Screen
        name="Camerabarcode"
        component={CameraBarcodeScreen}
        options={{title: 'Add Device'}}
      />
      <Stack.Screen
        name="Tuyasetting"
        component={TuyaSettingScreen}
        options={{title: 'Add Device'}}
      />
    </Stack.Navigator>
  );
};

export default PairingNavigation;
