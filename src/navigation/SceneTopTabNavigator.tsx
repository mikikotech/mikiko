import React from 'react';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import GreenHouseScreen from '../screen/hometoptabs/GreenHouseScreen';
import OnFarmScreen from '../screen/hometoptabs/OnFarmScreen';
import OtherScreen from '../screen/hometoptabs/OtherScreen';
import {Animated, TouchableOpacity, View} from 'react-native';
import {Box, Divider, Pressable, Text} from 'native-base';
import {
  BG_DARK,
  BG_ERROR,
  BG_LIGHT,
  FONT_ACTIVE_DARK,
  FONT_INACTIVE_DARK,
  ITEM_WIDTH_H1,
  ITEM_WIDTH_H2,
  ITEM_WIDTH_H4,
  PRIMARY_COLOR,
  TAB_BAR_HEIGHT,
} from '../utils/constanta';
import SharedScreen from '../screen/hometoptabs/SharedScreen';

export type scenetabparams = {
  Greenhouse;
  Onfarm;
  Shared;
  Other;
};

const Tab = createMaterialTopTabNavigator<scenetabparams>();

function MyTabBar({state, descriptors, navigation, position}) {
  return (
    <Box
      width="100%"
      _light={{bg: BG_LIGHT}}
      _dark={{bg: BG_DARK}}
      height={TAB_BAR_HEIGHT * 1.5}
      justifyContent="center"
      alignItems={'center'}>
      <Box
        flexDirection="row"
        width={ITEM_WIDTH_H1}
        justifyContent="space-around">
        {state.routes.map((route, index) => {
          const {options} = descriptors[route.key];
          const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
              ? options.title
              : route.name;

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

          const onLongPress = () => {
            navigation.emit({
              type: 'tabLongPress',
              target: route.key,
            });
          };

          const inputRange = state.routes.map((_, i) => i);
          const opacity = position.interpolate({
            inputRange,
            outputRange: inputRange.map(i => (i === index ? 1 : 0)),
          });

          return (
            <Pressable
              key={index}
              onPress={onPress}
              justifyContent="center"
              alignItems={'center'}>
              <Text
                _light={{color: isFocused ? BG_DARK : 'gray.300'}}
                _dark={{
                  color: isFocused ? FONT_ACTIVE_DARK : FONT_INACTIVE_DARK,
                }}>
                {label}
              </Text>
              <Box
                width={ITEM_WIDTH_H4 / 2.5}
                mt={1}
                _dark={{
                  borderColor: isFocused
                    ? FONT_ACTIVE_DARK
                    : FONT_INACTIVE_DARK,
                }}
                _light={{borderColor: isFocused ? PRIMARY_COLOR : BG_LIGHT}}
                borderBottomWidth={1}
              />
            </Pressable>
          );
        })}
      </Box>
    </Box>
  );
}

const SceneTopTabNavigator = () => {
  return (
    <Tab.Navigator tabBar={props => <MyTabBar {...props} />}>
      <Tab.Screen name="Greenhouse" component={GreenHouseScreen} />
      <Tab.Screen name="Onfarm" component={OnFarmScreen} />
      <Tab.Screen name="Shared" component={SharedScreen} />
      <Tab.Screen name="Other" component={OtherScreen} />
    </Tab.Navigator>
  );
};

export default SceneTopTabNavigator;
