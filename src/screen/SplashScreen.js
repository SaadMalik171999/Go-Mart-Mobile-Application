import { StyleSheet, Text, View, SafeAreaView, Image } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import React, { useState } from 'react';
import { useEffect } from 'react';
import TopSearchBar from '../components/TopSearchBar';
import AppStatusBar from '../components/AppStatusBar'
import { useNavigation } from '@react-navigation/native';
import { getToken, getUser } from '../services/authorizationToken';
import { baseURl } from '../utils/base_URL';
import { useDispatch, useSelector } from 'react-redux'
import { useLoggedInUserQuery } from '../services/userAuthentication'
import axios from 'axios';
import { setUserInformation } from '../features/api/userReducerSlice'


export default function SplashScreen() {
  const navigation = useNavigation();
  const dispatch = useDispatch()

  




  useEffect(() => {
    getUserDetails();
  }, []);


  getUserDetails = async () => {
    let screen;
    const token = await getToken()
    if (token) {
      const user =  await getUser()
      console.log(user)
      dispatch(setUserInformation({ name: user.name, email: user.email }))
      screen = 'SideDrawer';
    } else {
      screen = 'Login';
    }

    setTimeout(() => {
      navigation.navigate(screen)
    }, 3000);
  };





  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <AppStatusBar backgroundColor='white' barStyle="dark-content" hidden={true} />
      <View style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        // alignSelf: 'center'
      }}>
        <Image
          style={styles.headerImage}
          source={require('../assets/images/logo.png')}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    width: '70%',
    height: 190,
    borderRadius: 10,
    alignSelf: 'center',
  },
});
