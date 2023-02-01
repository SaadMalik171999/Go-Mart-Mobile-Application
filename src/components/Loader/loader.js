import React, {useState} from 'react';
import {Alert, Modal, StyleSheet, Text, Pressable, View} from 'react-native';
import LottieView from 'lottie-react-native';
import AppStatusBar from '../AppStatusBar';
import {SafeAreaView} from 'react-native-safe-area-context';

export default function Loader() {
  return (
    <View style={styles.centeredView}>
      <LottieView
        style={{height: 100}}
        source={require('../../assets/lottie/loader.json')}
        autoPlay
        loop
      />
      <View>
        <Text>Please wait for a few seconds</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
