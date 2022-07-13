import {
  Box,
  Button,
  Icon,
  Image,
  Input,
  KeyboardAvoidingView,
  Text,
  VStack,
} from 'native-base';
import React, {useRef, useState} from 'react';
import PhoneInput from 'react-native-phone-number-input';
import AndroidToast from '../../utils/AndroidToast';
import auth from '@react-native-firebase/auth';
import {
  BG_LIGHT,
  FONT_INACTIVE_LIGHT,
  ITEM_HEIGHT_H3,
  PRIMARY_COLOR,
} from '../../utils/constanta';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {StackScreenProps} from '@react-navigation/stack';
import {AuthStackParams} from '../../navigation/AuthStackNavigation';
import Loader from 'react-native-modal-loader';

type Nav = StackScreenProps<AuthStackParams>;

const PhoneScreen = ({navigation}: Nav) => {
  const [userName, userNameSet] = useState<string>('');
  const [formattedValue, setFormattedValue] = useState('');
  const phoneInput = useRef<PhoneInput>(null);
  const [phone, phoneSet] = useState<string>('');
  const [isLoading, isLoadingSet] = useState(false);

  const sendPhoneVerification = async () => {
    if (userName != '' && formattedValue != '') {
      isLoadingSet(true);
      await auth()
        .signInWithPhoneNumber(formattedValue)
        .then(async res => {
          await auth().onAuthStateChanged(async user => {
            if (user != null) {
              await user.updateProfile({
                displayName: userName,
              });
            }

            navigation.navigate('Phoneotp', {
              confirm: res,
              phoneNumber: formattedValue,
            });
            isLoadingSet(false);
          });
        })
        .catch(e => {
          // console.log(e.code);
          if (e.code == 'auth/invalid-phone-number') {
            AndroidToast.toast('invalid phone number');
          }
          if (e.code == 'auth/too-many-requests') {
            AndroidToast.toast('try another login method');
          }
        });
    } else {
      AndroidToast.toast("input can't be empty");
    }
  };

  return (
    <Box flex={1} width="100%" bg={BG_LIGHT}>
      <KeyboardAvoidingView
        keyboardVerticalOffset={50}
        behavior="height"
        flex={1}>
        <VStack space={10}>
          {/* image */}
          <Box position={'relative'}>
            <Image
              h={ITEM_HEIGHT_H3 * 2}
              w="100%"
              source={require('./../../assets/logo/cloud.png')}
              alt="cloud"
            />
            <VStack position={'absolute'} top={20} left={10}>
              <Text fontSize={24} fontFamily="mono" color={FONT_INACTIVE_LIGHT}>
                You're cute.
              </Text>
              <Text fontSize={24} fontFamily="mono" color={FONT_INACTIVE_LIGHT}>
                Can i have your
              </Text>
              <Text fontSize={24} fontFamily="mono" color={FONT_INACTIVE_LIGHT}>
                number?
              </Text>
            </VStack>

            {/* back icon */}

            <Icon
              as={MaterialCommunityIcons}
              position={'absolute'}
              top={5}
              left={5}
              size={7}
              color="white"
              name="arrow-left"
              onPress={() => {
                navigation.goBack();
              }}
            />
          </Box>

          {/* input */}
          <VStack px={5} space={10} mt={10}>
            <Input
              w="100%"
              h={43}
              value={userName}
              variant="unstyled"
              backgroundColor={'#FFF'}
              borderWidth={0}
              borderRadius={0}
              shadow={10}
              color={'black'}
              onChangeText={val => userNameSet(val)}
              InputLeftElement={
                <Box
                  w={75}
                  alignItems="center"
                  justifyContent="center"
                  h={43}
                  borderRightWidth={1}
                  borderRightColor="black">
                  <Icon
                    as={MaterialCommunityIcons}
                    name="account"
                    size={7}
                    ml="2"
                    color="muted.400"
                  />
                </Box>
              }
              placeholder="Username"
            />
            <PhoneInput
              ref={phoneInput}
              value={phone}
              // disableArrowIcon
              defaultCode="ID"
              countryPickerProps={{withAlphaFilter: true}}
              layout="first"
              onChangeText={text => {
                phoneSet(text);
              }}
              onChangeFormattedText={text => {
                setFormattedValue(text);
              }}
              textInputStyle={{
                height: 24,
                fontSize: 12,
                padding: 0,
                marginBottom: -1,
                color: 'black',
                // backgroundColor: 'red',
              }}
              textContainerStyle={{
                height: 43,
                padding: 0,
                backgroundColor: '#FFF',
              }}
              codeTextStyle={{
                fontSize: 13,
                padding: 0,
                marginTop: -2,
              }}
              countryPickerButtonStyle={{
                width: 75,
                padding: 0,
                borderRightWidth: 1,
                borderRightColor: 'black',
              }}
              containerStyle={{
                width: '100%',
                padding: 0,
              }}
              textInputProps={{
                placeholderTextColor: '#cccccc',
              }}
              withDarkTheme
              withShadow
            />
          </VStack>
          <Button
            mx={5}
            onPress={sendPhoneVerification}
            _text={{color: '#fff', fontWeight: 'medium'}}
            rounded="none"
            variant={'unstyled'}
            bg={PRIMARY_COLOR}>
            Next
          </Button>
        </VStack>
      </KeyboardAvoidingView>
      <Loader loading={isLoading} opacity={0.6} color={PRIMARY_COLOR} />
    </Box>
  );
};

export default PhoneScreen;
