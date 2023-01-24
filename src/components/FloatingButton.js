import React , {useState , useEffect} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import {FloatingAction} from 'react-native-floating-action';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function FloatingButton() {
  const actions = [
    {
      text: 'Use Camera',
      icon: <Ionicons name="camera-outline" size={20} color="white" />,
      name: 'use_Camera',
      position: 2,
      color: '#1C75BC',
      textColor: '#1C75BC',
      textElevation: 10,
    },
    {
      text: 'Use Gallery',
      icon: <Ionicons name="image-outline" size={20} color="white" />,
      name: 'use_Gallery',
      position: 1,
      color: '#1C75BC',
      textColor: '#1C75BC',
      textElevation: 10,
    },
  ];
  const [FloatingButtonText, setFloatingButtonText] = useState('SCAN');

  return (
    <SafeAreaView>
      <FloatingAction
        listenKeyboard={true}
        floatingIcon={
          <Text style={{color: 'white'}}>{FloatingButtonText}</Text>
        }
        showBackground={true}
        color="#1C75BC"
        actions={actions}
        onOpen={() => {
          setFloatingButtonText('CLOSE');
        }}
        onClose={() => {
          setFloatingButtonText('SCAN');
        }}
        onPressItem={name => {
          if (name === 'use_Camera') {
            navigation.navigate('ScanImage', 'camera');
          } else if (name === 'use_Gallery') {
            navigation.navigate('ScanImage', 'gallery');
          }
        }}
        onPressMain={() => {
          console.log(`Main Button`);
        }}
      />
    </SafeAreaView>
  );
}
