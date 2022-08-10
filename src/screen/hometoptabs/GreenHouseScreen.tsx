import {StackScreenProps} from '@react-navigation/stack';
import {Box, Button, FlatList, Text, VStack} from 'native-base';
import React, {useEffect, useLayoutEffect, useState} from 'react';
import {LogBox} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import DeviceList from '../../components/DeviceList';
import {HomeStackParams} from '../../navigation/HomeStackNavigation';
import {
  BG_DARK,
  BG_LIGHT,
  FONT_ACTIVE_LIGHT,
  FONT_INACTIVE_DARK,
  FONT_INACTIVE_LIGHT,
  FONT_TITLE,
  ITEM_HEIGHT_H1,
  ITEM_WIDTH_H4,
  PRIMARY_COLOR,
  TAB_BAR_HEIGHT,
} from './../../utils/constanta';
import {useSelector} from 'react-redux';
import {ReducerRootState} from '../../redux/Reducer';
import SonoffDevice from '../../components/SonoffDevice';

type Nav = StackScreenProps<HomeStackParams>;

export type deviceList = {
  gardenName: string;
  id: string;
  location: string;
  scene: string;
  model: string;
  switchName: Array<string>;
};

const GreenHouseScreen = ({navigation}: Nav) => {
  const state = useSelector((state: ReducerRootState) => state);
  const [deviceList, deviceListSet] = useState<Array<any>>([]);
  const [status, statusSet] = useState<boolean>(true);

  LogBox.ignoreAllLogs();

  useLayoutEffect(() => {
    const subscribe = firestore()
      .collection('devices')
      .where(
        'devOwner',
        '==',
        state.auth.email !== null ? state.auth.email : state.auth.uid,
      )
      .where('scene', '==', 'greenHouse')
      .onSnapshot((querySnapshot: any) => {
        console.log('filter query ===================', querySnapshot.docs);

        if (querySnapshot.size == 0) {
          deviceListSet([]);
        } else {
          deviceListSet(querySnapshot.docs);
        }
      });
    // .catch(e => {});
    return () => subscribe();
  }, []);

  // useLayoutEffect(() => {
  //   const subscribe = firestore()
  //     .collection(state.auth.email !== null ? state.auth.email : state.auth.uid)
  //     .onSnapshot(res => {
  //       if (res.size == 0) {
  //         deviceListSet([]);
  //       } else {
  //         var devices: any = [];
  //         res.forEach((device: any) => {
  //           devices.push(device?._data);
  //         });
  //         deviceListSet(devices);
  //       }
  //     });

  //   return () => subscribe();
  // }, []);

  return (
    <Box
      flex={1}
      width="100%"
      _light={{bg: BG_LIGHT}}
      _dark={{bg: BG_DARK}}
      px={3}>
      {deviceList.length > 0 ? (
        <FlatList
          data={deviceList}
          renderItem={({item}) => {
            // if (item.scene != 'greenHouse') statusSet(true);

            console.log(item._data);

            return (
              <Box>
                {item._data.model == '5CH' ? (
                  <DeviceList
                    gardenName={item._data.gardenName}
                    id={item._data.id}
                    location={item._data.location}
                    shared={false}
                    scene={item._data.scene}
                    model={item._data.model}
                    switchName={item._data.switchName}
                  />
                ) : item._data.model == '4CH' ? (
                  <SonoffDevice
                    gardenName={item._data.gardenName}
                    id={item._data.id}
                    location={item._data.location}
                    shared={false}
                    scene={item._data.scene}
                    model={item._data.model}
                    switchName={item._data.switchName}
                  />
                ) : null}
              </Box>
            );
          }}
          keyExtractor={item => item.id}
        />
      ) : (
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
      )}
    </Box>
  );
};

export default GreenHouseScreen;
