import React from 'react';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import MonitoringScreen from '../screen/toptabs/MonitoringScreen';
import CameraScreen from '../screen/toptabs/CameraScreen';
import StatistikScreen from '../screen/toptabs/StatistikScreen';
import ControlingScreen from '../screen/toptabs/ControlingScreen';
import {Box, Pressable, Text} from 'native-base';
import {
  BG_DARK,
  BG_LIGHT,
  FONT_ACTIVE_LIGHT,
  FONT_DESC,
  FONT_INACTIVE_DARK,
  FONT_INACTIVE_LIGHT,
  FONT_TITLE,
  ITEM_WIDTH_H1,
  PRIMARY_COLOR,
  TAB_BAR_HEIGHT,
} from '../utils/constanta';
import {StackScreenProps} from '@react-navigation/stack';
import {HomeStackParams} from './HomeStackNavigation';

const Tab = createMaterialTopTabNavigator();

const MyTabBar = ({state, descriptors, navigation, position}) => {
  return (
    <Box
      style={{flexDirection: 'row'}}
      _light={{bg: BG_LIGHT}}
      _dark={{bg: BG_DARK}}>
      {state.routes.map((route, index) => {
        const {options} = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        var _label: string;

        if (label == '1') {
          _label = 'Monitoring';
        } else if (label == '2') {
          _label = 'Controlling';
        } else if (label == '3') {
          _label = 'Statistik';
        } else {
          _label = 'Camera';
        }

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            // The `merge: true` option makes sure that the params inside the tab screen are preserved
            navigation.navigate({name: route.name, merge: true});
          }
        };

        return (
          <Pressable
            justifyContent={'center'}
            alignItems="center"
            onPress={onPress}
            mt={5}
            flex={1}>
            <Box
              h={TAB_BAR_HEIGHT * 0.9}
              width={TAB_BAR_HEIGHT * 0.9}
              _light={{bg: isFocused ? PRIMARY_COLOR : BG_LIGHT}}
              _dark={{bg: isFocused ? PRIMARY_COLOR : BG_DARK}}
              borderWidth={2}
              zIndex={1}
              justifyContent="center"
              alignItems={'center'}
              _text={{
                _light: {
                  color: isFocused ? FONT_INACTIVE_LIGHT : FONT_ACTIVE_LIGHT,
                },
                _dark: {
                  color: isFocused ? FONT_INACTIVE_LIGHT : FONT_INACTIVE_DARK,
                },
                fontWeight: 'medium',
                fontSize: FONT_TITLE,
              }}
              borderColor={PRIMARY_COLOR}
              rounded="full">
              {label}
            </Box>
            <Box
              position={'absolute'}
              borderBottomWidth={2}
              top={TAB_BAR_HEIGHT * 0.42}
              zIndex={-1}
              width={ITEM_WIDTH_H1 / 2.5}
              borderBottomColor={PRIMARY_COLOR}
            />
            <Text
              mt={1}
              fontSize={FONT_TITLE * 0.9}
              fontWeight={'medium'}
              _light={{color: FONT_ACTIVE_LIGHT}}
              _dark={{color: FONT_INACTIVE_DARK}}>
              {_label}
            </Text>
          </Pressable>
        );
      })}
    </Box>
  );
};

type NavBar = StackScreenProps<HomeStackParams>;

const TopTabsNavigation = ({route}: NavBar) => {
  console.log('top tab bar route = ', route);

  return (
    <Tab.Navigator tabBar={props => <MyTabBar {...props} />}>
      <Tab.Screen
        name="Monitoring"
        component={MonitoringScreen}
        options={{title: '1'}}
        initialParams={{id: route?.params?.id, weather: route?.params?.weather}}
      />
      <Tab.Screen
        name="Controling"
        component={ControlingScreen}
        options={{title: '2'}}
        initialParams={{
          id: route?.params?.id,
          switchName: route?.params?.switchName,
        }}
      />
      <Tab.Screen
        name="Statistik"
        component={StatistikScreen}
        options={{title: '3'}}
        initialParams={{id: route?.params?.id}}
      />
      <Tab.Screen
        name="Camera"
        component={CameraScreen}
        options={{title: '4'}}
        initialParams={{id: route?.params?.id}}
      />
    </Tab.Navigator>
  );
};

export default TopTabsNavigation;
