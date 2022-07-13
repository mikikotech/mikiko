import {StackScreenProps} from '@react-navigation/stack';
import {
  Box,
  Button,
  Center,
  HStack,
  Icon,
  Spinner,
  Text,
  VStack,
} from 'native-base';
import React, {useEffect, useState} from 'react';
import {Alert} from 'react-native';
import {CountdownCircleTimer} from 'react-native-countdown-circle-timer';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import RNEsptouch from 'react-native-esptouch2';
import dgram from 'react-native-udp';
import {PairingParams} from '../../navigation/PairingNavigation';
import {
  BG_DARK,
  BG_LIGHT,
  FONT_INACTIVE_DARK,
  FONT_SUB,
  PRIMARY_COLOR,
} from '../../utils/constanta';
import ModalAlert from '../../components/ModalAlert';
import {useSelector} from 'react-redux';
import {ReducerRootState} from '../../redux/Reducer';

type Nav = StackScreenProps<PairingParams>;

const SettingsUpScreen = ({navigation, route}: Nav) => {
  const state = useSelector((state: ReducerRootState) => state);

  const [show, setShow] = useState<boolean>(false);
  const [hasUnsavedChanges, hasUnsavedChangesSet] = useState<boolean>(true);
  const [esptouch, esptouchSet] = useState<boolean>(true);
  const [udpmsg, udpmsgSet] = useState<boolean>(false);
  const [udpload, udploadSet] = useState<boolean>(false);
  const [getready, getreadySet] = useState<boolean>(false);
  const [bssid, bssidSet] = useState<string>('');
  const [ip, ipSet] = useState<string>('');
  const [deviceInfo, deviceInfoSet] = useState<string>('');
  const [e, setE] = useState<any>(undefined);

  const pass: string = route?.params?.pass;

  const socket = dgram.createSocket({type: 'udp4'});

  const espTouch = () => {
    RNEsptouch.startSmartConfig(pass, 1).then(res => {
      if (res.code == 200) {
        console.log(res);

        bssidSet(res.bssid);
        ipSet(res.ip);

        udpmsgSet(true);
        udploadSet(true);
        esptouchSet(false);
      } else {
        console.info(res.msg);
      }
    });
  };

  useEffect(() => {
    RNEsptouch.initESPTouch();

    espTouch();

    return () => {
      RNEsptouch.finish();
    };
  }, []);

  useEffect(
    () =>
      navigation.addListener('beforeRemove', e => {
        if (hasUnsavedChanges == false) {
          return;
        }

        e.preventDefault();

        setE(e.data.action);

        setShow(true);
      }),
    [navigation, hasUnsavedChanges],
  );

  useEffect(() => {
    socket.bind(2255, e => {
      if (e) throw e;
    });

    socket.setMaxListeners(50);

    var myInterval;

    if (udpmsg) {
      socket.once('listening', function () {
        myInterval = setInterval(() => {
          socket.send(
            state.auth.email !== null ? state.auth.email : state.auth.uid, // message sent
            undefined,
            undefined,
            2255,
            ip, // ip address
            function (err) {
              if (err) throw err;
              socket.on('message', function (msg, rinfo) {
                var str = String.fromCharCode.apply(null, [
                  ...new Uint8Array(msg),
                ]);
                console.log('string = ', str);
                const splitString = str.split(':');
                if (splitString[splitString.length - 1] == 'MIKIKO') {
                  deviceInfoSet(str);
                  udpmsgSet(false);
                  getreadySet(true);
                }
              });
            },
          );
        }, 1000);
      });
    }

    return () => {
      socket.close();
      clearInterval(myInterval);
    };
  }, [udpmsg]);

  useEffect(() => {
    var myTimeout;

    if (getready) {
      myTimeout = setTimeout(() => {
        hasUnsavedChangesSet(false);
        getreadySet(false);
        navigation.replace('Deviceinfo', {
          bssid: bssid,
          deviceInfo: deviceInfo,
        });
      }, 3000);
    }

    return () => clearTimeout(myTimeout);
  }, [getready]);

  return (
    <Center flex={1} _light={{bg: BG_LIGHT}} _dark={{bg: BG_DARK}}>
      <VStack justifyContent={'center'} alignItems="center">
        <Box>
          <CountdownCircleTimer
            isPlaying
            duration={120}
            onComplete={() => {
              hasUnsavedChangesSet(false);
              navigation.navigate('Failed');
              // navigation.navigate('Deviceinfo');
            }}
            // trailColor={FONT_INACTIVE_DARK}
            colors={[PRIMARY_COLOR, '#F7B801', '#A30000', '#A30000']}
            colorsTime={[7, 5, 2, 0]}>
            {({remainingTime}) => (
              <Text _dark={{color: FONT_INACTIVE_DARK}}>
                {remainingTime}
                {' s'}
              </Text>
            )}
          </CountdownCircleTimer>
        </Box>
        <VStack space={2} mt={10}>
          <HStack alignItems={'center'}>
            {/* <Spinner mr={3} color={esptouch ? PRIMARY_COLOR : BG_LIGHT} /> */}
            {esptouch ? (
              <Spinner mr={3} color={esptouch ? PRIMARY_COLOR : BG_LIGHT} />
            ) : (
              <Icon
                mr={3}
                size={5}
                as={MaterialCommunityIcons}
                name="check-circle"
                color={PRIMARY_COLOR}
              />
            )}

            <Text
              fontSize={FONT_SUB}
              _light={{color: esptouch ? 'gray.300' : PRIMARY_COLOR}}
              _dark={{color: esptouch ? FONT_INACTIVE_DARK : PRIMARY_COLOR}}
              strikeThrough={esptouch}>
              Setting WiFi Credentials.
            </Text>
          </HStack>
          <HStack alignItems={'center'}>
            {udpmsg ? (
              <Spinner mr={3} color={udpmsg ? PRIMARY_COLOR : BG_LIGHT} />
            ) : (
              <Icon
                mr={3}
                as={MaterialCommunityIcons}
                name={udpload ? 'check-circle' : 'close-circle'}
                size={5}
                _light={{color: udpload ? PRIMARY_COLOR : 'gray.300'}}
                _dark={{color: udpload ? PRIMARY_COLOR : FONT_INACTIVE_DARK}}
              />
            )}
            <Text
              fontSize={FONT_SUB}
              _light={{color: udpload && !udpmsg ? PRIMARY_COLOR : 'gray.300'}}
              _dark={{
                color: udpload && !udpmsg ? PRIMARY_COLOR : FONT_INACTIVE_DARK,
              }}
              strikeThrough={!udpload && esptouch}>
              Get Device Information.
            </Text>
          </HStack>
          <HStack alignItems={'center'}>
            {getready ? (
              <Spinner mr={3} color={getready ? PRIMARY_COLOR : BG_LIGHT} />
            ) : (
              <Icon
                mr={3}
                size={5}
                as={MaterialCommunityIcons}
                name={getready ? 'check-circle' : 'close-circle'}
                _light={{color: getready ? PRIMARY_COLOR : 'gray.300'}}
                _dark={{color: getready ? PRIMARY_COLOR : FONT_INACTIVE_DARK}}
              />
            )}
            <Text
              fontSize={FONT_SUB}
              _light={{
                color: getready && !udpmsg ? PRIMARY_COLOR : 'gray.300',
              }}
              _dark={{
                color: getready && !udpmsg ? PRIMARY_COLOR : FONT_INACTIVE_DARK,
              }}
              strikeThrough={!udpmsg && !getready}>
              Setting Up New Device.
            </Text>
          </HStack>
        </VStack>
      </VStack>
      {/* modal alert */}
      <ModalAlert
        show={show}
        title="Cancel Installation"
        message="Canceling process during installation may effect error! confirm cancel?"
        onPress={() => {
          setShow(false);
          // navigation.navigate('Wifi');
          navigation.dispatch(e);
          console.log('back');
        }}
        onCancel={() => {
          setShow(false);
        }}
        schema="check"
        variant="error"
      />
    </Center>
  );
};

export default SettingsUpScreen;
