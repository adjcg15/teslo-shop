import { useContext, useEffect } from 'react';
import NextLink from 'next/link';

import { Box, Button, Card, CardContent, Divider, Grid, Link, Typography } from '@mui/material';

import { CartList, OrderSummary } from '../../components/cart';
import { ShopLayout } from '../../components/layouts';
import { CartContext } from '../../context';
import { countries } from '../../utils';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';

const SummaryPage = () => {
    const router = useRouter();
    const { shippingAddress, numberOfItems } = useContext(CartContext);

    useEffect(() => {
        if(!Cookies.get('firstName')) {
            router.push('/checkout/address');
        }
    }, [router]);

    if(!shippingAddress) {
        return (<></>);
    }

    const { firstName, lastName, address, address2 = '', city, country, phone, zip } = shippingAddress;

    return (
        <ShopLayout 
            title='Resumen de la orden' 
            pageDescription='Resumen de la orden'
        >
            <Typography variant='h1' component='h1' sx={{ mb: 2 }}>Resumen de su orden</Typography>

            <Grid container>
                <Grid item xs={12} md={7}>
                    <CartList />
                </Grid>

                <Grid item xs={12} md={5}>
                    <Card className='summary-card' sx={{ ml: 4 }}>
                        <CardContent>
                            <Typography variant='h2'>Resumen ({ numberOfItems  } { numberOfItems === 1 ? 'producto' : 'productos' })</Typography>
                            <Divider sx={{ my: 1 }}/>

                            <Box display='flex' justifyContent='space-between'>
                                <Typography variant='subtitle1'>Dirección de entrega</Typography>
                                <NextLink href='/checkout/address' passHref>
                                    <Link underline='always'>
                                        Editar
                                    </Link>
                                </NextLink>
                            </Box>

                            <Typography>{ firstName } { lastName }</Typography>
                            <Typography>{ address }{ address2 ? `, ${address2}` : ''}</Typography>
                            <Typography>{ city }, { zip }</Typography>
                            <Typography>{ countries.find(c => c.code === country)?.name }</Typography>
                            <Typography>{ phone }</Typography>
                            <Divider sx={{ my: 1 }}/>

                            <Box display='flex' justifyContent='flex-end'>
                                <NextLink href='/cart' passHref>
                                    <Link underline='always'>
                                        Editar
                                    </Link>
                                </NextLink>
                            </Box>

                            <OrderSummary />

                            <Box sx={{ mt: 3 }}>
                                <Button color='secondary' className='circular-btn' fullWidth>
                                    Confirmar orden
                                </Button>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </ShopLayout>
    )
}

export default SummaryPage;