import {StackScreenProps} from '@react-navigation/stack';
import {Center, Box, Button, VStack, Text, Icon, Pressable} from 'native-base';
import React, {useEffect, useLayoutEffect, useState} from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import mqtt, {IMqttClient} from 'sp-react-native-mqtt';
import ControlButton from '../../components/ControlButton';
import {HomeStackParams} from '../../navigation/HomeStackNavigation';
import {BG_DARK, BG_LIGHT, PRIMARY_COLOR} from '../../utils/constanta';
import Loader from 'react-native-modal-loader';
import AndroidToast from '../../utils/AndroidToast';

type Nav = StackScreenProps<HomeStackParams>;

var MQTTClient: IMqttClient;

const SwitchScreen = ({navigation, route}: Nav) => {
  const [btnone, btnoneSet] = useState(false);
  const [btntwo, btntwoSet] = useState(false);
  const [btnthree, btnthreeSet] = useState(false);
  const [btnfour, btnfourSet] = useState(false);
  const [isLoad, isLoadSet] = useState<boolean>(false);

  let state: Array<{path: string; status: boolean}> = [];

  for (let i = 0; i < 5; i++) {
    state = [
      ...state,
      {
        path: `btn${i + 1}`,
        status: false,
      },
    ];
  }

  const id: string = route?.params?.id;

  const model: string = route.params?.model;

  const switchName: Array<string> = route?.params?.switchName;

  useEffect(() => {
    mqtt
      .createClient({
        uri: 'mqtt://broker.hivemq.com:1883',
        clientId: `${id}12345`,
      })
      .then(function (client) {
        client.on('message', function (msg) {
          // console.log('mqtt.event.message', msg);

          // if (isLoading) {
          if (msg.topic == `/${id}/data/btnone`) {
            if (msg.data == 'true') {
              btnoneSet(true);
            } else {
              btnoneSet(false);
            }
          } else if (msg.topic == `/${id}/data/btntwo`) {
            if (msg.data == 'true') {
              btntwoSet(true);
            } else {
              btntwoSet(false);
            }
          } else if (msg.topic == `/${id}/data/btnthree`) {
            if (msg.data == 'true') {
              btnthreeSet(true);
            } else {
              btnthreeSet(false);
            }
          } else if (msg.topic == `/${id}/data/btnfour`) {
            if (msg.data == 'true') {
              btnfourSet(true);
            } else {
              btnfourSet(false);
            }
          }
          // }
          isLoadSet(true);
        });

        client.on('connect', function () {
          client.subscribe(`/${id}/data/btnone`, 0);
          client.subscribe(`/${id}/data/btntwo`, 0);
          client.subscribe(`/${id}/data/btnthree`, 0);
          client.subscribe(`/${id}/data/btnfour`, 0);
          client.subscribe(`/${id}/data/btnfive`, 0);
          MQTTClient = client;
        });

        client.connect();
      })
      .catch(function (err) {
        console.log(err);
      });
  }, [navigation]);

  if (isLoad == false)
    return <Loader loading={!isLoad} opacity={0.6} color={PRIMARY_COLOR} />;

  return (
    <Center flex={1} _light={{bg: BG_LIGHT}} _dark={{bg: BG_DARK}}>
      <Box
        width={'100%'}
        height="95%"
        px={5}
        pt={32}
        mt={12}
        mb={10}
        flexDirection="row"
        alignItems="center"
        justifyContent={'space-around'}
        flexWrap="wrap">
        <ControlButton
          key={1}
          onPress={() => {
            // btnoneSet(!btnone);
            btnoneSet(prev => !prev);
            btnone == true
              ? MQTTClient.publish(`/${id}/data/btnone`, 'false', 0, true)
              : MQTTClient.publish(`/${id}/data/btnone`, 'true', 0, true);
          }}
          name={switchName[0]}
          condition={btnone}
        />
        <ControlButton
          key={2}
          onPress={() => {
            btntwoSet(prev => !prev);
            btntwo == true
              ? MQTTClient.publish(`/${id}/data/btntwo`, 'false', 0, true)
              : MQTTClient.publish(`/${id}/data/btntwo`, 'true', 0, true);
          }}
          name={switchName[1]}
          condition={btntwo}
        />
        <Box width={'100%'} height={50} />
        <ControlButton
          key={3}
          onPress={() => {
            btnthreeSet(prev => !prev);
            btnthree == true
              ? MQTTClient.publish(`/${id}/data/btnthree`, 'false', 0, true)
              : MQTTClient.publish(`/${id}/data/btnthree`, 'true', 0, true);
          }}
          name={switchName[2]}
          condition={btnthree}
        />
        <ControlButton
          key={4}
          onPress={() => {
            btnfourSet(prev => !prev);
            btnfour == true
              ? MQTTClient.publish(`/${id}/data/btnfour`, 'false', 0, true)
              : MQTTClient.publish(`/${id}/data/btnfour`, 'true', 0, true);
          }}
          name={switchName[3]}
          condition={btnfour}
        />
      </Box>
      <Box
        flexDir={'row'}
        justifyContent="space-around"
        width={'100%'}
        position="absolute"
        bottom={5}>
        <Pressable
          onPress={() => {
            // navigation.navigate('Action', {
            //   id: id,
            //   switchName: switchName,
            //   model: model,
            // });
            AndroidToast.toast('coming soon');
          }}
          justifyContent={'center'}
          alignItems="center">
          <Icon
            as={MaterialCommunityIcons}
            name="timer-settings-outline"
            size={10}
            color={PRIMARY_COLOR}
          />
          <Text mt={1}>Loop Timer</Text>
        </Pressable>
        <Pressable
          onPress={() => {
            navigation.navigate('Schedule', {
              id: id,
              switchName: switchName,
              model: model,
            });
          }}
          justifyContent={'center'}
          alignItems="center">
          <Icon
            as={MaterialCommunityIcons}
            name="alarm"
            size={10}
            color={PRIMARY_COLOR}
          />
          <Text mt={1}>Schedule</Text>
        </Pressable>
      </Box>
    </Center>
  );
};

export default SwitchScreen;
