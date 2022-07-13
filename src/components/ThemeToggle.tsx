import React, {useEffect} from 'react';
import {Switch, useColorMode} from 'native-base';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {PRIMARY_COLOR, SECONDARY_COLOR} from '../utils/constanta';

const ThemeToggle = () => {
  const {colorMode, toggleColorMode, setColorMode} = useColorMode();

  const getThemeValue = async () => {
    try {
      var data = await AsyncStorage.getItem('theme');
      console.log(data);
      if (data != null || data != undefined) {
        setColorMode(data);
      }
    } catch (e) {
      //
    }
  };

  const setThemeValue = async () => {
    try {
      await AsyncStorage.setItem('theme', colorMode?.toString() ?? '');
    } catch (e) {
      //
    }
  };

  useEffect(() => {
    getThemeValue();
  }, []);

  useEffect(() => {
    setThemeValue();
  }, [colorMode]);

  return (
    <Switch
      onThumbColor={PRIMARY_COLOR}
      onTrackColor={SECONDARY_COLOR}
      isChecked={colorMode === 'dark'}
      onToggle={() => {
        toggleColorMode();
      }}
    />
  );
};

export default ThemeToggle;
