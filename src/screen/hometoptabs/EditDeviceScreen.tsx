import {
  Box,
  Button,
  Center,
  CheckIcon,
  FormControl,
  Input,
  KeyboardAvoidingView,
  ScrollView,
  Select,
  VStack,
} from 'native-base';
import React, {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import {ReducerRootState} from '../../redux/Reducer';
import {
  BG_DARK,
  BG_LIGHT,
  FONT_INACTIVE_DARK,
  PRIMARY_COLOR,
  TAB_BAR_HEIGHT,
} from '../../utils/constanta';
import firestore from '@react-native-firebase/firestore';
import {StackScreenProps} from '@react-navigation/stack';
import {HomeStackParams} from '../../navigation/HomeStackNavigation';
import AndroidToast from '../../utils/AndroidToast';
import Loader from 'react-native-modal-loader';

type Nav = StackScreenProps<HomeStackParams>;

const EditDeviceScreen = ({navigation, route}: Nav) => {
  const state = useSelector((state: ReducerRootState) => state);

  const [deviceName, deviceNameSet] = useState<string>('');
  const [scene, sceneSet] = useState<string>('');
  const [bssid, bssidSet] = useState<string>('');
  const [switchName, switchNameSet] = useState<Array<string>>([]);
  const [isLoad, isLoadSet] = useState<boolean>(false);

  useEffect(() => {
    bssidSet(route?.params?.id);
    deviceNameSet(route?.params?.gardenName);
    sceneSet(route?.params?.scene);
    switchNameSet(route?.params?.switchName);
    isLoadSet(true);
  }, []);

  if (isLoad == false)
    return <Loader loading={!isLoad} opacity={0.6} color={PRIMARY_COLOR} />;

  return (
    <Center flex={1} _dark={{bg: BG_DARK}} _light={{bg: BG_LIGHT}}>
      <Box width={'100%'} px={5}>
        <KeyboardAvoidingView behavior={'padding'}>
          <ScrollView>
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
                _dark={{
                  borderColor: FONT_INACTIVE_DARK,
                  color: FONT_INACTIVE_DARK,
                }}
                // height={TAB_BAR_HEIGHT}
                onChangeText={val => {
                  deviceNameSet(val);
                }}
              />
            </FormControl>

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

            <FormControl mt={5}>
              <FormControl.Label
                _text={{
                  _light: {color: BG_DARK},
                  _dark: {color: FONT_INACTIVE_DARK},
                }}>
                Rename Switch
              </FormControl.Label>
              <VStack space={2}>
                {switchName.map((val, i) => {
                  return (
                    <Input
                      key={i}
                      value={val}
                      onChangeText={val => {
                        if (val.length < 10) {
                          // setSwitch1(val);
                          switchNameSet(oldVal => {
                            const copy = [...oldVal];
                            copy[i] = val;

                            return copy;
                          });
                        } else {
                          AndroidToast.toast('max name length');
                        }
                      }}
                      placeholder="Switch 1 name"
                    />
                  );
                })}
                {/* <Input
                  value={switch1}
                  onChangeText={val => {
                    if (val.length < 10) {
                      setSwitch1(val);
                    } else {
                      AndroidToast.toast('max name length');
                    }
                  }}
                  placeholder="Switch 1 name"
                />
                <Input
                  value={switch2}
                  onChangeText={val => {
                    if (val.length < 10) {
                      setSwitch2(val);
                    } else {
                      AndroidToast.toast('max name length');
                    }
                  }}
                  placeholder="Switch 2 name"
                />
                <Input
                  value={switch3}
                  onChangeText={val => {
                    if (val.length < 10) {
                      setSwitch3(val);
                    } else {
                      AndroidToast.toast('max name length');
                    }
                  }}
                  placeholder="Switch 3 name"
                />
                <Input
                  value={switch4}
                  onChangeText={val => {
                    if (val.length < 10) {
                      setSwitch4(val);
                    } else {
                      AndroidToast.toast('max name length');
                    }
                  }}
                  placeholder="Switch 4 name"
                />
                <Input
                  value={switch5}
                  onChangeText={val => {
                    if (val.length < 10) {
                      setSwitch5(val);
                    } else {
                      AndroidToast.toast('max name length');
                    }
                  }}
                  placeholder="Switch 5 name"
                /> */}
              </VStack>
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
                firestore()
                  // .collection(
                  //   state.auth.email !== null
                  //     ? state.auth.email
                  //     : state.auth.uid,
                  // )
                  .collection('devices')
                  .doc(bssid)
                  .update({
                    gardenName: deviceName,
                    scene: scene,
                    switchName: switchName,
                  })
                  .then(() => {
                    navigation.goBack();
                  });
              }}
              height={TAB_BAR_HEIGHT}
              _text={{
                color: 'gray.200',
                mt: -1,
              }}>
              Update
            </Button>
          </ScrollView>
        </KeyboardAvoidingView>
      </Box>
    </Center>
  );
};

export default EditDeviceScreen;
