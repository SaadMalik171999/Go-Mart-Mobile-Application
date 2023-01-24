import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Linking,
  Text,
  Image,
} from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import ImagePicker from 'react-native-image-crop-picker';
import { Button } from 'react-native-paper';


export default function ScanList({ navigation, route }) {

  const [hasPermission, setHasPermission] = React.useState(false);
  const devices = useCameraDevices()
  const device = devices.back
  const camera = useRef(null)
  const takePhotoOptions = {
    qualityPrioritization: 'speed',
    flash: 'off'
  };
  React.useEffect(() => {
    (async () => {
      const status = await Camera.requestCameraPermission();
      setHasPermission(status === 'authorized');
    })();
  }, []);
  const takePhoto = async () => {
    try {
      if (camera.current == null) throw new Error('Camera Ref is Null');
      console.log('Photo taking ....');
      const photo = await camera.current.takePhoto(takePhotoOptions);
      console.log(photo)
    } catch (error) {
      console.log(error);
    }
  };

  


  function renderCamera() {
    if (device == null) {
      return (
        <View>
          <Text style={{ color: '#fff' }}>Loading</Text>
        </View>
      )
    }
    else {
      return (
        <View style={{ flex: 1 }}>
          {device != null &&
            hasPermission && (
              <>
                <Camera
                  ref={camera}
                  style={StyleSheet.absoluteFill}
                  device={device}
                  isActive={true}
                  photo={true}
                />
                  <Text> Too much code, I delete something here </Text>
              </>
            )}
        </View>
      )
    }


  }

  const captureCamera = async () => {
    console.log("Yes")

    ImagePicker.openCamera({
      maxWidth: 700,
      maxHeight: 700,
      cropping: true,
    }).then(image => {
      console.log(image)
    })

  }
  return (
    <SafeAreaView
      style={{
        flex: 1,
      }}>

      {
          renderCamera()
        }
      <Button
        style={{
          // backgroundColor: '#1C75BC',
          borderRadius: 30,
          width: '50%'
        }}

        onPress={() => {
          takePhoto()
         
        }}>
        camera check
      </Button>
    </SafeAreaView>
  );
}
