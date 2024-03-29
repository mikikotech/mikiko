import {
  Box,
  Button,
  Checkbox,
  CheckIcon,
  HStack,
  Pressable,
  Radio,
  ScrollView,
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
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {StackScreenProps} from '@react-navigation/stack';
import {HomeStackParams} from '../../navigation/HomeStackNavigation';
import AuthContex, {
  NewSchedulParams,
  SchedulParams,
} from '../../route/AuthContext';
import mqtt, {IMqttClient} from 'sp-react-native-mqtt';
import {useSelector} from 'react-redux';
import {ReducerRootState} from '../../redux/Reducer';

type Nav = StackScreenProps<HomeStackParams>;

var MQTTClient: IMqttClient;

const ScheduleEdit = ({navigation, route}: Nav) => {
  const [show, showSet] = useState<boolean>(false);
  const [time, timeSet] = useState<string>('00:00');
  const [output, outputSet] = useState<string>('out1');
  const [state, stateSet] = useState<string>('1');
  const [everySelect, everySelectSet] = useState<string>('week');
  const [every, everySet] = useState<Array<string>>([]);
  const [months, mounthSet] = useState<Array<string>>([]);
  const [scheduleList, scheduleListSet] = useState<Array<NewSchedulParams>>();
  const [status, statusSet] = useState<boolean>(true);
  const [cron, cronSet] = useState<Array<string>>([
    '0',
    '*',
    '*',
    '*',
    '*',
    '*',
  ]);

  const id: string = route?.params?.id;
  const model: string = route.params?.model;
  const switchName: Array<string> = route?.params?.switchName;

  const _data: string = route?.params?._data;
  const _id: string = route?.params?._id;

  useLayoutEffect(() => {
    var dataSplit = _data.split(':');
    var cronSplit = dataSplit[0].split(' ');

    cronSet(dataSplit[0].split(' '));
    timeSet(`${cronSplit[2]}:${cronSplit[1]}`);
    outputSet(dataSplit[1]);
    stateSet(dataSplit[2]);
    if (cronSplit[3] == '*' && cronSplit[5] == '*') {
      everySelectSet('week');
    } else if (cronSplit[5] != '*') {
      everySelectSet('week');
      everySet(cronSplit[5].split(','));
    } else if (cronSplit[3] != '*') {
      everySelectSet('months');
      mounthSet(cronSplit[5].split(','));
    }
    statusSet(dataSplit[3] == '1' ? true : false);

    firestore()
      // .collection(state.auth.email !== null ? state.auth.email : state.auth.uid)
      .collection('devices')
      .doc(id)
      .get()
      .then(res => {
        console.log(res?.data()?.schedule);
        if (res.exists) {
          scheduleListSet(res?.data()?.schedule);
        }
      });
  }, [route, navigation]);

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

  const handleConfirm = time => {
    showSet(false);
    var splitTime = time.toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
    });

    var timeSplit = splitTime.split(':');

    cronSet(oldValue => {
      const copy = [...oldValue];

      copy[1] = timeSplit[1];
      copy[2] = timeSplit[0];

      return copy;
    });

    timeSet(splitTime);
  };

  return (
    <Box
      flex={1}
      justifyContent="center"
      width="100%"
      _light={{bg: BG_LIGHT}}
      _dark={{bg: BG_DARK}}
      p={5}>
      <ScrollView showsVerticalScrollIndicator={false}>
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

        {/* radio output state */}

        <HStack
          py={3}
          alignItems={'center'}
          justifyContent="space-between"
          borderBottomWidth={0.8}
          borderBottomColor="gray.300">
          <Text _light={{color: 'black'}} _dark={{color: FONT_INACTIVE_DARK}}>
            State
          </Text>
          <Radio.Group
            defaultValue={state}
            name="myRadioGroup"
            onChange={val => stateSet(val)}
            accessibilityLabel="Pick your favorite number">
            <HStack space={2}>
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
                ON
              </Radio>
              <Radio
                _text={{
                  _light: {color: FONT_ACTIVE_LIGHT},
                  _dark: {color: FONT_INACTIVE_DARK},
                }}
                value="0"
                colorScheme="green"
                _dark={{backgroundColor: BG_DARK}}
                size="sm"
                my={1}>
                OFF
              </Radio>
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

          <VStack>
            <Select
              selectedValue={everySelect}
              minWidth="200"
              accessibilityLabel="Choose Button"
              placeholder="Choose Button"
              mb={3}
              _selectedItem={{
                bg: 'teal.600',
                endIcon: <CheckIcon size="5" />,
              }}
              mt={1}
              onValueChange={val => {
                everySelectSet(val);

                mounthSet(() => {
                  return [];
                });

                everySet(() => {
                  return [];
                });

                cronSet(oldValue => {
                  const copy = [...oldValue];

                  copy[3] = '*';
                  copy[5] = '*';

                  return copy;
                });
              }}>
              <Select.Item label={'day of weeks'} value="week" />
              <Select.Item label={'day of months'} value="months" />
            </Select>
            {everySelect == 'week' ? (
              <Checkbox.Group
                key={'week'}
                colorScheme="green"
                defaultValue={every}
                accessibilityLabel="pick an days"
                onChange={(val: Array<string>) => {
                  console.log('every week select ======', val);

                  everySet(val);

                  everySet(() => {
                    return val;
                  });

                  if (val.length == 7 || val.length == 0) {
                    cronSet(oldValue => {
                      const copy = [...oldValue];

                      copy[3] = '*';
                      copy[5] = '*';

                      return copy;
                    });
                  } else {
                    cronSet(oldValue => {
                      const copy = [...oldValue];

                      copy[3] = '*';
                      copy[5] = val.toString();

                      return copy;
                    });
                  }
                }}>
                <HStack>
                  <VStack mr={10}>
                    <Checkbox value="0" my="1">
                      Sun
                    </Checkbox>
                    <Checkbox value="1" my="1">
                      Mon
                    </Checkbox>
                    <Checkbox value="2" my="1">
                      Tue
                    </Checkbox>
                    <Checkbox value="3" my="1">
                      Wed
                    </Checkbox>
                  </VStack>
                  <VStack>
                    <Checkbox value="4" my="1">
                      Thue
                    </Checkbox>
                    <Checkbox value="5" my="1">
                      Fri
                    </Checkbox>
                    <Checkbox value="6" my="1">
                      Sat
                    </Checkbox>
                  </VStack>
                </HStack>
              </Checkbox.Group>
            ) : (
              <Checkbox.Group
                key={'months'}
                colorScheme="green"
                defaultValue={months}
                accessibilityLabel="pick an item"
                onChange={(val: Array<string>) => {
                  console.log(val);

                  mounthSet(val);

                  mounthSet(() => {
                    return val;
                  });

                  if (val.length == 31 || val.length == 0) {
                    cronSet(oldValue => {
                      const copy = [...oldValue];

                      copy[3] = '*';
                      copy[5] = '*';

                      return copy;
                    });
                  } else {
                    cronSet(oldValue => {
                      const copy = [...oldValue];

                      copy[3] = val.toString();
                      copy[5] = '*';

                      return copy;
                    });
                  }
                }}>
                <HStack>
                  <VStack mr={2}>
                    <Checkbox value="1" my="1">
                      1
                    </Checkbox>
                    <Checkbox value="2" my="1">
                      2
                    </Checkbox>
                    <Checkbox value="3" my="1">
                      3
                    </Checkbox>
                    <Checkbox value="4" my="1">
                      4
                    </Checkbox>
                    <Checkbox value="5" my="1">
                      5
                    </Checkbox>
                    <Checkbox value="6" my="1">
                      6
                    </Checkbox>
                    <Checkbox value="7" my="1">
                      7
                    </Checkbox>
                    <Checkbox value="8" my="1">
                      8
                    </Checkbox>
                    <Checkbox value="9" my="1">
                      9
                    </Checkbox>
                    <Checkbox value="10" my="1">
                      10
                    </Checkbox>
                  </VStack>
                  <VStack mr={2}>
                    <Checkbox value="11" my="1">
                      11
                    </Checkbox>
                    <Checkbox value="12" my="1">
                      12
                    </Checkbox>
                    <Checkbox value="13" my="1">
                      13
                    </Checkbox>
                    <Checkbox value="14" my="1">
                      14
                    </Checkbox>
                    <Checkbox value="15" my="1">
                      15
                    </Checkbox>
                    <Checkbox value="16" my="1">
                      16
                    </Checkbox>
                    <Checkbox value="17" my="1">
                      17
                    </Checkbox>
                    <Checkbox value="18" my="1">
                      18
                    </Checkbox>
                    <Checkbox value="19" my="1">
                      19
                    </Checkbox>
                    <Checkbox value="20" my="1">
                      20
                    </Checkbox>
                  </VStack>

                  <VStack mr={2}>
                    <Checkbox value="21" my="1">
                      21
                    </Checkbox>
                    <Checkbox value="22" my="1">
                      22
                    </Checkbox>
                    <Checkbox value="23" my="1">
                      23
                    </Checkbox>
                    <Checkbox value="24" my="1">
                      24
                    </Checkbox>
                    <Checkbox value="25" my="1">
                      25
                    </Checkbox>
                    <Checkbox value="26" my="1">
                      26
                    </Checkbox>
                    <Checkbox value="27" my="1">
                      27
                    </Checkbox>
                    <Checkbox value="28" my="1">
                      28
                    </Checkbox>
                    <Checkbox value="29" my="1">
                      29
                    </Checkbox>
                    <Checkbox value="30" my="1">
                      30
                    </Checkbox>
                    <Checkbox value="31" my="1">
                      31
                    </Checkbox>
                  </VStack>
                </HStack>
              </Checkbox.Group>
            )}
          </VStack>
        </HStack>

        {/* repeat */}

        {/* <HStack
            py={3}
            alignItems={'center'}
            justifyContent="space-between"
            borderBottomWidth={0.8}
            borderBottomColor="gray.300">
            <Text _light={{color: 'black'}} _dark={{color: FONT_INACTIVE_DARK}}>
              Repeat
            </Text>
  
            <Select
              selectedValue={repeat}
              minWidth="200"
              accessibilityLabel="Choose Button"
              placeholder="Choose Button"
              _selectedItem={{
                bg: 'teal.600',
                endIcon: <CheckIcon size="5" />,
              }}
              mt={1}
              onValueChange={val => {
                repeatSet(val);
              }}>
              <Select.Item label={'once'} value="1" />
              <Select.Item label={'repeat'} value="0" />
            </Select>
          </HStack> */}

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

        {/* safasfas */}

        {/* <Button
          onPress={() => {
            // var cronString: string = cron.join(' ');
            // var data = `${cronString}:${output}:${state}:${
            //   status == true ? 1 : 0
            // }`;
            // console.log('schedule data', data);
            console.log(every);
          }}>
          print schedule data
        </Button> */}

        {/* button save */}

        <Button
          mt={20}
          bg={PRIMARY_COLOR}
          onPress={() => {
            if (MQTTClient != null && MQTTClient != undefined) {
              var cronString: string = cron.join(' ');

              var dataEdit = `${cronString}:${output}:${state}:${
                status == true ? 1 : 0
              }`;
              const newScheduleEdit = scheduleList?.map(res => {
                console.log('respone loop = ', res);

                if (res.id == _id) {
                  return {
                    ...res,
                    data: dataEdit,
                  };
                }
                return res;
              });

              console.log('new schedule ===', newScheduleEdit);

              firestore()
                .collection('devices')
                .doc(id)
                .update({
                  schedule: newScheduleEdit,
                })
                .then(() => {
                  MQTTClient.publish(`/${id}/data/schedule`, 'true', 0, true);
                });

              navigation.navigate('Schedule', {
                id: id,
                switchName: switchName,
                model: model,
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
      </ScrollView>
    </Box>
  );
};

export default ScheduleEdit;
