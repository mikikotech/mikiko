import {StackScreenProps} from '@react-navigation/stack';
import {Text, Center, Button, VStack, Box, Icon} from 'native-base';
import React, {useLayoutEffect, useState} from 'react';
import mqtt, {IMqttClient} from 'sp-react-native-mqtt';
import {NoFlickerImage} from 'react-native-no-flicker-image';
import {HomeStackParams} from '../../navigation/HomeStackNavigation';
import {
  BG_DARK,
  BG_LIGHT,
  FONT_INACTIVE_DARK,
  FONT_INACTIVE_LIGHT,
  FONT_TITLE,
  ITEM_WIDTH_H4,
  PRIMARY_COLOR,
  TAB_BAR_HEIGHT,
} from '../../utils/constanta';
import {useSelector} from 'react-redux';
import {ReducerRootState} from '../../redux/Reducer';
import firestore from '@react-native-firebase/firestore';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

type Nav = StackScreenProps<HomeStackParams>;

var MQTTClient: IMqttClient;

const CameraScreen = ({navigation, route}: Nav) => {
  const state = useSelector((state: ReducerRootState) => state);

  const [base64, base64Set] = useState<string>('');
  const [cctvList, cctvListSet] = useState<any>();
  const [isConnected, isConnectedSet] = useState<string>('false');

  const id: string = route?.params?.id;

  useLayoutEffect(() => {
    var camIds: string;
    const subscriber = firestore()
      .collection(state.auth.email !== null ? state.auth.email : state.auth.uid)
      .doc(id)
      .onSnapshot(documentSnapshot => {
        console.log('User data: ', documentSnapshot.data()?.cctv);
        if (documentSnapshot.data()?.cctv !== null) {
          cctvListSet(documentSnapshot.data()?.cctv);
          camIds = documentSnapshot.data()?.cctv?.id;
        }
      });

    mqtt
      .createClient({
        uri: 'mqtt://broker.hivemq.com:1883',
        clientId: `camera1234`,
      })
      .then(function (client) {
        client.on('message', function (msg) {
          if (msg.topic == `/${camIds}/cam/`) {
            base64Set(msg.data);
          } else if (msg.topic == `${camIds}`) {
            isConnectedSet(msg.data);
          }
        });

        client.on('connect', function () {
          console.log('connected');
          client.subscribe(`/${camIds}/cam/`, 0);
          client.subscribe(`${camIds}`, 0);
          client.subscribe(`/${camIds}/data/firmwareversion`, 0);
          MQTTClient = client;
        });

        client.connect();
      })
      .catch(function (err) {
        console.log(err);
      });

    return () => subscriber();
  }, []);

  console.log('cctv list ========= ', cctvList);

  return (
    <Center flex={1} _light={{bg: BG_LIGHT}} _dark={{bg: BG_DARK}}>
      <VStack alignItems="center" space={3}>
        {cctvList !== null || cctvList !== undefined || cctvList !== '' ? (
          <Box position={'relative'}>
            <NoFlickerImage
              style={{
                width: 350,
                height: 250,
                borderRadius: 5,
                borderWidth: 1,
                borderColor: 'white',
              }}
              source={{
                uri: base64,
              }}
            />
            {isConnected == 'false' ? (
              <Icon
                position={'absolute'}
                top={250 / 2 - 64}
                left={350 / 2 - 64}
                size={32}
                as={MaterialCommunityIcons}
                name="wifi-alert"
                color={'red.600'}
              />
            ) : null}
          </Box>
        ) : (
          <>
            <Text
              fontSize={FONT_TITLE}
              _dark={{color: FONT_INACTIVE_DARK}}
              bold>
              No Device Yet
            </Text>
            <Button
              variant={'unstyled'}
              width={ITEM_WIDTH_H4 * 1.3}
              height={TAB_BAR_HEIGHT}
              onPress={() => {
                navigation.replace('Pairingbase');
              }}
              rounded="none"
              bg={PRIMARY_COLOR}
              _text={{color: FONT_INACTIVE_LIGHT, mt: -1}}>
              ADD
            </Button>
          </>
        )}
      </VStack>
    </Center>
  );
};

export default CameraScreen;
