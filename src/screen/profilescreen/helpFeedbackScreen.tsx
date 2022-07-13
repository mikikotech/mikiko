import {
  Box,
  Button,
  FormControl,
  HStack,
  Input,
  Text,
  VStack,
} from 'native-base';
import React, {useState} from 'react';
import {Linking} from 'react-native';
import {BG_DARK, BG_LIGHT, ITEM_HEIGHT_H2} from '../../utils/constanta';

type emailParams = {
  to: string;
  subject: string;
  body: string;
  options: {
    cc: string;
    bcc?: string;
  };
};

const HelpFeedbackScreen = () => {
  const [username, usernameSet] = useState<string>('');
  const [userEmail, userEmailSet] = useState<string>('');
  const [subject, subjectSet] = useState<string>('');
  const [message, messageSet] = useState<string>('');

  return (
    <Box
      flex={1}
      width={'100%'}
      px={5}
      _light={{bg: BG_LIGHT}}
      _dark={{bg: BG_DARK}}>
      <VStack space={5}>
        <HStack alignItems={'center'} justifyContent="space-between">
          <FormControl width={'47%'}>
            <FormControl.Label>Username</FormControl.Label>
            <Input value={username} onChangeText={val => usernameSet(val)} />
          </FormControl>
          <FormControl width={'47%'}>
            <FormControl.Label>Your Emaill</FormControl.Label>
            <Input
              value={userEmail}
              onChangeText={val => userEmailSet(val)}
              keyboardType="email-address"
            />
          </FormControl>
        </HStack>

        {/* subject */}

        <FormControl>
          <FormControl.Label>Subject</FormControl.Label>
          <Input value={subject} onChangeText={val => subjectSet(val)} />
        </FormControl>

        {/* message */}

        <FormControl>
          <FormControl.Label>Your Message</FormControl.Label>
          <Input
            height={ITEM_HEIGHT_H2}
            value={message}
            onChangeText={val => messageSet(val)}
          />
        </FormControl>
      </VStack>
      <Button mt={5} onPress={() => {}}>
        send
      </Button>
    </Box>
  );
};

export default HelpFeedbackScreen;
