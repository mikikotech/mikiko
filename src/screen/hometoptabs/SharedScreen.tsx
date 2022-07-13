import {Box, Button, Text, FlatList, VStack} from 'native-base';
import React, {useContext, useEffect, useLayoutEffect, useState} from 'react';
import AuthContex, {AuthContexDeviceArray} from '../../route/AuthContext';
import {useSelector} from 'react-redux';
import {ReducerRootState} from '../../redux/Reducer';
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
} from '../../utils/constanta';
import DeviceList from '../../components/DeviceList';
import SplashScreen from 'react-native-splash-screen';
import firestore from '@react-native-firebase/firestore';
import {StackScreenProps} from '@react-navigation/stack';
import {deviceList} from './GreenHouseScreen';

type Nav = StackScreenProps<any>;
const SharedScreen = ({navigation}: Nav) => {
  const state = useSelector((state: ReducerRootState) => state);

  const {RemoveDevice} = useContext(AuthContex);

  const [check, setCheck] = useState<boolean>(true);
  const [deviceList, deviceListSet] = useState<Array<deviceList>>([]);

  useLayoutEffect(() => {
    if (check) {
      state.device.map((res: AuthContexDeviceArray) => {
        firestore()
          .collection(res.user)
          .doc(res.id)
          .get()
          .then(device => {
            // return {...device.data(), scene : 'shared'}

            if (device.exists) {
              var dev: any = device.data();

              console.log(dev);

              deviceListSet([...deviceList, dev]);

              // deviceArray.push(dev);
            } else {
              RemoveDevice(res.id);
            }
          });
      });

      setCheck(false);
    }
  }, []);

  return (
    <Box
      flex={1}
      width="100%"
      _light={{bg: BG_LIGHT}}
      _dark={{bg: BG_DARK}}
      px={3}>
      {deviceList[0] != undefined ? (
        <FlatList
          data={deviceList}
          renderItem={item => {
            return (
              <DeviceList
                gardenName={item?.item?.gardenName}
                id={item?.item?.id}
                location={item?.item?.location}
                shared={true}
                scene={item?.item?.scene}
                model={item?.item?.model}
                switchName={item?.item?.switchName}
              />
            );
          }}
        />
      ) : (
        <VStack
          justifyContent={'center'}
          mt={ITEM_HEIGHT_H1 / 2}
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
              navigation.navigate('Pairingbase', {
                screen: 'Barcode',
              });
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

export default SharedScreen;
