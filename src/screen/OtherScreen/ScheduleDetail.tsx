import {
  Box,
  Button,
  CheckIcon,
  HStack,
  Pressable,
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
  ITEM_HEIGHT_H3,
  PRIMARY_COLOR,
  SECONDARY_COLOR,
} from '../../utils/constanta';
import firestore from '@react-native-firebase/firestore';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {StackScreenProps} from '@react-navigation/stack';
import {HomeStackParams} from '../../navigation/HomeStackNavigation';
import AuthContex, {SchedulParams} from '../../route/AuthContext';
import mqtt, {IMqttClient} from 'sp-react-native-mqtt';
import {useSelector} from 'react-redux';
import {ReducerRootState} from '../../redux/Reducer';

type Nav = StackScreenProps<HomeStackParams>;

var MQTTClient: IMqttClient;

const ScheduleDetail = ({navigation, route}: Nav) => {
  const state = useSelector((state: ReducerRootState) => state);

  // const {Schedule} = useContext(AuthContex);
  const [show, showSet] = useState<boolean>(false);
  const [time, timeSet] = useState<string>('00:00');
  const [output, outputSet] = useState<string>('out1');
  const [duration, durationSet] = useState<string>('1');
  const [every, everySet] = useState<string>('7');
  const [status, statusSet] = useState<boolean>(true);

  const id: string = route?.params?.id;
  const model: string = route.params?.model;
  const switchName: Array<string> = route?.params?.switchName;

  useLayoutEffect(() => {
    mqtt
      .createClient({
        uri: 'mqtt://broker.hivemq.com:1883',
        clientId: `${id}schedule`,
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

  useLayoutEffect(() => {
    var splitTime: string = new Date().toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
    });

    console.log('time ======================', splitTime);

    // var timesplit = splitTime.split(':');

    // timeSet(`${timesplit[0]}:${timesplit[1]}`);
    timeSet(splitTime);
  }, []);

  const handleConfirm = time => {
    showSet(false);
    var timesplit = time.toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
    });

    // console.log('time = ', timesplit);
    // timesplit = timesplit.split('.');
    // timesplit = timesplit[4].split(':');

    // timeSet(`${timesplit[0]}:${timesplit[1]}`);

    timeSet(timesplit);
  };

  return (
    <Box
      flex={1}
      justifyContent="center"
      width="100%"
      _light={{bg: BG_LIGHT}}
      _dark={{bg: BG_DARK}}
      p={5}>
      <Pressable
        onPress={() => {
          showSet(true);
        }}>
        <HStack
          py={3}
          justifyContent={'space-between'}
          borderBottomWidth={0.8}
          alignItems="center"
          borderBottomColor="gray.300">
          <Text _light={{color: 'black'}} _dark={{color: FONT_INACTIVE_DARK}}>
            Time
          </Text>
          <Text _light={{color: 'black'}} _dark={{color: FONT_INACTIVE_DARK}}>
            {time}
          </Text>
        </HStack>
      </Pressable>

      {/* select button */}

      <HStack
        py={3}
        justifyContent={'space-between'}
        borderBottomWidth={0.8}
        alignItems="center"
        borderBottomColor="gray.300">
        <Text _light={{color: 'black'}} _dark={{color: FONT_INACTIVE_DARK}}>
          Button
        </Text>
        {model == '5CH' ? (
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
            {/* {switchName.map((i, data) => {
            return <Select.Item label={switchName[i]} value={`out${i + 1}`} />;
          })} */}
            <Select.Item label={switchName[0]} value="out1" />
            <Select.Item label={switchName[1]} value="out2" />
            <Select.Item label={switchName[2]} value="out3" />
            <Select.Item label={switchName[3]} value="out4" />
            <Select.Item label={switchName[4]} value="out5" />
          </Select>
        ) : (
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
            {/* {switchName.map((i, data) => {
            return <Select.Item label={switchName[i]} value={`out${i + 1}`} />;
          })} */}
            <Select.Item label={switchName[0]} value="out1" />
            <Select.Item label={switchName[1]} value="out2" />
            <Select.Item label={switchName[2]} value="out3" />
            <Select.Item label={switchName[3]} value="out4" />
          </Select>
        )}
      </HStack>

      {/* radio output duration */}

      <HStack
        py={3}
        alignItems={'center'}
        justifyContent="space-between"
        borderBottomWidth={0.8}
        borderBottomColor="gray.300">
        <Text _light={{color: 'black'}} _dark={{color: FONT_INACTIVE_DARK}}>
          Duration
        </Text>
        <Radio.Group
          defaultValue="1"
          name="myRadioGroup"
          onChange={val => durationSet(val)}
          accessibilityLabel="Pick your favorite number">
          <HStack space={2}>
            <VStack>
              <Radio
                value="1"
                _text={{
                  _light: {color: FONT_ACTIVE_LIGHT},
                  _dark: {color: FONT_INACTIVE_DARK},
                }}
                colorScheme="green"
                _dark={{backgroundColor: BG_DARK}}
                size="sm"
                my={1}>
                1 minutes
              </Radio>
              <Radio
                _text={{
                  _light: {color: FONT_ACTIVE_LIGHT},
                  _dark: {color: FONT_INACTIVE_DARK},
                }}
                value="2"
                colorScheme="green"
                _dark={{backgroundColor: BG_DARK}}
                size="sm"
                my={1}>
                2 minutes
              </Radio>
              <Radio
                _text={{
                  _light: {color: FONT_ACTIVE_LIGHT},
                  _dark: {color: FONT_INACTIVE_DARK},
                }}
                value="3"
                colorScheme="green"
                _dark={{backgroundColor: BG_DARK}}
                size="sm"
                my={1}>
                3 minutes
              </Radio>
            </VStack>
            <VStack>
              <Radio
                _text={{
                  _light: {color: FONT_ACTIVE_LIGHT},
                  _dark: {color: FONT_INACTIVE_DARK},
                }}
                value="5"
                colorScheme="green"
                _dark={{backgroundColor: BG_DARK}}
                size="sm"
                my={1}>
                5 minutes
              </Radio>
              <Radio
                _text={{
                  _light: {color: FONT_ACTIVE_LIGHT},
                  _dark: {color: FONT_INACTIVE_DARK},
                }}
                value="7"
                colorScheme="green"
                _dark={{backgroundColor: BG_DARK}}
                size="sm"
                my={1}>
                7 minutes
              </Radio>
              <Radio
                _text={{
                  _light: {color: FONT_ACTIVE_LIGHT},
                  _dark: {color: FONT_INACTIVE_DARK},
                }}
                value="10"
                colorScheme="green"
                _dark={{backgroundColor: BG_DARK}}
                size="sm"
                my={1}>
                10 minutes
              </Radio>
            </VStack>
          </HStack>
        </Radio.Group>
      </HStack>

      {/* select every */}

      <HStack
        py={3}
        alignItems={'center'}
        justifyContent="space-between"
        borderBottomWidth={0.8}
        borderBottomColor="gray.300">
        <Text _light={{color: 'black'}} _dark={{color: FONT_INACTIVE_DARK}}>
          Every
        </Text>
        <Radio.Group
          defaultValue={'7'}
          name="myRadioGroup"
          onChange={val => {
            everySet(val);
          }}
          accessibilityLabel="Pick your favorite number">
          <HStack space={2}>
            <VStack>
              <Radio
                _text={{
                  _light: {color: FONT_ACTIVE_LIGHT},
                  _dark: {color: FONT_INACTIVE_DARK},
                }}
                value="7"
                colorScheme="green"
                _dark={{backgroundColor: BG_DARK}}
                size="sm"
                my={1}>
                Sunday
              </Radio>
              <Radio
                _text={{
                  _light: {color: FONT_ACTIVE_LIGHT},
                  _dark: {color: FONT_INACTIVE_DARK},
                }}
                value="1"
                colorScheme="green"
                _dark={{backgroundColor: BG_DARK}}
                size="sm"
                my={1}>
                Monday
              </Radio>
              <Radio
                _text={{
                  _light: {color: FONT_ACTIVE_LIGHT},
                  _dark: {color: FONT_INACTIVE_DARK},
                }}
                value="2"
                colorScheme="green"
                _dark={{backgroundColor: BG_DARK}}
                size="sm"
                my={1}>
                Tuesday
              </Radio>
              <Radio
                _text={{
                  _light: {color: FONT_ACTIVE_LIGHT},
                  _dark: {color: FONT_INACTIVE_DARK},
                }}
                value="3"
                colorScheme="green"
                _dark={{backgroundColor: BG_DARK}}
                size="sm"
                my={1}>
                Wednesday
              </Radio>
            </VStack>
            <VStack>
              <Radio
                _text={{
                  _light: {color: FONT_ACTIVE_LIGHT},
                  _dark: {color: FONT_INACTIVE_DARK},
                }}
                value="4"
                colorScheme="green"
                _dark={{backgroundColor: BG_DARK}}
                size="sm"
                my={1}>
                Thursday
              </Radio>
              <Radio
                _text={{
                  _light: {color: FONT_ACTIVE_LIGHT},
                  _dark: {color: FONT_INACTIVE_DARK},
                }}
                value="5"
                colorScheme="green"
                _dark={{backgroundColor: BG_DARK}}
                size="sm"
                my={1}>
                Friday
              </Radio>
              <Radio
                _text={{
                  _light: {color: FONT_ACTIVE_LIGHT},
                  _dark: {color: FONT_INACTIVE_DARK},
                }}
                value="6"
                colorScheme="green"
                _dark={{backgroundColor: BG_DARK}}
                size="sm"
                my={1}>
                Saturday
              </Radio>
              <Radio
                _text={{
                  _light: {color: FONT_ACTIVE_LIGHT},
                  _dark: {color: FONT_INACTIVE_DARK},
                }}
                value="8"
                colorScheme="green"
                _dark={{backgroundColor: BG_DARK}}
                size="sm"
                my={1}>
                Everyday
              </Radio>
            </VStack>
          </HStack>
        </Radio.Group>
      </HStack>

      {/* status */}

      <HStack
        py={3}
        justifyContent={'space-between'}
        borderBottomWidth={0.8}
        alignItems="center"
        borderBottomColor="gray.300">
        <Text _light={{color: 'black'}} _dark={{color: FONT_INACTIVE_DARK}}>
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
            var newSchedule: SchedulParams = {
              output: output,
              duration: Number(duration),
              every: Number(every),
              status: status,
              id: Math.random().toString(),
              time,
            };

            firestore()
              // .collection(
              //   state.auth.email !== null ? state.auth.email : state.auth.uid,
              // )
              .collection('devices')
              .doc(id)
              .update({
                schedule: firestore.FieldValue.arrayUnion(newSchedule),
              })
              .then(() => {
                MQTTClient.publish(`/${id}/data/schedule`, 'true', 0, true);
              });

            navigation.navigate('Schedule', {
              id: id,
              switchName: switchName,
            });
          }
        }}
        _text={{
          color: 'black',
          letterSpacing: 3,
          fontWeight: 'medium',
          //   fontSize: FONT_SUB,
        }}>
        save
      </Button>

      {/* schedule picker */}
      <DateTimePickerModal
        isVisible={show}
        date={new Date()}
        // timeZoneOffsetInMinutes={0}
        mode="time"
        onConfirm={handleConfirm}
        onCancel={() => {
          showSet(false);
        }}
      />
    </Box>
  );
};

export default ScheduleDetail;
