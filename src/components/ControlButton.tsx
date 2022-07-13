import {Text, Center, Button, VStack} from 'native-base';
import React from 'react';
import {Vibration} from 'react-native';
import {
  BG_BOX_DARK,
  BG_DARK,
  BG_LIGHT,
  FONT_ACTIVE_LIGHT,
  FONT_INACTIVE_DARK,
  FONT_INACTIVE_LIGHT,
  FONT_SUB,
  FONT_TITLE,
  ITEM_HEIGHT_H3,
  ITEM_WIDTH_H3,
  PRIMARY_COLOR,
} from '../utils/constanta';

interface Props {
  condition: boolean;
  name: string;
  onPress: () => void;
  key: number;
}

const ControlButton = ({condition, name, onPress, key}: Props) => {
  console.log(condition);

  return (
    <Button
      key={key}
      variant={'unstyled'}
      onPress={() => {
        onPress();
        Vibration.vibrate(500);
      }}
      width={ITEM_WIDTH_H3 * 1.3}
      height={ITEM_WIDTH_H3 * 1.3}
      _light={{
        borderColor: 'gray.300',
        borderWidth: 1,
        bg: condition == true ? PRIMARY_COLOR : BG_LIGHT,
      }}
      _dark={{bg: condition == true ? PRIMARY_COLOR : BG_BOX_DARK}}
      rounded="xl"
      mt={3}>
      <VStack justifyContent={'center'} alignItems="center">
        <Text
          bold
          fontSize={FONT_TITLE}
          _light={{
            color: condition == true ? FONT_INACTIVE_LIGHT : FONT_ACTIVE_LIGHT,
          }}
          _dark={{
            color: condition == true ? FONT_INACTIVE_LIGHT : FONT_INACTIVE_DARK,
          }}>
          {condition == true ? 'ON' : 'OFF'}
        </Text>
        <Text
          fontSize={FONT_SUB}
          _light={{
            color: condition == true ? FONT_INACTIVE_LIGHT : FONT_ACTIVE_LIGHT,
          }}
          _dark={{
            color: condition == true ? FONT_INACTIVE_LIGHT : FONT_INACTIVE_DARK,
          }}>
          {name}
        </Text>
      </VStack>
    </Button>
  );
};

export default ControlButton;
