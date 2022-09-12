import {Text, Center, Box, Skeleton} from 'native-base';
import React, {useEffect, useLayoutEffect, useState} from 'react';
import MonitoringItem from '../../components/MonitoringItem';
import database from '@react-native-firebase/database';
import {
  BG_DARK,
  BG_LIGHT,
  FONT_INACTIVE_LIGHT,
  ITEM_HEIGHT_H2,
  ITEM_WIDTH_H2,
  PRIMARY_COLOR,
  TAB_BAR_HEIGHT,
} from '../../utils/constanta';

const MonitoringScreen = ({route}) => {
  const [humi, setHumi] = useState<number>(0);
  const [temp, setTemp] = useState<number>(0);
  const [ph, setPh] = useState<number>(0);
  const [soil, setSoil] = useState<number>(0);
  const [isLoading, isLoadingSet] = useState(true);

  console.log('monitor = ', route?.params?.weather);

  useEffect(() => {
    database()
      .ref(`${route?.params?.id}/data`)
      .on('value', snapshot => {
        // console.log('User data: ', snapshot.val());
        const data = snapshot.val();
        setHumi(data?.humi);
        setTemp(data?.temp);
        setPh(data?.ph);
        setSoil(data?.soil);
      });

    isLoadingSet(false);

    return () => isLoadingSet(true);
  }, []);

  // console.log(humi);

  return (
    <Center flex={1} width="100%" _light={{bg: BG_LIGHT}} _dark={{bg: BG_DARK}}>
      <Box
        width={'100%'}
        px={5}
        flexDirection="row"
        justifyContent="space-evenly"
        alignItems={'center'}
        flexWrap="wrap">
        {isLoading ? (
          <>
            <Skeleton
              m={1}
              h={ITEM_HEIGHT_H2 * 0.9}
              w={ITEM_WIDTH_H2 * 0.9}
              startColor="coolGray.400"
            />
            <Skeleton
              m={1}
              h={ITEM_HEIGHT_H2 * 0.9}
              w={ITEM_WIDTH_H2 * 0.9}
              startColor="coolGray.400"
            />
            <Skeleton
              m={1}
              h={ITEM_HEIGHT_H2 * 0.9}
              w={ITEM_WIDTH_H2 * 0.9}
              startColor="coolGray.400"
            />
            <Skeleton
              m={1}
              h={ITEM_HEIGHT_H2 * 0.9}
              w={ITEM_WIDTH_H2 * 0.9}
              startColor="coolGray.400"
            />
          </>
        ) : (
          <>
            <MonitoringItem
              source={require('./../../assets/icons/temp.png')}
              name="Temperature"
              data={temp}
              labelSurfix="°C"
            />
            <MonitoringItem
              source={require('./../../assets/icons/hum.png')}
              name="Humidity"
              data={humi}
              labelSurfix="%"
            />
            <MonitoringItem
              source={require('./../../assets/icons/ph.png')}
              name="PH"
              data={Number(Number(ph).toFixed(2))}
              labelSurfix=" "
            />
            <MonitoringItem
              source={require('./../../assets/icons/soil.png')}
              name="Soil Moisture"
              data={soil}
              labelSurfix="%"
            />
          </>
        )}

        <Box
          width={'94%'}
          bg={PRIMARY_COLOR}
          mt={10}
          // rounded="lg"
          justifyContent={'center'}
          alignItems="center"
          _text={{
            color: FONT_INACTIVE_LIGHT,
          }}
          height={TAB_BAR_HEIGHT}>
          {route?.params?.weather == 'true' ? 'Rainy Day!' : "It's Sunny Day!"}
        </Box>
      </Box>
    </Center>
  );
};

export default MonitoringScreen;
