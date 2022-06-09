import { Box, Button, Card, CardContent, Divider, Grid, Typography } from '@mui/material';
import { CartList, OrderSummary } from '../../components/cart';
import { ShopLayout } from '../../components/layouts';

const CartPage = () => {
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
                                <Button size='medium' color='secondary' className='circular-btn' fullWidth>
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