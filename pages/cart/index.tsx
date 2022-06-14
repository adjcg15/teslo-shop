import { useContext, useEffect } from 'react';
import { useRouter } from 'next/router';

import { Box, Button, Card, CardContent, Divider, Grid, Typography } from '@mui/material';

import { CartList, OrderSummary } from '../../components/cart';
import { ShopLayout } from '../../components/layouts';
import { CartContext } from '../../context';

const CartPage = () => {
    const { isLoaded, cart } = useContext(CartContext);
    const router = useRouter();

    useEffect(() => {
        if(isLoaded && cart.length === 0) {
            router.replace('/cart/empty');
        }
    }, [isLoaded, cart, router]);

    if(!isLoaded || cart.length === 0) {
        return (<></>);
    }

    return (
        <ShopLayout 
            title='Carrito(2)' 
            pageDescription='Carrito de compras de la tienda'
        >
            <Typography variant='h1' component='h1' sx={{ mb: 2 }}>Carrito</Typography>

            <Grid container>
                <Grid item xs={12} md={7}>
                    <CartList editable />
                </Grid>

                <Grid item xs={12} md={5}>
                    <Card className='summary-card' sx={{ ml: 4 }}>
                        <CardContent>
                            <Typography variant='h2'>Orden</Typography>
                            <Divider sx={{ my: 1 }}/>

                            <OrderSummary />

                            <Box sx={{ mt: 3 }}>
                                <Button 
                                    size='medium' 
                                    color='secondary' className='circular-btn' 
                                    fullWidth
                                    href='/checkout/address'
                                >
                                    Checkout
                                </Button>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </ShopLayout>
    )
}

export default CartPage;