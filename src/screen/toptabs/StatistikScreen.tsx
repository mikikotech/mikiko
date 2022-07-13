import {Text, Center, Box, ScrollView, Button, Checkbox} from 'native-base';
import React, {useEffect, useState} from 'react';
import database from '@react-native-firebase/database';
import LineChartComponent from '../../components/LineChartComponent';
import {
  BG_BOX_DARK,
  BG_DARK,
  BG_LIGHT,
  FONT_INACTIVE_DARK,
  FONT_INACTIVE_LIGHT,
  FONT_SUB,
  PRIMARY_COLOR,
  TAB_BAR_HEIGHT,
} from '../../utils/constanta';
import XLSX from 'xlsx';
import AndroidToast from '../../utils/AndroidToast';
import {PermissionsAndroid} from 'react-native';
import ModalAlert from '../../components/ModalAlert';
var RNFS = require('react-native-fs');

type dataProps = {
  hum: number;
  soil: number;
  temp: number;
  ph: number;
  time: string;
};

const StatistikScreen = ({route}) => {
  const [humi, setHumi] = useState<Array<number>>([0, 0, 0, 0, 0, 0, 0, 0]);
  const [temp, setTemp] = useState<Array<number>>([0, 0, 0, 0, 0, 0, 0, 0]);
  const [ph, setPh] = useState<Array<number>>([0, 0, 0, 0, 0, 0, 0, 0]);
  const [soil, setSoil] = useState<Array<number>>([0, 0, 0, 0, 0, 0, 0, 0]);
  const [time, timeSet] = useState<Array<string>>([
    '00:00',
    '00:00',
    '00:00',
    '00:00',
    '00:00',
    '00:00',
    '00:00',
    '00:00',
  ]);
  const [datalog, datalogSet] = useState<any>();
  const [show, showSet] = useState<boolean>(false);
  const [check, checkSet] = useState<boolean>(true);
  const [canDownload, canDownloadSet] = useState<boolean>(false);

  const id = route?.params?.id;

  const requestPermission = async () => {
    try {
      await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      ]);
    } catch (err) {
      AndroidToast.toast('Access denied');
    }
  };

  useEffect(() => {
    requestPermission();
  }, []);

  useEffect(() => {
    database()
      .ref(`${id}/Sensor`)
      .limitToLast(8)
      .on('value', snapshot => {
        // console.log('User data: ', snapshot.val());
        if (snapshot.val() != null) {
          canDownloadSet(true);

          const data = snapshot.val();
          var dataArray: Array<dataProps> = [];
          for (let id in data) {
            dataArray.push(data[id]);
          }

          var humiArray: Array<number> = [];
          var tempArray: Array<number> = [];
          var soilArray: Array<number> = [];
          var phArray: Array<number> = [];
          var timeArray: Array<string> = [];
          var datalogging: Array<any> = [];

          for (let id in dataArray) {
            humiArray.push(dataArray[id]?.hum);
            tempArray.push(dataArray[id].temp);
            soilArray.push(dataArray[id].soil);
            phArray.push(dataArray[id].ph);
            timeArray.push(dataArray[id].time);
            datalogging.push(dataArray[id]);
          }

          datalogSet(datalogging);
          setHumi(humiArray);
          setTemp(tempArray);
          setSoil(soilArray);
          setPh(phArray);
          timeSet(timeArray);
        } else {
          canDownloadSet(false);
        }
      });
  }, []);

  const exportDataToExcel = async () => {
    var ws = XLSX.utils.json_to_sheet(datalog);
    var wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Data');
    const wbout = XLSX.write(wb, {
      type: 'binary',
      bookType: 'xlsx',
    });

    RNFS.writeFile(
      `${RNFS.DownloadDirectoryPath}/mikiko_file.xlsx`,
      wbout,
      'ascii',
    )
      .then(r => {
        console.log('Success', RNFS.DownloadDirectoryPath);
        AndroidToast.toast('Done Downloading');
      })
      .catch(e => {
        console.log('Error', e);
        AndroidToast.toast('Failed Downloading');
      });

    if (check == true) {
      await database().ref(`${id}/Sensor`).remove();
    }
  };

  return (
    <Center flex={1} _light={{bg: BG_LIGHT}} _dark={{bg: BG_DARK}}>
      <Box
        width={'100%'}
        px={5}
        py={2}
        flexWrap="wrap"
        flexDirection={'row'}
        justifyContent="center"
        alignItems={'center'}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <LineChartComponent
            data={temp}
            labelSurfix="°C"
            key={1}
            name="Temperature"
            color="#ED1000"
            RGBAColor="237, 16, 0"
            labels={time}
          />
          <LineChartComponent
            data={humi}
            labels={time}
            labelSurfix="%"
            key={2}
            name="Humidity"
            color="#006FF4"
            RGBAColor="0, 111, 244"
          />
          <LineChartComponent
            data={ph}
            labels={time}
            labelSurfix=" "
            key={3}
            name="PH"
            color="#2CCF16"
            RGBAColor="44, 207, 22"
          />
          <LineChartComponent
            data={soil}
            labels={time}
            labelSurfix="%"
            key={4}
            name="Soil Moisture"
            color="#F8B01E"
            RGBAColor="248, 176, 30"
          />
          <Button
            variant={'unstyled'}
            width={'100%'}
            bg={PRIMARY_COLOR}
            mt={3}
            height={10}
            rounded="none"
            justifyContent={'center'}
            alignItems="center"
            onPress={() => {
              if (canDownload) {
                showSet(true);
              } else {
                AndroidToast.toast('No data to download');
              }
            }}
            _text={{
              color: FONT_INACTIVE_LIGHT,
              fontWeight: 'medium',
            }}>
            Download Data
          </Button>
        </ScrollView>
      </Box>
      <ModalAlert
        show={show}
        title="Download Data"
        message="Downloading data sensor"
        schema="check"
        onPress={() => {
          exportDataToExcel();
          showSet(false);
        }}
        onCancel={() => {
          showSet(false);
        }}>
        <Checkbox
          mt={5}
          _dark={{bg: BG_BOX_DARK, borderColor: FONT_INACTIVE_DARK}}
          _light={{bg: BG_LIGHT}}
          _checked={{
            backgroundColor: PRIMARY_COLOR,
            borderColor: PRIMARY_COLOR,
          }}
          size={'sm'}
          value="data"
          isChecked={check}
          _text={{fontSize: FONT_SUB, _dark: {color: FONT_INACTIVE_DARK}}}
          onChange={() => {
            checkSet(prev => !prev);
          }}>
          Delete data after downloading ?
        </Checkbox>
      </ModalAlert>
    </Center>
  );
};

export default StatistikScreen;
