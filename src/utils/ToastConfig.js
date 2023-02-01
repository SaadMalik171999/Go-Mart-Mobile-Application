import React from 'react';
import {StyleSheet, View, Text} from 'react-native';
export const toastConfig = {
  warning: ({text1, props}) => (
    <View
      style={{
        height: 40,
        width: '70%',
        backgroundColor: '#ffa6a6',
        padding: 10,
        borderRadius: 15,
      }}>
      <Text style={{fontWeight: '700', alignSelf: 'center'}}>{text1}</Text>
      <Text>{props.uuid}</Text>
    </View>
  ),
  done: ({text1, props}) => {
    return (
      <View
        style={{
          height: 40,
          width: '50%',
          padding: 10,
          borderRadius: 15,
          backgroundColor: '#1affc6',
        }}>
        <Text style={{fontWeight: '700', alignSelf: 'center'}}>{text1}</Text>
        <Text>{props.uuid}</Text>
      </View>
    );
  },
};
