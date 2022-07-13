import React, {useEffect, useState} from 'react';
import {
  Box,
  Button,
  Center,
  FormControl,
  HStack,
  Input,
  Text,
  VStack,
  Link,
  Icon,
  Image,
} from 'native-base';
import auth from '@react-native-firebase/auth';
import Loader from 'react-native-modal-loader';
import SplashScreen from 'react-native-splash-screen';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AndroidToast from '../../utils/AndroidToast';
import {
  BG_LIGHT,
  FONT_DESC,
  FONT_HEADING,
  FONT_INACTIVE_LIGHT,
  FONT_SUB,
  FONT_TITLE,
  ITEM_HEIGHT_H4,
  ITEM_WIDTH_H1,
  ITEM_WIDTH_H4,
  PRIMARY_COLOR,
  SECONDARY_COLOR,
  TAB_BAR_HEIGHT,
} from '../../utils/constanta';
import GoogleLogin from '../../components/GoogleSignIn';
import {StackScreenProps} from '@react-navigation/stack';
import {AuthStackParams} from '../../navigation/AuthStackNavigation';
import FacebookLogin from '../../components/FacebookLogin';
import PhoneSignIn from '../../components/PhoneSignIn';

type Nav = StackScreenProps<AuthStackParams>;

const SignInScreen = ({navigation}: Nav) => {
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [show, setShow] = useState(false);
  const [submit, submitSet] = useState<boolean>(false);

  const signInHandle = async () => {
    if (email != '' && pass != '') {
      submitSet(true);
      await auth()
        .signInWithEmailAndPassword(email, pass)
        .then(() => {
          auth().onAuthStateChanged(user => {
            // console.log('user respone = ', user);
            submitSet(false);
            // if (!user?.emailVerified) {
            //   AndroidToast.toast('Email not verified');
            //   user?.sendEmailVerification().then(() => {
            //     const unsubscribeOnUserChanged = auth().onUserChanged(res => {
            //       const unsubscribeSetInterval = setInterval(() => {
            //         //this works as a next in for-like
            //         auth().currentUser?.reload();
            //       }, 30000);
            //       if (res?.emailVerified) {
            //         clearInterval(unsubscribeSetInterval);
            //         return unsubscribeOnUserChanged();
            //       }
            //     });
            //   });
            // }
          });
        })
        .catch(error => {
          if (error.code === 'auth/user-not-found') {
            AndroidToast.toast('Wrong email!');
          }
          if (error.code === 'auth/invalid-email') {
            AndroidToast.toast('Invalid email!');
          }
          if (error.code === 'auth/wrong-password') {
            AndroidToast.toast('Wrong password');
          }
          if (error.code == 'auth/too-many-requests') {
            AndroidToast.toast('try another login method');
          }
          console.error(error.code);
        });
    } else {
      AndroidToast.toast("email and password can't be empty");
    }
  };

  useEffect(() => {
    SplashScreen.hide();
  }, []);

  return (
    <Box
      py={10}
      w="100%"
      flex={1}
      bg={{
        linearGradient: {
          colors: [SECONDARY_COLOR, PRIMARY_COLOR],
          start: [0, 0],
          end: [0, 1],
        },
      }}>
      {/* <Box safeArea px={8} w="100%"> */}

      <VStack
        justifyContent={'space-between'}
        flex={1}
        safeArea
        px={8}
        w="100%">
        {/* image */}

        <Box width={'100%'} alignItems="center">
          <Text
            color={FONT_INACTIVE_LIGHT}
            textAlign={'center'}
            fontSize={FONT_HEADING * 0.8}>
            Welcome to
          </Text>
          <Image
            width={ITEM_WIDTH_H1 * 0.8}
            height={ITEM_HEIGHT_H4}
            resizeMode="contain"
            source={require('./../../assets/logo/MSF.png')}
            alt="MSF-logo"
          />
        </Box>

        {/* form control */}
        <Box>
          <FormControl>
            <FormControl.Label
              _text={{color: FONT_INACTIVE_LIGHT, fontWeight: 'light'}}>
              Email ID
            </FormControl.Label>
            <Input
              value={email}
              color={FONT_INACTIVE_LIGHT}
              variant="underlined"
              onChangeText={val => setEmail(val)}
            />
          </FormControl>
          <FormControl>
            <FormControl.Label
              _text={{color: FONT_INACTIVE_LIGHT, fontWeight: 'light'}}>
              Password
            </FormControl.Label>
            <Input
              type={show ? 'text' : 'password'}
              value={pass}
              color={FONT_INACTIVE_LIGHT}
              variant="underlined"
              onChangeText={val => setPass(val)}
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
            <Link
              _text={{
                fontSize: 'xs',
                fontWeight: '500',
                color: '#faed00',
              }}
              alignSelf="flex-end"
              mt="1">
              Forget Password?
            </Link>
          </FormControl>
        </Box>

        {/* login button */}

        <Button
          mt="2"
          borderRadius={0}
          bg={'white'}
          height={TAB_BAR_HEIGHT * 1.4}
          _text={{
            color: 'black',
            fontWeight: 'bold',
            fontSize: FONT_TITLE,
          }}
          onPress={() => {
            signInHandle();
          }}>
          Login
        </Button>

        {/* register */}
        <HStack mt={3} justifyContent="center">
          <Text
            fontSize={FONT_DESC}
            color={FONT_INACTIVE_LIGHT}
            _dark={{
              color: 'warmGray.200',
            }}>
            DON'T HAVE ACCOUNT ?{' '}
          </Text>
          <Link
            _text={{
              color: '#faed00',
              fontWeight: 'medium',
              fontSize: FONT_DESC,
            }}
            onPress={() => {
              navigation.navigate('Signup');
            }}>
            REGISTER NOW
          </Link>
        </HStack>

        {/* other methods */}

        <HStack mt={5} justifyContent={'space-between'} alignItems="center">
          <Box
            w={ITEM_WIDTH_H4 * 0.82}
            borderBottomWidth={2}
            borderBottomColor={BG_LIGHT}
          />
          <Text color={FONT_INACTIVE_LIGHT} textAlign={'center'}>
            Use other Methods
          </Text>
          <Box
            w={ITEM_WIDTH_H4 * 0.82}
            borderBottomWidth={2}
            borderBottomColor={BG_LIGHT}
          />
        </HStack>

        <HStack mt={5} justifyContent={'center'} space={6}>
          {/* google login */}

          <GoogleLogin />

          {/* facebook login */}

          <FacebookLogin />

          {/* phone login */}

          <PhoneSignIn
            onPress={() => {
              navigation.navigate('Phone');
            }}
          />
        </HStack>

        {/* loader */}

        <Loader loading={submit} color="#ff66be" />
      </VStack>
      {/* </Box> */}
    </Box>
  );
};

export default SignInScreen;
