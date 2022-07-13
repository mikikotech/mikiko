import {Pressable} from 'native-base';
import React from 'react';
import {NoFlickerImage} from 'react-native-no-flicker-image';
import {ITEM_WIDTH_H4} from '../utils/constanta';

interface Props {
  onPress: () => void;
}

const PhoneSignIn = ({onPress}: Props) => {
  return (
    <Pressable onPress={onPress}>
      <NoFlickerImage
        source={require('./../assets/logo/phone.png')}
        style={{
          width: ITEM_WIDTH_H4 * 0.5,
          height: ITEM_WIDTH_H4 * 0.5,
          resizeMode: 'cover',
        }}
      />
    </Pressable>
  );
};

export default PhoneSignIn;
