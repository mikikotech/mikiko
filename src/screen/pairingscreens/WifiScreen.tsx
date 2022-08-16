import {
  Box,
  Button,
  Center,
  Checkbox,
  FormControl,
  HStack,
  Icon,
  Input,
  Pressable,
  Text,
  VStack,
} from 'native-base';
import React, {useEffect, useState} from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {StackScreenProps} from '@react-navigation/stack';
import LottieView from 'lottie-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  BG_LIGHT,
  FONT_INACTIVE_LIGHT,
  PRIMARY_COLOR,
  FONT_SUB,
  TAB_BAR_HEIGHT,
  ITEM_WIDTH_H2,
  BG_DARK,
  FONT_INACTIVE_DARK,
  BG_BOX_DARK,
  PRIMARY_COLOR_DISABLE,
} from '../../utils/constanta';
import {PairingParams} from '../../navigation/PairingNavigation';
import {Linking, LogBox, PermissionsAndroid} from 'react-native';
import WifiManager from 'react-native-wifi-reborn';
import AndroidToast from '../../utils/AndroidToast';
import RNEsptouch from 'react-native-esptouch2';

type Nav = StackScreenProps<PairingParams>;

type WifiParams = {
  ssid: string;
  pass: string;
};

const WifiScreen = ({navigation}: Nav) => {
  const [password, passwordSet] = useState<string>('');
  const [show, setShow] = useState<boolean>(false);
  const [ssid, ssidSet] = useState<string>('');
  const [check, checkSet] = useState<boolean>(false);
  const [flag, flagSet] = useState<boolean>(true);
  const [running, runningSet] = useState<boolean>(false);
  const [isConfirm, setIsConfirm] = useState<boolean>(false);

  const requestPermission = async () => {
    await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'Location permission is required for WiFi connections',
        message:
          'This app needs location permission as this is required  ' +
          'to scan for wifi networks.',
        buttonNegative: 'DENY',
        buttonPositive: 'ALLOW',
      },
    ).then(res => {
      // console.log(res);

      if (res == 'granted') {
        runningSet(true);
      }
    });
  };

  const setValue = async (value: WifiParams) => {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem('test', jsonValue);
    } catch (e) {
      // saving error
    }
  };

  const removeValue = async () => {
    try {
      await AsyncStorage.removeItem('test');
    } catch (e) {
      // remove error
    }
  };

  const getValue = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('test');
      if (jsonValue != null) {
        const resp = JSON.parse(jsonValue);

        if (resp.ssid == ssid && flag == true) {
          passwordSet(resp.pass);
          checkSet(true);
          flagSet(false);
        }
      }
    } catch (e) {
      // read error
    }
  };

  useEffect(() => {
    if (ssid != '') {
      getValue();
    } else {
      passwordSet('');
      checkSet(false);
    }

    RNEsptouch.initESPTouch();

    // return () => RNEsptouch.finish();
  });

  useEffect(() => {
    requestPermission();

    if (!running) {
      return;
    }

    getValue();

    const myInterval = setInterval(() => {
      WifiManager.getCurrentWifiSSID()
        .then(res => {
          ssidSet(res);
        })
        .catch(() => {
          ssidSet('');
        });
    }, 500);

    return () => clearInterval(myInterval);
  }, [running]);

  LogBox.ignoreAllLogs();

  return (
    <Center flex={1} _light={{bg: BG_LIGHT}} _dark={{bg: BG_DARK}}>
      <Box width={'100%'} px={5}>
        <Text
          _dark={{color: FONT_INACTIVE_DARK}}
          fontSize={FONT_SUB}
          mt={2}
          color="gray.500">
          Press and hold reset button on device for 5 second until you see
          "Waiting wifi" on LCD screen and device ready to pair.
        </Text>
        <Text
          _dark={{color: FONT_INACTIVE_DARK}}
          fontSize={FONT_SUB}
          mt={2}
          color="gray.500">
          Choose a 2.4GHz WiFi for device pairing and enter the right password.
        </Text>
        <Text
          _dark={{color: FONT_INACTIVE_DARK}}
          mt={2}
          color="gray.500"
          fontSize={FONT_SUB}>
          If your 2.4GHz WiFi and 5GHz WiFi share the same WiFi SSID, you are
          recommended to change your router settings or try compatible pairing
          mode.
        </Text>
        {/* Lottie */}
        <Center mt={5}>
          <LottieView
            source={require('./../../assets/lottie/phone-search.json')}
            autoPlay
            loop
            style={{
              width: ITEM_WIDTH_H2 * 0.8,
              height: ITEM_WIDTH_H2 * 0.8,
            }}
          />
        </Center>
        {/* form control */}
        <FormControl>
          <FormControl.Label _text={{_dark: {color: FONT_INACTIVE_DARK}}}>
            SSID
          </FormControl.Label>
          <FormControl.HelperText
            _text={{
              fontSize: 'xs',
              color: 'blue.400',
              marginBottom: 2,
              marginTop: -3,
            }}>
            Only support 2.4GHz WiFi.
          </FormControl.HelperText>
          <Pressable
            onPress={() => {
              Linking.sendIntent('android.settings.WIFI_SETTINGS');
            }}>
            <Box
              height={TAB_BAR_HEIGHT * 1.1}
              _dark={{bg: BG_BOX_DARK, borderColor: BG_BOX_DARK}}
              _light={{borderColor: 'gray.300'}}
              borderWidth={1}
              justifyContent="center"
              rounded="sm">
              <HStack alignItems={'center'} justifyContent="space-between">
                <Text ml={3}>{ssid}</Text>
                <Icon
                  as={MaterialCommunityIcons}
                  name="chevron-right"
                  _dark={{color: FONT_INACTIVE_DARK}}
                />
              </HStack>
            </Box>
          </Pressable>
        </FormControl>

        <FormControl>
          <FormControl.Label _text={{_dark: {color: FONT_INACTIVE_DARK}}}>
            Password
          </FormControl.Label>
          <Input
            value={password}
            type={show ? 'text' : 'password'}
            height={TAB_BAR_HEIGHT * 1.1}
            _dark={{bg: BG_BOX_DARK, borderColor: BG_BOX_DARK}}
            bg={BG_LIGHT}
            variant="unstyled"
            borderWidth={1}
            borderColor={'gray.300'}
            onFocus={() => {}}
            rounded="sm"
            onChangeText={val => {
              passwordSet(val);
            }}
            InputRightElement={
              <Box size="xs" rounded="none" w="1/6" h="full">
                <Center flex={1} justifyContent="center" alignItems="center">
                  <Icon
                    as={MaterialCommunityIcons}
                    name={show ? 'eye-outline' : 'eye-off-outline'}
                    _dark={{color: FONT_INACTIVE_DARK}}
                    size={5}
                    ml={4}
                    onPress={() => setShow(!show)}
                  />
                </Center>
              </Box>
            }
          />
          <FormControl.ErrorMessage>
            Password cannot be empty
          </FormControl.ErrorMessage>
          <Checkbox
            mt={5}
            _dark={{bg: BG_BOX_DARK, borderColor: FONT_INACTIVE_DARK}}
            _light={{bg: BG_LIGHT}}
            _checked={{
              backgroundColor: PRIMARY_COLOR,
              borderColor: PRIMARY_COLOR,
            }}
            size={'sm'}
            value="password"
            isChecked={check}
            _text={{fontSize: FONT_SUB, _dark: {color: FONT_INACTIVE_DARK}}}
            onChange={() => {
              checkSet(prev => !prev);
            }}>
            Remember Password
          </Checkbox>
        </FormControl>

        <VStack>
          <Checkbox
            mt={5}
            _dark={{bg: BG_BOX_DARK, borderColor: FONT_INACTIVE_DARK}}
            _light={{bg: BG_LIGHT}}
            _checked={{
              backgroundColor: PRIMARY_COLOR,
              borderColor: PRIMARY_COLOR,
            }}
            size={'sm'}
            value="confirm"
            isChecked={isConfirm}
            rounded="full"
            _text={{fontSize: FONT_SUB, _dark: {color: FONT_INACTIVE_DARK}}}
            onChange={() => {
              setIsConfirm(prev => !prev);
            }}>
            Confirm see "Waiting Wifi" on LCD screen.
          </Checkbox>
          <Button
            mt={3}
            variant="unstyled"
            bg={isConfirm ? PRIMARY_COLOR : PRIMARY_COLOR_DISABLE}
            rounded="none"
            // borderWidth={1}
            onPress={() => {
              RNEsptouch.initESPTouch();

              if (isConfirm) {
                if (ssid != '' && password.length >= 1) {
                  runningSet(false);
                  if (check == true) {
                    setValue({ssid: ssid, pass: password});
                  } else {
                    removeValue();
                  }
                  navigation.navigate('Settingup', {
                    // ssid: ssid,
                    pass: password,
                  });
                } else {
                  AndroidToast.toast("Ssid or password can't be empty");
                }
              } else {
                AndroidToast.toast('Confirm pairing');
              }
            }}
            _text={{
              color: FONT_INACTIVE_LIGHT,
              letterSpacing: 3,
            }}
            justifyContent="center">
            NEXT
          </Button>
        </VStack>
      </Box>
    </Center>
  );
};

export default WifiScreen;
