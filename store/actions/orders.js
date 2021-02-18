import Product from "../../models/product";
import {SET_PRODUCTS} from "./products";
import Order from "../../models/order";

export const ADD_ORDER = 'ADD_ORDER';
export const SET_ORDERS = "SET_ORDERS"


export const fetchOrders = () => {
    return async (dispatch) => {
        // Here we can do async code
        try {
            const response = await fetch("https://someurl2")

            if (!response.ok)
                throw new Error("something went wrong")

            const data = await response.json()

            const loadedOrders = []

            for (const key in data) {
                loadedOrders.push(
                    new Order(
                        key,
                        data[key].cartItems,
                        data[key].totalAmount,
                        new Date(data[key].date)
                    )
                )
            }

            dispatch({
                type: SET_ORDERS,
                orders: loadedOrders
            })
        } catch (e) {
            // send to custom analytics
            throw new Error("Something went wrong")
        }
    }
}

export const addOrder = (cartItems, totalAmount) => {
    return async (dispatch) => {
        const date = new Date()

        // Here we can do async code
        const response = await fetch("https://someurl", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                cartItems,
                totalAmount,
                date: date.toISOString()
            })
        })

        const data = await response.json()

        if (!response.ok)
            throw Error("Something went wrong")

        dispatch({
            type: ADD_ORDER,
            orderData: {
                id: data.name,
                items: cartItems,
                amount: totalAmount,
                date: date
            }
        })
    }

    return {
        type: ADD_ORDER,
        orderData: {items: cartItems, amount: totalAmount}
    };
};
