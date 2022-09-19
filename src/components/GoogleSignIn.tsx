import React, {useCallback, useEffect, useState} from 'react';
import auth from '@react-native-firebase/auth';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {Pressable} from 'native-base';
import {NoFlickerImage} from 'react-native-no-flicker-image';
import RNLocation from 'react-native-location';
import Geocoder from 'react-native-geocoder';
import {ITEM_WIDTH_H4} from '../utils/constanta';
import TuyaUser from '../lib/TuyaUser';
import TuyaHome from '../lib/TuyaHome';
import firestore from '@react-native-firebase/firestore';

const GoogleLogin = () => {
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

  GoogleSignin.configure({
    webClientId:
      '774801735464-a615fhll4399vpufna6m0fgvih0fl0q6.apps.googleusercontent.com',
  });

  const signIn = async () => {
    const {idToken} = await GoogleSignin.signIn();

    console.log('google token = ', idToken);

    await TuyaUser.loginByGoogle('62', idToken)
      .then(res => {
        console.log('tuya google login ====== ', res);
        TuyaHome.createHome(
          'mikikohome',
          lon,
          lat,
          ['greenhouse', 'onfarm'],
          location,
        ).then(res => {
          console.log('create home tuya ==========', res);
        });
      })
      .catch(e => {
        console.log('tuya error reason ===========', e);
      });

    // Create a Google credential with the token
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);

    console.log('google credential === ', googleCredential.token);

    const googleLogin = auth().signInWithCredential(googleCredential);

    const googleRespone = (await googleLogin).user;

    if ((await googleLogin).additionalUserInfo.isNewUser) {
      firestore()
        .collection('users')
        .doc(
          googleRespone.email !== null
            ? googleRespone.email
            : googleRespone.uid,
        )
        .set({
          email:
            googleRespone.email !== null
              ? googleRespone.email
              : googleRespone.uid,
          shared: [],
          device: [],
        });
    }

    return auth().signInWithCredential(googleCredential);
  };

  return (
    <Pressable onPress={signIn}>
      <NoFlickerImage
        source={require('./../assets/logo/google.png')}
        style={{
          width: ITEM_WIDTH_H4 * 0.5,
          height: ITEM_WIDTH_H4 * 0.5,
          resizeMode: 'cover',
        }}
      />
    </Pressable>
  );
};

export default GoogleLogin;
