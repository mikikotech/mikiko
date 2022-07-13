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
  FONT_DESC,
  FONT_INACTIVE_DARK,
  PRIMARY_COLOR,
  TAB_BAR_HEIGHT,
} from '../../utils/constanta';
import firestore from '@react-native-firebase/firestore';
import {StackScreenProps} from '@react-navigation/stack';
import {HomeStackParams} from '../../navigation/HomeStackNavigation';
import AndroidToast from '../../utils/AndroidToast';

type Nav = StackScreenProps<HomeStackParams>;

const EditDeviceScreen = ({navigation, route}: Nav) => {
  const state = useSelector((state: ReducerRootState) => state);

  const [deviceName, deviceNameSet] = useState<string>('');
  const [scene, sceneSet] = useState<string>('');
  const [bssid, bssidSet] = useState<string>('');
  const [switch1, setSwitch1] = useState<string>('');
  const [switch2, setSwitch2] = useState<string>('');
  const [switch3, setSwitch3] = useState<string>('');
  const [switch4, setSwitch4] = useState<string>('');
  const [switch5, setSwitch5] = useState<string>('');

  useEffect(() => {
    bssidSet(route?.params?.id);
    deviceNameSet(route?.params?.gardenName);
    sceneSet(route?.params?.scene);
    setSwitch1(route?.params?.switchName[0]);
    setSwitch2(route?.params?.switchName[1]);
    setSwitch3(route?.params?.switchName[2]);
    setSwitch4(route?.params?.switchName[3]);
    setSwitch5(route?.params?.switchName[4]);
  }, []);

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
                <Input
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
                />
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
                  .collection(
                    state.auth.email !== null
                      ? state.auth.email
                      : state.auth.uid,
                  )
                  .doc(bssid)
                  .update({
                    gardenName: deviceName,
                    scene: scene,
                    switchName: [switch1, switch2, switch3, switch4, switch5],
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
