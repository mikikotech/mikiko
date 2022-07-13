import {Box, Image, Text} from 'native-base';
import React from 'react';
import {ImageSourcePropType} from 'react-native';
import {LineChart} from 'react-native-chart-kit';
import {
  BG_BOX_DARK,
  BG_DARK,
  BG_LIGHT,
  FONT_ACTIVE_LIGHT,
  FONT_HEADING,
  FONT_INACTIVE_DARK,
  FONT_TITLE,
  ITEM_HEIGHT_H2,
  ITEM_HEIGHT_H3,
  ITEM_HEIGHT_H4,
  ITEM_WIDTH_H2,
  ITEM_WIDTH_H4,
  PRIMARY_COLOR,
} from '../utils/constanta';

interface Props {
  source: ImageSourcePropType;
  name: string;
  labelSurfix: string;
  data?: number;
  labels?: Array<string>;
}

const MonitoringItem = ({source, name, data, labels, labelSurfix}: Props) => {
  return (
    <Box
      width={ITEM_WIDTH_H2 * 0.9}
      height={ITEM_HEIGHT_H2 * 0.9}
      rounded="xl"
      mt={3}
      alignItems="center"
      justifyContent={'center'}
      _light={{borderColor: 'gray.300'}}
      _dark={{bg: BG_BOX_DARK, borderColor: BG_BOX_DARK}}
      borderWidth={1}>
      <Image size={'md'} resizeMode="contain" source={source} alt="temp" />
      <Text
        fontSize={FONT_HEADING}
        _light={{color: FONT_ACTIVE_LIGHT}}
        _dark={{color: FONT_INACTIVE_DARK}}
        mt={3}
        bold>
        {data}
        {labelSurfix}
      </Text>
      <Text
        _light={{color: FONT_ACTIVE_LIGHT}}
        _dark={{color: FONT_INACTIVE_DARK}}>
        {name}
      </Text>
    </Box>
  );
};

export default MonitoringItem;
