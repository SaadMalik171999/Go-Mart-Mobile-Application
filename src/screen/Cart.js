import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  Image,
  BackHandler,
  TouchableOpacity,
} from 'react-native';
import {useSelector} from 'react-redux';
import {FlatList} from 'react-native-gesture-handler';
import {Button} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {
  getAllOrder,
  updateOrder,
  removeOrder,
} from '../services/orderLocalStore';
import {SwipeListView} from 'react-native-swipe-list-view';
import useIsLoading from '../hooks/useIsLoader';

let updateQty = [];

export default function Cart({navigation}) {
  const [loader, showLoader, hideLoader] = useIsLoading();
  const [cartredItems, setCartedItem] = useState(null);
  const [totalPrice, setTotalPrice] = useState(0);

  const backAction = async () => {
    navigation.goBack();
    return true;
  };

  const setAllProducts = async () => {
    showLoader();
    let cartItems = await getAllOrder();
    setCartedItem(cartItems);
    calculateTotal(cartItems);
    hideLoader();
  };

  const updateProductQuantity = (newQty, id) => {
    updateQty = cartredItems.map(q =>
      q.productId === id ? {...q, productQuantity: newQty} : q,
    );

    calculateTotal(updateQty);
    setCartedItem(updateQty);
  };

  const calculateTotal = cartItems => {
    const amount =
      cartItems.length &&
      cartItems
        .map(item => item.productCompanyPrice * item.productQuantity)
        .reduce((prev, next) => prev + next);
    setTotalPrice(amount);
  };

  const updateAsync = () => {
    updateOrder(cartredItems);
  };

  useEffect(() => {
    updateAsync();
  }, [cartredItems]);

  useEffect(() => {
    setAllProducts();
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => {
      updateAsync();
      backHandler.remove();
    };
  }, []);

  const CartCard = ({item}) => {
    return (
      /////////// FOR DATA SHOWING IN CART /////////////////
      // <TouchableOpacity onPress={() => navigation.navigate('AboutItem', item)}>
        <View style={style.cartCard}>
          <Image
            source={{uri: item.productImage}}
            style={{height: 60, width: 60}}
          />
          <View
            style={{
              height: 100,
              marginLeft: 10,
              paddingVertical: 20,
              maxWidth: 150,
              flex: 1,
              justifyContent: 'center',
              // backgroundColor: 'green'
            }}>
            <Text style={{fontWeight: '700', fontSize: 14}}>
              {item.productName}
            </Text>
            <Text style={{fontSize: 12, color: 'grey'}}>
              {item.productCompanyName}
            </Text>
          </View>

          <View style={{alignItems: 'center', marginLeft: 28}}>
            <View style={style.actionContainer}>
              <TouchableOpacity
                onPress={() => {
                  updateProductQuantity(
                    item.productQuantity - 1,
                    item.productId,
                  );
                }}
                disabled={item.productQuantity == 1}
                style={[
                  style.actionBtn,
                  {
                    backgroundColor:
                      item.productQuantity > 1 ? '#1C75BC' : '#D3D3D3',
                  },
                ]}>
                <View>
                  <Icon name="remove" size={20} color="white" />
                </View>
              </TouchableOpacity>

              <Text
                style={{
                  fontWeight: 'bold',
                  fontSize: 18,
                  width: 50,
                  textAlign: 'center',
                }}>
                {item.productQuantity}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  updateProductQuantity(
                    item.productQuantity + 1,
                    item.productId,
                  );
                }}
                style={[style.actionBtn, {backgroundColor: '#1C75BC'}]}>
                <View>
                  <Icon name="add" size={20} color="white" />
                </View>
              </TouchableOpacity>
            </View>
            <Text style={{fontSize: 14, fontWeight: 'bold', marginTop: 10}}>
              Rs {(item.productCompanyPrice * item.productQuantity).toFixed(2)}
            </Text>
          </View>
        </View>
      // </TouchableOpacity>
    );
  };

  const cartItemRender = () => {
    return (
      <>
        {cartredItems?.length > 0 ? (
          <SwipeListView
            data={cartredItems}
            keyExtractor={item => `${item.productId}`}
            contentContainerStyle={{
              marginTop: 10,
              paddingHorizontal: 10,
              paddingBottom: 10,
            }}
            disableRightSwipr={true}
            rightOpenValue={-75}
            renderItem={(data, rowMap) => {
              return <CartCard item={data.item} />;
            }}
            renderHiddenItem={(data, rowMap) => {
              return (
                <View
                  style={{
                    // alignSelf: 'flex-end',
                    // marginLeft: 5,
                    flex: 1,
                    // backgroundColor: 'red',
                    alignItems: 'flex-end',
                    justifyContent: 'center',
                    marginHorizontal: 20,
                  }}>
                  <TouchableOpacity
                    onPress={() => {
                      let removeItem = [];
                      removeItem = cartredItems.filter(
                        item => item.productId !== data.item.productId,
                      );
                      setCartedItem(removeItem);
                      calculateTotal(removeItem);
                      removeOrder();
                    }}>
                    <View>
                      <Icon name="delete-outline" size={35} color="#054f4f" />
                    </View>
                  </TouchableOpacity>
                </View>
              );
            }}
          />
        ) : null}
      </>
    );
  };

  return (
    <SafeAreaView style={{backgroundColor: 'white', flex: 1}}>
      <View style={style.header}>
        <Icon name="arrow-back-ios" size={28} onPress={navigation.goBack} />
        <Text style={{fontSize: 20, fontWeight: 'bold'}}>Cart</Text>
      </View>

      {/* {loader ? (
        loader
      ) : ( */}
        <View>
          {cartItemRender()}
          <View
            style={{
              height: 150,
              alignItems: 'center',
              maxWidth: '100%',
              // justifyContent: 'center'
            }}>
            {console.log(totalPrice)}
            {totalPrice > 0 ? (
              <>
                <View
                  style={{
                    // maxWidth: '90%',
                    width: '100%',
                    flexDirection: 'row',
                    // backgroundColor: 'red',
                    justifyContent: 'space-around',
                    marginVertical: 15,
                  }}>
                  <Text style={{fontSize: 18, fontWeight: 'bold'}}>
                    Total Price
                  </Text>
                  <Text style={{fontSize: 18, fontWeight: 'bold'}}>
                    Rs. {totalPrice}/-
                  </Text>
                </View>
                <View style={{marginHorizontal: 30}}>
                  <Button
                    style={{
                      backgroundColor: '#1C75BC',
                      borderRadius: 30,
                      width: '80%',
                    }}
                    mode="contained"
                    onPress={() => {
                      navigation.navigate('ProductComparision');
                    }}>
                    PRODUCT COMPARISON
                  </Button>
                </View>
              </>
            ) : (
              <Text>No Items Added In Cart</Text>
            )}
          </View>
        </View>
      {/* )} */}
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
    elevation: 4,
    borderRadius: 10,
    backgroundColor: 'white',
    marginVertical: 10,
    marginHorizontal: 20,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
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
    width: 25,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
    // marginHorizontal: 20,
  },
});
