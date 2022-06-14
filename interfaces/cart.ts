import { ISize } from './';

export interface ICartProduct {
    _id: string;
    title: string;
    size?: ISize;
    quantity: number;
    slug: string;
    image: string;
    price: number;
    gender: 'men'|'women'|'kid'|'unisex';
}