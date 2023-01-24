import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Dimensions,
  View,
  Text,
  Image,
  ImageBackground,
  BackHandler,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import {Button} from 'react-native-paper';
import {ScrollView} from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AppStatusBar from '../components/AppStatusBar';
const {width} = Dimensions.get('screen');
import {LineChart, BarChart} from 'react-native-chart-kit';
import {setCartInformation} from '../features/api/cartReducerSlice';
import {
  storeOrder,
  removeOrder,
  getAllOrder,
} from '../services/orderLocalStore';
import {useDispatch, useSelector} from 'react-redux';
const cardWidth = width - 20;

export default function AboutItem({navigation, route}) {
  const item = route.params;
  const dispatch = useDispatch();

  const [minPrice, seMinPrice] = useState(0);
  const [checkDisabled, setCheckDisabled] = useState(false);

  const getLowestPrice = () => {
    let temp;
    item.productCompany.map((data, index) => {
      temp = item.productCompany[0].companyPrice;
      if (data.companyPrice < temp) {
        temp = data.companyPrice;
      }
    });

    seMinPrice(temp);
    checkDisabledFun();
  };

  const checkDisabledFun = async () => {
    // removeOrder()
    const checkOrder = await getAllOrder();
    if (checkOrder !== null) {
      console.log(checkOrder);
      checkOrder.map(orderData => {
        if (orderData.productId === item._id) {
          setCheckDisabled(true);
        }
      });
    } else {
      console.log(checkOrder);
    }
  };

  const backAction = () => {
    navigation.goBack();
    return true;
  };
  useEffect(() => {
    getLowestPrice();
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, []);

  const ChartSection = () => {
    return (
      <View>
        {item.productCompany.length > 0 ? (
          <View
            style={{
              marginTop: 20,
              marginHorizontal: 10,
              borderColor: '#E5E5E5',
              width: cardWidth,
              borderWidth: 1,
              borderRadius: 15,
              backgroundColor: '#E5E5E5',
              alignSelf: 'center',
              elevation: 3,
              marginBottom: 10,
            }}>
            <View
              style={{
                marginHorizontal: 15,
                marginTop: 20,
                marginBottom: 10,
              }}>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: '700',
                  color: '#1C75BC',
                }}>
                PRODUCTS COMPARISON
              </Text>
            </View>
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <BarChart
                data={{
                  labels: item.productCompany.map(label => {
                    return label.companyName;
                  }),
                  datasets: [
                    {
                      data: item.productCompany.map(price => {
                        return price.companyPrice;
                      }),
                    },
                  ],
                  legend: ['Product Price'], // optional
                }}
                width={Dimensions.get('window').width - 30} // from react-native
                height={200}
                // fromZero = {true}
                yAxisLabel="Rs. "
                yAxisInterval={1} // optional, defaults to 1
                chartConfig={{
                  backgroundColor: '#00AEEF',
                  backgroundGradientFrom: '#00AEEF',
                  backgroundGradientTo: '#1C75BC',
                  decimalPlaces: 0, // optional, defaults to 2dp
                  color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                  labelColor: (opacity = 1) =>
                    `rgba(255, 255, 255, ${opacity})`,
                  style: {
                    borderRadius: 16,
                  },
                  propsForDots: {
                    r: '4',
                    strokeWidth: '2',
                    stroke: '#1C75BC',
                  },
                }}
                bezier
                style={{
                  marginVertical: 8,
                  borderRadius: 16,
                }}
              />
            </View>
          </View>
        ) : null}
      </View>
    );
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <View>
        <AppStatusBar
          hidden={true}
          backgroundColor="white"
          barStyle="dark-content"
        />
        <View style={{backgroundColor: 'white'}}>
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              height: 220,
              backgroundColor: 'white',
            }}>
            <ImageBackground
              source={{uri: item.productImage}}
              style={{height: '100%', width: '100%', marginTop: 1}}>
              <View style={style.crossBackBtn}>
                <Ionicons
                  name="close"
                  size={28}
                  color="#1C75BC"
                  onPress={navigation.goBack}
                />
              </View>
            </ImageBackground>
          </View>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingHorizontal: 10,
              paddingTop: 10,
              paddingBottom: 6,
            }}>
            <View>
              <Text style={style.itemName}>{item.productName}</Text>
              <Text style={style.itemCompany}>{item.productCategory}</Text>
            </View>
            <Text style={style.itemPrice}>{`Min Rs. ${minPrice}`}</Text>
          </View>
          <View>
            <View
              style={{
                borderBottomColor: 'white',
                borderWidth: 0.5,
                width: '90%',
                alignSelf: 'center',
              }}></View>
          </View>
        </View>
      </View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{paddingBottom: 10}}>
        <View>
          <ChartSection />
        </View>
        <View
          style={{
            marginTop: 20,
            marginHorizontal: 10,
            borderColor: '#E5E5E5',
            width: cardWidth,
            borderWidth: 1,
            borderRadius: 15,
            backgroundColor: '#E5E5E5',
            alignSelf: 'center',
            elevation: 3,
            marginBottom: 10,
          }}>
          <View
            style={{
              marginHorizontal: 15,
              // marginVertical: 20,
              marginTop: 20,
              marginBottom: 10,
            }}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: '700',
                color: '#1C75BC',
              }}>
              AVAILABLE PRODUCTS
            </Text>
            <Text>In Different Platform:</Text>
          </View>
          <View>
            {item.productCompany?.map((companyData, index) => {
              return (
                <View key={index}>
                  {companyData.companyName ? (
                    <>
                      <View style={style.cartCard}>
                        <Image
                          source={{uri: item.productImage}}
                          style={{height: 50, width: 50, borderRadius: 60 / 2}}
                        />
                        <View
                          style={{
                            height: 100,
                            marginLeft: 10,
                            paddingVertical: 20,
                            flex: 1,
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                          }}>
                          <View>
                            <Text style={{fontWeight: 'bold', fontSize: 14}}>
                              {companyData?.companyName}
                            </Text>
                            <Text style={{fontSize: 14, color: 'grey'}}>
                              {` Stock: ${companyData?.companyProductStock}`}
                            </Text>
                          </View>
                          <Text style={{fontSize: 15, fontWeight: 'bold'}}>
                            Rs.{companyData?.companyPrice}
                          </Text>
                        </View>
                        <View
                          style={{
                            justifyContent: 'space-between',
                            alignItems: 'center',
                          }}></View>
                      </View>
                    </>
                  ) : null}
                </View>
              );
            })}
          </View>
          <View
            style={{
              // marginHorizontal: 60,
              marginVertical: 20,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Button
              style={{
                backgroundColor: '#1C75BC',
                borderRadius: 30,
                width: '50%',
              }}
              disabled={checkDisabled}
              mode="contained"
              onPress={() => {
                storeOrder(item);

                setCheckDisabled(true);
              }}>
              ADD TO CART
            </Button>
          </View>
        </View>
      </ScrollView>
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

  crossBackBtn: {
    margin: 20,
    height: 30,
    width: 30,
    borderRadius: 20,
    backgroundColor: '#E5E5E5',
    justifyContent: 'center',
    alignItems: 'center',
  },

  title: {color: 'white', fontWeight: 'bold', fontSize: 18},
  btnContainer: {
    backgroundColor: 'green',
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },

  itemName: {
    maxWidth: '70%',
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
    marginLeft: 15,
    marginVertical: 10,
    marginTop: 0,
  },
  itemCompany: {
    fontSize: 12,
    // fontWeight: 'bold',
    color: 'gray',
    marginLeft: 15,
    marginVertical: 10,
    marginTop: -10,
    color: '#1C75BC',
    fontWeight: 'bold',
  },
  itemPrice: {
    fontSize: 15,
    fontWeight: 'bold',
    marginVertical: 10,
    color: 'black',
    // marginLeft: 15,
    marginTop: -20,
  },
  cartCard: {
    height: 80,
    elevation: 2,
    borderRadius: 10,
    backgroundColor: 'white',
    marginVertical: 5,
    marginHorizontal: 10,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionBtn: {
    width: 200,
    // height: 50,
    borderColor: 'red',
    borderWidth: 1,
    borderRadius: 30,
    paddingVertical: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignContent: 'center',
  },
});
