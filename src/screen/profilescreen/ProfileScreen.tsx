import {
  Avatar,
  Box,
  HStack,
  Icon,
  Image,
  Pressable,
  Switch,
  Text,
  useColorMode,
  VStack,
} from 'native-base';
import React, {useContext} from 'react';
import {
  BG_DARK,
  BG_LIGHT,
  FONT_ACTIVE_LIGHT,
  FONT_INACTIVE_DARK,
  FONT_SUB,
  ITEM_HEIGHT_H3,
  PRIMARY_COLOR,
  TAB_BAR_HEIGHT,
} from '../../utils/constanta';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {Linking} from 'react-native';
import auth from '@react-native-firebase/auth';
import {useSelector} from 'react-redux';
import AuthContex from '../../route/AuthContext';
import {ReducerRootState} from '../../redux/Reducer';
import ThemeToggle from '../../components/ThemeToggle';
import {StackScreenProps} from '@react-navigation/stack';
import {ProfileStackParams} from '../../navigation/ProfileStackNavigation';
import TuyaUser from '../../lib/TuyaUser';

type Nav = StackScreenProps<ProfileStackParams>;

const ProfileScreen = ({navigation}: Nav) => {
  const {SignOut} = useContext(AuthContex);
  const state = useSelector((state: ReducerRootState) => state);

  const {colorMode} = useColorMode();

  console.log(colorMode);

  return (
    <Box
      flex={1}
      width="100%"
      bg={colorMode === 'light' ? BG_LIGHT : BG_DARK}
      p={3}>
      <VStack>
        <Box width={'100%'} h={ITEM_HEIGHT_H3} bg="gray.400" rounded={'xl'}>
          <HStack alignItems={'center'} ml={5} mt={5} space={3}>
            <Avatar
              bg={PRIMARY_COLOR}
              mr="1"
              size={'lg'}
              source={{
                uri: state?.auth?.photoURL ?? 'https://bit.ly/broken-link',
              }}>
              MK
            </Avatar>
            <VStack>
              <Text color={'black'}>
                {state?.auth?.displayName != null
                  ? state?.auth?.displayName
                  : ''}
              </Text>
              <Text color={'black'}>
                {state?.auth?.email != null
                  ? state?.auth?.email
                  : state?.auth?.phoneNumber}
              </Text>
            </VStack>
          </HStack>
        </Box>
        <Box h={10} />
        {/* email */}
        <Pressable
          justifyContent={'space-between'}
          borderBottomWidth={0.8}
          alignItems="center"
          flexDir={'row'}
          height={TAB_BAR_HEIGHT}
          onPress={() => {
            navigation.navigate('Helpfeedback');
          }}
          borderBottomColor="gray.300">
          <HStack alignItems="center" justifyContent={'center'}>
            <Icon mr={2} as={MaterialCommunityIcons} size={5} name="email" />
            <Text
              color={
                colorMode == 'light' ? FONT_ACTIVE_LIGHT : FONT_INACTIVE_DARK
              }>
              Help & Feedback
            </Text>
          </HStack>
          <Icon as={MaterialCommunityIcons} name="chevron-right" />
        </Pressable>
        {/* settings */}
        <HStack
          justifyContent={'space-between'}
          borderBottomWidth={0.8}
          alignItems="center"
          height={TAB_BAR_HEIGHT}
          borderBottomColor="gray.300">
          <HStack alignItems="center" justifyContent={'center'}>
            <Icon
              mr={2}
              as={MaterialCommunityIcons}
              size={5}
              name="google-play"
            />
            <Text
              color={
                colorMode == 'light' ? FONT_ACTIVE_LIGHT : FONT_INACTIVE_DARK
              }>
              Rate us
            </Text>
          </HStack>
          <Icon as={MaterialCommunityIcons} name="chevron-right" />
        </HStack>
        {/* version */}
        <HStack
          justifyContent={'space-between'}
          borderBottomWidth={0.8}
          alignItems="center"
          height={TAB_BAR_HEIGHT}
          borderBottomColor="gray.300">
          <HStack alignItems="center" justifyContent={'center'}>
            <Icon mr={2} as={MaterialCommunityIcons} size={5} name="cog-sync" />
            <Text
              color={
                colorMode == 'light' ? FONT_ACTIVE_LIGHT : FONT_INACTIVE_DARK
              }>
              Version
            </Text>
          </HStack>
          <Text
            color={
              colorMode == 'light' ? FONT_ACTIVE_LIGHT : FONT_INACTIVE_DARK
            }>
            0.0.1
          </Text>
        </HStack>
        {/* theme */}
        <HStack
          justifyContent={'space-between'}
          borderBottomWidth={0.8}
          alignItems="center"
          height={TAB_BAR_HEIGHT}
          borderBottomColor="gray.300">
          <HStack alignItems="center" justifyContent={'center'}>
            <Icon
              mr={2}
              as={MaterialCommunityIcons}
              size={5}
              name="theme-light-dark"
            />
            <Text
              color={
                colorMode == 'light' ? FONT_ACTIVE_LIGHT : FONT_INACTIVE_DARK
              }>
              Theme
            </Text>
          </HStack>
          <ThemeToggle />
        </HStack>
        {/* about */}
        <HStack
          justifyContent={'space-between'}
          borderBottomWidth={0.8}
          alignItems="center"
          height={TAB_BAR_HEIGHT}
          borderBottomColor="gray.300">
          <HStack alignItems="center" justifyContent={'center'}>
            <Icon
              mr={2}
              as={MaterialCommunityIcons}
              size={5}
              name="information"
            />
            <Text
              color={
                colorMode == 'light' ? FONT_ACTIVE_LIGHT : FONT_INACTIVE_DARK
              }>
              About
            </Text>
          </HStack>
          <Icon as={MaterialCommunityIcons} name="chevron-right" />
        </HStack>

        {/* logout */}

        <Pressable
          onPress={() => {
            auth()
              .signOut()
              .then(() => {
                SignOut();
                TuyaUser.logout();
              });
          }}>
          <HStack
            justifyContent={'space-between'}
            borderBottomWidth={0.8}
            alignItems="center"
            height={TAB_BAR_HEIGHT}
            borderBottomColor="gray.300">
            <HStack alignItems="center" justifyContent={'center'}>
              <Icon mr={2} as={MaterialCommunityIcons} size={5} name="logout" />
              <Text
                color={
                  colorMode == 'light' ? FONT_ACTIVE_LIGHT : FONT_INACTIVE_DARK
                }>
                Logout
              </Text>
            </HStack>
            <Icon as={MaterialCommunityIcons} name="chevron-right" />
          </HStack>
        </Pressable>

        {/* social media */}

        <Text
          color={colorMode == 'light' ? FONT_ACTIVE_LIGHT : FONT_INACTIVE_DARK}
          marginY={5}
          fontSize={FONT_SUB}
          italic
          textAlign={'center'}>
          {'~ '}Follow us on social media {' ~'}
        </Text>

        {/* instagram */}

        <Pressable
          onPress={() => {
            Linking.openURL(
              'https://www.instagram.com/mikikosmartfarming/?hl=en',
            );
          }}>
          <HStack
            justifyContent={'space-between'}
            borderBottomWidth={0.8}
            alignItems="center"
            height={TAB_BAR_HEIGHT}
            borderBottomColor="gray.300">
            <HStack alignItems="center" justifyContent={'center'}>
              <Image
                h={6}
                w={6}
                mr={3}
                source={{
                  uri: 'https://i.postimg.cc/c1bNz1Mv/ig.png',
                }}
                alt="instagram"
              />
              <Text
                color={
                  colorMode == 'light' ? FONT_ACTIVE_LIGHT : FONT_INACTIVE_DARK
                }>
                Instagram
              </Text>
            </HStack>
            <Icon as={MaterialCommunityIcons} name="chevron-right" />
          </HStack>
        </Pressable>

        {/* facebook */}

        <HStack
          justifyContent={'space-between'}
          borderBottomWidth={0.8}
          alignItems="center"
          height={TAB_BAR_HEIGHT}
          borderBottomColor="gray.300">
          <HStack alignItems="center" justifyContent={'center'}>
            <Image
              h={6}
              w={6}
              mr={3}
              source={{uri: 'https://i.postimg.cc/CMDWcC1Q/Facebook.webp'}}
              alt="instagram"
            />
            <Text
              color={
                colorMode == 'light' ? FONT_ACTIVE_LIGHT : FONT_INACTIVE_DARK
              }>
              Facebook
            </Text>
          </HStack>
          <Icon as={MaterialCommunityIcons} name="chevron-right" />
        </HStack>

        {/* youtube */}
        <HStack
          justifyContent={'space-between'}
          borderBottomWidth={0.8}
          alignItems="center"
          height={TAB_BAR_HEIGHT}
          borderBottomColor="gray.300">
          <HStack alignItems="center" justifyContent={'center'}>
            <Image
              h={6}
              w={6}
              mr={3}
              source={{uri: 'https://i.postimg.cc/76zQQDx2/youtube.png'}}
              alt="instagram"
            />
            <Text
              color={
                colorMode == 'light' ? FONT_ACTIVE_LIGHT : FONT_INACTIVE_DARK
              }>
              Youtube
            </Text>
          </HStack>
          <Icon as={MaterialCommunityIcons} name="chevron-right" />
        </HStack>
      </VStack>
    </Box>
  );
};

export default ProfileScreen;
