import {Box, Button, Center, HStack, Icon, Text, VStack} from 'native-base';
import React, {useEffect} from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {StackScreenProps} from '@react-navigation/stack';
import {
  BG_LIGHT,
  FONT_DESC,
  FONT_INACTIVE_LIGHT,
  FONT_HEADING,
  ITEM_HEIGHT_H4,
  ITEM_WIDTH_H1,
  PRIMARY_COLOR,
  ITEM_WIDTH_H4,
  BG_DARK,
  BG_BOX_DARK,
  FONT_INACTIVE_DARK,
} from '../../utils/constanta';
import {PairingParams} from '../../navigation/PairingNavigation';
import AndroidToast from '../../utils/AndroidToast';
import {PermissionsAndroid} from 'react-native';

type Nav = StackScreenProps<PairingParams>;

const PairingScreen = ({navigation}: Nav) => {
  const requestPermission = async () => {
    await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'Location permission is required for WiFi connections',
        message:
          'This app needs location permission as this is required  ' +
          'to scan for wifi networks.',
        buttonNegative: 'DENY',
        buttonPositive: 'ALLOW',
      },
    ).then(res => {
      console.log(res);
    });

    await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA, {
      title: 'Camera permission is required for Barcode scanner',
      message:
        'This app camera permission as this is required  ' +
        'to scan for barcode.',
      buttonNegative: 'DENY',
      buttonPositive: 'ALLOW',
    }).then(res => {
      console.log(res);
    });
  };

  useEffect(() => {
    requestPermission();
  }, []);

  return (
    <Center flex={1} _light={{bg: BG_LIGHT}} _dark={{bg: BG_DARK}}>
      <Box width={'100%'} px={5} justifyContent="center" alignItems={'center'}>
        <Button
          variant={'unstyled'}
          width={ITEM_WIDTH_H1 * 0.9}
          height={ITEM_HEIGHT_H4 * 0.85}
          onPress={() => {
            navigation.navigate('Wifi');
          }}
          rounded={'xl'}
          justifyContent="center"
          bg={PRIMARY_COLOR}>
          <HStack alignItems={'center'} justifyContent={'center'}>
            <Box
              height={ITEM_WIDTH_H4 / 1.8}
              width={ITEM_WIDTH_H4 / 1.8}
              justifyContent="center"
              alignItems={'center'}
              rounded="full"
              borderWidth={4}
              borderColor={FONT_INACTIVE_LIGHT}>
              <Icon
                as={MaterialCommunityIcons}
                name="devices"
                size={7}
                color={FONT_INACTIVE_LIGHT}
              />
            </Box>
            <VStack ml={5}>
              <Text fontSize={FONT_HEADING} color={FONT_INACTIVE_LIGHT}>
                Quick Pairing
              </Text>
              <Text
                fontSize={FONT_DESC}
                maxW={ITEM_WIDTH_H1 * 0.6}
                color={FONT_INACTIVE_LIGHT}>
                Available for all mikiko support devices.
              </Text>
            </VStack>
          </HStack>
        </Button>

        {/* barcode */}

        <Button
          variant={'unstyled'}
          _dark={{bg: BG_BOX_DARK, borderColor: BG_BOX_DARK}}
          width={ITEM_WIDTH_H1 * 0.9}
          height={ITEM_HEIGHT_H4 * 0.85}
          onPress={() => {
            navigation.navigate('Barcode');
          }}
          mt={5}
          rounded={'xl'}
          justifyContent="center"
          borderColor={'gray.300'}
          borderWidth={2}>
          <HStack justifyContent={'center'} alignItems="center">
            <VStack mr={5}>
              <Text
                textAlign={'right'}
                _dark={{color: FONT_INACTIVE_DARK}}
                fontSize={FONT_HEADING}>
                QRCode
              </Text>
              <Text
                _dark={{color: FONT_INACTIVE_DARK}}
                fontSize={FONT_DESC}
                textAlign={'right'}
                maxW={ITEM_WIDTH_H1 * 0.6}>
                Available for ALL shared QRCode mikiko device.
              </Text>
            </VStack>
            <Icon
              as={MaterialCommunityIcons}
              name="qrcode-scan"
              size={12}
              color="red.600"
            />
          </HStack>
        </Button>

        {/* nfc */}

        <Button
          mt={5}
          variant={'unstyled'}
          width={ITEM_WIDTH_H1 * 0.9}
          height={ITEM_HEIGHT_H4 * 0.85}
          onPress={() => {
            // navigation.navigate('Wifi');
            AndroidToast.toast('Under Maintenance');
          }}
          rounded={'xl'}
          justifyContent="center"
          bg={PRIMARY_COLOR}>
          <HStack alignItems={'center'} justifyContent={'center'}>
            <Icon
              as={MaterialCommunityIcons}
              name="nfc"
              size={12}
              color={FONT_INACTIVE_LIGHT}
            />
            <VStack ml={5}>
              <Text fontSize={FONT_HEADING} color={FONT_INACTIVE_LIGHT}>
                NFC
              </Text>
              <Text
                fontSize={FONT_DESC}
                maxW={ITEM_WIDTH_H1 * 0.6}
                color={FONT_INACTIVE_LIGHT}>
                Available for mikiko device with support NFC technology.
              </Text>
            </VStack>
          </HStack>
        </Button>
      </Box>
    </Center>
  );
};

export default PairingScreen;
