import React, {useEffect, useLayoutEffect, useState} from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  Box,
  FormControl,
  Input,
  Icon,
  Select,
  CheckIcon,
  Center,
  Button,
  FlatList,
  Text,
} from 'native-base';
import RNLocation from 'react-native-location';
import Geocoder from 'react-native-geocoder';
import firestore from '@react-native-firebase/firestore';
import {
  BG_DARK,
  BG_LIGHT,
  FONT_DESC,
  FONT_INACTIVE_DARK,
  PRIMARY_COLOR,
  // TAB_BAR_HEIGHT,
} from '../../utils/constanta';
import AndroidToast from '../../utils/AndroidToast';
import {useSelector} from 'react-redux';
import {ReducerRootState} from '../../redux/Reducer';
import {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import {BottomTabsParams} from '../../navigation/BottomTabsNavigation';

type Nav = BottomTabScreenProps<any>;

type deviceAdd = {
  gardenName: string;
  location: string;
  id: string;
  scene: string;
};

const DeviceInfoScreen = ({navigation, route}: Nav) => {
  const state = useSelector((state: ReducerRootState) => state);

  const [hasUnsavedChanges, hasUnsavedChangesSet] = useState<boolean>(true);
  const [deviceName, deviceNameSet] = useState<string>('');
  const [location, locationSet] = useState<string>('');
  const [scene, sceneSet] = useState<string>('greenHouse');
  const [bssid, bssidSet] = useState<string>('');
  const [mode, modeSet] = useState<string>('');
  const [devices, devicesSet] = useState<Array<any>>();
  const [camId, camIdSet] = useState<string>('');

  var loc = route?.params?.location;
  var device = route?.params?.deviceInfo;

  console.log('device info = ', device);

  const getAddress = async () => {
    RNLocation.configure({
      distanceFilter: 5.0,
      desiredAccuracy: {
        ios: 'best',
        android: 'balancedPowerAccuracy',
      },
      androidProvider: 'auto',
    });

    RNLocation.subscribeToLocationUpdates(async locations => {
      // console.log(locations);

      let res = await Geocoder.geocodePosition({
        lat: locations[0].latitude,
        lng: locations[0].longitude,
      });

      let adds = res[0].formattedAddress.split(',');

      locationSet(`${adds[0]}, ${adds[1]}, ${adds[2]}`);
    });
  };

  useEffect(
    () =>
      navigation.addListener('beforeRemove', e => {
        if (!hasUnsavedChanges) {
          return;
        }

        e.preventDefault();

        if (scene != '') {
          navigation.dispatch(e.data.action);
        } else {
          AndroidToast.toast('complate installation first');
        }
      }),
    [navigation, hasUnsavedChanges],
  );

  useLayoutEffect(() => {
    const deviceId = device.split(':');
    modeSet(deviceId[1]);

    deviceNameSet(`${deviceId[2]}${deviceId[1]}`);
    bssidSet(route?.params?.bssid ?? '');

    if (loc == undefined || loc == null) {
      getAddress();
    } else {
      locationSet(loc);
    }

    const subscriber = firestore()
      .collection(state.auth.email !== null ? state.auth.email : state.auth.uid)
      .onSnapshot(querySnapshot => {
        const deviceInfo: Array<any> = [];

        querySnapshot.forEach(documentSnapshot => {
          // console.log(documentSnapshot);
          deviceInfo.push({
            ...documentSnapshot.data(),
            key: documentSnapshot.id,
          });
        });

        // console.log('list devices ====== ', deviceInfo);

        devicesSet(deviceInfo);
      });

    return () => subscriber();
  }, []);

  return (
    <Center flex={1} _dark={{bg: BG_DARK}} _light={{bg: BG_LIGHT}}>
      <Box width={'100%'} px={5}>
        <FormControl>
          <FormControl.Label
            _text={{
              _light: {color: BG_DARK},
              _dark: {color: FONT_INACTIVE_DARK},
            }}>
            Device Name
          </FormControl.Label>
          <Input
            value={deviceName}
            variant={'unstyled'}
            borderWidth={1}
            _light={{borderColor: 'gray.300', color: 'black'}}
            _dark={{borderColor: FONT_INACTIVE_DARK, color: FONT_INACTIVE_DARK}}
            // fontSize={FONT_DESC}
            // height={TAB_BAR_HEIGHT}
            onChangeText={val => {
              deviceNameSet(val);
            }}
          />
        </FormControl>

        {mode !== 'CAM' ? (
          <FormControl mt={5}>
            <FormControl.Label
              _text={{
                _light: {color: BG_DARK},
                _dark: {color: FONT_INACTIVE_DARK},
              }}>
              Scene
            </FormControl.Label>

            <Select
              placeholder="Choose Scene"
              selectedValue={scene}
              // height={TAB_BAR_HEIGHT}
              onValueChange={val => sceneSet(val)}
              _selectedItem={{
                bg: 'teal.600',
                endIcon: <CheckIcon size="5" />,
              }}>
              <Select.Item value="onFarm" label="On Farm" />
              <Select.Item value="greenHouse" label="Green House" />
              {/* <Select.Item value="other" label="Other" /> */}
            </Select>
          </FormControl>
        ) : (
          <FormControl mt={5}>
            <FormControl.Label
              _text={{
                _light: {color: BG_DARK},
                _dark: {color: FONT_INACTIVE_DARK},
              }}>
              Device bind
            </FormControl.Label>

            <Select
              placeholder="Choose Scene"
              selectedValue={camId}
              // height={TAB_BAR_HEIGHT}
              onValueChange={val => camIdSet(val)}
              _selectedItem={{
                bg: 'teal.600',
                endIcon: <CheckIcon size="5" />,
              }}>
              {devices?.map(item => {
                return <Select.Item value={item.id} label={item.gardenName} />;
              })}
            </Select>
          </FormControl>
        )}
        <FormControl mt={5}>
          <FormControl.Label
            _text={{
              _light: {color: BG_DARK},
              _dark: {color: FONT_INACTIVE_DARK},
            }}>
            Location
          </FormControl.Label>
          <FormControl.HelperText
            _text={{
              fontSize: 'xs',
              color: 'blue.400',
              marginBottom: 2,
              marginTop: -3,
            }}>
            Drag and drop pin to select the new location.
          </FormControl.HelperText>
          <Input
            value={location}
            variant={'unstyled'}
            borderWidth={1}
            _light={{borderColor: 'gray.300', color: 'black'}}
            _dark={{borderColor: FONT_INACTIVE_DARK, color: FONT_INACTIVE_DARK}}
            // height={TAB_BAR_HEIGHT}
            onChangeText={val => locationSet(val)}
            InputRightElement={
              <Icon
                as={MaterialCommunityIcons}
                name="map-marker"
                size={5}
                color="red.500"
                mr={2}
                onPress={() => {
                  navigation.navigate('Map', {
                    device: device,
                    bssid: bssid,
                  });
                }}
              />
            }
          />
        </FormControl>

        <Button
          mt={10}
          width={'100%'}
          variant="unstyled"
          borderWidth={1}
          borderColor={PRIMARY_COLOR}
          bg={PRIMARY_COLOR}
          rounded="none"
          justifyContent="center"
          alignItems={'center'}
          onPress={() => {
            if (scene != '') {
              if (mode === 'CAM') {
                firestore()
                  .collection(
                    state.auth.email !== null
                      ? state.auth.email
                      : state.auth.uid,
                  )
                  .doc(camId)
                  .update({
                    cctv: {
                      id: bssid,
                      deviceName: deviceName,
                      location: location,
                    },
                  })
                  .then(() => {
                    console.log('User added!');
                  })
                  .catch(e => console.log(e));

                hasUnsavedChangesSet(false);
                sceneSet('');
                navigation.navigate('Bottomtabsbase');
              } else {
                firestore()
                  .collection(
                    state.auth.email !== null
                      ? state.auth.email
                      : state.auth.uid,
                  )
                  .doc(bssid)
                  .set({
                    gardenName: deviceName,
                    location: location,
                    id: bssid,
                    scene: scene,
                    model: mode,
                    actions: [],
                    schedule: [],
                    switchName:
                      mode == '5CH'
                        ? [
                            'Switch1',
                            'Switch2',
                            'Switch3',
                            'Switch4',
                            'Switch5',
                          ]
                        : null,
                  })
                  .then(() => {
                    console.log('User added!');
                  })
                  .catch(e => console.log(e));

                hasUnsavedChangesSet(false);
                sceneSet('');
                navigation.navigate('Bottomtabsbase');
              }
            } else {
              AndroidToast.toast("Input Cant't be empty");
            }

            // Linking.sendIntent('android.settings.APP_NOTIFICATION_SETTINGS');
          }}
          // height={TAB_BAR_HEIGHT}
          _text={{
            color: 'gray.200',
            mt: -1,
          }}>
          Finish
        </Button>
      </Box>
    </Center>
  );
};

export default DeviceInfoScreen;
