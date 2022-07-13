import React, {useEffect} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import SignInScreen from '../screen/authscreens/SignInScreen';
import SignUpScreen from '../screen/authscreens/SignUpScreen';
import PhoneScreen from '../screen/authscreens/PhoneScreen';
import PhoneScreenOtp from '../screen/authscreens/PhoneScreeOtp';
import SplashScreen from 'react-native-splash-screen';
import {PermissionsAndroid} from 'react-native';

export type AuthStackParams = {
  Signin;
  Signup;
  Phone;
  Phoneotp;
};

const Stack = createStackNavigator<AuthStackParams>();

const AuthStackNavigation = () => {
  const reqPermissions = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location permition',
          message: 'Location permition are require',
          buttonPositive: 'location',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('You can use the location');
      } else {
        console.log('location permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };

  useEffect(() => {
    reqPermissions();
  }, []);
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="Signin" component={SignInScreen} />
      <Stack.Screen name="Signup" component={SignUpScreen} />
      <Stack.Screen name="Phone" component={PhoneScreen} />
      <Stack.Screen name="Phoneotp" component={PhoneScreenOtp} />
    </Stack.Navigator>
  );
};

export default AuthStackNavigation;
