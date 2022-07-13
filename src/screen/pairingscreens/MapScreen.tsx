import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import Geocoder from 'react-native-geocoder';
import {Box} from 'native-base';
import RNLocation from 'react-native-location';
import {StackScreenProps} from '@react-navigation/stack';
import {PairingParams} from '../../navigation/PairingNavigation';
import AndroidToast from '../../utils/AndroidToast';

type Nav = StackScreenProps<PairingParams>;

const MapScreen = ({navigation, route}: Nav) => {
  const [lat, setLat] = useState(0);
  const [lon, setLon] = useState(0);
  const [location, setLocation] = useState('');

  Geocoder.fallbackToGoogle('AIzaSyDrtu0ZNYwh-rrG8TKplC0Sjlku7QTnOkY');

  const getAdd = async () => {
    RNLocation.configure({
      distanceFilter: 5.0,
    });

    RNLocation.subscribeToLocationUpdates(res => {
      setLat(res[0].latitude);
      setLon(res[0].longitude);

      getpos(res[0].latitude, res[0].longitude);
    });
  };

  const getpos = useCallback(async (lat, lon) => {
    try {
      let res = await Geocoder.geocodePosition({lat: lat, lng: lon});
      AndroidToast.toast(res[0].formattedAddress);

      let adds = res[0].formattedAddress.split(',');

      setLocation(`${adds[0]}, ${adds[1]}, ${adds[2]}`);
    } catch (error) {
      console.log(error);
    }
  }, []);

  useLayoutEffect(() => {
    getAdd();
  });

  return (
    <Box flex={1} _dark={{bg: 'warmGray.800'}} _light={{bg: 'warmGray.50'}}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={{flex: 1}}
        showsUserLocation={true}
        showsMyLocationButton={true}
        region={{
          latitude: lat,
          longitude: lon,
          latitudeDelta: 0.015,
          longitudeDelta: 0.0121,
        }}>
        <Marker
          coordinate={{latitude: lat, longitude: lon}}
          draggable={true}
          onDragEnd={res => {
            const {longitude, latitude} = res.nativeEvent.coordinate;
            setLat(latitude);
            setLon(longitude);
            getpos(latitude, longitude);
          }}
          onPress={() => {
            navigation.navigate('Deviceinfo', {
              location: location,
              deviceName: route?.params?.device,
              bssid: route?.params?.bssid,
            });
          }}
        />
      </MapView>
    </Box>
  );
};

export default MapScreen;
