import {extendTheme} from 'native-base';

const config = {
  useSystemColorMode: true,
  initialColorMode: 'dark',
};

const fontConfig = {
  Raleway: {
    100: {
      normal: 'Raleway-Thin',
    },
    200: {
      normal: 'Raleway-Light',
    },
    300: {
      normal: 'Raleway-Regular',
    },
    400: {
      normal: 'Raleway-Medium',
    },
    500: {
      normal: 'Raleway-SemiBold',
    },
    600: {
      normal: 'Raleway-Bold',
    },
  },
};

const fonts = {
  heading: 'Raleway-Bold',
  body: 'Raleway-Medium',
  mono: 'Raleway-Light',
};

const components = {
  Button: {
    variants: {
      outline: () => {
        return {
          rounded: 'full',
        };
      },
    },
    Text: {
      baseStyle: () => {
        return {
          color: 'black',
        };
      },
    },
  },
};

const colors = {
  primary: {
    50: '#E3F2F9',
    100: '#C5E4F3',
    200: '#A2D4EC',
    300: '#7AC1E4',
    400: '#47A9DA',
    500: '#0088CC',
    600: '#007AB8',
    700: '#006BA1',
    800: '#005885',
    900: '#003F5E',
  },
};

export default extendTheme({config, colors, fontConfig, fonts});
