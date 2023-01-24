import {
  Dimensions,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  BackHandler,
  Alert,
  KeyboardAvoidingView,
} from 'react-native';
import {
  FlatList,
  ScrollView,
  TextInput,
  TouchableHighlight,
  TouchableOpacity,
} from 'react-native-gesture-handler';
import React, {useEffect, useState} from 'react';
import TopSearchBar from '../components/TopSearchBar';
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
import {foods} from '../utils/food';
import {useDispatch, useSelector} from 'react-redux';
import {setProductInformation} from '../features/api/productReducerSlice';
import {categories} from '../utils/categories';
import Loader from '../components/Loader/loader';
import useIsLoading from '../hooks/useIsLoader';
import {interpolate} from 'react-native-reanimated';
import axios from 'axios';
import {baseURl} from '../utils/base_URL';

export default function DashBoard({navigation}) {
  const allProductState = useSelector(state => state.productInfo);

  const [loader, showLoader, hideLoader] = useIsLoading();
  const [searchText, setSearchText] = useState('');
  const [productData, setProductData] = useState([]);
  const [productCategory, setProductCategories] = useState([]);

  const dispatch = useDispatch();

  // const { data, error, isLoading, isSuccess } = useAllProductQuery();
  const getDataToModel = async () => {
    try {
      showLoader();
      const response = await axios.post(`${baseURl}allproductlist`,{
        "Content-Type": "application/json", Accept: "application/json"
      });
      if (response) {
        console.log(response);
      }
      // hideLoader();
    } catch (error) {
      console.log(error);
      return (
        <>
          <Text>Something Went Wrong</Text>
        </>
      );
    }
  };

  const getData = async () => {
    try {
      showLoader();
      const response = await axios.get(`${baseURl}finalproduct`,{
        "Content-Type": "application/json", Accept: "application/json"
      });
      if (response) {
        // console.log(response.data)
        dispatch(setProductInformation({data: response.data}));
        setProductData(response.data);
        let categories = [];
        let duplicate = [];
        response.data?.map(category => {
          if (!duplicate.includes(category.productCategory)) {
            duplicate.push(category.productCategory);
            categories.push({
              category: category.productCategory,
              image: category.productImage,
            });
          }
        });
        setProductCategories(categories);
      }
      hideLoader();
    } catch (error) {
      console.log(error);
      return (
        <>
          <Text>Something Went Wrong</Text>
        </>
      );
    }
  };

  const backAction = () => {
    BackHandler.exitApp();
    return true;
  };

  useEffect(() => {
    getDataToModel();
    getData();
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );
    return () => backHandler.remove();
  }, []);

  const openDrawer = () => {
    navigation.openDrawer();
  };

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

  const ListCategories = ({product}) => {
    const [selectedCategoryIndex, setSelectedCategoryIndex] = useState(false);

    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={style.categoriesListContainer}>
        {product?.map((category, index) => (
          <TouchableOpacity
            key={index}
            activeOpacity={0.8}
            onPress={() => {
              let categoryData = [];
              allProductState.data?.map(data => {
                if (data.productCategory === 'All') {
                  categoryData.push(data);
                } else if (data.productCategory === category.category) {
                  categoryData.push(data);
                }
              });
              setProductData(categoryData);
            }}>
            <View
              style={{
                ...style.categoryBtn,
                backgroundColor:
                  productData.length > 0
                    ? productData[0].productCategory == category.category
                      ? '#1C75BC'
                      : '#00AEEF'
                    : null,
              }}>
              <View style={style.categoryBtnImgCon}>
                <Image
                  source={{uri: category.image}}
                  style={{
                    height: 35,
                    width: 35,
                    resizeMode: 'cover',
                    borderRadius: 35 / 2,
                  }}
                />
              </View>
              <Text
                style={{
                  fontSize: 15,
                  fontWeight: 'bold',
                  marginLeft: 10,
                  color:
                    productData.length > 0
                      ? productData[0].productCategory == category.category
                        ? 'white'
                        : 'black'
                      : null,
                }}>
                {category.category}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    );
  };

  const Card = ({product}) => {
    return (
      <TouchableHighlight
        underlayColor="white"
        activeOpacity={0.9}
        onPress={() => navigation.navigate('AboutItem', product)}>
        <View style={style.card}>
          <View style={{alignItems: 'center', top: -20}}>
            <Image
              source={{uri: product.productImage}}
              style={{height: 80, width: 80, borderRadius: 80 / 2}}
            />
          </View>
          <View style={{marginHorizontal: 10}}>
            <Text
              numberOfLines={2}
              style={{fontSize: 14, fontWeight: 'bold', textAlign: 'center'}}>
              {product.productName}
            </Text>
            <Text style={{fontSize: 12, color: 'grey', textAlign: 'center'}}>
              {product.productCategory}
            </Text>
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
    <>
      <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
        <AppStatusBar
          backgroundColor={
            FloatingButtonText === 'SCAN' ? 'white' : '#00000099'
          }
          barStyle="dark-content"
          hidden={FloatingButtonText === 'SCAN' ? false : true}
        />
        <View style={style.header}>
          <Ionicons name="menu-outline" size={28} onPress={openDrawer} />
          <View style={style.inputContainer}>
            <Icon name="search" size={20} />
            <TextInput
              style={{flex: 1, fontSize: 18}}
              placeholder="Search grocery"
              onChangeText={text => {
                let tempData = allProductState.data.filter(item => {
                  return (
                    item.productName.toLowerCase().indexOf(text.toLowerCase()) >
                    -1
                  );
                });
                setSearchText(text);
                setProductData(tempData);
              }}
              value={searchText}
            />
            {searchText ? (
              <TouchableOpacity
                onPress={() => {
                  setProductData(allProductState.data);
                  setSearchText('');
                }}>
                <View>
                  <Ionicons
                    name="md-close-circle-sharp"
                    size={20}
                    color="#1C75BC"
                  />
                </View>
              </TouchableOpacity>
            ) : null}
          </View>
          <View style={{marginLeft: 5}}>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('Cart');
                // navigation.navigate('AllSearchProducts');
              }}>
              <View>
                <Ionicons name="cart-outline" size={30} color="#1C75BC" />
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {searchText ? (
          <React.Fragment>
            <View style={{marginLeft: 20, marginTop: 0}}>
              <View>
                {productData.length > 0 ? (
                  <Text style={{fontSize: 18}}>
                    Search For{' '}
                    <Text style={{color: '#1C75BC'}}>{searchText}</Text>
                  </Text>
                ) : (
                  <Text style={{fontSize: 18}}>
                    No Product Found:{' '}
                    <Text style={{color: '#1C75BC'}}>{searchText}</Text>
                  </Text>
                )}
              </View>
              <View></View>
            </View>
          </React.Fragment>
        ) : null}

        {searchText ? null : (
          <React.Fragment>
            <View style={style.sliderContainer}>
              <Swiper
                autoplay
                horizontal={false}
                height={200}
                activeDotColor="#1C75BC">
                <View style={style.slide}>
                  <Image
                    source={require('../assets/images/c1.jpg')}
                    resizeMode="cover"
                    style={style.sliderImage}
                  />
                </View>
                <View style={style.slide}>
                  <Image
                    source={require('../assets/images/c2.jpg')}
                    resizeMode="cover"
                    style={style.sliderImage}
                  />
                </View>
                <View style={style.slide}>
                  <Image
                    source={require('../assets/images/c3.jpg')}
                    resizeMode="cover"
                    style={style.sliderImage}
                  />
                </View>
              </Swiper>
            </View>

            <View
              style={{
                marginTop: 20,
                flexDirection: 'row',
                paddingHorizontal: 20,
              }}></View>
            <View>
              <ListCategories product={productCategory} />
            </View>
          </React.Fragment>
        )}
        {loader ? (
          loader
        ) : (
          <FlatList
            showsVerticalScrollIndicator={false}
            data={productData}
            renderItem={({item, index}) => <Card product={item} />}
            key={'_'}
            keyExtractor={item => '_' + item._id}
            numColumns={3}
          />
        )}

        <FloatingAction
          listenKeyboard={false}
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
          // onPressMain={() => {
          //   setFloatButtonClick(!floatButtonClick);
          //   console.log(`Main Button`);
          // }}
        />
      </SafeAreaView>
    </>
  );
}

const style = StyleSheet.create({
  header: {
    paddingVertical: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
  },
  details: {
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 60,
    backgroundColor: 'red',
    borderTopRightRadius: 40,
    borderTopLeftRadius: 40,
  },
  inputContainer: {
    // flex: 2,
    width: searchInputWidth,
    height: 40,
    backgroundColor: 'red',
    borderRadius: 10,
    flexDirection: 'row',
    backgroundColor: '#E5E5E5',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginHorizontal: 10,
  },

  sortBtn: {
    width: 50,
    height: 50,
    marginLeft: 10,
    backgroundColor: 'red',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoriesListContainer: {
    // paddingTop: 30,
    paddingBottom: 10,
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  categoryBtn: {
    height: 45,
    width: 120,
    marginRight: 7,
    borderRadius: 30,
    alignItems: 'center',
    paddingHorizontal: 5,
    flexDirection: 'row',
    shadowColor: '#000',
    borderColor: 'gray',
  },
  categoryBtnImgCon: {
    height: 35,
    width: 35,
    backgroundColor: 'red',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    height: 150,
    width: cardWidth,
    marginHorizontal: 10,
    marginBottom: 20,
    marginTop: 50,
    borderRadius: 15,
    elevation: 13,
    backgroundColor: 'white',
  },
  addToCartBtn: {
    height: 25,
    width: 25,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,
  },

  sliderContainer: {
    height: 200,
    width: '90%',
    // marginTop: 10,
    justifyContent: 'center',
    alignSelf: 'center',
    borderRadius: 8,
  },

  wrapper: {},

  slide: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'transparent',
    borderRadius: 8,
  },
  sliderImage: {
    height: '100%',
    width: '100%',
    alignSelf: 'center',
    borderRadius: 8,
  },
});
