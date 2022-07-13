import {StackScreenProps} from '@react-navigation/stack';
import {Box, Button, Checkbox, Text, VStack} from 'native-base';
import React, {useState} from 'react';
import LottieView from 'lottie-react-native';
import {PairingParams} from '../../navigation/PairingNavigation';
import {
  BG_BOX_DARK,
  BG_DARK,
  BG_LIGHT,
  FONT_INACTIVE_DARK,
  FONT_INACTIVE_LIGHT,
  FONT_SUB,
  ITEM_WIDTH_H1,
  ITEM_WIDTH_H2,
  PRIMARY_COLOR,
  PRIMARY_COLOR_DISABLE,
} from '../../utils/constanta';

type Nav = StackScreenProps<PairingParams>;

const ConfirmPairingScreen = ({navigation}: Nav) => {
  const [isConfirm, setIsConfirm] = useState<boolean>(false);

  return (
    <Box flex={1} _dark={{bg: BG_DARK}} _light={{bg: BG_LIGHT}} p={5}>
      <VStack space={7} mt={5}>
        <Text>Reset the device first</Text>
        <Text>
          Power on the device and make sure the indicator is flashing rapidly or
          a prompt tone is heard
        </Text>
        <LottieView
          source={require('./../../assets/lottie/camera.json')}
          autoPlay
          loop
          style={{
            width: ITEM_WIDTH_H1,
            height: ITEM_WIDTH_H1,
          }}
        />
        <Checkbox
          mt={5}
          _dark={{bg: BG_BOX_DARK, borderColor: FONT_INACTIVE_DARK}}
          _light={{bg: BG_LIGHT}}
          _checked={{
            backgroundColor: PRIMARY_COLOR,
            borderColor: PRIMARY_COLOR,
          }}
          size={'sm'}
          value="confirm"
          isChecked={isConfirm}
          rounded="full"
          _text={{fontSize: FONT_SUB, _dark: {color: FONT_INACTIVE_DARK}}}
          onChange={() => {
            setIsConfirm(prev => !prev);
          }}>
          Make sure the indicator is flashing quickly or a prompt tone is heard
        </Checkbox>

        <Button
          variant="unstyled"
          bg={isConfirm ? PRIMARY_COLOR : PRIMARY_COLOR_DISABLE}
          rounded="none"
          _text={{
            color: FONT_INACTIVE_LIGHT,
            letterSpacing: 3,
          }}
          justifyContent="center"
          onPress={() => {
            if (isConfirm) {
              navigation.navigate('Camerapairing');
            }
          }}>
          Next
        </Button>
      </VStack>
    </Box>
  );
};

export default ConfirmPairingScreen;
