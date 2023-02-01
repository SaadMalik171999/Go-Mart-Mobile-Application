import {
  ScrollView,
  StyleSheet,
  Text,
  BackHandler,
  View,
  KeyboardAvoidingView,
  TouchableOpacity,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {Dimensions} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {TextInput, Button} from 'react-native-paper';
import {Formik, Form, Field, ErrorMessage} from 'formik';
import {loginValidationSchema} from '../../Schema/index';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Header from '../../components/login/Header';
import ModalNative from '../../components/Modal/Modal';
import Toaster, {toastConfig} from '../../components/Toaster/Toaster';
import AppStatusBar from '../../components/AppStatusBar';
import Toast, {BaseToast, ErrorToast} from 'react-native-toast-message';
import {storeToken} from '../../services/authorizationToken';
import {useLoginMutation} from '../../services/userAuthentication';

const initialValues = {
  email: '',
  password: '',
};

export default function Login() {
  const navigation = useNavigation();

  const [passwordVisible, setPasswordVisible] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);

  const [forgetPasswordEmail, setForgetPasswordEmail] = useState('');
  const [validEmail, setValidEmail] = useState(false);

  const backAction = () => {
    BackHandler.exitApp();
    return true;
  };

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, []);

  const openDrawer = () => {
    navigation.openDrawer();
  };

  const [loginUser] = useLoginMutation();

  const handleSubmit = async values => {
    // storeToken('hfuefhfdfewh33434bcadscbh3r3rbber33bscbcc')
    // navigation.navigate('SideDrawer')
    try {
      const {email, password} = values;
      if (email && password) {
        const formData = {email, password};
        const response = await loginUser(formData);
        console.log(response.data.status);
        if (response.data.status == 'Success') {
          await storeToken(response.data.Token);
          navigation.navigate('SideDrawer');
        }
        if (response.data.status === 'Failed') {
          console.log(response.data.Message);
          Toast.show({
            type: 'warning',
            position: 'top',
            topOffset: 10,
            // keyboardOffset	: 10,
            text1: response.data.Message,
          });
        }
      } else {
        Toast.show({
          type: 'warning',
          position: 'top',
          topOffset: 0,
          text1: 'All fields are Required',
        });
      }
    } catch (error) {
      Toast.show({
        type: 'warning',
        position: 'top',
        topOffset: 0,
        text1: 'Something went wrong',
      });
    }
  };
  let validateEmail = email => {
    var re =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  };
  return (
    <View style={styles.container}>
      <View>
        <Header name={'Sign Up'} />
        <View>
          <Text
            style={{
              textAlign: 'center',
              color: '#1C75BC',
              fontSize: 28,
              fontWeight: '700',
              marginRight: 50,
              fontFamily: 'sans-serif-medium',
            }}>
            SMART GROCERY
          </Text>
          <Text
            style={{
              textAlign: 'center',
              color: '#898989',
              fontSize: 24,
              fontWeight: '700',
              fontFamily: 'sans-serif-medium',
              marginLeft: 130,
            }}>
            APPLICATION
          </Text>
        </View>
      </View>
      <View style={styles.formContainer}>
        <Formik
          validationSchema={loginValidationSchema}
          initialValues={initialValues}>
          {({handleChange, handleBlur, values, errors, isValid}) => (
            <View>
              <View>
                <View style={{flexDirection: 'row'}}>
                  <View style={{justifyContent: 'center'}}>
                    <Ionicons name="mail-outline" size={20} />
                  </View>
                  <View style={{flex: 1}}>
                    <TextInput
                      mode="flat"
                      name="email"
                      label="Email"
                      style={styles.textInput}
                      onChangeText={handleChange('email')}
                      onBlur={handleBlur('email')}
                      value={values.email}
                      keyboardType="email-address"
                      activeUnderlineColor="#1C75BC"
                    />
                  </View>
                </View>
                {errors.email && (
                  <Text style={{fontSize: 12, color: 'red', marginLeft: 20}}>
                    {errors.email}
                  </Text>
                )}
                <View style={{flexDirection: 'row'}}>
                  <View style={{justifyContent: 'center'}}>
                    <Ionicons name="lock-closed-outline" size={25} />
                  </View>
                  <View style={{flex: 1}}>
                    <TextInput
                      mode="flat"
                      name="password"
                      label="Password"
                      style={styles.textInput}
                      onChangeText={handleChange('password')}
                      onBlur={handleBlur('password')}
                      value={values.password}
                      activeUnderlineColor="#1C75BC"
                      secureTextEntry={passwordVisible}
                      right={
                        <TextInput.Icon
                          name={passwordVisible ? 'eye-off' : 'eye'}
                          onPress={() => setPasswordVisible(!passwordVisible)}
                        />
                      }
                    />
                  </View>
                </View>
                {errors.password && (
                  <Text style={{fontSize: 12, color: 'red', marginLeft: 20}}>
                    {errors.password}
                  </Text>
                )}
              </View>
              <View style={styles.loginButton}>
                <Button
                  style={{
                    backgroundColor: '#1C75BC',
                  }}
                  mode="contained"
                  theme={{
                    roundness: 10,
                  }}
                  onPress={() => {
                    handleSubmit(values);
                  }}
                  disabled={!isValid}>
                  LOGIN
                </Button>
              </View>
              <View style={styles.forgetPassword}>
                <TouchableOpacity
                  onPress={() => {
                    console.log('Forget Password');
                    setForgetPasswordEmail(values.email);
                    setModalVisible(true);
                  }}>
                  {/* <Text style={{fontWeight: 'bold'}}>Forget Password?</Text> */}
                </TouchableOpacity>
              </View>
            </View>
          )}
        </Formik>
      </View>
      {modalVisible ? (
        <View>
          <ModalNative
            modalVisible={modalVisible}
            setModalVisible={setModalVisible}>
            <View
              style={{
                flex: 1,
                justifyContent: 'flex-end',
                alignItems: 'center',
              }}>
              <View
                style={{
                  width: '100%',
                  height: '30%',
                  backgroundColor: 'white',
                  borderTopLeftRadius: 20,
                  borderTopRightRadius: 20,
                }}>
                <View style={{marginTop: 30, marginLeft: 20}}>
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: '700',
                      color: '#1C75BC',
                    }}>
                    Forget your password?
                  </Text>
                  <Text>Confirm your email</Text>
                </View>
                <View>
                  <View
                    style={{
                      width: '90%',
                      alignSelf: 'center',
                    }}>
                    <TextInput
                      mode="flat"
                      name="forgetEmail"
                      label="Email"
                      style={styles.textInput}
                      onChangeText={text => {
                        setForgetPasswordEmail(text);
                      }}
                      value={forgetPasswordEmail}
                      keyboardType="email-address"
                      activeUnderlineColor="#1C75BC"
                    />
                  </View>
                  {validEmail ? (
                    <Text style={{fontSize: 12, color: 'red', marginLeft: 20}}>
                      Please enter valid email
                    </Text>
                  ) : null}
                </View>
                <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginVertical: 20,
                  }}>
                  <Button
                    mode="contained"
                    style={{
                      borderWidth: 1,
                      borderColor: '#1C75BC',
                      borderRadius: 50,
                      width: '60%',
                    }}
                    color="#1C75BC"
                    onPress={() => {
                      if (!validateEmail(forgetPasswordEmail)) {
                        setValidEmail(true);
                        setTimeout(() => {
                          setValidEmail(false);
                        }, 3000);
                      } else {
                        console.log(' Valid');
                      }
                    }}>
                    <Text style={styles.headerButtonText}>{`Reset`}</Text>
                  </Button>
                </View>
              </View>
            </View>
          </ModalNative>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },

  formContainer: {
    borderColor: 'gray',
    alignSelf: 'center',
    height: 300,
    width: '90%',
    backgroundColor: 'white',
    justifyContent: 'center',
    paddingHorizontal: 10,
    marginTop: 20,
    borderRadius: 10,
  },
  textInput: {
    backgroundColor: 'white',
    color: 'black',
  },
  loginButton: {
    marginTop: 10,
  },
  forgetPassword: {
    alignItems: 'flex-end',
    marginTop: 10,
  },
  headerButtonText: {
    // color: '#1C75BC',
    color: 'white',
    fontSize: 15,
    fontWeight: '700',
  },
});
