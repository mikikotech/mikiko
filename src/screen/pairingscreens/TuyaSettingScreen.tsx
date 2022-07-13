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
import {CountdownCircleTimer} from 'react-native-countdown-circle-timer';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
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
import {NativeEventEmitter, NativeModules} from 'react-native';
import {HomeStackParams} from '../../navigation/HomeStackNavigation';
const eventEmitter = new NativeEventEmitter(NativeModules.TuyaCameraModule);

type Nav = StackScreenProps<any>;

const TuyaSettingScreen = ({navigation, route}: Nav) => {
  const state = useSelector((state: ReducerRootState) => state);

  const [show, setShow] = useState<boolean>(false);
  const [hasUnsavedChanges, hasUnsavedChangesSet] = useState<boolean>(true);
  const [initPair, setInitPair] = useState<boolean>(true);
  const [cloudPair, SetCloudPair] = useState<boolean>(false);
  const [getready, setGetReady] = useState<boolean>(false);
  const [e, setE] = useState<any>(undefined);

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
    const pairlistener = eventEmitter.addListener('pair', (res: any) => {
      console.log(res);

      navigation.replace('Bottomtabsbase');
    });

    setTimeout(() => {
      setInitPair(false);
      SetCloudPair(true);
    }, 2000);

    return () => pairlistener.remove();
  }, []);

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
            {/* <Spinner mr={3} color={initPair ? PRIMARY_COLOR : BG_LIGHT} /> */}
            {initPair ? (
              <Spinner mr={3} color={initPair ? PRIMARY_COLOR : BG_LIGHT} />
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
              _light={{color: initPair ? 'gray.300' : PRIMARY_COLOR}}
              _dark={{color: initPair ? FONT_INACTIVE_DARK : PRIMARY_COLOR}}
              strikeThrough={initPair}>
              Setting WiFi Credentials.
            </Text>
          </HStack>
          <HStack alignItems={'center'}>
            {cloudPair && !initPair ? (
              <Spinner
                mr={3}
                color={!cloudPair && !initPair ? PRIMARY_COLOR : BG_LIGHT}
              />
            ) : (
              <Icon
                mr={3}
                as={MaterialCommunityIcons}
                name={!cloudPair && !initPair ? 'check-circle' : 'close-circle'}
                size={5}
                _light={{
                  color: !cloudPair && !initPair ? PRIMARY_COLOR : 'gray.300',
                }}
                _dark={{
                  color:
                    !cloudPair && !initPair
                      ? PRIMARY_COLOR
                      : FONT_INACTIVE_DARK,
                }}
              />
            )}
            <Text
              fontSize={FONT_SUB}
              _light={{
                color: !cloudPair && !initPair ? PRIMARY_COLOR : 'gray.300',
              }}
              _dark={{
                color:
                  !cloudPair && !initPair ? PRIMARY_COLOR : FONT_INACTIVE_DARK,
              }}
              strikeThrough={initPair && !cloudPair}>
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
                color: getready && !cloudPair ? PRIMARY_COLOR : 'gray.300',
              }}
              _dark={{
                color:
                  getready && !cloudPair ? PRIMARY_COLOR : FONT_INACTIVE_DARK,
              }}
              strikeThrough={!cloudPair && !getready}>
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

export default TuyaSettingScreen;
