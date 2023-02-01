import AsyncStorage from '@react-native-async-storage/async-storage';

const storeToken = async (value) => {
    try {
        await AsyncStorage.setItem('token', value)
    } catch (error) {
        console.log(error)
    }
}

const getToken = async () => {
    try {
        const token = await AsyncStorage.getItem('token')
        if (token !== null) {
            return token
        }else {
            return null
        }
    } catch (error) {
        console.log(error)
    }
}
const removeToken = async (value) => {
    try {
        await AsyncStorage.removeItem(value)
    } catch (error) {
        console.log(error)
    }
}
const storeUser = async (value) => {
    try {
        await AsyncStorage.setItem('user', JSON.stringify(value))
    } catch (error) {
        console.log(error)
    }
}

const getUser = async () => {
    try {
        const user = await AsyncStorage.getItem('user')
        if (user !== null) {
            return JSON.parse(user)
        }else {
            return null
        }
    } catch (error) {
        console.log(error)
    }
}
const removeUser = async () => {
    try {
        await AsyncStorage.removeItem('user')
    } catch (error) {
        console.log(error)
    }
}

export { storeToken, getToken, removeToken  , storeUser , getUser , removeUser}
