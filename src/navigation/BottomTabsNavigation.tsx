import React, {useContext, useEffect, useLayoutEffect, useState} from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import ProfileScreen from './../screen/profilescreen/ProfileScreen';
import {Box, Icon, Image, Text, VStack} from 'native-base';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {StackScreenProps} from '@react-navigation/stack';
import {HomeStackParams} from './HomeStackNavigation';
import {
  BG_LIGHT,
  FONT_SUB,
  FONT_TITLE,
  ITEM_HEIGHT_H3,
  PRIMARY_COLOR,
  TAB_BAR_HEIGHT,
} from '../utils/constanta';
import PairingNavigation from './PairingNavigation';
import Carousel from 'react-native-snap-carousel';
import {dummyData} from '../assets/Dataimage/Data';
import {Dimensions, LogBox} from 'react-native';
import SceneTopTabNavigator from './SceneTopTabNavigator';
import ProfileStackScreen from './ProfileStackNavigation';
import Loader from 'react-native-modal-loader';
import database from '@react-native-firebase/database';
import TuyaUser from '../lib/TuyaUser';
import TuyaHome from '../lib/TuyaHome';
import AuthContex from '../route/AuthContext';
import SplashScreen from 'react-native-splash-screen';

export type BottomTabsParams = {
  Home;
  Pairing;
  Profile;
};

const Tab = createBottomTabNavigator<BottomTabsParams>();

type navBar = StackScreenProps<HomeStackParams>;

function MyTabBar({state, descriptors, navigation}) {
  return (
    <Box
      flexDir={'row'}
      width="100%"
      justifyContent={'space-around'}
      alignItems="center"
      height={TAB_BAR_HEIGHT}
      bg={PRIMARY_COLOR}>
      {state.routes.map((route, index) => {
        const {options} = descriptors[route.key];
        var label: string;
        var destination: string;

        // console.log(route.name);

        if (route.name == 'Home') {
          label = 'home-edit-outline';
          destination = 'Home';
        } else if (route.name == 'Pairing') {
          label = 'plus-box';
          destination = 'Pairingbase';
        } else {
          label = 'account-circle-outline';
          destination = 'Profilebase';
        }

        const isFocused = state.index === index;

        const onPress = () => {
          navigation.navigate(destination);
        };

        return (
          <Box key={index}>
            <Icon
              onPress={onPress}
              as={MaterialCommunityIcons}
              name={label}
              size={options.title == 'Pairing' ? 'lg' : 6}
              color={'gray.200'}
            />
          </Box>
        );
      })}
    </Box>
  );
}

type photoParam = {
  id: string;
  uri: string;
};

const BottomTabsNavigator = ({navigation}: navBar) => {
  const {AddUser} = useContext(AuthContex);

  const [isLogin, setIsLogin] = useState<boolean>(false);
  const [dataPhoto, setDataPhoto] = useState<Array<photoParam>>([]);

  const tuyaUser = async () => {
    await TuyaUser.isLogin()
      .then(async res => {
        console.log('is user login ========================', res);

        if (res == true) {
          await TuyaHome.queryHomeList()
            .then(resp => {
              console.log('home list details ========================', resp);
              AddUser(resp);
              setIsLogin(true);
              SplashScreen.hide();
            })
            .catch(e => {});
        }
      })
      .catch(e => {});
  };

  useEffect(() => {
    database()
      .ref('/bannerphoto')
      .on('value', snapshot => {
        // console.log('User data: ', snapshot.val());
        const data = snapshot.val();

        var dataArray: Array<photoParam> = [];

        for (let id in data) {
          if (data[id] != null) {
            console.log(data[id]);
            dataArray.push(data[id]);
          }
        }

        console.log('photo database = ', dataArray);

        tuyaUser();

        setDataPhoto(dataArray);
      });

    return () => {
      true;
    };
  }, []);

  // console.log(dataPhoto);

  if (!isLogin)
    return <Loader loading={true} opacity={0.6} color={PRIMARY_COLOR} />;

  return (
    <Tab.Navigator tabBar={props => <MyTabBar {...props} />}>
      <Tab.Screen
        name="Home"
        component={SceneTopTabNavigator}
        options={{
          header: () => (
            <Carousel
              data={dataPhoto}
              autoplay
              loop
              autoplayDelay={5000}
              renderItem={({item, index}) => {
                return (
                  <Image
                    source={{uri: item.uri}}
                    alt="kampret"
                    width={Dimensions.get('screen').width}
                    height={ITEM_HEIGHT_H3 * 0.9}
                    maxHeight={ITEM_HEIGHT_H3 * 0.9}
                  />
                );
              }}
              sliderWidth={Dimensions.get('screen').width}
              itemWidth={Dimensions.get('screen').width}
            />
          ),
          headerStyle: {
            height: ITEM_HEIGHT_H3 * 0.85,
          },
        }}
      />
      <Tab.Screen name="Pairing" component={PairingNavigation} />
      <Tab.Screen
        name="Profile"
        component={ProfileStackScreen}
        options={{
          headerShown: false,
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomTabsNavigator;
