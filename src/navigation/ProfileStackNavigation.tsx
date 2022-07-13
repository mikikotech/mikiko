import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import HelpFeedbackScreen from '../screen/profilescreen/helpFeedbackScreen';
import ProfileScreen from '../screen/profilescreen/ProfileScreen';
import {
  FONT_INACTIVE_LIGHT,
  FONT_TITLE,
  PRIMARY_COLOR,
  TAB_BAR_HEIGHT,
} from '../utils/constanta';

export type ProfileStackParams = {
  Profile;
  Helpfeedback;
};

const Stack = createStackNavigator<ProfileStackParams>();

const ProfileStackScreen = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {backgroundColor: PRIMARY_COLOR, height: TAB_BAR_HEIGHT},
        headerTitleAlign: 'center',
        headerTitleStyle: {color: FONT_INACTIVE_LIGHT, fontSize: FONT_TITLE},
        headerTintColor: FONT_INACTIVE_LIGHT,
      }}>
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen
        name="Helpfeedback"
        component={HelpFeedbackScreen}
        options={{
          title: 'Help & Feedback',
        }}
      />
    </Stack.Navigator>
  );
};

export default ProfileStackScreen;
