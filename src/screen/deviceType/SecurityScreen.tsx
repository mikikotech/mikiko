import {StackScreenProps} from '@react-navigation/stack';
import {Text, Box, Pressable, Image, VStack, HStack} from 'native-base';
import React from 'react';
import {PairingParams} from '../../navigation/PairingNavigation';
import {BG_DARK, BG_LIGHT} from '../../utils/constanta';

type Nav = StackScreenProps<PairingParams>;

const SecurityScreen = ({navigation}: Nav) => {
  return (
    <Box
      p={5}
      flex={1}
      width="100%"
      _light={{bg: BG_LIGHT}}
      _dark={{bg: BG_DARK}}>
      <HStack space={2}>
        <Pressable
          onPress={() => {
            navigation.navigate('Confirmpairing');
          }}>
          <VStack justifyContent="center" alignItems="center">
            <Image
              h={50}
              w={50}
              alt="camera_wifi"
              source={{
                uri: 'https://images.tuyaus.com/smart/icon/ay1511509043755MhIx1/1654940638304c21f2708.png',
              }}
            />
            <Text mt={2}>Camera (Wifi)</Text>
          </VStack>
        </Pressable>
      </HStack>
    </Box>
  );
};

export default SecurityScreen;
