import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ImageBackground,
  Dimensions,
  PermissionsAndroid,
  SafeAreaView,
  Image,
  BackHandler,
  ScrollView,
} from 'react-native';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import ImagePicker from 'react-native-image-crop-picker';
import ModalNative from '../components/Modal/Modal';
const {width, height} = Dimensions.get('screen');
import AppStatusBar from '../components/AppStatusBar';
import CustomInput from './CustomInput';
import useIsLoading from '../hooks/useIsLoader';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useScanListMutation} from '../services/userAuthentication';
import {set} from 'immer/dist/internal';

export default function ScanImage({navigation, route}) {
  const imgData = new FormData();
  const checkCameraOrGellary = route.params;
  const [filePath, setFilePath] = useState({});
  const [imageResponse, setImageResponse] = useState([]);

  const [sendImage, isSuccess, isLoading] = useScanListMutation();
  const [modalVisible, setModalVisible] = useState(false);

  const [loader, showLoader, hideLoader] = useIsLoading();

  const uploadProfileImage = async image => {
    console.log('pohancha 3');

    imgData.append('scanImage', {
      uri: image.uri,
      type: image.type,
      name: image.fileName,
    });

    //for testing purpose
    // showLoader();
    // setImageResponse(["AAta", "Daal", "Rice", "Noodles", "Potato"]);
    // hideLoader();

    //original

    // const config = {
    //   method: 'POST',
    //   headers: {
    //     Accept: 'application/json',
    //     'Content-Type': 'multipart/form-data',
    //   },
    //   body: imgData,
    // };

    // fetch('https://smart-grocery-application.herokuapp.com/scan-image', config)
    //   .then(response => response.text())
    //   .then(result => console.log(result))
    //   .catch(error => console.log('error', error));

    try {
      showLoader();
      const response = await sendImage(imgData);
      if (response.data.Status === 'Success') {
        console.log(response.data.Message);
        setImageResponse(response.data.Message);
      } else {
        console.log(response.data.Message);
      }
      hideLoader();
    } catch (error) {
      console.log(error.message);
    }
  };

  const checkParamsValue = () => {
    console.log(route.params);
    if (checkCameraOrGellary === 'camera') {
      // console.log(checkCameraOrGellary);
      captureImage('photo');
      // captureCamera()
    } else if (checkCameraOrGellary === 'gallery') {
      // console.log(checkCameraOrGellary);
      chooseFile('photo');
    }
  };

  const backAction = () => {
    navigation.goBack();
    return true;
  };

  useEffect(() => {
    checkParamsValue();
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, []);

  const requestCameraPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'Camera Permission',
            message: 'App needs camera permission',
          },
        );
        // If CAMERA Permission is granted
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    } else return true;
  };

  const requestExternalWritePermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'External Storage Write Permission',
            message: 'App needs write permission',
          },
        );
        // If WRITE_EXTERNAL_STORAGE Permission is granted
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        alert('Write permission err', err);
      }
      return false;
    } else return true;
  };

  // const captureCamera = async () => {
  //   console.log("Yes")
  //   let isCameraPermitted = await requestCameraPermission();
  //   let isStoragePermitted = await requestExternalWritePermission();
  //   if (isCameraPermitted && isStoragePermitted) {
  //     ImagePicker.openCamera({
  //       maxWidth: 700,
  //       maxHeight: 700,
  //       cropping: true,
  //     }).then(image => {
  //       console.log(image)
  //     })
  //   }
  // }

  const captureImage = async type => {
    try {
      let options = {
        mediaType: type,
        maxWidth: 700,
        maxHeight: 700,
        quality: 1,
        durationLimit: 30,
        saveToPhotos: true,
      };

      let isCameraPermitted = await requestCameraPermission();
      let isStoragePermitted = await requestExternalWritePermission();
      if (isCameraPermitted && isStoragePermitted) {
        launchCamera(options, response => {
          if (response.didCancel) {
            navigation.navigate('DashBoard');
          } else if (response.errorCode == 'camera_unavailable') {
            alert('Camera not available on device');
            navigation.navigate('DashBoard');
          } else if (response.errorCode == 'permission') {
            alert('Permission not satisfied');
            navigation.navigate('DashBoard');
          } else if (response.errorCode == 'others') {
            alert(response.errorMessage);
            navigation.navigate('DashBoard');
          }

          if (response.didCancel) {
            navigation.navigate('DashBoard');
          } else {
            console.log('pohancha 1');
            // console.log('fileName -> ', response?.assets[0]);

            setFilePath(response.assets[0]);
            // console.log("pohancha 2", response.assets[0])
            uploadProfileImage(response.assets[0]);
          }
        });
      }
    } catch (error) {
      console.log('Something went wrong');
    }
  };

  const chooseFile = async type => {
    let options = {
      mediaType: type,
      maxWidth: 300,
      maxHeight: 550,
      quality: 1,
      // includeBase64: true,
    };
    launchImageLibrary(options, response => {
      // console.log('Response = ', response);

      if (response.didCancel) {
        navigation.navigate('DashBoard');
      } else if (response.errorCode == 'camera_unavailable') {
        alert('Camera not available on device');
        navigation.navigate('DashBoard');
      } else if (response.errorCode == 'permission') {
        alert('Permission not satisfied');
        navigation.navigate('DashBoard');
      } else if (response.errorCode == 'others') {
        alert(response.errorMessage);
        navigation.navigate('DashBoard');
      }
      if (response.didCancel) {
        navigation.navigate('DashBoard');
      } else {
        setFilePath(response.assets[0]);
        console.log('fileName -> ', response?.assets[0]);
        uploadProfileImage(response.assets[0]);
      }
    });
  };

  return (
    <>
      {loader ? (
        loader
        
      ) : (
        <SafeAreaView style={{flex: 1}}>
          <AppStatusBar
            backgroundColor="black"
            barStyle="dark-content"
            hidden={true}
          />
          <View style={styles.header}>
            <Icon name="arrow-back-ios" size={28} onPress={navigation.goBack} />
            <Text style={{fontSize: 20, fontWeight: 'bold'}}>
              Search Products
            </Text>
          </View>
          <View style={styles.container}>
            <View
              style={{
                backgroundColor: 'red',
              }}>
              <View
                style={{
                  width: width,
                  // height: 200,
                  backgroundColor: 'black',
                  aspectRatio: 1 * 1.4,
                }}>
                <Image
                  source={{uri: filePath.uri}}
                  style={{
                    resizeMode: 'contain',
                    width: '100%',
                    height: '100%',
                  }}
                />
              </View>
            </View>
            <ScrollView
              showsVerticalScrollIndicator={false}
              style={{
                backgroundColor: 'white',
                // height: '20%',
              }}>
              <CustomInput imageResponse={imageResponse} />
            </ScrollView>
          </View>
        </SafeAreaView>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  header: {
    paddingVertical: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
  },
  titleText: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingVertical: 20,
  },
  textStyle: {
    padding: 10,
    color: 'black',
    textAlign: 'center',
  },
  buttonStyle: {
    alignItems: 'center',
    backgroundColor: '#DDDDDD',
    padding: 5,
    marginVertical: 10,
    width: 250,
  },
  imageStyle: {
    width: '100%',
    height: '100%',
    margin: '4%',
    // alignSelf: 'center',
    borderRadius: 10,
    resizeMode: 'contain',
  },
});
