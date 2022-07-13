import * as React from 'react';
import {Pressable, StyleSheet} from 'react-native';
import {
  useNavigationBuilder,
  TabRouter,
  TabActions,
  createNavigatorFactory,
} from '@react-navigation/native';
import {HStack, ScrollView, Box, Text} from 'native-base';
import {
  BG_BOX_DARK,
  BG_DARK,
  BG_LIGHT,
  FONT_ACTIVE_DARK,
  FONT_ACTIVE_LIGHT,
} from '../utils/constanta';

function TabNavigator({initialRouteName, children, screenOptions}) {
  const {state, navigation, descriptors, NavigationContent} =
    useNavigationBuilder(TabRouter, {
      children,
      screenOptions,
      initialRouteName,
    });

  return (
    <NavigationContent>
      <HStack flex={1}>
        <Box flexDir="column" height="100%" backgroundColor="gray.900">
          <ScrollView>
            {state.routes.map((route, index) => {
              const isFocused = state.index === index;

              return (
                <Pressable
                  key={route.key}
                  onPress={() => {
                    const event = navigation.emit({
                      type: 'tabPress',
                      target: route.key,
                      canPreventDefault: true,
                    });

                    if (!event.defaultPrevented) {
                      navigation.dispatch({
                        ...TabActions.jumpTo(route.name),
                        target: state.key,
                      });
                    }
                  }}>
                  <Box bg={isFocused ? BG_DARK : 'gray.900'}>
                    <Text
                      _light={{color: FONT_ACTIVE_LIGHT}}
                      _dark={{color: FONT_ACTIVE_DARK}}
                      padding={4}>
                      {descriptors[route.key].options.title || route.name}
                    </Text>
                  </Box>
                </Pressable>
              );
            })}
          </ScrollView>
        </Box>
        <Box style={[{flex: 1}]}>
          {state.routes.map((route, i) => {
            return (
              <Box
                key={route.key}
                style={[
                  StyleSheet.absoluteFill,
                  {display: i === state.index ? 'flex' : 'none'},
                ]}>
                {descriptors[route.key].render()}
              </Box>
            );
          })}
        </Box>
      </HStack>
    </NavigationContent>
  );
}

export const CustomNav = createNavigatorFactory(TabNavigator);
