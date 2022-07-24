import {HStack, Icon, Text} from 'native-base';
import React from 'react';
import QRCodeScanner from 'react-native-qrcode-scanner';
import {launchImageLibrary} from 'react-native-image-picker';
import RNQRGenerator from 'rn-qr-generator';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {AES_IV, AES_KEY, BG_LIGHT, ITEM_WIDTH_H2} from '../../utils/constanta';
import AndroidToast from '../../utils/AndroidToast';
import {NativeModules} from 'react-native';
import {StackScreenProps} from '@react-navigation/stack';
import firestore from '@react-native-firebase/firestore';
import {useSelector} from 'react-redux';
import {ReducerRootState} from '../../redux/Reducer';
var Aes = NativeModules.Aes;

type Nav = StackScreenProps<any>;

const BarcodeScreen = ({navigation}: Nav) => {
  const state = useSelector((state: ReducerRootState) => state);
  // const {AddDevice} = useContext(AuthContex);

  const scanQRCode = (data: string) => {
    Aes.decrypt(data, AES_KEY, AES_IV, 'aes-256-cbc').then(res => {
      console.log('decrypt = ', res);

      var strData: Array<string> = res.split('&');
      if (strData[3] === 'PMK2022' && strData[2] === 'shared') {
        // const newDevices: AuthContexDeviceArray = {
        //   id: strData[0],
        //   user: strData[1],
        //   scene: 'shared',
        // };
        // AddDevice(newDevices);

        var userId =
          state.auth.email !== null ? state.auth.email : state.auth.uid;

        if (strData[1] !== userId) {
          try {
            // firestore()
            //   .collection('users')
            //   .doc(
            //     state.auth.email !== null ? state.auth.email : state.auth.uid,
            //   )
            //   .get()
            //   .then((resp: any) => {
            //     if (resp._data.shared.length == 0) {
            //       try {
            //         firestore()
            //           .collection('users')
            //           .doc(
            //             state.auth.email !== null
            //               ? state.auth.email
            //               : state.auth.uid,
            //           )
            //           .update({
            //             shared: [strData[0]],
            //           })
            //           .then(() => {
            //             navigation.navigate('Bottomtabsbase');
            //           });
            //       } catch (error) {}
            //     } else {
            //       var devId: Array<string> = resp._data.shared;

            //       devId.push(strData[0]);

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
            //           })
            //           .then(() => {
            //             navigation.navigate('Bottomtabsbase');
            //           });
            //       } catch (error) {}
            //     }
            //   });

            firestore()
              .collection('users')
              .doc(
                state.auth.email !== null ? state.auth.email : state.auth.uid,
              )
              .update({
                shared: firestore.FieldValue.arrayUnion(strData[0]),
              })
              .then(() => {
                navigation.navigate('Bottomtabsbase');
              });
          } catch (error) {}
        } else {
          AndroidToast.toast('Same device owner');
        }
      } else {
        AndroidToast.toast('Invalid Barcode!');
      }
    });
  };

  const selectImage = async () => {
    await launchImageLibrary({mediaType: 'photo'}).then((res: any) => {
      RNQRGenerator.detect({
        uri: res.assets[0].uri,
        base64: 'imageBase64String',
      })
        .then(res => {
          if (res.type == 'QRCode') {
            scanQRCode(res.values[0]);
          } else {
            AndroidToast.toast('Invalid Barcode!');
          }
        })
        .catch(e => console.log(e));
    });
  };

  return (
    <QRCodeScanner
      onRead={res => {
        // console.log(res);
        scanQRCode(res.data);
      }}
      containerStyle={{backgroundColor: 'black'}}
      // topContent={
      //   <Button
      //     onPress={() => {
      //       decryption();
      //     }}>
      //     decrypt
      //   </Button>
      // }
      bottomContent={
        <HStack
          position="absolute"
          bottom={5}
          right={3}
          justifyContent="center"
          alignItems="center">
          <Text mr={2} color={BG_LIGHT}>
            Choose from galery
          </Text>
          <Icon
            as={MaterialCommunityIcons}
            name="image"
            size={10}
            onPress={selectImage}
          />
        </HStack>
      }
      reactivate={true}
      reactivateTimeout={3000}
      showMarker={true}
      checkAndroid6Permissions={true}
      markerStyle={{
        borderColor: 'white',
        width: ITEM_WIDTH_H2,
        height: ITEM_WIDTH_H2,
      }}
      // flashMode={RNCamera.Constants.FlashMode.torch}
    />
  );
};

export default BarcodeScreen;
