import {Box, Button, Image, Text} from 'native-base';
import React, {useEffect, useState} from 'react';
import {NativeEventEmitter, NativeModules} from 'react-native';
import LottieView from 'lottie-react-native';
import TuyaCamera from '../../lib/TuyaCamera';
import RNQRGenerator from 'rn-qr-generator';
import {useSelector} from 'react-redux';
import {ReducerRootState} from '../../redux/Reducer';
import {StackScreenProps} from '@react-navigation/stack';
import {PairingParams} from '../../navigation/PairingNavigation';
import TuyaHome from '../../lib/TuyaHome';
import {
  BG_DARK,
  BG_LIGHT,
  FONT_INACTIVE_LIGHT,
  ITEM_WIDTH_H1,
  ITEM_WIDTH_H3,
  PRIMARY_COLOR,
} from '../../utils/constanta';
const eventEmitter = new NativeEventEmitter(NativeModules.TuyaCameraModule);

type Nav = StackScreenProps<PairingParams>;

const CameraBarcodeScreen = ({navigation, route}: Nav) => {
  const state = useSelector((state: ReducerRootState) => state);
  //   const [homeId, setHomeId] = useState<number>();
  const [imageUrl, setImageUrl] = useState<string>('');

  const ssid: string = route.params?.ssid ?? 'mikiko';
  const password: string = route.params?.pass ?? 'mikiko';
  //   var homeId: number;

  useEffect(() => {
    // const pairlistener = eventEmitter.addListener('pair', (res: any) => {
    //   console.log(res);
    // });

    TuyaHome.queryHomeList().then(res => {
      TuyaCamera.cameraPairing(res[0]?.homeId, ssid, password, 100)
        .then((res: any) => {
          console.log(res);
          RNQRGenerator.generate({
            correctionLevel: 'Q',
            value: res,
            base64: true,
            height: 300,
            width: 300,
          }).then(res => {
            setImageUrl(res.base64);
          });
        })
        .catch(e => {
          console.log(e);
        });
    });

    // return () => pairlistener.remove();
  }, []);

  return (
    <Box
      alignItems="center"
      justifyContent="center"
      flex={1}
      p={7}
      _light={{bg: BG_LIGHT}}
      _dark={{bg: BG_DARK}}>
      <Box w={300} h={300}>
        {imageUrl != '' ? (
          <Image
            alt="barcode"
            w={300}
            h={300}
            source={{uri: `data:image/png;base64, ${imageUrl}`}}
          />
        ) : null}
      </Box>

      <Text my={5} mt={8}>
        Please scan QR code from 15 to 20 cm away
      </Text>

      <LottieView
        source={require('./../../assets/lottie/scanner.json')}
        autoPlay
        loop
        style={{
          width: ITEM_WIDTH_H3,
          height: ITEM_WIDTH_H3,
        }}
      />

      <Button
        mt={5}
        variant="unstyled"
        width="100%"
        bg={PRIMARY_COLOR}
        rounded="none"
        _text={{
          color: FONT_INACTIVE_LIGHT,
        }}
        justifyContent="center"
        onPress={() => {
          // if (isConfirm) {
          //   navigation.navigate('Camerapairing');
          // }
          navigation.navigate('Tuyasetting');
        }}>
        I Heard a Prompt
      </Button>
    </Box>
  );
};

export default CameraBarcodeScreen;
