import React, {useCallback, useEffect, useLayoutEffect, useState} from 'react';
import {NativeModules, PermissionsAndroid} from 'react-native';
import {HStack, Icon, Pressable, Text} from 'native-base';
import auth from '@react-native-firebase/auth';
import {LoginManager, AccessToken, Settings} from 'react-native-fbsdk-next';
import {NoFlickerImage} from 'react-native-no-flicker-image';
import {ITEM_WIDTH_H4} from '../utils/constanta';
import RNLocation from 'react-native-location';
import Geocoder from 'react-native-geocoder';
import TuyaUser from '../lib/TuyaUser';
import TuyaHome from '../lib/TuyaHome';
import firestore from '@react-native-firebase/firestore';

const FacebookLogin = () => {
  const [lat, setLat] = useState(0);
  const [lon, setLon] = useState(0);
  const [location, setLocation] = useState('');

  const getPostisions = async () => {
    RNLocation.configure({
      distanceFilter: 5.0,
      desiredAccuracy: {
        ios: 'best',
        android: 'balancedPowerAccuracy',
      },
      androidProvider: 'auto',
    });

    RNLocation.subscribeToLocationUpdates(res => {
      setLat(res[0].latitude);
      setLon(res[0].longitude);

      getpos(res[0].latitude, res[0].longitude);
    });
  };

  const getpos = useCallback(async (lat, lon) => {
    try {
      let res = await Geocoder.geocodePosition({lat: lat, lng: lon});

      let adds = res[0].formattedAddress.split(',');

      setLocation(`${adds[0]}, ${adds[1]}, ${adds[2]}`);
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    // getPostisions();

    RNLocation.configure({
      distanceFilter: 5.0,
      desiredAccuracy: {
        ios: 'best',
        android: 'balancedPowerAccuracy',
      },
      androidProvider: 'auto',
    });

    const subscribe = RNLocation.subscribeToLocationUpdates(res => {
      setLat(res[0].latitude);
      setLon(res[0].longitude);

      getpos(res[0].latitude, res[0].longitude);
    });

    return () => subscribe();
  }, []);

  async function onFacebookButtonPress() {
    const result = await LoginManager.logInWithPermissions([
      'public_profile',
      'email',
      'user_friends',
    ]);

    if (result.isCancelled) {
      throw 'User cancelled the login process';
    }

    const data = await AccessToken.getCurrentAccessToken();

    if (!data) {
      throw 'Something went wrong obtaining access token';
    }

    TuyaUser.loginByFacebook('62', data.accessToken).then(res => {
      console.log('tuya facebook login ========== ', res);

      TuyaHome.createHome(
        'mikikohome',
        lon,
        lat,
        ['greenhouse', 'onfarm'],
        location,
      ).then(res => {
        console.log('create home tuya ==========', res);
      });
    });

    const facebookCredential = auth.FacebookAuthProvider.credential(
      data.accessToken,
    );

    console.log('facebook token = ', data.accessToken);

    // TuyaUserModule.loginByFacebook('62', data.accessToken).then((res: any) => {
    //   console.log(res);
    // });

    auth()
      .signInWithCredential(facebookCredential)
      .then(res => {
        if (res.additionalUserInfo.isNewUser) {
          firestore()
            .collection('users')
            .doc(res.user.email !== null ? res.user.email : res.user.uid)
            .set({
              email: res.user.email !== null ? res.user.email : res.user.uid,
              shared: [],
              device: [],
            });
        }
      });
  }

  return (
    <Pressable onPress={onFacebookButtonPress}>
      <NoFlickerImage
        source={require('./../assets/logo/fb.png')}
        style={{
          width: ITEM_WIDTH_H4 * 0.5,
          height: ITEM_WIDTH_H4 * 0.5,
          resizeMode: 'cover',
        }}
      />
    </Pressable>
  );
};

export default FacebookLogin;
