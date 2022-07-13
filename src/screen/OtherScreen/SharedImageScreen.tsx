import {StackScreenProps} from '@react-navigation/stack';
import {Box, HStack, Icon, Image, Pressable, Text} from 'native-base';
import React from 'react';
import Share from 'react-native-share';
import {HomeStackParams} from '../../navigation/HomeStackNavigation';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {BG_LIGHT, ITEM_HEIGHT_H1} from '../../utils/constanta';

type Nav = StackScreenProps<HomeStackParams>;

const SharedImageScreen = ({navigation, route}: Nav) => {
  const uri: string = route?.params?.uri;
  const base64: string = route?.params?.base64;

  console.log(uri);

  const onShare = async (uri: string) => {
    Share.open({
      message: 'mikiko shared',
      url: uri,
    }).then(res => {
      console.log(res);
    });
  };

  return (
    <Box
      flex={1}
      width="100%"
      justifyContent={'center'}
      bg={BG_LIGHT}
      alignItems="center">
      <Image
        width={ITEM_HEIGHT_H1 * 0.8}
        height={ITEM_HEIGHT_H1 * 0.8}
        borderWidth={1}
        source={{uri: `data:image/jpeg;base64, ${base64}`}}
        alt="barcode"
      />

      {/* icon share */}
      <Pressable
        justifyContent={'center'}
        alignItems="center"
        mt={5}
        onPress={() => {
          onShare(uri);
          // onToggle();
        }}>
        <HStack justifyContent={'center'} alignItems="center">
          <Icon
            as={MaterialCommunityIcons}
            size={10}
            name="share"
            color="gray.300"
          />
          <Text ml={2}>Share</Text>
        </HStack>
      </Pressable>

      {/* stagger */}
      {/* <Stagger
        visible={isOpen}
        initial={{
          opacity: 0,
          scale: 0,
          translateY: 34,
        }}
        animate={{
          translateY: 0,
          scale: 1,
          opacity: 1,
          transition: {
            type: 'spring',
            mass: 0.8,
            stagger: {
              offset: 30,
              reverse: true,
            },
          },
        }}
        exit={{
          translateY: 34,
          scale: 0.5,
          opacity: 0,
          transition: {
            duration: 100,
            stagger: {
              offset: 30,
              reverse: true,
            },
          },
        }}>
        <HStack mb={-5} mt={5} space={5}>
          <IconButton
            variant="solid"
            bg="red.600"
            colorScheme="red"
            borderRadius="full"
            onPress={() => {
              Share.shareSingle({
                message: 'MIKIKO',
                url: `data:image/jpeg;base64, ${base64}`,
                social: Share.Social.EMAIL,
                filename: `data:image/jpeg;base64, ${base64}`,
              }).then(res => {
                console.log(res);
              });
            }}
            icon={
              <Icon
                as={MaterialCommunityIcons}
                size="6"
                name="email-send"
                _dark={{
                  color: 'warmGray.50',
                }}
                color="warmGray.50"
              />
            }
          />
          <IconButton
            variant="solid"
            bg="green.400"
            colorScheme="green"
            borderRadius="full"
            onPress={() => {
              Share.shareSingle({
                message: 'MIKIKO',
                url: `data:image/jpeg;base64, ${base64}`,
                social: Share.Social.WHATSAPP,
                filename: `data:image/jpeg;base64, ${base64}`,
              }).then(res => {
                console.log(res);
              });
            }}
            icon={
              <Icon
                as={MaterialCommunityIcons}
                _dark={{
                  color: 'warmGray.50',
                }}
                size="6"
                name="whatsapp"
                color="warmGray.50"
              />
            }
          />
          <IconButton
            variant="solid"
            bg="blue.700"
            colorScheme="blue"
            borderRadius="full"
            onPress={() => {
              Share.shareSingle({
                message: 'MIKIKO',
                url: `data:image/jpeg;base64, ${base64}`,
                social: Share.Social.MESSENGER,
                filename: `data:image/jpeg;base64, ${base64}`,
              }).then(res => {
                console.log(res);
              });
            }}
            icon={
              <Icon
                as={MaterialCommunityIcons}
                _dark={{
                  color: 'warmGray.50',
                }}
                size="6"
                name="facebook-messenger"
                color="warmGray.50"
              />
            }
          />
          <IconButton
            variant="solid"
            bg="blue.400"
            colorScheme="blue"
            borderRadius="full"
            onPress={() => {
              Share.shareSingle({
                message: 'MIKIKO',
                url: `data:image/jpeg;base64, ${base64}`,
                social: Share.Social.TWITTER,
                filename: `data:image/jpeg;base64, ${base64}`,
              }).then(res => {
                console.log(res);
              });
            }}
            icon={
              <Icon
                as={MaterialCommunityIcons}
                size="6"
                name="twitter"
                _dark={{
                  color: 'warmGray.50',
                }}
                color="warmGray.50"
              />
            }
          />
        </HStack> */}

      {/* second line */}

      {/* <HStack mb={-5} mt={10} space={5}>
          <IconButton
            variant="solid"
            bg="blue.700"
            colorScheme="blue"
            borderRadius="full"
            onPress={() => {
              Share.shareSingle({
                message: 'MIKIKO',
                url: `data:image/jpeg;base64, ${base64}`,
                social: Share.Social.FACEBOOK,
                filename: `data:image/jpeg;base64, ${base64}`,
              }).then(res => {
                console.log(res);
              });
            }}
            icon={
              <Icon
                as={MaterialCommunityIcons}
                size="6"
                name="facebook"
                _dark={{
                  color: 'warmGray.50',
                }}
                color="warmGray.50"
              />
            }
          />
          <IconButton
            variant="solid"
            bg="red.600"
            colorScheme="red"
            borderRadius="full"
            onPress={() => {
              Share.shareSingle({
                message: 'MIKIKO',
                url: `data:image/jpeg;base64, ${base64}`,
                social: Share.Social.INSTAGRAM,
                filename: `data:image/jpeg;base64, ${base64}`,
              }).then(res => {
                console.log(res);
              });
            }}
            icon={
              <Icon
                as={MaterialCommunityIcons}
                _dark={{
                  color: 'warmGray.50',
                }}
                size="6"
                name="instagram"
                color="warmGray.50"
              />
            }
          />
          <IconButton
            variant="solid"
            bg="yellow.400"
            colorScheme="yellow"
            borderRadius="full"
            onPress={() => {
              Share.shareSingle({
                message: 'MIKIKO',
                url: `data:image/jpeg;base64, ${base64}`,
                social: Share.Social.SNAPCHAT,
                filename: `data:image/jpeg;base64, ${base64}`,
              }).then(res => {
                console.log(res);
              });
            }}
            icon={
              <Icon
                as={MaterialCommunityIcons}
                _dark={{
                  color: 'warmGray.50',
                }}
                size="6"
                name="snapchat"
                color="warmGray.50"
              />
            }
          />
          <IconButton
            variant="solid"
            bg="blue.400"
            colorScheme="blue"
            borderRadius="full"
            onPress={() => {
              Share.shareSingle({
                message: 'MIKIKO',
                url: `data:image/jpeg;base64, ${base64}`,
                social: Share.Social.TELEGRAM,
                filename: `data:image/jpeg;base64, ${base64}`,
              }).then(res => {
                console.log(res);
              });
            }}
            icon={
              <Icon
                as={MaterialCommunityIcons}
                size="6"
                name="television"
                _dark={{
                  color: 'warmGray.50',
                }}
                color="warmGray.50"
              />
            }
          />
        </HStack>
      </Stagger> */}
    </Box>
  );
};

export default SharedImageScreen;
