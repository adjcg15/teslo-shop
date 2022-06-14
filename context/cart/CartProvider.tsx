import React, { FC, useEffect, useReducer } from 'react';

import Cookie from 'js-cookie';

import { ICartProduct } from '../../interfaces';
import { CartContext, cartReducer } from './';

export interface CartState {
    isLoaded: boolean;
    cart: ICartProduct[];
    numberOfItems: number;
    subTotal: number;
    tax: number;
    total: number;
    shippingAddress?: ShippingAddress;
}

export interface ShippingAddress {
    firstName: string;
    lastName : string;
    address  : string;
    address2?: string;
    zip      : string;
    city     : string;
    country  : string;
    phone    : string;
}

const CART_INITIAL_STATE: CartState = {
    isLoaded: false,
    cart: [],
    numberOfItems: 0,
    subTotal: 0,
    tax: 0,
    total: 0,
    shippingAddress: undefined
}

interface Props {
    children?: React.ReactNode
}

export const CartProvider: FC<Props> = ({ children }) => {
    const [state, dispatch] = useReducer(cartReducer, CART_INITIAL_STATE);

    useEffect(() => {
        try {
            const cookieProducts = Cookie.get('cart') ? JSON.parse(Cookie.get('cart')!) : [];

            dispatch({
                type: '[Cart] - Load cart from storage',
                payload: cookieProducts
            });
        } catch (error) {
            dispatch({
                type: '[Cart] - Load cart from storage',
                payload: []
            });
        }
    }, []);

    useEffect(() => {
        if(Cookie.get('firstName') !== undefined) {
            const shippingAddress = {
                firstName: Cookie.get('firstName') || '',
                lastName : Cookie.get('lastName') || '',
                address  : Cookie.get('address') || '',
                address2 : Cookie.get('address2') || '',
                zip      : Cookie.get('zip') || '',
                city     : Cookie.get('city') || '',
                country  : Cookie.get('country') || '',
                phone    : Cookie.get('phone') || ''
            }
    
            dispatch({
                type: '[Cart] - Load address from cookies',
                payload: shippingAddress
            });
        }
    }, []);

    useEffect(() => {
        if(state.cart.length > 0) Cookie.set('cart', JSON.stringify(state.cart));
    }, [state.cart]);

    useEffect(() => {
        const numberOfItems = state.cart.reduce((prev, current) => current.quantity + prev, 0);
        const subTotal = state.cart.reduce((prev, current) => current.quantity * current.price + prev, 0);
        const taxRate = Number(process.env.NEXT_PUBLIC_TAX_RATE || 0);

        const orderSummary = {
            numberOfItems,
            subTotal,
            tax: subTotal * taxRate,
            total: subTotal * (1 + taxRate)
        }

        dispatch({
            type: '[Cart] - Update order summary',
            payload: orderSummary
        });
    }, [state.cart]);
    
    const addProductToCart = (product: ICartProduct) => {
        const productInCart = state.cart.some(prod => prod._id === product._id && prod.size === product.size);

        if(!productInCart) return dispatch({ 
            type: '[Cart] - Update products in cart', 
            payload: [...state.cart, product]
        });

        const updatedProducts = state.cart.map(prod => {
            if(prod._id !== product._id) return prod;
            if(prod.size !== product.size) return prod;

            prod.quantity += product.quantity;
            return prod;
        });

        dispatch({ 
            type: '[Cart] - Update products in cart', 
            payload: updatedProducts
        });
    }

    const updateCardQuantity = (product: ICartProduct) => {
        dispatch({
            type: '[Cart] - Change product quantity',
            payload: product
        });
    }

    const removeCartProduct = (product: ICartProduct) => {
        dispatch({
            type: '[Cart] - Remove product in cart',
            payload: product
        });
    }
    
    const updateAddress = (address: ShippingAddress) => {
        Cookie.set('firstName', address.firstName);
        Cookie.set('lastName', address.lastName);
        Cookie.set('address', address.address);
        Cookie.set('address2', address.address2 || '');
        Cookie.set('zip', address.zip);
        Cookie.set('city', address.city);
        Cookie.set('country', address.country);
        Cookie.set('phone', address.phone);

        dispatch({
            type: '[Cart] - Update shipping address',
            payload: address
        });
    }

    return (
        <CartContext.Provider value={{
            ...state,
            addProductToCart,
            updateCardQuantity,
            removeCartProduct,
            updateAddress
        }}>
            { children }
        </CartContext.Provider>
    )
}