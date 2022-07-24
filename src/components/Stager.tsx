import {useNavigation} from '@react-navigation/native';
import {Box, Checkbox, Icon, Menu} from 'native-base';
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
  ITEM_WIDTH_H2,
  PRIMARY_COLOR,
} from '../utils/constanta';
import AuthContex from '../route/AuthContext';
import ModalAlert from './ModalAlert';
import database from '@react-native-firebase/database';
import firestore from '@react-native-firebase/firestore';
import {useSelector} from 'react-redux';
import {ReducerRootState} from '../redux/Reducer';
var Aes = NativeModules.Aes;

interface Props {
  id: string;
  location: string;
  gardenName: string;
  shared?: boolean;
  version?: string;
  model: string;
  scene: string;
  switchName: Array<string>;
}

const StaggerView = ({
  id,
  location,
  gardenName,
  shared,
  version,
  model,
  scene,
  switchName,
}: Props) => {
  const Nav: any = useNavigation();

  const state = useSelector((state: ReducerRootState) => state);

  const {RemoveDevice} = useContext(AuthContex);
  const [show, setShow] = useState(false);
  const [check, checkSet] = useState<boolean>(true);

  const generateQRCode = () => {
    Aes.encrypt(
      `${id}&${
        state.auth.email !== null ? state.auth.email : state.auth.uid
      }&shared&PMK2022`,
      AES_KEY,
      AES_IV,
      'aes-256-cbc',
    ).then(res => {
      RNQRGenerator.generate({
        value: res,
        height: ITEM_WIDTH_H2 * 0.9,
        width: ITEM_WIDTH_H2 * 0.9,
        fileName: `${id}`,
        base64: true,
        padding: {top: 1, left: 1, bottom: 1, right: 1},
        correctionLevel: 'H',
      })
        .then(response => {
          const {uri, base64} = response;
          // console.log(response);
          Nav.navigate('Shareimage', {
            uri,
            base64,
          });
        })
        .catch(error => console.log('Cannot create QR code', error));
    });
  };

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
          isDisabled={shared == true ? true : false}
          _text={{fontSize: FONT_SUB}}
          onPress={() => {
            Nav.navigate('Firmware', {
              id,
              version,
            });
          }}>
          Update Firmware
        </Menu.Item>
        <Menu.Item
          isDisabled={shared == true ? true : false}
          _text={{fontSize: FONT_SUB}}
          onPress={generateQRCode}>
          QR Code
        </Menu.Item>
        <Menu.Item
          isDisabled={shared == true ? true : false}
          _text={{fontSize: FONT_SUB}}
          onPress={() => {
            Nav.navigate('Editdevice', {
              id,
              gardenName,
              scene,
              location,
              switchName,
            });
          }}>
          Edit
        </Menu.Item>
      </Menu>
      {/* alert */}
      <ModalAlert
        show={show}
        schema="trash-can"
        title="Delete Device ?"
        message="Are you sure delete this device ?"
        onPress={async () => {
          if (shared) {
            // RemoveDevice(id);

            try {
              firestore()
                .collection('users')
                .doc(
                  state.auth.email !== null ? state.auth.email : state.auth.uid,
                )
                .update({
                  shared: firestore.FieldValue.arrayRemove(id),
                });
            } catch (error) {}

            // try {
            //   firestore()
            //     .collection('users')
            //     .doc(
            //       state.auth.email !== null ? state.auth.email : state.auth.uid,
            //     )
            //     .get()
            //     .then((res: any) => {
            //       var devId: Array<string>;

            //       res._data.shared.map((resp, index) => {
            //         if (res._data.shared.length > 1) {
            //           if (resp[index] != id) {
            //             devId.push(resp[index]);
            //           }
            //         } else {
            //           devId = [];
            //         }
            //       });

            //       try {
            //         firestore()
            //           .collection('users')
            //           .doc(
            //             state.auth.email !== null
            //               ? state.auth.email
            //               : state.auth.uid,
            //           )
            //           .update({
            //             shared: devId,
            //           });
            //       } catch (error) {}
            //     });
            // } catch (error) {}
          } else {
            firestore()
              // .collection(
              //   state.auth.email !== null ? state.auth.email : state.auth.uid,
              // )
              .collection('devices')
              .doc(id)
              .delete()
              .then(() => {
                console.log('User deleted!');
              });

            if (check == true) {
              await database().ref(`${id}/Sensor`).remove();
            }
          }
          setShow(false);
        }}
        onCancel={() => {
          setShow(false);
        }}>
        {shared ? null : (
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
            Delete data ?
          </Checkbox>
        )}
      </ModalAlert>
      {/* end alert */}
    </Box>
  );
};

export default StaggerView;
