import {
  Dimensions,
  Image,
  Text,
  View,
  StyleSheet,
  KeyboardAvoidingView,
} from 'react-native';
import {
  FlatList,
  ScrollView,
  TouchableOpacity,
} from 'react-native-gesture-handler';
import React from 'react';
import {categories} from '../utils/categories';

export default function listCategories() {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={style.categoriesListContainer}>
      {categories.map((category, index) => (
        <TouchableOpacity
          key={index}
          activeOpacity={0.8}
          onPress={() => setSelectedCategoryIndex(index)}>
          <View
            style={{
              backgroundColor:
                selectedCategoryIndex == index ? '#1C75BC' : '#00AEEF',
              ...style.categoryBtn,
            }}>
            <View style={style.categoryBtnImgCon}>
              <Image
                source={category.image}
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
                color: selectedCategoryIndex == index ? 'white' : 'black',
              }}>
              {category.name}
            </Text>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
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
    },
    categoryBtnImgCon: {
      height: 35,
      width: 35,
      backgroundColor: 'red',
      borderRadius: 30,
      justifyContent: 'center',
      alignItems: 'center',
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
  