import React, {useContext} from 'react';
import {Button, HStack, Icon, Text, VStack} from 'native-base';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import auth from '@react-native-firebase/auth';
import {
  FONT_DESC,
  FONT_INACTIVE_LIGHT,
  FONT_SUB,
  ICON_H1,
  ICON_H2,
  TAB_BAR_HEIGHT,
} from '../utils/constanta';
// import AuthContex from '../route/AuthContext';

const AnonymousLogin = props => {
  //   const {SignIn} = useContext(AuthContex);

  const handleClick = () => {
    auth()
      .signInAnonymously()
      .then(userCredentials => {
        userCredentials.user
          .updateProfile({
            displayName: 'farmer',
          })
          .then(() => {
            auth().onAuthStateChanged(user => {
              console.log(user);

              //   SignIn(user);
            });
          });
        console.log('User signed in anonymously');
      })
      .catch(error => {
        console.error(error);
      });
  };
  return (
    <VStack {...props} alignItems="center">
      <Button
        onPress={handleClick}
        width="100%"
        h={TAB_BAR_HEIGHT}
        bg={FONT_INACTIVE_LIGHT}>
        <HStack alignItems="center">
          <Icon
            mr={5}
            as={MaterialCommunityIcons}
            name="account-circle"
            size={ICON_H1 * 1.5}
            color="black"
          />
          <Text color="black" fontSize={FONT_SUB}>
            LOGIN as Guest
          </Text>
        </HStack>
      </Button>
    </VStack>
  );
};

export default AnonymousLogin;
