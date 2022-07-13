import {Text, Box} from 'native-base';
import React from 'react';
import {BG_DARK, BG_LIGHT} from '../../utils/constanta';

const ElectricalScreen = () => {
  return (
    <Box flex={1} _light={{bg: BG_LIGHT}} _dark={{bg: BG_DARK}}>
      <Text>Electrical</Text>
    </Box>
  );
};

export default ElectricalScreen;
