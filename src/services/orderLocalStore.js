import AsyncStorage from '@react-native-async-storage/async-storage';



export const storeOrder = (newOrder) => {
    let tempPrice;
    let product;

    if (newOrder) {
        tempPrice = newOrder.productCompany[0].companyPrice
        product = newOrder.productCompany[0]
        for (let j = 0; j < 3; ++j) {
            if (newOrder.productCompany[j].companyPrice < tempPrice) {
                tempPrice = newOrder.productCompany[j].companyPrice
                product = newOrder.productCompany[j]
            }
        }
        const newProduct = {
            productId: newOrder._id,
            productName: newOrder.productName,
            productImage: newOrder.productImage,
            productQuantity: 1,
            productCompanyId: product._id,
            productCompanyName: product.companyName,
            productCompanyStock: product.companyProductStock,
            productCompanyPrice: product.companyPrice
        }
        storeOneProduct(newProduct)
    }
}


const storeOneProduct = async (newOrder) => {
    try {
        let allOrder = await AsyncStorage.getItem('order');
        if (JSON.parse(allOrder) !== null) {
            let parseData = JSON.parse(allOrder)
            parseData.push(newOrder)
            await AsyncStorage.setItem('order', JSON.stringify(parseData));
        }
        else {
            allOrder = [newOrder];
            await AsyncStorage.setItem('order', JSON.stringify(allOrder));
        }


    } catch (error) {
        console.log(error)
    }

}


const getAllLeastProduct = (allCartedProducts) => {
    let tempPrice;
    let product;

    let order = []
    // debugger
    if (allCartedProducts.length) {

        for (let i = 0; i < allCartedProducts.length; i++) {
            tempPrice = allCartedProducts[i].productCompany[0].companyPrice
            product = allCartedProducts[i].productCompany[0]
            for (let j = 0; j < 3; ++j) {
                if (allCartedProducts[i].productCompany[j].companyPrice < tempPrice) {
                    tempPrice = allCartedProducts[i].productCompany[j].companyPrice
                    product = allCartedProducts[i].productCompany[j]
                }
            }

            // console.log(tempPrice , product)
            order.push({
                productId: allCartedProducts[i]._id,
                productName: allCartedProducts[i].productName,
                productImage: allCartedProducts[i].productImage,
                productQuantity: 1,
                productCompanyId: product._id,
                productCompanyName: product.companyName,
                productCompanyStock: product.companyProductStock,
                productCompanyPrice: product.companyPrice

            })
        }
    }

    return order
}

export const multipleProductStore = async (allCartedProducts) => {
    try {
        // debugger

        const sortedProducts = getAllLeastProduct(allCartedProducts)

        const allOrder = await AsyncStorage.getItem('order');
        if (allOrder !== null) {
            let parseData = JSON.parse(allOrder)
            const extractAllIds = parseData.map(product => product.productId)


            sortedProducts.map((newOrder) => {
                if (!extractAllIds.includes(newOrder.productId)) {
                    parseData.push(newOrder)
                }
            })


            await AsyncStorage.setItem('order', JSON.stringify(parseData));

        }
        else {
            await AsyncStorage.setItem('order', JSON.stringify(sortedProducts));
        }


    } catch (error) {

    }

}

export const updateOrder = async (updatedOrder) => {
    try {
        if (updatedOrder?.length) {
            await AsyncStorage.removeItem('order')

            console.log(updatedOrder)
            await AsyncStorage.setItem('order', JSON.stringify(updatedOrder))
            const AllOrder = await AsyncStorage.getItem('order')
            console.log(JSON.parse(AllOrder))
        }
    } catch (error) {
        console.log(error)
    }
}

export const getAllOrder = async () => {
    try {
        const AllOrder = await AsyncStorage.getItem('order')
        if (AllOrder !== null) {
            return JSON.parse(AllOrder)
        } else {
            return null
        }
    } catch (error) {
        console.log(error)
    }
}

export const removeOrder = async () => {
    try {
        await AsyncStorage.removeItem('order')
    } catch (error) {
        console.log(error)
    }
}

