import {
  Box,
  HStack,
  Icon as NativeIcon,
  Switch,
  Text,
  VStack,
  Pressable,
  Skeleton,
} from 'native-base';
import React, {useEffect, useState} from 'react';
import {Vibration} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import StaggerView from './Stager';
import MQTT, {IMqttClient} from 'sp-react-native-mqtt';
import {useNavigation} from '@react-navigation/native';
import {
  BG_BOX_DARK,
  BG_DARK,
  BG_LIGHT,
  DISABLE_COLOR,
  FONT_HEADING,
  FONT_INACTIVE_DARK,
  FONT_SUB,
  ITEM_HEIGHT_H3,
  PRIMARY_COLOR,
  SECONDARY_COLOR,
} from '../utils/constanta';
import SplashScreen from 'react-native-splash-screen';
import AndroidToast from '../utils/AndroidToast';
import NetInfo from '@react-native-community/netinfo';

interface Props {
  gardenName: string;
  location: string;
  id: string;
  shared?: boolean;
  model: string;
  scene: string;
  switchName: Array<string>;
}

var MQTTClient: IMqttClient;

// type nav = StackScreenProps<HomeStackParams>;

const SonoffDevice = ({
  gardenName,
  location,
  id,
  shared,
  model,
  scene,
  switchName,
}: Props) => {
  const navigation = useNavigation<any>();

  const [buttonState, buttonStateSet] = useState<Array<string>>([
    'false',
    'false',
    'false',
    'false',
    'false',
  ]);
  const [isConnected, isConnectedSet] = useState('true');
  const [isLoad, isLoadSet] = useState<boolean>(false);
  const [firmwareVersion, firmwareVersionSet] = useState('');

  useEffect(() => {
    MQTT.createClient({
      uri: 'mqtt://broker.hivemq.com:1883',
      clientId: `${id}qwert`,
    })
      .then(function (client) {
        client.on('closed', function () {
          console.log('mqtt closed ============================');
        });

        client.on('message', function (msg) {
          // console.log('mqtt.event.message', msg);

          if (msg.topic == `${id}`) {
            isConnectedSet(msg.data);
          }

          // if (isLoading) {
          if (msg.topic == `/${id}/data/btn1`) {
            buttonStateSet(oldVal => {
              const copy = [...oldVal];

              copy[1] = msg.data;

              return copy;
            });
            // channel1Set(msg.data);
          } else if (msg.topic == `/${id}/data/btn2`) {
            // channel2Set(msg.data);
            buttonStateSet(oldVal => {
              const copy = [...oldVal];

              copy[2] = msg.data;

              return copy;
            });
          } else if (msg.topic == `/${id}/data/btn3`) {
            // channel3Set(msg.data);
            buttonStateSet(oldVal => {
              const copy = [...oldVal];

              copy[3] = msg.data;

              return copy;
            });
          } else if (msg.topic == `/${id}/data/btn4`) {
            // channel4Set(msg.data);
            buttonStateSet(oldVal => {
              const copy = [...oldVal];

              copy[4] = msg.data;

              return copy;
            });
          } else if (msg.topic == `/${id}/data/firmwareversion`) {
            // firmwareVersionSet(msg.data);
          }

          isLoadSet(true);
          // }
        });

        client.on('connect', function () {
          console.log('connected =====================');
          client.subscribe(`/${id}/data/btn1`, 0);
          client.subscribe(`/${id}/data/btn2`, 0);
          client.subscribe(`/${id}/data/btn3`, 0);
          client.subscribe(`/${id}/data/btn4`, 0);
          client.subscribe(`${id}`, 0);
          client.subscribe(`/${id}/data/firmwareversion`, 0);
          MQTTClient = client;
          SplashScreen.hide();
        });

        client.connect();
      })
      .catch(function (err) {
        console.log(err);
      });
  }, [navigation]);

  if (!isLoad) {
    return (
      <Box
        width="full"
        _light={{bg: BG_LIGHT}}
        _dark={{bg: BG_DARK}}
        h={ITEM_HEIGHT_H3 * 0.95}
        p={3}
        mt={3}
        borderWidth={1}
        borderColor={DISABLE_COLOR}
        rounded="xl">
        <HStack mt={3}>
          <Skeleton h="5" w={'16'} rounded="full" startColor="coolGray.400" />
          <Skeleton
            ml={3}
            h="5"
            w={'5'}
            rounded="full"
            startColor="coolGray.300"
          />
        </HStack>
        <Skeleton mt={3} h="3" w={'78%'} rounded="full" startColor="red.300" />
        <HStack mt={3} justifyContent="space-between">
          <VStack>
            <Skeleton h="5" w={'16'} rounded="full" startColor="coolGray.400" />
            <Skeleton
              mt={1}
              h="3"
              w={'12'}
              rounded="full"
              startColor="coolGray.400"
            />
          </VStack>
          <VStack>
            <Skeleton h="5" w={'16'} rounded="full" startColor="coolGray.400" />
            <Skeleton
              mt={1}
              h="3"
              w={'12'}
              rounded="full"
              startColor="coolGray.400"
            />
          </VStack>
          <VStack>
            <Skeleton h="5" w={'16'} rounded="full" startColor="coolGray.400" />
            <Skeleton
              mt={1}
              h="3"
              w={'12'}
              rounded="full"
              startColor="coolGray.400"
            />
          </VStack>
          <VStack>
            <Skeleton h="5" w={'16'} rounded="full" startColor="coolGray.400" />
            <Skeleton
              mt={1}
              h="3"
              w={'12'}
              rounded="full"
              startColor="coolGray.400"
            />
          </VStack>
          <VStack>
            <Skeleton h="5" w={'16'} rounded="full" startColor="coolGray.400" />
            <Skeleton
              mt={1}
              h="3"
              w={'12'}
              rounded="full"
              startColor="coolGray.400"
            />
          </VStack>
        </HStack>
      </Box>
    );
  }

  return (
    <Box
      width="full"
      mt={3}
      _light={{bg: BG_LIGHT, borderColor: DISABLE_COLOR}}
      _dark={{bg: BG_BOX_DARK, borderColor: BG_BOX_DARK}}
      h={ITEM_HEIGHT_H3 * 0.95}
      p={3}
      borderWidth={1}
      borderColor={DISABLE_COLOR}
      rounded="xl">
      <VStack>
        <Pressable
          onPress={() => {
            navigation.navigate('Controlscreen', {
              id: id,
              switchName: switchName,
              model: model,
            });
          }}>
          {/* garden name */}

          <HStack alignItems={'center'} justifyContent="space-between">
            <Text
              fontSize={FONT_HEADING}
              bold
              color={isConnected == 'true' ? PRIMARY_COLOR : DISABLE_COLOR}
              style={{textTransform: 'capitalize'}}>
              {gardenName}{' '}
            </Text>
            {/* {!shared ? ( */}
            <StaggerView
              id={id}
              gardenName={gardenName}
              location={location}
              shared={shared}
              version={firmwareVersion}
              model={model}
              scene={scene}
              switchName={switchName}
            />
            {/* ) : null} */}
          </HStack>

          {/* connection */}

          <Text
            italic
            fontSize={FONT_SUB}
            _dark={{
              color:
                isConnected == 'false' ? FONT_INACTIVE_DARK : PRIMARY_COLOR,
            }}
            _light={{color: isConnected == 'false' ? DISABLE_COLOR : 'black'}}>
            {isConnected == 'true' ? 'online' : 'offline'}
          </Text>

          {/* location */}

          <HStack mt={2}>
            <NativeIcon
              as={MaterialCommunityIcons}
              name="map-marker"
              size={5}
              color={isConnected == 'true' ? 'red.400' : DISABLE_COLOR}
            />
            <Text
              noOfLines={1}
              fontSize={FONT_SUB}
              _dark={{
                color:
                  isConnected == 'false' ? FONT_INACTIVE_DARK : PRIMARY_COLOR,
              }}
              _light={{color: isConnected == 'true' ? BG_DARK : DISABLE_COLOR}}
              style={{textTransform: 'capitalize'}}>
              {location}
            </Text>
          </HStack>
        </Pressable>

        {/* switch */}

        <HStack mt={1} justifyContent="space-between">
          {switchName.map((val, i) => {
            return (
              <VStack>
                <Switch
                  key={i + 1}
                  isDisabled={isConnected == 'true' ? false : true}
                  isChecked={buttonState[i + 1] == 'true' ? true : false}
                  onThumbColor={PRIMARY_COLOR}
                  onTrackColor={SECONDARY_COLOR}
                  _dark={{offThumbColor: FONT_INACTIVE_DARK}}
                  onChange={() => {
                    if (isConnected == 'true') {
                      Vibration.vibrate(500);
                      // buttonState[i] == 'true'
                      // ?
                      buttonStateSet(oldVal => {
                        const copy = [...oldVal];

                        copy[i + 1] =
                          buttonState[i + 1] == 'true' ? 'false' : 'true';

                        return copy;
                      });
                      // : channel1Set('true');
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
                    } else {
                      AndroidToast.toast('device disconnected');
                    }
                  }}
                />
                <Text
                  fontSize={FONT_SUB}
                  textAlign="center"
                  numberOfLines={1}
                  lineBreakMode="tail"
                  maxW={12}
                  _light={{
                    color: isConnected == 'true' ? BG_DARK : DISABLE_COLOR,
                  }}
                  _dark={{
                    color:
                      isConnected == 'true'
                        ? FONT_INACTIVE_DARK
                        : DISABLE_COLOR,
                  }}>
                  {/* switch */}
                  {val}
                </Text>
              </VStack>
            );
          })}
        </HStack>
      </VStack>
    </Box>
  );
};

export default SonoffDevice;
