import {Dimensions} from 'react-native';

const {width, height} = Dimensions.get('screen');

const PRIMARY_COLOR = '#169b7e';
const PRIMARY_COLOR_DISABLE = '#02523e';
const SECONDARY_COLOR = '#7ecb8f';
const DISABLE_COLOR = '#a3a3a3';

const BG_LIGHT = '#e6e6e6';
const BG_DARK = '#1f272b';
const BG_ERROR = '#e85c31';

const FONT_INACTIVE_LIGHT = '#e6e6e6';
const FONT_ACTIVE_LIGHT = '#5b4a42';

const FONT_INACTIVE_DARK = '#8897ad';
const FONT_ACTIVE_DARK = '#169b7e';
const BG_BOX_DARK = '#273137';

const TAB_BAR_HEIGHT = width * 0.1;

const ITEM_WIDTH_H1 = width * 0.9;
const ITEM_WIDTH_H2 = width * 0.45;
const ITEM_WIDTH_H3 = width * 0.3;
const ITEM_WIDTH_H4 = width * 0.25;

const ITEM_HEIGHT_H1 = height * 0.5;
const ITEM_HEIGHT_H2 = height * 0.3;
const ITEM_HEIGHT_H3 = height * 0.2;
const ITEM_HEIGHT_H4 = height * 0.15;

const FONT_HEADING = width / 20;
const FONT_TITLE = width / 25;
const FONT_SUB = width / 30;
const FONT_DESC = width / 35;

const ICON_H1 = width / 25;
const ICON_H2 = width / 30;
const ICON_H3 = width / 35;
const ICON_H4 = width / 40;

const AES_KEY =
  '2D4A614E645267556B58703273357638792F423F4528482B4D6250655368566D';
const AES_IV = '48cb3d06bb3b427bbfd3f59a7b5cb8c4';

export {
  PRIMARY_COLOR,
  PRIMARY_COLOR_DISABLE,
  SECONDARY_COLOR,
  DISABLE_COLOR,
  BG_DARK,
  BG_LIGHT,
  BG_ERROR,
  FONT_INACTIVE_LIGHT,
  FONT_ACTIVE_LIGHT,
  FONT_INACTIVE_DARK,
  FONT_ACTIVE_DARK,
  BG_BOX_DARK,
  TAB_BAR_HEIGHT,
  ITEM_WIDTH_H1,
  ITEM_WIDTH_H2,
  ITEM_WIDTH_H3,
  ITEM_WIDTH_H4,
  ITEM_HEIGHT_H1,
  ITEM_HEIGHT_H2,
  ITEM_HEIGHT_H3,
  ITEM_HEIGHT_H4,
  FONT_HEADING,
  FONT_TITLE,
  FONT_SUB,
  FONT_DESC,
  ICON_H1,
  ICON_H2,
  ICON_H3,
  ICON_H4,
  AES_KEY,
  AES_IV,
};
