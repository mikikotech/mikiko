import React, {useState} from 'react';
import {
  Alert,
  Box,
  Button,
  Center,
  CloseIcon,
  FormControl,
  Heading,
  HStack,
  Icon,
  IconButton,
  Input,
  Modal,
  VStack,
  Text,
  Image,
} from 'native-base';
import {LogBox} from 'react-native';
import auth from '@react-native-firebase/auth';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {Formik} from 'formik';
import * as yup from 'yup';
import {
  FONT_HEADING,
  FONT_INACTIVE_LIGHT,
  FONT_SUB,
  FONT_TITLE,
  ITEM_HEIGHT_H4,
  ITEM_WIDTH_H1,
  PRIMARY_COLOR,
  SECONDARY_COLOR,
  TAB_BAR_HEIGHT,
} from './../../utils/constanta';
import {StackScreenProps} from '@react-navigation/stack';
import {AuthStackParams} from './../../navigation/AuthStackNavigation';

interface user {
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
}

type Nav = StackScreenProps<AuthStackParams>;

const SignUpScreen = ({navigation}: Nav) => {
  const newUser: user = {
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
  };
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [show, setShow] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errMsg, setErrMsg] = useState('');

  const creatUser = async (val: user) => {
    if (val.email != '') {
      setIsSubmitting(true);
      await auth()
        .createUserWithEmailAndPassword(val.email, val.password)
        .then(userCredentials => {
          auth().onAuthStateChanged(async user => {
            if (user != null) {
              await user.updateProfile({
                displayName: val.username,
              });

              // auth().currentUser?.sendEmailVerification({handleCodeInApp: true, url: ''})

              await auth().sendSignInLinkToEmail(val.email, {
                handleCodeInApp: true,
                url: 'http://example.com',
              });

              // user
              //   .sendEmailVerification()
              //   .then(function () {
              //     // Email sent.
              //     console.log('Email sent.');
              //   })
              //   .catch(function (error) {
              //     // An error happened.
              //     console.log(error);
              //   });
            }
          });

          // if(!userCredentials.user.emailVerified)

          setInterval(() => {
            setIsSubmitting(false);
            navigation.navigate('Signin');
          }, 2000);
        })
        .catch(error => {
          if (error.code === 'auth/email-already-in-use') {
            setShow(true);
            setIsSubmitting(false);
            setErrMsg('That email address is already in use!');
          }

          console.error(error);
        });
    }
  };

  const validSchema = yup.object({
    email: yup.string().email('invalid email').required('email is required!'),
    username: yup
      .string()
      .trim()
      .min(3, 'user name must be 3 - 12 characters!')
      .max(12, 'more than 12 characters')
      .required('user name is required!'),
    password: yup
      .string()
      .trim()
      .min(8, 'password too short')
      .required('password is required!'),
    confirmPassword: yup
      .string()
      .equals([yup.ref('password'), null], 'password does not match!'),
  });

  LogBox.ignoreAllLogs();

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
            Create Account
          </Text>
          <Image
            my={5}
            // mb={16}
            width={ITEM_WIDTH_H1}
            height={ITEM_HEIGHT_H4}
            resizeMode="contain"
            source={require('./../../assets/logo/MSF.png')}
            alt="MSF-logo"
          />
        </Center>
        <VStack space={3} mt="5">
          <Formik
            initialValues={newUser}
            validationSchema={validSchema}
            enableReinitialize={true}
            onSubmit={(values, formikAction) => {
              // console.log('value = ', values);
              creatUser(values);
              formikAction.resetForm();
            }}>
            {({values, handleChange, handleBlur, errors, handleSubmit}) => {
              console.log(values);
              const {email, username, password, confirmPassword} = values;
              return (
                <>
                  <FormControl isRequired isInvalid={'email' in errors}>
                    <FormControl.Label _text={{color: FONT_INACTIVE_LIGHT}}>
                      Email
                    </FormControl.Label>
                    <Input
                      value={email}
                      color={FONT_INACTIVE_LIGHT}
                      variant="underlined"
                      onChangeText={handleChange('email')}
                      onBlur={handleBlur('email')}
                    />
                    <FormControl.ErrorMessage>
                      {errors.email}
                    </FormControl.ErrorMessage>
                  </FormControl>
                  <FormControl isRequired isInvalid={'username' in errors}>
                    <FormControl.Label _text={{color: FONT_INACTIVE_LIGHT}}>
                      Username
                    </FormControl.Label>
                    <Input
                      value={username}
                      color={FONT_INACTIVE_LIGHT}
                      variant="underlined"
                      onChangeText={handleChange('username')}
                      onBlur={handleBlur('username')}
                    />
                    <FormControl.ErrorMessage>
                      {errors.username}
                    </FormControl.ErrorMessage>
                  </FormControl>
                  <FormControl isRequired isInvalid={'password' in errors}>
                    <FormControl.Label _text={{color: FONT_INACTIVE_LIGHT}}>
                      Password
                    </FormControl.Label>
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      color={FONT_INACTIVE_LIGHT}
                      variant="underlined"
                      onChangeText={handleChange('password')}
                      onBlur={handleBlur('password')}
                      InputRightElement={
                        <Box size="xs" rounded="none" w="1/6" h="full">
                          <Center
                            flex={1}
                            justifyContent="center"
                            alignItems="center">
                            <Icon
                              as={MaterialCommunityIcons}
                              name={showPassword ? 'eye' : 'eye-off'}
                              size={6}
                              color={FONT_INACTIVE_LIGHT}
                              onPress={() => setShowPassword(!showPassword)}
                            />
                          </Center>
                        </Box>
                      }
                    />
                    <FormControl.ErrorMessage>
                      {errors.password}
                    </FormControl.ErrorMessage>
                  </FormControl>
                  <FormControl
                    isRequired
                    isInvalid={'confirmPassword' in errors}>
                    <FormControl.Label _text={{color: FONT_INACTIVE_LIGHT}}>
                      Confirm Password
                    </FormControl.Label>
                    <Input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      color={FONT_INACTIVE_LIGHT}
                      variant="underlined"
                      onChangeText={handleChange('confirmPassword')}
                      onBlur={handleBlur('confirmPassword')}
                      InputRightElement={
                        <Box size="xs" rounded="none" w="1/6" h="full">
                          <Center
                            flex={1}
                            justifyContent="center"
                            alignItems="center">
                            <Icon
                              as={MaterialCommunityIcons}
                              name={showConfirmPassword ? 'eye' : 'eye-off'}
                              size={6}
                              color={FONT_INACTIVE_LIGHT}
                              onPress={() =>
                                setShowConfirmPassword(!showConfirmPassword)
                              }
                            />
                          </Center>
                        </Box>
                      }
                    />
                    <FormControl.ErrorMessage>
                      {errors.confirmPassword}
                    </FormControl.ErrorMessage>
                  </FormControl>
                  <Button
                    mt="10"
                    isLoading={isSubmitting}
                    colorScheme="green"
                    variant={'outline'}
                    borderRadius={0}
                    bg={'white'}
                    height={TAB_BAR_HEIGHT * 1.4}
                    _text={{
                      color: 'black',
                      fontWeight: 'bold',
                      fontSize: FONT_TITLE,
                    }}
                    // height={TAB_BAR_HEIGHT}
                    onPress={() => {
                      handleSubmit();
                    }}>
                    Create Account
                  </Button>
                </>
              );
            }}
          </Formik>
        </VStack>
      </Box>

      <Modal isOpen={show}>
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
                  Invalid Email!
                </Text>
              </HStack>
              <IconButton
                variant="unstyled"
                icon={<CloseIcon size="3" color="coolGray.600" />}
                onPress={() => setShow(false)}
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
            <Box
              pl="6"
              _dark={{
                _text: {
                  color: 'coolGray.600',
                },
              }}></Box>
          </VStack>
        </Alert>
      </Modal>
    </Center>
  );
};

export default SignUpScreen;
