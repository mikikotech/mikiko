import {useNavigation} from '@react-navigation/native';
import {Box, Checkbox, Icon, Input, Menu} from 'native-base';
import React, {useContext, useState} from 'react';
import {Pressable, NativeModules} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import RNQRGenerator from 'rn-qr-generator';
import {
  AES_IV,
  AES_KEY,
  BG_BOX_DARK,
  BG_LIGHT,
  FONT_ACTIVE_LIGHT,
  FONT_INACTIVE_DARK,
  FONT_SUB,
  PRIMARY_COLOR,
} from '../utils/constanta';
import AuthContex from '../route/AuthContext';
import ModalAlert from './ModalAlert';
import {useSelector} from 'react-redux';
import {ReducerRootState} from '../redux/Reducer';
import TuyaDevice from '../lib/TuyaDevice';
var Aes = NativeModules.Aes;

interface Props {
  devId: string;
}

const TuyaStagger = ({devId}: Props) => {
  const Nav: any = useNavigation();

  const state = useSelector((state: ReducerRootState) => state);

  const {RemoveDevice} = useContext(AuthContex);

  const [show, setShow] = useState(false);
  const [check, checkSet] = useState<boolean>(false);
  const [devName, setDevName] = useState<string>('');

  return (
    <Box>
      <Menu
        right={7}
        trigger={triggerProps => {
          //   console.log(triggerProps);
          return (
            <Pressable accessibilityLabel="More options menu" {...triggerProps}>
              <Icon
                as={MaterialCommunityIcons}
                _light={{color: FONT_ACTIVE_LIGHT}}
                _dark={{color: FONT_INACTIVE_DARK}}
                name="dots-vertical"
                size={7}
              />
            </Pressable>
          );
        }}>
        <Menu.Item onPress={() => setShow(true)} _text={{fontSize: FONT_SUB}}>
          Delete
        </Menu.Item>
        <Menu.Item
          onPress={() => {
            setShow(true);
            checkSet(true);
          }}>
          Edit
        </Menu.Item>
      </Menu>
      {/* alert */}
      <ModalAlert
        show={show}
        schema={check ? 'check' : 'trash-can'}
        title={check ? 'Rename Device' : 'Delete Device ?'}
        message={check ? 'Rename Device' : 'Are you sure delete this device ?'}
        onPress={async () => {
          if (check) {
            TuyaDevice.renameDevice(devId, devName).then(res => {
              console.log(res);
              checkSet(false);
            });
          } else {
            TuyaDevice.removeDevice(devId).then(res => {
              console.log(res);
            });
          }

          setShow(false);
        }}
        onCancel={() => {
          setShow(false);
          checkSet(false);
        }}>
        {check ? (
          <Input value={devName} onChangeText={val => setDevName(val)} />
        ) : null}
      </ModalAlert>
      {/* end alert */}
    </Box>
  );
};

export default TuyaStagger;
