import { ICartProduct } from '../../interfaces';
import { CartState, ShippingAddress } from './';

interface OrderSummary {
    numberOfItems: number;
    subTotal: number;
    tax: number;
    total: number;
}

type CartActionType = 
    | { type: '[Cart] - Load cart from storage', payload: ICartProduct[] }
    | { type: '[Cart] - Update products in cart', payload: ICartProduct[] }
    | { type: '[Cart] - Change product quantity', payload: ICartProduct }
    | { type: '[Cart] - Remove product in cart', payload: ICartProduct }
    | { type: '[Cart] - Update order summary', payload: OrderSummary }
    | { type: '[Cart] - Load address from cookies', payload: ShippingAddress }
    | { type: '[Cart] - Update shipping address', payload: ShippingAddress }

export const cartReducer = (state: CartState,  action: CartActionType): CartState => {
    switch(action.type) {
        case '[Cart] - Load cart from storage':
            return {
                ...state,
                isLoaded: true,
                cart: [...action.payload]
            }
        case '[Cart] - Update products in cart':
            return {
                ...state,
                cart: [...action.payload]
            }
        case '[Cart] - Change product quantity':
            return {
                ...state,
                cart: state.cart.map(product => {
                    if(product._id !== action.payload._id) return product;
                    if(product.size !== action.payload.size) return product;

                    return action.payload;
                })
            }
        case '[Cart] - Remove product in cart':
            return {
                ...state,
                cart: state.cart.filter(product => !(product._id === action.payload._id && product.size === action.payload.size))
            }
        case '[Cart] - Update order summary':
            return {
                ...state,
                ...action.payload
            }
        case '[Cart] - Load address from cookies':
        case '[Cart] - Update shipping address':
            return {
                ...state,
                shippingAddress: action.payload
            }
        default:
            return state;
    }
}