import {Text, Box} from 'native-base';
import React from 'react';
import {BG_DARK, BG_LIGHT} from '../../utils/constanta';

const MikikoScreen = () => {
  return (
    <Box p={5} flex={1} _light={{bg: BG_LIGHT}} _dark={{bg: BG_DARK}}>
      <Text>Mikiko</Text>
    </Box>
  );
};

export default MikikoScreen;
