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
import firestore from '@react-native-firebase/firestore';
import {StackScreenProps} from '@react-navigation/stack';
import {deviceList} from './GreenHouseScreen';
import SonoffDevice from '../../components/SonoffDevice';

type Nav = StackScreenProps<any>;
const SharedScreen = ({navigation}: Nav) => {
  const state = useSelector((state: ReducerRootState) => state);

  const {RemoveDevice} = useContext(AuthContex);

  const [deviceList, deviceListSet] = useState<Array<any>>([]);

  useLayoutEffect(() => {
    const subscribe = firestore()
      .collection('users')
      .doc(state.auth.email !== null ? state.auth.email : state.auth.uid)
      .onSnapshot((resp: any) => {
        console.log(resp._data.shared);

        if (resp._data.shared.length == 0) {
          deviceListSet([]);
        } else {
          try {
            firestore()
              .collection('devices')
              .where('id', 'in', resp._data.shared)
              .onSnapshot(querySnapshot => {
                // console.log(
                //   'filter query ===================',
                //   querySnapshot.docs,
                // );

                if (resp._data == undefined) {
                  try {
                    firestore()
                      .collection('users')
                      .doc(
                        state.auth.email !== null
                          ? state.auth.email
                          : state.auth.uid,
                      )
                      .set({
                        device: [],
                        email:
                          state.auth.email !== null
                            ? state.auth.email
                            : state.auth.uid,
                        shared: [],
                      });
                  } catch (error) {}
                }

                if (querySnapshot.size != resp._data?.shared.length) {
                  var devId = [];

                  querySnapshot.docs.map((res: any) => {
                    console.log('map query ==============', res._data);

                    devId.push(res._data.id);

                    try {
                      firestore()
                        .collection('users')
                        .doc(
                          state.auth.email !== null
                            ? state.auth.email
                            : state.auth.uid,
                        )
                        .update({
                          shared: devId,
                        });
                    } catch (error) {}
                  });
                } else {
                  deviceListSet(querySnapshot.docs);
                }
              });
          } catch (error) {}
        }
      });

    return () => subscribe();
  }, []);

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
            console.log(item._data);
            return (
              <Box key={item._data.id}>
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
                ) : (
                  <SonoffDevice
                    gardenName={item._data.gardenName}
                    id={item._data.id}
                    location={item._data.location}
                    shared={false}
                    scene={item._data.scene}
                    model={item._data.model}
                    switchName={item._data.switchName}
                  />
                )}
              </Box>
            );
          }}
          keyExtractor={item => item.id}
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

      {/* <Button
        onPress={() => {
          firestore()
            .collection('users')
            .doc('testarray')
            .update({
              schedule: firestore.FieldValue.arrayUnion({
                id: '1234',
                time: '11:22',
              }),
            });
        }}>
        array
      </Button> */}
    </Box>
  );
};

export default SharedScreen;
