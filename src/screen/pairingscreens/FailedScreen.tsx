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
          1. Lorem ipsum dolor sit amet.
        </Text>
        <Text _dark={{color: FONT_INACTIVE_DARK}} fontSize={FONT_DESC}>
          2. Lorem ipsum dolor sit amet consectetur adipisicing elit.
        </Text>
        <Text _dark={{color: FONT_INACTIVE_DARK}} fontSize={FONT_DESC}>
          3. Lorem, ipsum dolor sit amet consectetur adipisicing elit. Minima
          vitae blanditiis vero eos atque!
        </Text>
      </VStack>
    </Box>
  );
};

export default FailedScreen;
