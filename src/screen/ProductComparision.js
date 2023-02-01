import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  Image,
  BackHandler,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import {useSelector} from 'react-redux';
import {FlatList, ScrollView, TextInput} from 'react-native-gesture-handler';
import {Button} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {SwipeListView} from 'react-native-swipe-list-view';
import {DataTable} from 'react-native-paper';
import {getAllOrder} from '../services/orderLocalStore';
import useIsLoading from '../hooks/useIsLoader';
const {width} = Dimensions.get('screen');
import {LineChart, BarChart} from 'react-native-chart-kit';
const cardWidth = width - 20;

function ProductComparision({navigation}) {
  const getProducts = useSelector(state => state.productInfo);

  const [loader, showLoader, hideLoader] = useIsLoading();
  const [gfresh, setGfresh] = useState([]);
  const [graphData, setGraphData] = useState([]);
  const [companyM, setCompanyM] = useState([]);
  const [companyN, setCompanyN] = useState([]);
  const [companyC, setCompanyC] = useState([]);
  const [companyS, setCompanyS] = useState([]);
  const [cartedProductSaad, setcartedProductSaad] = useState([]);

  const [total, setTotal] = useState({
    gfreshTotal: undefined,
    grocetriaTotal: undefined,
    foodigoTotal: undefined,
    smartTotal: undefined,
  });
  var cartSAAD = [];
  const getCartProducts = async () => {
    let cartedProduct = [];
    let cartItems = await getAllOrder();
    // console.log(cartItems, 'SAAD');
    const extractAllIds = cartItems.map(product => product.productName);

    if (getProducts.data.length) {
      getProducts.data.map(products => {
        if (extractAllIds.includes(products.productName)) {
          cartedProduct.push(products);
          cartedProductSaad.push(products);
        }
      });
      setGfresh(cartedProduct);
      removeOther(cartedProduct);
    }
  };

  //   console.log(cartedProductSaad, 'SAAD');

  const removeOther = async cartedProduct => {
    let gfreshCompany = [];
    let grocetriaCompany = [];
    let foodigoCompany = [];

    showLoader();
    cartedProduct.map(async (product, index) => {
      for (let i = 0; i < product.productCompany.length; i++) {
        if (product.productCompany[i].companyName === 'Gfresh') {
          gfreshCompany.push({
            productID: product._id,
            productName: product.productName,
            productCompany: product.productCompany[i].companyName,
            productPrice: product.productCompany[i].companyPrice,
            productStoke: product.productCompany[i].companyProductStock,
            productImage: product.productImage,
            productCategory: product.productCategory,
            productQuantity: index + 1,
          });
        } else if (product.productCompany[i].companyName === 'Groceteria') {
          grocetriaCompany.push({
            productID: product._id,
            productName: product.productName,
            productCompany: product.productCompany[i].companyName,
            productPrice: product.productCompany[i].companyPrice,
            productStoke: product.productCompany[i].companyProductStock,
            productImage: product.productImage,
            productCategory: product.productCategory,
            productQuantity: index + 1,
          });
        } else if (product.productCompany[i].companyName === 'Foodigo') {
          foodigoCompany.push({
            productID: product._id,
            productName: product.productName,
            productCompany: product.productCompany[i].companyName,
            productPrice: product.productCompany[i].companyPrice,
            productStoke: product.productCompany[i].companyProductStock,
            productImage: product.productImage,
            productCategory: product.productCategory,
            productQuantity: index + 1,
          });
        }
      }
    });

    setCompanyM(gfreshCompany);
    setCompanyN(grocetriaCompany);
    setCompanyC(foodigoCompany);

    const gfreshTotal = gfreshCompany
      ?.map(item => item.productPrice)
      .reduce((prev, next) => prev + next, 0);
    const grocetriaTotal = grocetriaCompany
      ?.map(item => item.productPrice)
      .reduce((prev, next) => prev + next, 0);
    const foodigoTotal = foodigoCompany
      ?.map(item => item.productPrice)
      .reduce((prev, next) => prev + next, 0);
    setTotal({
      gfreshTotal: gfreshTotal,
      grocetriaTotal: grocetriaTotal,
      foodigoTotal: foodigoTotal,
    });

    const graphDataSet = [
      {companyName: 'Gfresh', totalPrice: gfreshTotal},
      {companyName: 'Groceteria', totalPrice: grocetriaTotal},
      {companyName: 'Foodigo', totalPrice: foodigoTotal},
    ];

    setGraphData(graphDataSet);

    hideLoader();
  };

  useEffect(() => {
    getCartProducts();
  }, []);

  return (
    <SafeAreaView style={{backgroundColor: 'white', flex: 1}}>
      <View style={style.header}>
        <Icon name="arrow-back-ios" size={28} onPress={navigation.goBack} />
        <Text style={{fontSize: 20, fontWeight: 'bold'}}>
          Products Analysis
        </Text>
      </View>

      {loader ? (
        loader
      ) : (
        <ScrollView
          style={{marginTop: 20}}
          showsVerticalScrollIndicator={false}>
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
            <DataTable style={{marginHorizontal: 30}}>
              <DataTable.Header
                style={{
                  borderColor: 'gray',
                  borderWidth: 2,
                  height: 80,
                }}>
                <DataTable.Title
                  style={{
                    width: 200,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Text style={{fontWeight: 'bold', fontSize: 15}}>
                    Product Image
                  </Text>
                </DataTable.Title>
                <DataTable.Title
                  style={{
                    width: 200,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Text style={{fontWeight: 'bold', fontSize: 15}}>
                    Product Name
                  </Text>
                </DataTable.Title>
                <DataTable.Title
                  style={{
                    width: 200,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Text style={{fontWeight: 'bold', fontSize: 15}}>
                    Gfresh Company
                  </Text>
                </DataTable.Title>
                <DataTable.Title
                  style={{
                    width: 200,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Text style={{fontWeight: 'bold', fontSize: 15}}>
                    Groceteria Company
                  </Text>
                </DataTable.Title>
                <DataTable.Title
                  style={{
                    width: 200,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Text style={{fontWeight: 'bold', fontSize: 15}}>
                    Foodigo Company
                  </Text>
                </DataTable.Title>
              </DataTable.Header>

              {cartedProductSaad?.map((data, index) => {
                return (
                  <DataTable.Row
                    style={{borderColor: 'gray', borderWidth: 2}}
                    key={data._id}>
                    <React.Fragment key={data._id}>
                      <DataTable.Cell
                        style={{
                          width: 40,
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}>
                        <View
                          style={{
                            justifyContent: 'center',
                            alignItems: 'center',
                            // width: 100,
                          }}>
                          <Image
                            source={{uri: data?.productImage}}
                            style={{height: 60, width: 60}}
                          />
                        </View>
                      </DataTable.Cell>
                    </React.Fragment>
                    <React.Fragment key={data._id}>
                      <DataTable.Cell
                        style={{
                          width: 100,
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}>
                        <View
                          style={{
                            justifyContent: 'center',
                            alignItems: 'center',
                            width: 200,
                          }}>
                          {console.log}
                          <Text>{data?.productName}</Text>
                        </View>
                      </DataTable.Cell>
                    </React.Fragment>

                    <React.Fragment key={data._id}>
                      <DataTable.Cell
                        style={{
                          width: 40,
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}>
                        {data?.productCompany[0]?.companyName === 'Gfresh' && (
                          <View
                            style={{
                              justifyContent: 'center',
                              alignItems: 'center',
                            }}>
                            <Text>{data?.productCompany[0]?.companyPrice}</Text>
                          </View>
                        )}
                        {data?.productCompany[1]?.companyName === 'Gfresh' && (
                          <View
                            style={{
                              justifyContent: 'center',
                              alignItems: 'center',
                            }}>
                            <Text>{data?.productCompany[1]?.companyPrice}</Text>
                          </View>
                        )}
                        {data?.productCompany[2]?.companyName === 'Gfresh' && (
                          <View
                            style={{
                              justifyContent: 'center',
                              alignItems: 'center',
                            }}>
                            <Text>{data?.productCompany[2]?.companyPrice}</Text>
                          </View>
                        )}
                      </DataTable.Cell>
                    </React.Fragment>

                    <React.Fragment key={data._id}>
                      <DataTable.Cell
                        style={{
                          width: 40,
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}>
                        {data?.productCompany[0]?.companyName ===
                          'Groceteria' && (
                          <View
                            style={{
                              justifyContent: 'center',
                              alignItems: 'center',
                            }}>
                            <Text>{data?.productCompany[0]?.companyPrice}</Text>
                          </View>
                        )}

                        {data?.productCompany[1]?.companyName ===
                          'Groceteria' && (
                          <View
                            style={{
                              justifyContent: 'center',
                              alignItems: 'center',
                            }}>
                            <Text>{data?.productCompany[1]?.companyPrice}</Text>
                          </View>
                        )}

                        {data?.productCompany[2]?.companyName ===
                          'Groceteria' && (
                          <View
                            style={{
                              justifyContent: 'center',
                              alignItems: 'center',
                            }}>
                            <Text>{data?.productCompany[2]?.companyPrice}</Text>
                          </View>
                        )}
                      </DataTable.Cell>
                    </React.Fragment>

                    <React.Fragment key={data._id}>
                      <DataTable.Cell
                        style={{
                          width: 40,
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}>
                        {data?.productCompany[0]?.companyName === 'Foodigo' && (
                          <View
                            style={{
                              justifyContent: 'center',
                              alignItems: 'center',
                            }}>
                            <Text>{data?.productCompany[0]?.companyPrice}</Text>
                          </View>
                        )}

                        {data?.productCompany[1]?.companyName === 'Foodigo' && (
                          <View
                            style={{
                              justifyContent: 'center',
                              alignItems: 'center',
                            }}>
                            <Text>{data?.productCompany[1]?.companyPrice}</Text>
                          </View>
                        )}

                        {data?.productCompany[2]?.companyName === 'Foodigo' && (
                          <View
                            style={{
                              justifyContent: 'center',
                              alignItems: 'center',
                            }}>
                            <Text>{data?.productCompany[2]?.companyPrice}</Text>
                          </View>
                        )}
                      </DataTable.Cell>
                    </React.Fragment>
                  </DataTable.Row>
                );

                //   }
              })}

              <DataTable.Row
                style={{height: 60, borderColor: 'gray', borderWidth: 2}}>
                <DataTable.Cell
                  style={{
                    width: 10,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <View
                    style={{
                      width: 100,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Text></Text>
                  </View>
                </DataTable.Cell>

                <DataTable.Cell
                  style={{
                    width: 10,
                  }}>
                  <View
                    style={{
                      width: 100,
                    }}>
                    <Text style={{fontWeight: 'bold', fontSize: 15}}>
                      Total
                    </Text>
                  </View>
                </DataTable.Cell>

                <DataTable.Cell
                  style={{
                    width: 10,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <View
                    style={{
                      width: 100,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Text style={{fontWeight: 'bold', fontSize: 15}}>
                      Rs. {total.gfreshTotal}
                    </Text>
                  </View>
                </DataTable.Cell>

                <DataTable.Cell
                  style={{
                    width: 10,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <View
                    style={{
                      width: 100,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Text style={{fontWeight: 'bold', fontSize: 15}}>
                      Rs. {total.grocetriaTotal}
                    </Text>
                  </View>
                </DataTable.Cell>

                <DataTable.Cell
                  style={{
                    width: 10,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <View
                    style={{
                      width: 100,
                      justifyContent: 'center',
                      alignItems: 'center',
                      paddingLeft: 40,
                    }}>
                    <Text style={{fontWeight: 'bold', fontSize: 15}}>
                      Rs. {total.foodigoTotal}
                    </Text>
                  </View>
                </DataTable.Cell>
              </DataTable.Row>
            </DataTable>
          </ScrollView>
          {/* <View
            style={{
              marginHorizontal: 15,
              marginTop: 20,
              marginBottom: 10,
            }}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: '700',
                color: '#054f4f',
              }}>
              PRICE COMPARISON
            </Text>
          </View>
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <BarChart
              data={{
                labels: graphData.map(label => {
                  return label.companyName;
                }),
                datasets: [
                  {
                    data: graphData.map(data => {
                      return data.totalPrice;
                    }),
                  },
                ],
                legend: ['Product Price'], // optional
              }}
              width={Dimensions.get('window').width - 30} // from react-native
              height={200}
              fromZero={true}
              yAxisLabel="Rs."
              yAxisInterval={1} // optional, defaults to 1
              chartConfig={{
                backgroundColor: '#508484',
                backgroundGradientFrom: '#508484',
                backgroundGradientTo: '#9bb9b9',
                decimalPlaces: 0, // optional, defaults to 2dp
                color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                style: {
                  borderRadius: 16,
                },
                propsForDots: {
                  r: '4',
                  strokeWidth: '2',
                  stroke: '#054f4f',
                },
              }}
              bezier
              style={{
                marginVertical: 8,
                borderRadius: 16,
              }}
            />
          </View> */}
        </ScrollView>
      )}
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
});

export default ProductComparision;
