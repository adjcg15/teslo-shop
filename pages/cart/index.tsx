import { useContext, useEffect } from 'react';
import { useRouter } from 'next/router';

import { Box, Button, Card, CardContent, Divider, Grid, Typography } from '@mui/material';

import { CartList, OrderSummary } from '../../components/cart';
import { ShopLayout } from '../../components/layouts';
import { CartContext } from '../../context';

const CartPage = () => {
    const { isLoaded, cart, numberOfItems } = useContext(CartContext);
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
            title={`Carrito(${numberOfItems > 9 ? '+9' : numberOfItems})`} 
            pageDescription='Carrito de compras de la tienda'
        >
            <Box sx={{ px: { lg: '90px' } }}>
                <Typography variant='h1' component='h1' sx={{ mb: 4 }}>Carrito</Typography>

                <Grid container>
                    <Grid item xs={12} md={6} sx={{ pt: { md: '30px' } }}>
                        <CartList editable />
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Card 
                            sx={{ 
                                ml: { md: '30px', lg: '60px' },
                                borderRadius: '12px',
                                boxShadow: { sx: 'none', md: '0 8px 16px 0 rgba(0,0,0,0.16)' },
                                padding: { md: '20px' }
                            }}
                        >
                            <CardContent sx={{ px: { xs: 0, md: '16px' } }}>
                                <Typography 
                                    variant='h2' 
                                    sx={{ fontWeight: '500', mb: 4 }}
                                >
                                    Resumen de la orden
                                </Typography>
                                {/* <Divider sx={{ mb: 3, mt: 1 }}/> */}

                                <OrderSummary />

                                <Box sx={{ mt: 3 }}>
                                    <Button 
                                        size='large' 
                                        color='secondary' className='circular-btn' 
                                        fullWidth
                                        href='/checkout/address'
                                        sx={{ borderRadius: '30px' }}
                                    >
                                        Checkout
                                    </Button>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Box>
        </ShopLayout>
    )
}

export default CartPage;