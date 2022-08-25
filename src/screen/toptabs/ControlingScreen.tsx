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

const ControlingScreen = ({navigation, route}: Nav) => {
  const [buttonState, buttonStateSet] = useState<Array<string>>([
    'false',
    'false',
    'false',
    'false',
  ]);
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
          if (msg.topic == `/${id}/data/btn1`) {
            // if (msg.data == 'true') {
            //   btnoneSet(true);

            // } else {
            //   btnoneSet(false);
            // }
            buttonStateSet(oldValue => {
              const copy = [...oldValue];

              copy[1] = msg.data;

              return copy;
            });
          } else if (msg.topic == `/${id}/data/btn2`) {
            // if (msg.data == 'true') {
            //   btntwoSet(true);
            // } else {
            //   btntwoSet(false);
            // }
            buttonStateSet(oldValue => {
              const copy = [...oldValue];

              copy[2] = msg.data;

              return copy;
            });
          } else if (msg.topic == `/${id}/data/btn3`) {
            // if (msg.data == 'true') {
            //   btnthreeSet(true);
            // } else {
            //   btnthreeSet(false);
            // }
            buttonStateSet(oldValue => {
              const copy = [...oldValue];

              copy[3] = msg.data;

              return copy;
            });
          } else if (msg.topic == `/${id}/data/btn4`) {
            // if (msg.data == 'true') {
            //   btnfourSet(true);
            // } else {
            //   btnfourSet(false);
            // }
            buttonStateSet(oldValue => {
              const copy = [...oldValue];

              copy[4] = msg.data;

              return copy;
            });
          } else if (msg.topic == `/${id}/data/btn5`) {
            // if (msg.data == 'true') {
            //   btnfourSet(true);
            // } else {
            //   btnfourSet(false);
            // }
            buttonStateSet(oldValue => {
              const copy = [...oldValue];

              copy[5] = msg.data;

              return copy;
            });
          }
          // }
          isLoadSet(true);
        });

        client.on('connect', function () {
          client.subscribe(`/${id}/data/btn1`, 0);
          client.subscribe(`/${id}/data/btn2`, 0);
          client.subscribe(`/${id}/data/btn3`, 0);
          client.subscribe(`/${id}/data/btn4`, 0);
          client.subscribe(`/${id}/data/btn5`, 0);
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
        pt={model == '5CH' ? 0 : 32}
        mt={12}
        flexDirection="row"
        alignItems="center"
        justifyContent={'space-around'}
        flexWrap="wrap">
        {switchName.map((val, i) => {
          console.log('index btn = ', i);

          return (
            <ControlButton
              key={i + 1}
              onPress={() => {
                // btnoneSet(!btnone);
                // btnoneSet(prev => !prev);
                buttonStateSet(oldVal => {
                  const copy = [...oldVal];

                  copy[i + 1] = copy[i + 1] == 'true' ? 'false' : 'true';

                  return copy;
                });
                buttonState[i + 1] == 'true'
                  ? MQTTClient.publish(
                      `/${id}/data/btn${i + 1}`,
                      'false',
                      0,
                      true,
                    )
                  : MQTTClient.publish(
                      `/${id}/data/btn${i + 1}`,
                      'true',
                      0,
                      true,
                    );
              }}
              name={val}
              condition={buttonState[i + 1] == 'true' ? true : false}
            />
          );
        })}
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

export default ControlingScreen;
