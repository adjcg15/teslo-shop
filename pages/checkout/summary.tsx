import NextLink from 'next/link';

import { Box, Button, Card, CardContent, Divider, Grid, Link, Typography } from '@mui/material';

import { CartList, OrderSummary } from '../../components/cart';
import { ShopLayout } from '../../components/layouts';

const SummaryPage = () => {
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
                            <Typography variant='h2'>Resumen (3 productos)</Typography>
                            <Divider sx={{ my: 1 }}/>

                            <Box display='flex' justifyContent='space-between'>
                                <Typography variant='subtitle1'>Dirección de entrega</Typography>
                                <NextLink href='/checkout/address' passHref>
                                    <Link underline='always'>
                                        Editar
                                    </Link>
                                </NextLink>
                            </Box>

                            <Typography>Fernando Herrera</Typography>
                            <Typography>Mirador 29</Typography>
                            <Typography>Veracurz, 91016</Typography>
                            <Typography>México</Typography>
                            <Typography>+52 229010029</Typography>
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