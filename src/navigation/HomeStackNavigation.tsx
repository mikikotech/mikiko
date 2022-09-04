import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import ProfileScreen from '../screen/profilescreen/ProfileScreen';
import BottomTabsNavigator from './BottomTabsNavigation';
import TopTabsNavigation from './TopTabsNagitation';
import {
  FONT_INACTIVE_LIGHT,
  FONT_TITLE,
  PRIMARY_COLOR,
  TAB_BAR_HEIGHT,
} from '../utils/constanta';
import PairingNavigation from './PairingNavigation';
import SceneTopTabNavigator from './SceneTopTabNavigator';
import SharedImageScreen from '../screen/OtherScreen/SharedImageScreen';
import FirmwareScreen from '../screen/OtherScreen/FirmwareScreen';
import ManualUpdate from '../screen/OtherScreen/ManualUpdate';
import ScheduleScreen from '../screen/OtherScreen/ScheduleScreen';
import ScheduleDetail from '../screen/OtherScreen/ScheduleDetail';
import ActionScreen from '../screen/OtherScreen/ActionScreen';
import ActionDetail from '../screen/OtherScreen/ActionDetail';
import ScheduleEdit from '../screen/OtherScreen/ScheduleEdit';
import ActionEdit from '../screen/OtherScreen/ActionEdit';
import ProfileStackScreen from './ProfileStackNavigation';
import EditDeviceScreen from '../screen/hometoptabs/EditDeviceScreen';
import NewScheduleDetail from '../screen/OtherScreen/NewScheduleDetail';
import ControlingScreen from '../screen/toptabs/ControlingScreen';
import NewScheduleEdit from '../screen/OtherScreen/NewScheduleEdit';

export type HomeStackParams = {
  Homebase;
  Pairingbase;
  Profilebase;
  Toptabsbase;
  Schedule;
  Scheduledetail;
  Newscheduledetail;
  Newscheduleedit;
  Scheduleedit;
  Bottomtabsbase;
  Shareimage;
  Firmware;
  Manual;
  Action;
  Actiondetail;
  Actionedit;
  Editdevice;
  Controlscreen;
};

const Stack = createStackNavigator<HomeStackParams>();

const HomeStackNavigation = () => {
  const config = {
    animation: 'spring',
    config: {
      stiffness: 1000,
      damping: 500,
      mass: 3,
      overshootClamping: true,
      restDisplacementThreshold: 0.01,
      restSpeedThreshold: 0.01,
    },
  };

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {backgroundColor: PRIMARY_COLOR, height: TAB_BAR_HEIGHT},
        headerTitleAlign: 'center',
        headerTitleStyle: {color: FONT_INACTIVE_LIGHT, fontSize: FONT_TITLE},
        headerTintColor: FONT_INACTIVE_LIGHT,
        transitionSpec: {
          open: {config: config.config, animation: 'spring'},
          close: {config: config.config, animation: 'spring'},
        },
      }}>
      <Stack.Screen
        name="Bottomtabsbase"
        component={BottomTabsNavigator}
        options={{headerShown: false}}
      />
      <Stack.Screen name="Homebase" component={SceneTopTabNavigator} />
      <Stack.Screen name="Toptabsbase" component={TopTabsNavigation} />
      <Stack.Screen name="Schedule" component={ScheduleScreen} />
      <Stack.Screen
        name="Scheduledetail"
        component={ScheduleDetail}
        options={{title: 'Schedule'}}
      />
      <Stack.Screen
        name="Newscheduledetail"
        component={NewScheduleDetail}
        options={{title: 'Schedule'}}
      />
      <Stack.Screen
        name="Newscheduleedit"
        component={NewScheduleEdit}
        options={{title: 'Schedule'}}
      />
      <Stack.Screen
        name="Scheduleedit"
        component={ScheduleEdit}
        options={{title: 'Edit'}}
      />
      <Stack.Screen name="Action" component={ActionScreen} />
      <Stack.Screen
        name="Actiondetail"
        component={ActionDetail}
        options={{title: 'Action'}}
      />
      <Stack.Screen
        name="Actionedit"
        component={ActionEdit}
        options={{title: 'Edit'}}
      />
      <Stack.Screen
        name="Pairingbase"
        component={PairingNavigation}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Profilebase"
        component={ProfileStackScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Shareimage"
        component={SharedImageScreen}
        options={{
          title: 'Share',
          headerTitleStyle: {fontStyle: 'italic', fontSize: FONT_TITLE},
        }}
      />
      <Stack.Screen
        name="Firmware"
        component={FirmwareScreen}
        options={{
          headerTitleStyle: {fontStyle: 'italic', fontSize: FONT_TITLE},
        }}
      />
      <Stack.Screen
        name="Manual"
        component={ManualUpdate}
        options={{
          title: 'Firmware',
          headerTitleStyle: {fontStyle: 'italic', fontSize: FONT_TITLE},
        }}
      />
      <Stack.Screen
        name="Editdevice"
        component={EditDeviceScreen}
        options={{title: 'Device Config'}}
      />
      <Stack.Screen
        name="Controlscreen"
        component={ControlingScreen}
        options={{title: 'Control'}}
      />
    </Stack.Navigator>
  );
};

export default HomeStackNavigation;
