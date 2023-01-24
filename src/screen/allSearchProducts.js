import {
  Dimensions,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  BackHandler,
  Alert,
  Pressable,
  KeyboardAvoidingView,
  TouchableHighlight,
  TouchableOpacity,
} from 'react-native';
import {FlatList, ScrollView, TextInput} from 'react-native-gesture-handler';
import React, {useEffect, useState} from 'react';
import {Button} from 'react-native-paper';
import {FloatingAction} from 'react-native-floating-action';
import FloatingButton from '../components/FloatingButton';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AppStatusBar from '../components/AppStatusBar';
import Swiper from 'react-native-swiper';
const {width} = Dimensions.get('screen');
import {useScanListMutation} from '../services/userAuthentication';
import {useAllProductQuery} from '../services/userAuthentication';
const cardWidth = width / 3 - 20;
const searchInputWidth = width / 1.4;
import {useDispatch, useSelector} from 'react-redux';
import {setProductInformation} from '../features/api/productReducerSlice';
import {categories} from '../utils/categories';
import Loader from '../components/Loader/loader';
import useIsLoading from '../hooks/useIsLoader';
import {interpolate} from 'react-native-reanimated';
import axios from 'axios';
import {baseURl} from '../utils/base_URL';
import {foods} from './Cart';
import {local} from '../utils/localSer';
import {multipleProductStore, removeOrder} from '../services/orderLocalStore';

export default function AllSearchProducts({navigation, route}) {
  const searchProducts = route.params;

  const [allSearchProducts, setAllSearchProducts] = useState(searchProducts);

  const backAction = () => {
    navigation.goBack();
    return true;
  };

  useEffect(() => {
    if (allSearchProducts?.length === 0) {
      navigation.navigate('DashBoard');
    }
  }, [allSearchProducts]);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, []);

  const CartCard = ({item}) => {
    const [minPrice, seMinPrice] = useState(0);
    const getLowestPrice = () => {
      let temp;
      item.productCompany.map((data, index) => {
        temp = Number(item.productCompany[0].companyPrice);
        if (Number(data.companyPrice) < temp) {
          temp = Number(data.companyPrice);
        }
      });
      seMinPrice(temp);
    };
    useEffect(() => {
      getLowestPrice();
    }, []);

    return (
      <TouchableHighlight
        underlayColor="white"
        activeOpacity={0.9}
        onPress={() => navigation.navigate('AboutItem', item)}>
        <View style={style.card}>
          <View style={{alignItems: 'center', top: -20}}>
            <Image
              source={{uri: item.productImage}}
              style={{height: 80, width: 80, borderRadius: 80 / 2}}
            />
          </View>
          <View style={{marginHorizontal: 10}}>
            <Text style={{fontSize: 12, color: 'grey', textAlign: 'center'}}>
              {item.productCategory}
            </Text>
            <Text
              numberOfLines={2}
              style={{fontSize: 14, fontWeight: 'bold', textAlign: 'center'}}>
              {item.productName}
            </Text>
            <TouchableOpacity
              style={[style.actionBtn]}
              activeOpacity={0.8}
              onPress={() => {
                console.log('SS');

                const removeItem = allSearchProducts.filter(
                  element => element._id != item._id,
                );
                setAllSearchProducts(removeItem);
              }}>
              {/* <View>
                <Text>REMOVE</Text>
              </View> */}
              <View>
                <Icon name="delete-outline" size={25} color="#1C75BC" />
              </View>
            </TouchableOpacity>
          </View>
          <View
            style={{
              marginHorizontal: 10,
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            {/* <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
              ${food.price}
            </Text> */}
          </View>
        </View>
      </TouchableHighlight>
    );
  };

  return (
    <SafeAreaView style={{backgroundColor: 'white', flex: 1}}>
      <View style={style.header}>
        <Icon name="arrow-back-ios" size={28} onPress={navigation.goBack} />
        <Text style={{fontSize: 20, fontWeight: 'bold'}}>Search Products</Text>
      </View>
      <FlatList
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: 40}}
        data={allSearchProducts}
        renderItem={({item}) => <CartCard item={item} />}
        ListFooterComponentStyle={{paddingHorizontal: 20}}
        numColumns={3}
        ListFooterComponent={() => (
          <View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
              }}>
              <Button
                style={{
                  backgroundColor: '#1C75BC',
                  borderRadius: 10,
                  width: '70%',
                }}
                mode="contained"
                onPress={() => {
                  multipleProductStore(allSearchProducts);
                  navigation.navigate('DashBoard');
                }}>
                ADD TO CART
              </Button>
            </View>
            <View style={{marginHorizontal: 30}}>
              {/* <button title="CHECKOUT" /> */}
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const style = StyleSheet.create({
  header: {
    paddingVertical: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
  },
  cartCard: {
    height: 80,
    elevation: 10,
    borderRadius: 10,
    backgroundColor: 'white',
    marginVertical: 10,
    marginHorizontal: 20,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  card: {
    height: 180,
    width: cardWidth,
    marginHorizontal: 10,
    marginBottom: 20,
    marginTop: 50,
    borderRadius: 15,
    elevation: 13,
    backgroundColor: 'white',
  },
  actionContainer: {
    // backgroundColor:'green',
    flexDirection: 'row',
    justifyContent: 'center',
    alignContent: 'center',
    marginTop: 10,
  },
  actionBtn: {
    height: 25,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
});
