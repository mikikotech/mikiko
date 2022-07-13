import React, {useContext, useState} from 'react';
import {
  Box,
  Button,
  Center,
  FormControl,
  Heading,
  HStack,
  Input,
  Text,
  VStack,
  Link,
  WarningOutlineIcon,
  Icon,
  Modal,
  Alert,
  IconButton,
  CloseIcon,
  Image,
} from 'native-base';
import auth from '@react-native-firebase/auth';
// import FacebookLogin from '../components/FacebookLogin';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {BackHandler, ToastAndroid} from 'react-native';
// import AuthContex from '../route/AuthContext';
import AnonymousLogin from '../components/AnonymousLogin';
import AndroidToast from '../utils/AndroidToast';
import {
  FONT_DESC,
  FONT_HEADING,
  FONT_INACTIVE_LIGHT,
  FONT_SUB,
  FONT_TITLE,
  ITEM_HEIGHT_H3,
  ITEM_HEIGHT_H4,
  ITEM_WIDTH_H1,
  ITEM_WIDTH_H4,
  PRIMARY_COLOR,
  SECONDARY_COLOR,
  TAB_BAR_HEIGHT,
} from '../utils/constanta';

const SignInScreen = () => {
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [passMsgErr, setPassMsgErr] = useState('');
  const [emailErrorMsg, setEmailErrorMsg] = useState('');
  const [emailValid, setEmailValid] = useState(false);
  const [passValid, setPassValid] = useState(false);
  const [show, setShow] = useState(false);
  const [modalShow, setModalShow] = useState(false);
  const [errMsg, setErrMsg] = useState('');

  //   const {SignIn} = useContext(AuthContex);

  const handleEmailChange = () => {
    if (email.includes('@') && email.includes('.')) {
      //
    } else {
      setEmailValid(true);
      setEmailErrorMsg('Invalid email!');
    }
  };

  const handlePassChange = () => {
    if (pass.length < 7) {
      setPassMsgErr('password is less than 7 character');
      setPassValid(true);
    }
  };

  const signInHandle = () => {
    auth()
      .signInWithEmailAndPassword(email, pass)
      .then(() => {
        auth().onAuthStateChanged(user => {
          console.log('user respone = ', user);
          if (user?.emailVerified) {
            // SignIn(user);
          } else {
            // setModalShow(true);
            // setErrMsg('Email not verified!');
            AndroidToast.toast('Email not verified');
            user?.sendEmailVerification();
          }
        });
      })
      .catch(error => {
        if (error.code === 'auth/user-not-found') {
          setEmailValid(true);
          setEmailErrorMsg('Wrong email!');
        }
        if (error.code === 'auth/invalid-email') {
          setEmailValid(true);
          setEmailErrorMsg('Invalid email!');
        }
        if (error.code === 'auth/wrong-password') {
          setPassValid(true);
          setPassMsgErr('Wrong password');
        }

        console.error(error.code);
      });
  };

  return (
    <Center
      w="100%"
      flex={1}
      bg={{
        linearGradient: {
          colors: [SECONDARY_COLOR, PRIMARY_COLOR],
          start: [0, 0],
          end: [0, 1],
        },
      }}>
      <Box safeArea px={12} w="100%">
        <Center>
          <Text fontSize={FONT_HEADING} bold color={FONT_INACTIVE_LIGHT}>
            Welcome To
          </Text>
          <Image
            my={5}
            // mb={16}
            width={ITEM_WIDTH_H1 * 0.7}
            height={ITEM_HEIGHT_H4 * 0.3}
            resizeMode="contain"
            source={require('./../assets/logo/MSF2.png')}
            alt="MSF-logo"
          />
        </Center>
        <AnonymousLogin />

        <VStack space={3} mt="5">
          <FormControl isInvalid={emailValid}>
            <FormControl.Label _text={{color: FONT_INACTIVE_LIGHT}}>
              Email ID
            </FormControl.Label>
            <Input
              value={email}
              color={FONT_INACTIVE_LIGHT}
              variant="underlined"
              onFocus={() => setEmailValid(false)}
              onChangeText={val => setEmail(val)}
              onEndEditing={() => handleEmailChange()}
            />
            <FormControl.ErrorMessage>{emailErrorMsg}</FormControl.ErrorMessage>
          </FormControl>
          <FormControl isInvalid={passValid}>
            <FormControl.Label _text={{color: FONT_INACTIVE_LIGHT}}>
              Password
            </FormControl.Label>
            <Input
              type={show ? 'text' : 'password'}
              value={pass}
              color={FONT_INACTIVE_LIGHT}
              variant="underlined"
              onFocus={() => setPassValid(false)}
              onChangeText={val => setPass(val)}
              onEndEditing={() => handlePassChange()}
              InputRightElement={
                <Box size="xs" rounded="none" w="1/6" h="full">
                  <Center flex={1} justifyContent="center" alignItems="center">
                    <Icon
                      as={MaterialCommunityIcons}
                      name={show ? 'eye' : 'eye-off'}
                      size={6}
                      color={FONT_INACTIVE_LIGHT}
                      onPress={() => setShow(!show)}
                    />
                  </Center>
                </Box>
              }
            />
            <FormControl.ErrorMessage
              leftIcon={<WarningOutlineIcon size="xs" />}>
              {passMsgErr}
            </FormControl.ErrorMessage>
            <Link
              _text={{
                fontSize: 'xs',
                fontWeight: '500',
                color: 'indigo.500',
              }}
              alignSelf="flex-end"
              mt="1">
              Forget Password?
            </Link>
          </FormControl>
          <Button
            mt="2"
            colorScheme="green"
            variant={'outline'}
            bg={'white'}
            height={TAB_BAR_HEIGHT}
            _text={{
              color: 'black',
              letterSpacing: 3,
              fontWeight: 'medium',
              fontSize: FONT_SUB,
            }}
            onPress={() => {
              signInHandle();
            }}>
            LOGIN
          </Button>
          <HStack mt="6" justifyContent="center">
            <Text
              fontSize={FONT_DESC}
              color={FONT_INACTIVE_LIGHT}
              _dark={{
                color: 'warmGray.200',
              }}>
              Don't have account ?.{' '}
            </Text>
            <Link
              _text={{
                color: 'black',
                fontWeight: 'medium',
                fontSize: FONT_DESC,
              }}
              onPress={() => {
                // navigation.navigate('SignUp');
              }}>
              REGISTER NOW
            </Link>
          </HStack>
        </VStack>
      </Box>

      <Modal isOpen={modalShow}>
        <Alert w="90%" maxW="400" status="error" variant="subtle">
          <VStack space={1} flexShrink={1} w="100%">
            <HStack
              flexShrink={1}
              space={2}
              alignItems="center"
              justifyContent="space-between">
              <HStack flexShrink={1} space={2} alignItems="center">
                <Alert.Icon />
                <Text
                  fontSize="md"
                  fontWeight="medium"
                  _dark={{
                    color: 'coolGray.800',
                  }}>
                  Email not verified!
                </Text>
              </HStack>
              <IconButton
                variant="unstyled"
                icon={<CloseIcon size="3" color="coolGray.600" />}
                onPress={() => setModalShow(false)}
              />
            </HStack>
            <Box
              pl="6"
              paddingY={5}
              _dark={{
                _text: {
                  color: 'coolGray.600',
                },
              }}>
              {errMsg}
            </Box>
            <Button
              variant="unstyled"
              onPress={() => {
                setModalShow(false);
                ToastAndroid.showWithGravityAndOffset(
                  'email has been send',
                  ToastAndroid.LONG,
                  ToastAndroid.BOTTOM,
                  25,
                  50,
                );
              }}
              _text={{color: 'coolGray.600', fontSize: 'sm'}}>
              Ok (send email)
            </Button>
          </VStack>
        </Alert>
      </Modal>
    </Center>
  );
};

export default SignInScreen;
