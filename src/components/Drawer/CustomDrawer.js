import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  ImageBackground,
  TouchableOpacity,
} from 'react-native';
import {
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
} from '@react-navigation/drawer';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useDispatch, useSelector} from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import {
  removeToken,
  removeUser,
  getUser,
} from '../../services/authorizationToken';
import {removeOrder} from '../../services/orderLocalStore';

export default function CustomDrawer({...props}) {
  const navigation = useNavigation();

  const userInfo = useSelector(state => state.userInfo);
  console.log(userInfo);

  const [userName, setUserName] = useState('');

  const handleLogout = async () => {
    await removeToken('token');
    await removeUser();
    removeOrder();
    navigation.navigate('Login');
  };

  const getName = () => {
    if (userInfo.name) {
      let matches = userInfo.name.match(/\b(\w)/g); // ['J','S','O','N']
      let firstLatters = matches.join(''); // JSON
      firstLatters = firstLatters.toUpperCase();
      setUserName(firstLatters);
    }
  };

  useEffect(() => {}, [userName]);

  useEffect(() => {
    getName();
  });

  return (
    <View style={{flex: 1}}>
      <DrawerContentScrollView
        {...props}
        contentContainerStyle={
          {
            //   backgroundColor: '#00AEEF',
          }
        }>
        <View
          style={{
            width: '100%',
            height: 200,
            borderBottomColor: '#ccc',
            borderBottomWidth: 1,
            backgroundColor: '#00AEEF',
            marginTop: -6,
          }}>
          <View
            style={{
              flexDirection: 'row',
              paddingLeft: 15,
              alignItems: 'flex-end',
              height: '100%',
              paddingBottom: 20,
            }}>
            <View>
              <View
                style={{
                  backgroundColor: 'red',
                  height: 100,
                  width: 100,
                  backgroundColor: '#D1D3D4',
                  borderRadius: 50,
                  //   borderWidth: 1,
                }}>
                <Text
                  style={{
                    marginLeft: 20,
                    marginTop: 20,
                    fontSize: 40,
                    fontWeight: 'bold',
                  }}>
                  {userName}
                </Text>
              </View>
              <Text style={{fontSize: 16, fontWeight: 'bold', width: '100%'}}>
                {userInfo.name}
              </Text>
              <Text
                numberOfLines={2}
                style={{fontSize: 16, fontWeight: 'bold', width: '100%'}}>
                {userInfo.email}
              </Text>
            </View>
          </View>
          <View style={{}}></View>
        </View>

        <View style={{backgroundColor: 'white', paddingTop: 10}}>
          <DrawerItemList {...props} />
        </View>

        <DrawerItem
          label="My Cart"
          Style={{
            backgroundColor: 'white',
          }}
          icon={({color, size}) => (
            <Ionicons color={color} size={18} name="ios-cart" />
          )}
          onPress={() => navigation.navigate('Cart')}
        />
        {/* <DrawerItem
          label="Change Password"
          Style={{
            backgroundColor: 'white',
          }}
          icon={({ color, size }) => (
            <Ionicons color={color} size={15} name={`ios-home`} />
          )}
          onPress={() => navigation.navigate('Landing')}
        /> */}
      </DrawerContentScrollView>
      <View
        style={{
          borderTopColor: '#ccc',
          borderTopWidth: 1,
          paddingVertical: 20,
          paddingHorizontal: 20,
        }}>
        <View>
          <TouchableOpacity onPress={handleLogout}>
            <View style={{flexDirection: 'row'}}>
              <Ionicons name="exit-outline" size={22} />
              <Text
                style={{
                  fontSize: 18,
                  fontFamily: 'Roboto-Medium',
                  fontWeight: '700',
                  marginLeft: 5,
                }}>
                Sign Out
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
