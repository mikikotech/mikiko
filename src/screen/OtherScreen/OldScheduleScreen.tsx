import {Box, Fab, HStack, Icon, Switch, Text, VStack} from 'native-base';
import React, {useEffect, useLayoutEffect, useState} from 'react';
import {
  BG_DARK,
  BG_LIGHT,
  PRIMARY_COLOR,
  SECONDARY_COLOR,
} from '../../utils/constanta';
import firestore from '@react-native-firebase/firestore';
import {SwipeListView} from 'react-native-swipe-list-view';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {StackScreenProps} from '@react-navigation/stack';
import {HomeStackParams} from '../../navigation/HomeStackNavigation';
import {SchedulParams} from '../../route/AuthContext';
import mqtt, {IMqttClient} from 'sp-react-native-mqtt';

type Nav = StackScreenProps<HomeStackParams>;
var MQTTClient: IMqttClient;

const ScheduleScreen = ({navigation, route}: Nav) => {
  const id: string = route?.params?.id;

  const model: string = route.params?.model;

  const switchName: Array<string> = route?.params?.switchName;

  const [scheduleList, scheduleListSet] = useState<Array<SchedulParams>>();

  console.log('model ====================================', model);

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

    return () => mqtt.removeClient(MQTTClient);
  }, [navigation, route]);

  useEffect(() => {
    firestore()
      // .collection(state.auth.email !== null ? state.auth.email : state.auth.uid)
      .collection('devices')
      .doc(id)
      .onSnapshot(res => {
        console.log(res.data()?.schedule);
        // scheduleListSet(res?.data()?.schedule);
      });

    console.log('id =========================', id);
  }, []);

  const closeRow = (rowMap, rowKey) => {
    if (rowMap[rowKey]) {
      rowMap[rowKey].closeRow();
    }
  };

  const deleteRow = (rowMap, rowKey) => {
    closeRow(rowMap, rowKey);

    console.log('row key', rowKey);

    if (MQTTClient != null) {
      const newSchedule = scheduleList?.filter(res => {
        return res.id != rowKey;
      });

      console.log(newSchedule);

      scheduleListSet(newSchedule);

      try {
        firestore()
          .collection('devices')
          .doc(id)
          .update({
            schedule: newSchedule,
          })
          .then(() => {
            try {
              MQTTClient.publish(`/${id}/data/schedule`, 'true', 0, true);
            } catch (error) {}
          });
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <Box
      flex={1}
      width="100%"
      _light={{bg: BG_LIGHT}}
      _dark={{bg: BG_DARK}}
      p={5}>
      <SwipeListView
        data={scheduleList}
        renderItem={(data, rowMap) => {
          console.log(
            'output ==============================',
            data?.item?.output,
          );

          return (
            <HStack
              justifyContent={'space-between'}
              borderBottomWidth={0.8}
              alignItems="center"
              _dark={{bg: BG_DARK}}
              _light={{bg: BG_LIGHT}}
              py={2}
              borderBottomColor="gray.300">
              <VStack space={2}>
                <HStack space={2}>
                  <Text>
                    {'At  '}
                    {data.item.time}
                  </Text>
                  <Text>
                    {data.item.every == 1
                      ? 'Every  monday'
                      : data.item.every == 2
                      ? 'Every  tuesday'
                      : data.item.every == 3
                      ? 'Every  wednesday'
                      : data.item.every == 4
                      ? 'Every  thursday'
                      : data.item.every == 5
                      ? 'Every  friday'
                      : data.item.every == 6
                      ? 'Every  saturday'
                      : data.item.every == 7
                      ? 'Every  sunday'
                      : 'Everyday'}
                  </Text>
                </HStack>
                <HStack space={2}>
                  <Text>
                    {data.item.output == 'out1'
                      ? switchName[0]
                      : data.item.output == 'out2'
                      ? switchName[1]
                      : data.item.output == 'out3'
                      ? switchName[2]
                      : data.item.output == 'out4'
                      ? switchName[3]
                      : switchName[4]}
                    {'  ON'}
                  </Text>
                  <Text>
                    {'for  '}
                    {data.item.duration}
                    {' Minutes'}
                  </Text>
                </HStack>
              </VStack>
              <Switch
                onThumbColor={PRIMARY_COLOR}
                onTrackColor={SECONDARY_COLOR}
                onChange={() => {
                  var state: boolean = data.item.status;
                  if (MQTTClient != null && MQTTClient != undefined) {
                    const newSchedule = scheduleList?.map(res => {
                      if (res.id == data.item.id) {
                        return {...res, status: !state};
                      }

                      return res;
                    });

                    scheduleListSet(newSchedule);

                    try {
                      firestore()
                        // .collection(
                        //   state.auth.email !== null
                        //     ? state.auth.email
                        //     : state.auth.uid,
                        // )
                        .collection('devices')
                        .doc(id)
                        .update({
                          schedule: newSchedule,
                        })
                        .then(() => {
                          MQTTClient.publish(
                            `/${id}/data/schedule`,
                            'true',
                            0,
                            true,
                          );
                        });
                    } catch (error) {}
                  }
                }}
                value={data.item.status}
              />
            </HStack>
          );
        }}
        renderHiddenItem={(data, rowMap) => (
          <Box
            alignItems={'center'}
            flex={1}
            flexDirection={'row'}
            pl={15}
            justifyContent="flex-end">
            <Box
              w={12}
              h="100%"
              alignItems={'center'}
              justifyContent="center"
              bg={'gray.600'}>
              <Icon
                onPress={() => {
                  navigation.navigate('Scheduleedit', {
                    id: id,
                    _duration: data.item.duration,
                    _id: data.item.id,
                    _every: data.item.every,
                    _output: data.item.output,
                    _status: data.item.status,
                    _time: data.item.time,
                    switchName: switchName,
                    model: model,
                  });
                }}
                as={MaterialCommunityIcons}
                name="cog"
                size={7}
                color="gray.200"
              />
            </Box>
            <Box
              w={12}
              h="100%"
              alignItems={'center'}
              justifyContent="center"
              bg={'red.500'}>
              <Icon
                size={7}
                color="gray.200"
                as={MaterialCommunityIcons}
                name="delete"
                onPress={() => {
                  deleteRow(rowMap, data.item.id);
                }}
              />
            </Box>
          </Box>
        )}
        disableRightSwipe={true}
        leftOpenValue={75}
        rightOpenValue={-100}
      />
      <Fab
        renderInPortal={false}
        shadow={2}
        bg={PRIMARY_COLOR}
        onPress={() => {
          // navigation.navigate('Scheduledetail', {
          //   id: id,
          //   switchName: switchName,
          //   model: model,
          // });
          navigation.navigate('Newscheduledetail', {
            id: id,
            switchName: switchName,
            model: model,
          });
        }}
        size="sm"
        icon={
          <Icon
            color="white"
            as={MaterialCommunityIcons}
            name="plus"
            size="sm"
          />
        }
      />
    </Box>
  );
};

export default ScheduleScreen;
