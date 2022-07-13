import {StackScreenProps} from '@react-navigation/stack';
import {
  Box,
  Button,
  HStack,
  Icon,
  Image,
  Pressable,
  Text,
  VStack,
} from 'native-base';
import React, {useEffect, useState} from 'react';
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import {AuthStackParams} from '../../navigation/AuthStackNavigation';
import {
  BG_LIGHT,
  FONT_INACTIVE_LIGHT,
  ITEM_HEIGHT_H3,
  ITEM_WIDTH_H1,
  PRIMARY_COLOR,
  TAB_BAR_HEIGHT,
} from '../../utils/constanta';
import auth from '@react-native-firebase/auth';
import AndroidToast from '../../utils/AndroidToast';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

type Nav = StackScreenProps<AuthStackParams>;

const PhoneScreenOtp = ({route, navigation}: Nav) => {
  const CELL_COUNT = 6;
  const defaultCountDown: number = 30;
  let myInterval;

  const [value, setValue] = useState('');
  const [confirm, confirmSet] = useState<any>(route?.params?.confirm);
  const [countdown, countdownSet] = useState<number>(defaultCountDown);
  const [enableResend, enableResendSet] = useState<boolean>(false);
  const ref = useBlurOnFulfill({value, cellCount: CELL_COUNT});
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });

  const phone = route?.params?.phoneNumber;

  useEffect(() => {
    myInterval = setInterval(() => {
      decrimentCount();
    }, 1000);

    return () => {
      clearInterval(myInterval);
    };
  });

  const decrimentCount = () => {
    if (countdown == 0) {
      enableResendSet(true);
      countdownSet(0);
      clearInterval(myInterval);
    } else {
      countdownSet(countdown - 1);
    }
  };

  const authResendOTP = async () => {
    await auth()
      .signInWithPhoneNumber(phone)
      .then(res => {
        console.log('phone login = ', res);
        confirmSet(res);
      })
      .catch(e => {
        // console.log(e.code);
        if (e.code == 'auth/too-many-requests') {
          AndroidToast.toast('try another login method');
        }
      });
  };

  const resendOTP = () => {
    if (enableResend) {
      countdownSet(defaultCountDown);
      authResendOTP();
      enableResendSet(false);
      clearInterval(myInterval);
      myInterval = setInterval(() => {
        decrimentCount();
      }, 1000);
    }
  };

  const sendOTP = async () => {
    await confirm.confirm(value);
  };

  return (
    <Box flex={1} width="100%" bg={BG_LIGHT}>
      {/* image */}
      <VStack space={10}>
        <Box position={'relative'}>
          <Image
            h={ITEM_HEIGHT_H3 * 2}
            w="100%"
            source={require('./../../assets/logo/cloud.png')}
            alt="cloud"
          />
          <VStack position={'absolute'} top={16} left={10}>
            <Text fontSize={24} fontFamily="mono" color={FONT_INACTIVE_LIGHT}>
              I still don't trust
            </Text>
            <Text fontSize={24} fontFamily="mono" color={FONT_INACTIVE_LIGHT}>
              you.
            </Text>
            <Text fontSize={24} fontFamily="mono" color={FONT_INACTIVE_LIGHT}>
              Tell me something
            </Text>
            <Text fontSize={24} fontFamily="mono" color={FONT_INACTIVE_LIGHT}>
              that only two of us
            </Text>
            <Text fontSize={24} fontFamily="mono" color={FONT_INACTIVE_LIGHT}>
              know.
            </Text>
          </VStack>

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

        {/* otp */}

        <VStack px={5} alignItems="center">
          <Text fontSize={12}>OTP Verification</Text>
          <CodeField
            ref={ref}
            {...props}
            // Use `caretHidden={false}` when users can't paste a text value, because context menu doesn't appear
            value={value}
            onChangeText={val => {
              setValue(val);
            }}
            cellCount={CELL_COUNT}
            rootStyle={{marginVertical: TAB_BAR_HEIGHT}}
            keyboardType="number-pad"
            textContentType="oneTimeCode"
            renderCell={({index, symbol, isFocused}) => (
              <Text
                key={index}
                style={[
                  {
                    width: 40,
                    height: 40,
                    lineHeight: 38,
                    fontSize: 24,
                    marginHorizontal: 3,
                    borderWidth: 1,
                    borderColor: PRIMARY_COLOR,
                    borderRadius: 5,
                    textAlign: 'center',
                  },
                  isFocused && {borderColor: '#000'},
                ]}
                onLayout={getCellOnLayoutHandler(index)}>
                {symbol || (isFocused ? <Cursor /> : null)}
              </Text>
            )}
          />
          {/* resend button */}
          <VStack
            justifyContent={'center'}
            maxWidth={ITEM_WIDTH_H1}
            alignItems="center">
            <Text fontSize={12}>
              Verification code has been send to {phone}
            </Text>
            <HStack>
              <Text fontSize={12}>if not</Text>
              <Pressable
                onPress={() => {
                  resendOTP();
                }}>
                <HStack>
                  <Text
                    fontSize={12}
                    color={enableResend ? PRIMARY_COLOR : 'gray.300'}
                    bold>
                    {' '}
                    RESEND
                  </Text>

                  <Text
                    fontSize={12}
                    color={PRIMARY_COLOR}>{` (${countdown})`}</Text>
                </HStack>
              </Pressable>
            </HStack>
          </VStack>
        </VStack>

        {/* button send */}

        <Button
          mx={5}
          onPress={() => {
            sendOTP();
          }}
          _text={{color: '#fff', fontWeight: 'medium'}}
          rounded="none"
          variant={'unstyled'}
          bg={PRIMARY_COLOR}>
          Next
        </Button>
      </VStack>
    </Box>
  );
};

export default PhoneScreenOtp;
