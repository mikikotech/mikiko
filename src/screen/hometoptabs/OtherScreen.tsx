import {StackScreenProps} from '@react-navigation/stack';
import {
  Box,
  Button,
  FlatList,
  HStack,
  Image,
  Pressable,
  Text,
  VStack,
} from 'native-base';
import React, {useContext, useEffect, useLayoutEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import DeviceList from '../../components/DeviceList';
import firestore from '@react-native-firebase/firestore';
import {HomeStackParams} from '../../navigation/HomeStackNavigation';
import {ReducerRootState} from '../../redux/Reducer';
import {
  BG_DARK,
  BG_LIGHT,
  DISABLE_COLOR,
  FONT_ACTIVE_DARK,
  FONT_ACTIVE_LIGHT,
  FONT_INACTIVE_DARK,
  FONT_INACTIVE_LIGHT,
  FONT_TITLE,
  ITEM_HEIGHT_H1,
  ITEM_HEIGHT_H3,
  ITEM_HEIGHT_H4,
  ITEM_WIDTH_H4,
  PRIMARY_COLOR,
  TAB_BAR_HEIGHT,
} from '../../utils/constanta';
import {deviceList} from './GreenHouseScreen';
import {LogBox, PermissionsAndroid} from 'react-native';
import TuyaHome from '../../lib/TuyaHome';
import TuyaCamera from '../../lib/TuyaCamera';
import TuyaUser from '../../lib/TuyaUser';
import TuyaStagger from '../../components/TuyaStagger';

type Nav = StackScreenProps<HomeStackParams>;

const OtherScreen = ({navigation}: Nav) => {
  // const {Publish, Subscribe} = useContext(AuthContex);
  const state = useSelector((state: ReducerRootState) => state);

  const [deviceList, deviceListSet] = useState<Array<deviceList>>([]);
  const [status, statusSet] = useState<boolean>(true);
  const [deviceBean, setDeviceBean] = useState<Array<any>>([]);

  LogBox.ignoreAllLogs();

  // console.log(' other screen ', state.homeInfo);

  useLayoutEffect(() => {
    // setDeviceBean

    TuyaUser.isLogin().then(res => {
      if (res == true) {
        TuyaHome.queryHomeDetail(state.homeInfo[0]?.homeId).then((res: any) => {
          console.log(' other screen ', res.deviceList);
          setDeviceBean(res?.deviceList);
        });
      }
    });

    // firestore()
    //   .collection(state.auth.email !== null ? state.auth.email : state.auth.uid)
    //   .onSnapshot(res => {
    //     if (res.size == 0) {
    //       deviceListSet([]);
    //     } else {
    //       var devices: any = [];
    //       res.forEach((device: any) => {
    //         devices.push(device._data);
    //       });
    //       deviceListSet(devices);
    //     }
    //   });
  }, [navigation]);

  console.log('device bean =============', deviceBean.length);

  const requestPermission = async () => {
    await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
      {
        title: 'Location permission is required for WiFi connections',
        message:
          'This app needs location permission as this is required  ' +
          'to scan for wifi networks.',
        buttonNegative: 'DENY',
        buttonPositive: 'ALLOW',
      },
    ).then(res => {
      console.log(res);
    });
  };

  useEffect(() => {
    requestPermission();
  }, []);

  return (
    <Box
      flex={1}
      width="100%"
      _light={{bg: BG_LIGHT}}
      _dark={{bg: BG_DARK}}
      px={3}>
      {/* {deviceList[0] != undefined ? (
        <FlatList
          data={deviceList}
          renderItem={({item}) => {
            if (item.scene == 'other') statusSet(false);
            return (
              <Box>
                {item.scene == 'other' ? (
                  <DeviceList
                    gardenName={item.gardenName}
                    id={item.id}
                    location={item.location}
                    shared={false}
                    scene={item.scene}
                    model={item.model}
                    switchName={item.switchName}
                  />
                ) : null}
              </Box>
            );
          }}
          keyExtractor={item => item.id}
        />
      ) : null}
      {status ? (
        <VStack
          justifyContent={'center'}
          position="absolute"
          top={ITEM_HEIGHT_H1 / 2}
          left="37%"
          alignItems="center"
          space={3}>
          <Text
            _light={{color: FONT_ACTIVE_LIGHT}}
            _dark={{color: FONT_INACTIVE_DARK}}
            fontSize={FONT_TITLE}>
            No Device Yet
          </Text>
          <Button
            variant={'unstyled'}
            width={ITEM_WIDTH_H4 * 1.3}
            height={TAB_BAR_HEIGHT}
            onPress={() => {
              navigation.navigate('Pairingbase');
            }}
            rounded="none"
            bg={PRIMARY_COLOR}
            _text={{color: FONT_INACTIVE_LIGHT, mt: -0.5}}>
            ADD
          </Button>
        </VStack>
      ) : null} */}

      <FlatList
        data={deviceBean}
        flexDirection="row"
        flexWrap="wrap"
        width={'100%'}
        renderItem={({item}) => {
          return (
            <Pressable
              mx={3}
              onPress={() => {
                TuyaCamera.openIPC(item.devId);
              }}>
              <VStack
                width="full"
                _light={{bg: 'white'}}
                _dark={{bg: 'white'}}
                h={ITEM_HEIGHT_H4}
                w={ITEM_HEIGHT_H4 * 1.2}
                p={3}
                mt={3}
                borderWidth={1}
                borderColor={DISABLE_COLOR}
                rounded="xl">
                <HStack justifyContent="space-between">
                  <Image
                    alt="camera"
                    source={{uri: item.iconUrl}}
                    h={46}
                    w={46}
                  />
                  <TuyaStagger devId={item.devId} />
                </HStack>
                <Text mt={2} color={FONT_ACTIVE_DARK}>
                  Static Camera Outdor
                </Text>
              </VStack>
            </Pressable>
          );
        }}
      />
      {deviceBean.length == 0 ? (
        <VStack
          justifyContent={'center'}
          position="absolute"
          top={ITEM_HEIGHT_H1 / 2}
          left="37%"
          alignItems="center"
          space={3}>
          <Text
            _light={{color: FONT_ACTIVE_LIGHT}}
            _dark={{color: FONT_INACTIVE_DARK}}
            fontSize={FONT_TITLE}>
            No Device Yet
          </Text>
          <Button
            variant={'unstyled'}
            width={ITEM_WIDTH_H4 * 1.3}
            height={TAB_BAR_HEIGHT}
            onPress={() => {
              navigation.navigate('Pairingbase');
            }}
            rounded="none"
            bg={PRIMARY_COLOR}
            _text={{color: FONT_INACTIVE_LIGHT, mt: -0.5}}>
            ADD
          </Button>
        </VStack>
      ) : null}
    </Box>
  );
};

export default OtherScreen;
