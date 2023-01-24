import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Modal,
  backHandler,
  KeyboardAvoidingView,
  TouchableOpacity,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {Dimensions} from 'react-native';
import {Formik, Form, Field, ErrorMessage, useFormik} from 'formik';
import {useNavigation} from '@react-navigation/native';
import {TextInput, Button} from 'react-native-paper';
import AwesomeIcon from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {signUpValidationSchema} from '../../Schema/index';
import Header from '../../components/login/Header';
import Toast from 'react-native-toast-message';
import {toastConfig} from '../../utils/ToastConfig';
import {storeToken} from '../../services/authorizationToken';
import {useSignUpMutation} from '../../services/userAuthentication';
import ModalNative from '../../components/Modal/Modal';
import LottieView from 'lottie-react-native';

const initialValues = {
  fullName: '',
  email: '',
  password: '',
  confirmPassword: '',
};

export default function Registger() {
  const navigation = useNavigation();
  const [passwordVisible, setPasswordVisible] = useState(true);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(true);

  const [visibleModal, setVisibleModal] = React.useState(false);

  const [registerUser] = useSignUpMutation();

  const handleSubmit = async values => {
    try {
      const {fullName, email, password, confirmPassword} = values;
      if (fullName && email && password && confirmPassword) {
        if (password === confirmPassword) {
          const formData = {fullName, email, password, confirmPassword};
          setVisibleModal(true);
          const response = await registerUser(formData);
          setVisibleModal(false);
          if (response.data.status === 'Success') {
            console.log(response.data.Token);
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
            topOffset: 10,
            text1: "Password and Confirm Password doesn't match",
          });
        }
      } else {
        Toast.show({
          type: 'warning',
          position: 'top',
          topOffset: 10,
          text1: 'All fields are Required',
        });
      }
    } catch (error) {
      Toast.show({
        type: 'warning',
        position: 'top',
        topOffset: 10,
        text1: 'Something went wrong',
      });
    }
  };
  return (
    <ScrollView style={styles.container}>
      <React.Fragment>
        <View>
          <Header name={'Login'} />
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
        <Toast config={toastConfig} />
        <View style={styles.formContainer}>
          <Formik
            validationSchema={signUpValidationSchema}
            initialValues={initialValues}
            onSubmit={values => console.log(values)}>
            {({handleChange, handleBlur, values, errors, isValid}) => (
              <View>
                <View>
                  <View style={{flexDirection: 'row'}}>
                    <View style={{justifyContent: 'center'}}>
                      <Ionicons name="person-outline" size={20} />
                    </View>
                    <View style={{flex: 1}}>
                      <TextInput
                        type="focused"
                        name="fullName"
                        label="Username"
                        style={styles.textInput}
                        onChangeText={handleChange('fullName')}
                        onBlur={handleBlur('fullName')}
                        value={values.fullName}
                        activeUnderlineColor="#1C75BC"
                      />
                    </View>
                  </View>
                  {errors.fullName && (
                    <Text style={{fontSize: 12, color: 'red', marginLeft: 20}}>
                      {errors.fullName}
                    </Text>
                  )}
                  <View style={{flexDirection: 'row'}}>
                    <View style={{justifyContent: 'center'}}>
                      <Ionicons name="mail-outline" size={20} />
                    </View>
                    <View style={{flex: 1}}>
                      <TextInput
                        type="focused"
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
                        type="flat"
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
                  <View style={{flexDirection: 'row'}}>
                    <View style={{justifyContent: 'center'}}>
                      <Ionicons name="lock-closed-outline" size={25} />
                    </View>
                    <View style={{flex: 1}}>
                      <TextInput
                        mode="flat"
                        name="confirmPassword"
                        label="Confirm Password"
                        style={styles.textInput}
                        onChangeText={handleChange('confirmPassword')}
                        onBlur={handleBlur('confirmPassword')}
                        value={values.confirmPassword}
                        activeUnderlineColor="#1C75BC"
                        secureTextEntry={confirmPasswordVisible}
                        right={
                          <TextInput.Icon
                            name={confirmPasswordVisible ? 'eye-off' : 'eye'}
                            onPress={() =>
                              setConfirmPasswordVisible(!confirmPasswordVisible)
                            }
                          />
                        }
                      />
                    </View>
                  </View>
                  {errors.confirmPassword && (
                    <Text style={{fontSize: 12, color: 'red', marginLeft: 20}}>
                      {errors.confirmPassword}
                    </Text>
                  )}
                </View>
                <View style={styles.loginButton}>
                  <Button
                    // disabled={!isValid}
                    style={{
                      backgroundColor: '#1C75BC',
                    }}
                    theme={{
                      roundness: 10,
                    }}
                    mode="contained"
                    onPress={() => {
                      handleSubmit(values);
                    }}>
                    SIGN UP
                  </Button>
                </View>
              </View>
            )}
          </Formik>
        </View>
      </React.Fragment>
      {visibleModal ? (
        <ModalNative
          modalVisible={visibleModal}
          setModalVisible={setVisibleModal}>
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <LottieView
              style={{height: 120}}
              source={require('../../assets/lottie/loader.json')}
              autoPlay
              loop
            />
          </View>
        </ModalNative>
      ) : null}
    </ScrollView>
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
    height: 380,
    width: '90%',
    backgroundColor: 'white',
    justifyContent: 'center',
    paddingHorizontal: 10,
    marginTop: 20,
    borderRadius: 10,
    // elevation: 1,
    marginBottom: 5,
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
});
