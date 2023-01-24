import {
  ScrollView,
  StyleSheet,
  Text,
  Image,
  ImageBackground,
  View,
  KeyboardAvoidingView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import React, { useState } from 'react';
import { Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { TextInput, Button } from 'react-native-paper';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { loginValidationSchema } from '../Schema/index';
import AwesomeIcon from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AppStatusBar from '../components/AppStatusBar';

const initialValues = {
  password: '',
  confirmPassword: '',
};

export default function Landing() {
  const navigation = useNavigation();

  const [passwordVisible, setPasswordVisible] = useState(true);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <AppStatusBar
        backgroundColor="white"
        barStyle="dark-content"
        hidden={true}
      />
      <View
        style={{
          flex: 1,
          backgroundColor: '#9bb9b9',
          borderBottomLeftRadius: 40,
          borderBottomRightRadius: 40,
          height: '40%',
          paddingVertical: '7%'
        }}>
           <Image
          style={styles.headerImage}
          source={require('../assets/images/v2.png')}
        />
        

      </View>
      <View
        style={{
          backgroundColor: 'white',
          // backgroundColor: '#9bb9b9',
          height: '60%',
        }}>
        <View style={styles.formContainer}>
          <View>
            <Text style={{textAlign:'center' , color: '#1C75BC'}}>
              Smart Grocery Application
            </Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
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
    height: 400,
    width: '90%',
    position: 'absolute',
    top: -100,
    elevation:5,
    backgroundColor: 'white',
    paddingHorizontal: 10,
    marginTop: 20,
    borderRadius: 25,
    shadowColor: '#000',
  
  },
  headerImage: {
    width: '70%',
    height: '100%',
    borderRadius: 10,
    alignSelf: 'center',
    paddingBottom: 100
  },
  textInput: {
    backgroundColor: 'white',
    color: 'black',
  },
  loginButton: {
    marginTop: 20,
  },
  forgetPassword: {
    alignItems: 'flex-end',
    marginTop: 10,
  },
});

{
  /* <Text
            style={{
              fontSize: 35,
              fontWeight: 'bold',
              fontFamily: 'sans-serif-condensed',
              paddingBottom: 20,
            }}>
            Change Password
          </Text> */
}