import {StackScreenProps} from '@react-navigation/stack';
import {Box, Button, Center, Image, Pressable} from 'native-base';
import React, {useEffect, useState} from 'react';
import {HomeStackParams} from '../navigation/HomeStackNavigation';
import {BG_DARK, BG_LIGHT} from '../utils/constanta';
import MQTT from 'sp-react-native-mqtt';
import {NoFlickerImage} from 'react-native-no-flicker-image';
import DeviceList from '../components/DeviceList';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {dummyData} from '../assets/Dataimage/Data';
import {LogBox} from 'react-native';

type Nav = StackScreenProps<HomeStackParams>;

const HomeScreen = ({navigation}: Nav) => {
  const [data, dataSet] = useState('');

  function onConnect() {
    console.log('onConnect');
  }

  function onConnectionLost(responseObject) {
    if (responseObject.errorCode !== 0) {
      console.log('onConnectionLost:' + responseObject.errorMessage);
    }
  }

  function onMessageArrived(message) {
    console.log('onMessageArrived:' + message.payloadString);
  }

  useEffect(() => {
    // MQTT.createClient({
    //   uri: 'mqtt://broker.hivemq.com:1883',
    //   clientId: 'your_client_id11223344',
    // })
    //   .then(function (client) {
    //     client.on('closed', function () {
    //       console.log('mqtt.event.closed');
    //     });
    //     client.on('error', function (msg) {
    //       console.log('mqtt.event.error', msg);
    //     });
    //     client.on('message', function (msg) {
    //       dataSet(msg.data);
    //     });
    //     client.on('connect', function () {
    //       console.log('connected');
    //       client.subscribe('/esp32/cam/', 0);
    //       // client.publish('/data', "test", 0, false);
    //     });
    //     client.connect();
    //   })
    //   .catch(function (err) {
    //     console.log(err);
    //   });
  }, []);

  LogBox.ignoreAllLogs();

  return (
    <Box bg={BG_LIGHT} width="100%" flex={1}>
      {/* <Button
        onPress={() => {
          navigation.navigate('Toptabsbase');
        }}>
        Home
      </Button> */}
      {/* <Carousel data={dummyData} /> */}
      <Box px={3} mt={5}>
        <Pressable
          onPress={() => {
            navigation.navigate('Toptabsbase');
          }}>
          {/* <DeviceList
            gardenName="Kebun Bawang"
            id="1234567"
            location="gobleg, buleleng"
          /> */}
        </Pressable>
        {/* <NoFlickerImage style={{width: 350, height: 250}} source={{uri: data}} /> */}
      </Box>
    </Box>
  );
};

export default HomeScreen;
