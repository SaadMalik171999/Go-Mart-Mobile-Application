import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  Dimensions,
  BackHandler,
  TouchableOpacity,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {Colors, TextInput, Button} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useSelector} from 'react-redux';
const {width} = Dimensions.get('screen');
const cardWidth = width;

const CustomInput = ({imageResponse}) => {
  const navigation = useNavigation();

  const myData = useSelector(state => state.productInfo);

  const [inputs, setInputs] = useState([]);
  const [searchProducts, setSearchProducts] = useState([]);

  const addHandler = () => {
    const input = [];
    imageResponse?.map((value, index) => {
      console.log(value);
      input.push({
        key: index,
        value: value,
      });
    });

    setInputs(input);

    console.log(input);
  };

  const deleteHandler = key => {
    const input = inputs.filter((input, index) => index != key);
    setInputs(input);
  };

  const inputHandler = (text, key) => {
    const input = [...inputs];
    input[key].value = text;
    input[key].key = key;
    setInputs(input);
  };

  const addManually = () => {
    const manualInput = [...inputs];
    manualInput.push({
      key: 0,
      value: '',
    });
    setInputs(manualInput);
  };

  const backAction = () => {
    navigation.navigate('DashBoard');
    return true;
  };

  useEffect(() => {
    addHandler();
    console.log('HIIII');
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => {
      setInputs([]);
      backHandler.remove();
    };
  }, []);
  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={styles.container}>
        <View
          style={{
            marginVertical: 10,
          }}>
          <Text
            style={{
              marginHorizontal: 15,
              color: '#1C75BC',
              fontSize: 18,
              fontFamily: 'sans-serif-condensed',
              fontWeight: '700',
            }}>
            Searched Products:
          </Text>
          {inputs.length > 0 ? (
            inputs.map((input, key) => {
              return (
                <View
                  key={key}
                  style={{
                    justifyContent: 'center',
                    width: '100%',
                    alignSelf: 'center',
                    //   paddingVertical: 20,
                    flexDirection: 'row',
                  }}>
                  <TextInput
                    style={styles.textInput}
                    placeholder="Enter Product"
                    //   label="Email"
                    mode="outlined"
                    theme={{
                      colors: {
                        primary: '#1C75BC',
                        underlineColor: '#1C75BC',
                        background: 'white',
                      },
                      roundness: 10,
                    }}
                    value={input.value}
                    onChangeText={text => inputHandler(text, key)}
                  />

                  <TouchableOpacity
                    style={{
                      alignSelf: 'center',
                      marginLeft: 5,
                    }}
                    onPress={() => deleteHandler(key)}>
                    <View>
                      <Icon name="delete-outline" size={30} color="#1C75BC" />
                    </View>
                  </TouchableOpacity>
                </View>
              );
            })
          ) : (
            <View>
              <Text
                style={{
                  marginHorizontal: 15,
                  marginVertical: 20,
                  fontSize: 16,
                  alignSelf: 'center',
                }}>
                No Product Found:
              </Text>
            </View>
          )}
        </View>
        {inputs.length > 0 ? (
          <Button
            style={{
              backgroundColor: '#1C75BC',
              borderRadius: 30,
              width: '50%',
              alignSelf: 'center',
              // marginBottom: 10,
            }}
            mode="contained"
            onPress={() => {
              const data = [];

              inputs.map(values => {
                console.log(values.value);
                data.push(values.value);
              });

              let searchProductData = [];
              for (let i = 0; i < data.length; i++) {
                console.log(data.length);
                myData.data.filter(item => {
                  if (
                    item.productName
                      .toLowerCase()
                      .indexOf(data[i].toLowerCase()) > -1
                  ) {
                    searchProductData = [...searchProductData, item];
                  }
                });
              }

              console.log(data);
              console.log(searchProductData);
              navigation.navigate('AllSearchProducts', searchProductData);
            }}>
            Search Product
          </Button>
        ) : null}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-evenly',
            alignItems: 'center',
            margin: 10,
            // backgroundColor: '#cddcdc',
            backgroundColor: '#dae5e5',
            borderRadius: 15,
            padding: 10,
            width: cardWidth - 50,
          }}>
          <Text
            style={{
              fontWeight: '700',
              color: '#1C75BC',
              fontSize: 16,
              // backgroundColor: 'red',
              marginBottom: 7,
            }}>
            Add Products Manually:
          </Text>
          <Button
            style={{
              width: '20%',
              alignSelf: 'center',
              borderWidth: 1,
              borderColor: '#1C75BC',
              borderRadius: 10,
            }}
            mode="Outlined"
            color="#1C75BC"
            onPress={() => {
              addManually();
            }}>
            ADD
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default CustomInput;
const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    marginHorizontal: 10,
    // borderColor: '#E5E5E5',
    width: cardWidth,
    // borderWidth: 1,
    borderRadius: 50,
    backgroundColor: 'white',
    alignSelf: 'center',
    // elevation: 3,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  textInput: {
    color: 'black',
    width: '85%',
  },
});
