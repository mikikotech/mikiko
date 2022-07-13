import {AlertDialog, Box, Button, Icon} from 'native-base';
import React, {ReactNode} from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {FONT_INACTIVE_DARK} from '../utils/constanta';

type Props = {
  show?: boolean;
  title: string;
  message: string;
  onPress: () => void;
  onCancel: () => void;
  variant?: 'warning' | 'error' | 'success' | 'info';
  schema: 'trash-can' | 'check';
  children?: ReactNode;
};

const ModalAlert = ({
  show,
  title,
  message,
  variant,
  onPress,
  schema,
  onCancel,
  children,
}: Props) => {
  const cancelRef = React.useRef(null);
  return (
    <Box w="100%" alignItems="center">
      <AlertDialog
        leastDestructiveRef={cancelRef}
        isOpen={show}
        bg={'#FFFFFF4D'}
        onClose={onCancel}>
        <AlertDialog.Content>
          <AlertDialog.CloseButton _dark={{bg: FONT_INACTIVE_DARK}} />
          <AlertDialog.Header _text={{_dark: {color: FONT_INACTIVE_DARK}}}>
            {title}
          </AlertDialog.Header>
          <AlertDialog.Body _text={{_dark: {color: FONT_INACTIVE_DARK}}}>
            {message}
            <Box width={'100%'}>{children}</Box>
          </AlertDialog.Body>
          <AlertDialog.Footer>
            <Button.Group space={2} alignItems="center">
              <Button
                variant="unstyled"
                colorScheme="coolGray"
                onPress={onCancel}
                _text={{_dark: {color: FONT_INACTIVE_DARK}}}
                ref={cancelRef}>
                Cancel
              </Button>
              <Icon
                as={MaterialCommunityIcons}
                name={schema}
                size={7}
                _dark={{color: FONT_INACTIVE_DARK}}
                onPress={onPress}
              />
            </Button.Group>
          </AlertDialog.Footer>
        </AlertDialog.Content>
      </AlertDialog>
    </Box>
  );
};

export default ModalAlert;
