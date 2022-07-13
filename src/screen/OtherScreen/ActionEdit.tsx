import {
  Box,
  Button,
  CheckIcon,
  HStack,
  Input,
  Modal,
  Radio,
  Select,
  Switch,
  Text,
  VStack,
} from 'native-base';
import React, {useContext, useEffect, useLayoutEffect, useState} from 'react';
import {
  BG_DARK,
  BG_LIGHT,
  FONT_ACTIVE_LIGHT,
  FONT_INACTIVE_DARK,
  FONT_INACTIVE_LIGHT,
  ITEM_HEIGHT_H3,
  PRIMARY_COLOR,
  SECONDARY_COLOR,
} from '../../utils/constanta';
import firestore from '@react-native-firebase/firestore';
import {StackScreenProps} from '@react-navigation/stack';
import {HomeStackParams} from '../../navigation/HomeStackNavigation';
import mqtt, {IMqttClient} from 'sp-react-native-mqtt';
import {useSelector} from 'react-redux';
import {ReducerRootState} from '../../redux/Reducer';
import {ActionsParams} from '../../route/AuthContext';
import AndroidToast from '../../utils/AndroidToast';

type Nav = StackScreenProps<HomeStackParams>;

var splitTime: string = new Date().toLocaleTimeString();
splitTime: [] = splitTime.split(':');

var MQTTClient: IMqttClient;

const ActionEdit = ({navigation, route}: Nav) => {
  const state = useSelector((state: ReducerRootState) => state);

  const [value, valueSet] = useState<string>('1');
  const [listNumber, listNumberSet] = useState(
    Array(100)
      .fill('')
      .map((_, i) => ({
        key: `${i + 1}`,
        text: `item -${i + 1}`,
      })),
  );
  const [input, inputSet] = useState<string>('temp');
  const [condition, conditionSet] = useState<string>('>=');
  const [output, outputSet] = useState<string>('out1');
  const [outState, outStateSet] = useState<string>('true');
  const [status, statusSet] = useState<boolean>(true);
  const [actionId, actionIdSet] = useState<string>('');
  const [actionList, actionListSet] = useState<Array<ActionsParams>>();
  const [selectVal, selectValSet] = useState<string>('');
  const [showModal, setShowModal] = useState(false);

  const id: string = route?.params?.id;
  const _id: string = route?.params?._id;
  const _input: string = route?.params?._input;
  const _value: number = route?.params?._value;
  const _condition: string = route?.params?._condition;
  const _output: string = route?.params?._output;
  const _outstate: boolean = route?.params?._outstate;
  const _status: boolean = route?.params?._status;

  useEffect(() => {
    actionIdSet(_id);
    inputSet(_input);
    valueSet(_value.toString());
    conditionSet(_condition);
    outputSet(_output);
    outStateSet(_outstate == true ? 'true' : 'false');
    statusSet(_status);

    if (_input == 'temp' || _input == 'humi' || _input == 'soil') {
      listNumberSet(
        Array(100)
          .fill('')
          .map((_, i) => ({
            key: `${i + 1}`,
            text: `item -${i + 1}`,
          })),
      );
    } else {
      listNumberSet(
        Array(15)
          .fill('')
          .map((_, i) => ({
            key: `${i + 1}`,
            text: `item -${i + 1}`,
          })),
      );
    }

    firestore()
      .collection(state.auth.email !== null ? state.auth.email : state.auth.uid)
      .doc(id)
      .get()
      .then(res => {
        if (res.exists) {
          actionListSet(res?.data()?.actions);
        }
      });
  }, [navigation, route]);

  useLayoutEffect(() => {
    mqtt
      .createClient({
        uri: 'mqtt://broker.hivemq.com:1883',
        clientId: `${id}actions`,
      })
      .then(function (client) {
        client.on('message', function (msg) {});

        client.on('connect', function () {
          console.log('connected');
          MQTTClient = client;
        });

        client.connect();
      })
      .catch(function (err) {
        console.log(err);
      });
  }, []);

  return (
    <Box
      flex={1}
      justifyContent="center"
      width="100%"
      _light={{bg: BG_LIGHT}}
      _dark={{bg: BG_DARK}}
      p={5}>
      {/* select Input */}

      <HStack
        py={3}
        justifyContent={'space-between'}
        borderBottomWidth={0.8}
        alignItems="center"
        borderBottomColor="gray.300">
        <Text
          _light={{color: FONT_INACTIVE_LIGHT}}
          _dark={{color: FONT_INACTIVE_DARK}}>
          Input
        </Text>
        <VStack>
          {/* select sensor */}

          <Select
            selectedValue={input}
            minWidth="200"
            accessibilityLabel="Choose Sensor"
            placeholder="Choose Sensor"
            _selectedItem={{
              bg: 'teal.600',
              endIcon: <CheckIcon size="5" />,
            }}
            mt={1}
            onValueChange={val => {
              inputSet(val);
              if (val == 'temp' || val == 'humi' || val == 'soil') {
                listNumberSet(
                  Array(100)
                    .fill('')
                    .map((_, i) => ({
                      key: `${i + 1}`,
                      text: `item -${i + 1}`,
                    })),
                );
              } else {
                listNumberSet(
                  Array(15)
                    .fill('')
                    .map((_, i) => ({
                      key: `${i + 1}`,
                      text: `item -${i + 1}`,
                    })),
                );
              }
            }}>
            <Select.Item label="Temperature" value="temp" />
            <Select.Item label="humidity" value="humi" />
            <Select.Item label="Soil moisture" value="soil" />
            <Select.Item label="PH" value="ph" />
          </Select>

          {/* select condition */}

          <Select
            selectedValue={condition}
            minWidth="200"
            accessibilityLabel="Choose Condition"
            placeholder="Choose Condition"
            _selectedItem={{
              bg: 'teal.600',
              endIcon: <CheckIcon size="5" />,
            }}
            mt={1}
            onValueChange={val => conditionSet(val)}>
            <Select.Item label="greater than" value=">=" />
            <Select.Item label="smaller than" value="<=" />
          </Select>

          {/* select value */}

          <Select
            selectedValue={value}
            minWidth="200"
            accessibilityLabel="Choose Value"
            placeholder={selectVal}
            placeholderTextColor="white"
            _selectedItem={{
              bg: 'teal.600',
              endIcon: <CheckIcon size="5" />,
            }}
            mt={1}
            onValueChange={val => {
              if (val == 'manual') {
                setShowModal(true);
              } else {
                valueSet(val);
              }
            }}>
            <Select.Item label={'Manual input ...'} value={'manual'} />
            {listNumber.map(item => {
              return <Select.Item label={item.key} value={item.key} />;
            })}
          </Select>
        </VStack>
      </HStack>

      {/* select output */}

      <HStack
        py={3}
        justifyContent={'space-between'}
        borderBottomWidth={0.8}
        alignItems="center"
        borderBottomColor="gray.300">
        <Text
          _light={{color: FONT_INACTIVE_LIGHT}}
          _dark={{color: FONT_INACTIVE_DARK}}>
          Output
        </Text>

        <VStack justifyContent={'center'} alignItems="flex-end" space={3}>
          <Select
            selectedValue={output}
            minWidth="200"
            accessibilityLabel="Choose Button"
            placeholder="Choose Button"
            _selectedItem={{
              bg: 'teal.600',
              endIcon: <CheckIcon size="5" />,
            }}
            mt={1}
            onValueChange={val => outputSet(val)}>
            <Select.Item label="Switch 1" value="out1" />
            <Select.Item label="Switch 2" value="out2" />
            <Select.Item label="Switch 3" value="out3" />
            <Select.Item label="Switch 4" value="out4" />
            <Select.Item label="Switch 5" value="out5" />
          </Select>

          {/* output state */}

          <Radio.Group
            defaultValue={outState}
            name="myRadioGroup"
            onChange={val => {
              outStateSet(val);
            }}
            accessibilityLabel="Pick your favorite number">
            <HStack space={2}>
              <Radio
                _text={{
                  _light: {color: FONT_ACTIVE_LIGHT},
                  _dark: {color: FONT_INACTIVE_DARK},
                }}
                value="true"
                colorScheme="green"
                _dark={{backgroundColor: BG_DARK}}
                size="sm"
                my={1}>
                On
              </Radio>
              <Radio
                _text={{
                  _light: {color: FONT_ACTIVE_LIGHT},
                  _dark: {color: FONT_INACTIVE_DARK},
                }}
                value="false"
                colorScheme="green"
                _dark={{backgroundColor: BG_DARK}}
                size="sm"
                my={1}>
                Off
              </Radio>
            </HStack>
          </Radio.Group>
        </VStack>
      </HStack>

      {/* status */}

      <HStack
        py={3}
        justifyContent={'space-between'}
        borderBottomWidth={0.8}
        alignItems="center"
        borderBottomColor="gray.300">
        <Text
          _light={{color: FONT_INACTIVE_LIGHT}}
          _dark={{color: FONT_INACTIVE_DARK}}>
          Enable
        </Text>
        <Switch
          isChecked={status}
          onChange={() => statusSet(!status)}
          onThumbColor={PRIMARY_COLOR}
          onTrackColor={SECONDARY_COLOR}
        />
      </HStack>

      {/* button save */}

      <Button
        mt={ITEM_HEIGHT_H3}
        bg={PRIMARY_COLOR}
        onPress={() => {
          if (MQTTClient != null && MQTTClient != undefined) {
            const newActionEdit = actionList?.map(res => {
              if (res.id == actionId) {
                return {
                  ...res,
                  if: input,
                  output: output,
                  value: Number(value),
                  con: condition,
                  state: outState == 'true' ? true : false,
                  status: status,
                };
              }
              return res;
            });

            firestore()
              .collection(
                state.auth.email !== null ? state.auth.email : state.auth.uid,
              )
              .doc(id)
              .update({
                actions: newActionEdit,
              })
              .then(() => {
                MQTTClient.publish(`/${id}/data/actions`, 'true', 0, true);
              });

            navigation.navigate('Action', {
              id: id,
            });
          }
        }}>
        save
      </Button>

      {/* modal */}

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        _backdrop={{
          _dark: {
            bg: 'coolGray.800',
          },
          bg: 'warmGray.50',
        }}>
        <Modal.Content maxWidth="350" maxH="212">
          <Modal.CloseButton />
          <Modal.Header>Input Value</Modal.Header>
          <Modal.Body>
            <Input
              value={selectVal}
              onChangeText={val => {
                var maxNumber = 0;
                if (input == 'temp' || input == 'humi' || input == 'soil') {
                  maxNumber = 100;
                } else {
                  maxNumber = 15;
                }
                if (Number(val) > maxNumber) {
                  AndroidToast.toast('Max value!');
                } else if (
                  val[val.length - 1] == ',' ||
                  val[val.length - 1] == ' ' ||
                  val[val.length - 1] == '-'
                ) {
                  AndroidToast.toast('Invalid number!');
                } else {
                  selectValSet(val);
                }
              }}
              keyboardType="number-pad"
            />
          </Modal.Body>
          <Modal.Footer>
            <Button.Group space={2}>
              <Button
                variant="ghost"
                colorScheme="blueGray"
                onPress={() => {
                  setShowModal(false);
                }}>
                Cancel
              </Button>
              <Button
                onPress={() => {
                  valueSet(selectVal);
                  setShowModal(false);
                }}>
                Ok
              </Button>
            </Button.Group>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </Box>
  );
};

export default ActionEdit;
