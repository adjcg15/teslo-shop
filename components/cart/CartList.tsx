import { FC, useContext } from 'react';
import NextLink from 'next/link';

import { Box, Button, CardActionArea, CardMedia, Divider, Grid, Link, Typography } from '@mui/material';

import { ItemCounter } from '../ui';
import { CartContext } from '../../context';
import { ICartProduct, IOrderItem } from '../../interfaces';
import { currency } from '../../utils';

interface Props {
    editable?: boolean;
    products?: IOrderItem[];
}

export const CartList:FC<Props> = ({ editable = false, products }) => {
    const { cart, updateCardQuantity, removeCartProduct } = useContext(CartContext);

    const onNewQuantityValue = (product: ICartProduct, newQuantityValue: number) => {
        product.quantity = newQuantityValue;
        updateCardQuantity(product);
    }
    
    const productsToShow = products ? products : cart;

    return (
        <>
            <Divider sx={{ display: { md: 'none' }, mb: 6 }}/>
            {
                productsToShow.map(product => (
                    <Grid key={ product.slug + product.size }>
                        <Grid container spacing={2} sx={{ mb: 1 }}>
                            <Grid item xs={3}>
                                <NextLink href={`/product/${ product.slug }`} passHref>
                                    <Link>
                                        <CardActionArea>
                                            <CardMedia 
                                                image={ product.image }
                                                component='img'
                                                sx={{ borderRadius: '5px' }}
                                            />
                                        </CardActionArea>
                                    </Link>
                                </NextLink>
                            </Grid>

                            <Grid item xs={7}>
                                <Box display='flex' flexDirection='column'>
                                    <Typography variant='body1'>{ product.title }</Typography>
                                    <Typography variant='body1'>Talla: <strong>{ product.size }</strong></Typography>

                                    {
                                        editable 
                                        ? (
                                            <ItemCounter 
                                                currentValue={ product.quantity }
                                                maxValue={ 10 }
                                                updateQuantity={ (value) => onNewQuantityValue(product as ICartProduct, value) }
                                            />
                                        )
                                        : <Typography variant='h6'>{ product.quantity } { product.quantity > 1 ? 'artículos' : 'artículo' }</Typography>
                                    }
                                </Box>
                            </Grid>

                            <Grid item xs={2} display='flex' alignItems='center' flexDirection='column'>
                                <Typography>{currency.format(product.price)}</Typography>
                                {
                                    editable && (
                                        <Button 
                                            variant='text' 
                                            color='secondary'
                                            onClick={ () => removeCartProduct(product as ICartProduct) }
                                            sx={{ ':hover': { bgcolor: '#ffffff', color: '#2146ab' } }}
                                        >
                                            Remover
                                        </Button>
                                    )
                                }
                            </Grid>

                        </Grid>
                        <Divider sx={{ display: { md: 'none' }, mt: 6, mb: 4 }}/>
                    </Grid>
                ))
            }
        </>
    )
}
