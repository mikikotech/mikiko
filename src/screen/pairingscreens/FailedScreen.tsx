import {Box, Text, VStack} from 'native-base';
import React from 'react';
import {
  BG_DARK,
  BG_LIGHT,
  FONT_DESC,
  FONT_INACTIVE_DARK,
  FONT_TITLE,
} from '../../utils/constanta';

const FailedScreen = () => {
  return (
    <Box
      flex={1}
      width={'100%'}
      px={5}
      _light={{bg: BG_LIGHT}}
      _dark={{bg: BG_DARK}}>
      <VStack space={2} mt={3}>
        <Text _dark={{color: FONT_INACTIVE_DARK}} fontSize={FONT_TITLE}>
          Failed Setting Up New Device
        </Text>
        <Text _dark={{color: FONT_INACTIVE_DARK}} fontSize={FONT_DESC}>
          1. Check if device is ready to pair.
        </Text>
        <Text _dark={{color: FONT_INACTIVE_DARK}} fontSize={FONT_DESC}>
          2. Make sure your phone connect to WiFi network.
        </Text>
        <Text _dark={{color: FONT_INACTIVE_DARK}} fontSize={FONT_DESC}>
          3. Check your WiFi configuration and make sure you choose 2.4GHz WiFi.
        </Text>
      </VStack>
    </Box>
  );
};

export default FailedScreen;
