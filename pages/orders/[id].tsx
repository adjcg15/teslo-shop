import { GetServerSideProps, NextPage } from 'next'

import { Box, Card, CardContent, Chip, Divider, Grid, Link, Typography } from '@mui/material';
import { CreditCardOffOutlined, CreditScoreOutlined } from '@mui/icons-material';

import { CartList, OrderSummary } from '../../components/cart';
import { ShopLayout } from '../../components/layouts';
import { getSession } from 'next-auth/react';
import { dbOrders } from '../../database';
import { IOrder } from '../../interfaces';

interface Props {
    order: IOrder
}

const OrderPage:NextPage<Props> = ({ order }) => {
    const { _id, isPaid, numberOfItems, shippingAddress, orderItems, subTotal, tax, total } = order;

    return (
        <ShopLayout 
            title='Resumen de la orden 1278182912' 
            pageDescription='Resumen de la orden'
        >
            <Typography variant='h1' component='h1' sx={{ mb: 2 }}>Orden: { _id }</Typography>

            {
                isPaid
                ? (
                    <Chip 
                        sx={{ my: 2, px: 1 }}
                        label='Orden pagada'
                        variant='outlined'
                        color='success'
                        icon={ <CreditScoreOutlined /> }
                    />
                )
                : (
                    <Chip 
                        sx={{ my: 2, px: 2 }}
                        label='Pendiente de pago'
                        variant='outlined'
                        color='error'
                        icon={ <CreditCardOffOutlined /> }
                    />
                )
            }

            <Grid container className='fadeIn'>
                <Grid item xs={12} md={7}>
                    <CartList
                        products={ orderItems }
                    />
                </Grid>

                <Grid item xs={12} md={5}>
                    <Card className='summary-card' sx={{ ml: 4 }}>
                        <CardContent>
                            <Typography variant='h2'>Resumen ({numberOfItems} { numberOfItems === 1 ? 'producto' : 'productos' })</Typography>
                            <Divider sx={{ my: 1 }}/>

                            <Box display='flex' justifyContent='space-between'>
                                <Typography variant='subtitle1'>Dirección de entrega</Typography>
                            </Box>

                            <Typography>{ shippingAddress.firstName } { shippingAddress.lastName }</Typography>
                            <Typography>{ shippingAddress.address }{ shippingAddress.address2 ? `, ${shippingAddress.address2}` : ''}</Typography>
                            <Typography>{ shippingAddress.city }, { shippingAddress.zip }</Typography>
                            <Typography>{ shippingAddress.country }</Typography>
                            <Typography>{ shippingAddress.phone }</Typography>
                            <Divider sx={{ my: 1 }}/>

                            <OrderSummary 
                                orderValues={{
                                    numberOfItems,
                                    subTotal,
                                    tax,
                                    total
                                }}
                            />

                            <Box sx={{ mt: 3 }} display='flex' flexDirection='column'>
                                {/* Pagar */}
                                {
                                    isPaid
                                    ? (
                                        <Chip 
                                            sx={{ px: 1 }}
                                            label='Orden pagada'
                                            variant='outlined'
                                            color='success'
                                            icon={ <CreditScoreOutlined /> }
                                        />
                                    )
                                    : (
                                        <h1 style={{ margin: '5px 0' }}>Pagar</h1>
                                    )
                                }
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </ShopLayout>
    )
}


export const getServerSideProps: GetServerSideProps = async ({ req, query }) => {
    const { id = '' }  = query;
    const session: any = await getSession({ req });

    if(!session) return {
        redirect: {
            destination: `/auth/login?p=/orders/${ id }`,
            permanent: false,
        }
    }

    const order = await dbOrders.getOrderById(id.toString());
    if(!order) return {
        redirect: {
            destination: `/orders/history`,
            permanent: false,
        }
    }

    if(order.user !== session.user._id) return {
        redirect: {
            destination: `/orders/history`,
            permanent: false,
        }
    }

    return {
        props: {
            order
        }
    }
}

export default OrderPage;