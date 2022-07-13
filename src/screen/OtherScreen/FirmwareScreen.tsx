import {Box, HStack, Icon, Pressable, Text} from 'native-base';
import React, {useLayoutEffect, useState} from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {BG_DARK, BG_LIGHT, TAB_BAR_HEIGHT} from '../../utils/constanta';
import storage from '@react-native-firebase/storage';
import {StackScreenProps} from '@react-navigation/stack';
import {HomeStackParams} from '../../navigation/HomeStackNavigation';
import mqtt, {IMqttClient} from 'sp-react-native-mqtt';
import ModalAlert from '../../components/ModalAlert';
import AndroidToast from '../../utils/AndroidToast';

type Nav = StackScreenProps<HomeStackParams>;

var MQTTClient: IMqttClient;

const FirmwareScreen = ({route, navigation}: Nav) => {
  const [versionUpdate, versionUpdateSet] = useState<boolean>(false);
  const [targetVersion, targetVersionSet] = useState<string>('');
  const [show, setShow] = useState<boolean>(false);

  const id = route?.params?.id;

  useLayoutEffect(() => {
    mqtt
      .createClient({
        uri: 'mqtt://broker.hivemq.com:1883',
        clientId: `${id}update`,
      })
      .then(function (client) {
        client.on('closed', function () {});

        client.on('error', function (msg) {});

        client.on('message', function (msg) {});

        client.on('connect', function () {
          MQTTClient = client;
        });

        client.connect();
      })
      .catch(function (err) {
        console.log(err);
      });
  });

  useLayoutEffect(() => {
    const reference = storage().ref('/MTH/');
    reference.listAll().then(res => {
      console.log('firebase storage ==== ', res.items[0].name);

      if (res.items[0].name !== route.params?.version) {
        versionUpdateSet(true);
        targetVersionSet(res.items[0].name.toString());
      }
    });
  }, []);

  // if (MQTTClient == undefined) return <></>;

  return (
    <Box
      flex={1}
      width="100%"
      px={5}
      _dark={{bg: BG_DARK}}
      _light={{bg: BG_LIGHT}}>
      <HStack
        justifyContent={'space-between'}
        borderBottomWidth={0.8}
        alignItems="center"
        height={TAB_BAR_HEIGHT}
        borderBottomColor="gray.300">
        <Text>Version</Text>
        <Text>{route.params?.version}</Text>
      </HStack>
      {/* manual */}

      <Pressable
        onPress={() => {
          navigation.navigate('Manual', {id: id});
        }}>
        <HStack
          justifyContent={'space-between'}
          borderBottomWidth={0.8}
          alignItems="center"
          height={TAB_BAR_HEIGHT}
          borderBottomColor="gray.300">
          <Text>Manual Update</Text>
          <Icon as={MaterialCommunityIcons} name="chevron-right" />
        </HStack>
      </Pressable>

      {/* otomatis */}
      <Pressable
        onPress={() => {
          versionUpdate
            ? setShow(true)
            : AndroidToast.toast('Already in lastest version');
        }}>
        <HStack
          justifyContent={'space-between'}
          alignItems="center"
          borderBottomWidth={0.8}
          height={TAB_BAR_HEIGHT}
          borderBottomColor="gray.300">
          <Text>Check Update</Text>
          <HStack>
            {versionUpdate ? (
              <Box
                justifyContent={'center'}
                alignItems="center"
                bg={'red.600'}
                h={5}
                w={5}
                rounded="full">
                <Text>1</Text>
              </Box>
            ) : null}
            <Icon as={MaterialCommunityIcons} name="chevron-right" />
          </HStack>
        </HStack>
      </Pressable>

      <ModalAlert
        show={show}
        title="Update Firmware"
        message={`upgrade from version ${route.params?.version} to ${targetVersion}`}
        onPress={() => {
          MQTTClient.publish(`/${id}/data/ota`, 'true', 0, false);
          setShow(false);
          // navigation.navigate('Wifi');
        }}
        onCancel={() => {
          setShow(false);
        }}
        schema="check"
        variant="error"
      />
    </Box>
  );
};

export default FirmwareScreen;
