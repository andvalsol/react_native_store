import Product from "../../models/product";

export const DELETE_PRODUCT = 'DELETE_PRODUCT';
export const CREATE_PRODUCT = 'CREATE_PRODUCT';
export const UPDATE_PRODUCT = 'UPDATE_PRODUCT';
export const SET_PRODUCTS = "SET_PRODUCTS"
import {useDispatch} from "react-redux"

export const deleteProduct = productId => {
    return {type: DELETE_PRODUCT, pid: productId};
};

export const fetchProducts = () => {
    // Fetch the products from the network

    return async (dispatch) => {
        // Here we can do async code
        try {
            const response = await fetch("https://someurl")

            if (!response.ok)
                throw new Error("something went wrong")

            const data = await response.json()

            const loadedProducts = []

            for (const key in data) {
                loadedProducts.push(
                    new Product(key, "u1", data[key].title, data[key].imageUrl), data[key].description, data[key].price
                )
            }

            dispatch({
                type: SET_PRODUCTS,
                products: loadedProducts
            })
        } catch (e) {
            // send to custom analytics
            throw new Error("Something went wrong")
        }
    }
}

export const createProduct = (title, description, imageUrl, price) => {
    return async (dispatch) => {
        // Here we can do async code
        const response = await fetch("https://someurl", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                title,
                description,
                imageUrl,
                price
            })
        })

        const data = await response.json()

        dispatch({
            type: CREATE_PRODUCT,
            productData: {
                id: data.name,
                title,
                description,
                imageUrl,
                price
            }
        })
    }
};

export const updateProduct = (id, title, description, imageUrl) => {
    return async (dispatch) => {
        // Update the data
        await fetch("https://someurl", {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                title,
                description,
                imageUrl
            })
        })

        dispatch({
            type: UPDATE_PRODUCT,
            pid: id,
            productData: {
                title,
                description,
                imageUrl,
            }
        })
    }
};
