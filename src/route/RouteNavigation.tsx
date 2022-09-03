import React, {useEffect, useLayoutEffect, useMemo, useState} from 'react';
import {NativeBaseProvider} from 'native-base';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import HomeStackNavigation from '../navigation/HomeStackNavigation';
import {useDispatch, useSelector} from 'react-redux';
import {ActionType} from '../redux/ActionTypes';
import {ReducerRootState} from '../redux/Reducer';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AuthContex, {
  AuthContexDataObject,
  AuthContexDeviceArray,
  SchedulParams,
} from './AuthContext';
import {useColorMode} from 'native-base';
import {LogBox} from 'react-native';
import AuthStackNavigation from '../navigation/AuthStackNavigation';
import theme from '../utils/theme';
import PushNotification, {Importance} from 'react-native-push-notification';
import firestore from '@react-native-firebase/firestore';

const Stack = createStackNavigator();

let deviceList: Array<AuthContexDeviceArray> = [];
let scheduleList: Array<SchedulParams> = [];

const RouteNavigation = () => {
  const state = useSelector((state: ReducerRootState) => state);

  const [user, userSet] = useState<AuthContexDataObject>();

  deviceList = state.device;
  scheduleList = state.schedule;

  const dispatch = useDispatch();

  const {setColorMode} = useColorMode();

  const Auth = useMemo(
    () => ({
      SignIn: (data?: AuthContexDataObject | any) => {
        dispatch({type: ActionType.LOGIN, payload: data});
      },
      SignOut: () => {
        console.log('sign out');
        dispatch({type: ActionType.LOGOUT});
      },
      AddDevice: async (data: AuthContexDeviceArray) => {
        const newDevice = [...deviceList, data];
        console.log(newDevice);
        try {
          await AsyncStorage.setItem('device', JSON.stringify(newDevice));
        } catch (error) {}
        dispatch({type: ActionType.ADD_DEVICE, payload: newDevice});
      },
      RemoveDevice: async (id: String) => {
        const newDevice = state.device.filter(res => {
          return res.id != id;
        });
        try {
          await AsyncStorage.setItem('device', JSON.stringify(newDevice));
        } catch (error) {}
        dispatch({type: ActionType.REMOVE_DEVICE, payload: newDevice});
      },
      Schedule: async (data: SchedulParams) => {
        const newSchedule = [...scheduleList, data];

        console.log(newSchedule);

        try {
          await AsyncStorage.setItem('schedule', JSON.stringify(newSchedule));
        } catch (error) {}
        dispatch({type: ActionType.SCHEDULE, payload: newSchedule});
      },
      AddUser: async (data: any) => {
        dispatch({type: ActionType.ADD_USER, payload: data});
      },
    }),
    [],
  );

  const getThemeValue = async () => {
    try {
      var data = await AsyncStorage.getItem('theme');
      // console.log(data);
      if (data != null || data != undefined) {
        setColorMode(data);
      }
    } catch (e) {
      //
    }
  };

  const getDevice = async () => {
    try {
      let device = await AsyncStorage.getItem('device');
      device = JSON.parse(device ?? '');
      dispatch({type: ActionType.RETRIVE, payload: device});
    } catch (error) {
      console.log('reload error = ', error);
    }
  };

  const getSchedule = async () => {
    try {
      let schedule = await AsyncStorage.getItem('schedule');
      schedule = JSON.parse(schedule ?? '');
      dispatch({type: ActionType.SCHEDULE, payload: schedule});
    } catch (error) {
      console.log('reload error = ', error);
    }
  };

  useEffect(() => {
    getThemeValue();

    getDevice();

    getSchedule();

    console.log('retrive');
  }, []);

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(res => {
      console.log('user login = ', res);

      if (
        res?.emailVerified ||
        res?.email != null ||
        (res?.phoneNumber !== null && res?.displayName != null)
      ) {
        PushNotification.createChannel(
          {
            channelId: 'schedule', // (required)
            channelName: 'schedule', // (optional) default: true
            soundName: 'default', // (optional) See `soundName` parameter of `localNotification` function
            importance: Importance.HIGH, // (optional) default: Importance.HIGH. Int value of the Android notification importance
            vibrate: true, // (optional) default: true. Creates the default vibration pattern if true.
          },
          created => console.log(`createChannel returned '${created}'`), // (optional) callback returns whether the channel was created, false means it already existed.
        );

        PushNotification.configure({
          onRegister: function (token) {
            console.log(
              'TOKEN ====================================================================',
              token,
            );

            firestore()
              .collection('users')
              .doc(res.email !== null ? res.email : res.uid)
              .update({
                fcm_token: token.token,
              });
          },
          onNotification: function (notification) {
            console.log('NOTIFICATION:', notification);

            PushNotification.localNotification({
              /* Android Only Properties */
              channelId: 'schedule', // (optional) set whether this is an "ongoing" notification
              title: notification.title, // (optional)
              message: notification.message,
              priority: 'high', // (optional) set notification priority, default: high
              visibility: 'public', // (optional) default: {} (using null throws a JSON value '<null>' error)
              playSound: false, // (optional) default: true
              soundName: 'default', // (optional) Repeating interval. Check 'Repeating Notifications' section for more info.
            });
          },
          onAction: function (notification) {
            console.log('ACTION:', notification.action);
            console.log('NOTIFICATION:', notification);
          },
          onRegistrationError: function (err) {
            console.error(err.message, err);
          },
          permissions: {
            alert: true,
            badge: true,
            sound: true,
          },

          popInitialNotification: true,
          requestPermissions: true,
        });

        dispatch({type: ActionType.LOGIN, payload: res});
      }
    });

    // isUserLogin();

    return () => subscriber();
  }, []);

  const config = {
    dependencies: {
      'linear-gradient': LinearGradient,
    },
  };

  console.log('email', state?.auth?.email);

  LogBox.ignoreAllLogs();

  return (
    <AuthContex.Provider value={Auth}>
      <SafeAreaProvider>
        <NativeBaseProvider config={config} theme={theme}>
          <NavigationContainer>
            <Stack.Navigator screenOptions={{headerShown: false}}>
              {state?.auth?.uid == undefined ? (
                <Stack.Screen name="Auth" component={AuthStackNavigation} />
              ) : (
                <Stack.Screen name="Root" component={HomeStackNavigation} />
              )}
            </Stack.Navigator>
          </NavigationContainer>
        </NativeBaseProvider>
      </SafeAreaProvider>
    </AuthContex.Provider>
  );
};

export default RouteNavigation;
