import { useState } from 'react';
import { GetServerSideProps, NextPage } from 'next'
import { useRouter } from 'next/router';

import { PayPalButtons } from '@paypal/react-paypal-js';
import { Box, Card, CardContent, Chip, CircularProgress, Divider, Grid, Link, Typography } from '@mui/material';
import { CreditCardOffOutlined, CreditScoreOutlined } from '@mui/icons-material';

import { CartList, OrderSummary } from '../../components/cart';
import { ShopLayout } from '../../components/layouts';
import { getSession } from 'next-auth/react';
import { dbOrders } from '../../database';
import { IOrder } from '../../interfaces';
import { tesloApi } from '../../api';

type OrderResponseBody = {
    id: string;
    status:
        | 'COMPLETED'
        | 'SAVED'
        | 'APPROVED'
        | 'VOIDED'
        | 'PAYER_ACTION_REQUIRED'
}

interface Props {
    order: IOrder
}

const OrderPage:NextPage<Props> = ({ order }) => {
    const router = useRouter();
    const { _id, isPaid, numberOfItems, shippingAddress, orderItems, subTotal, tax, total } = order;
    const [isPaying, setIsPaying] = useState(false);

    const onOrderCompleted = async(details: OrderResponseBody) => {
        if(details.status !== 'COMPLETED') {
            return alert('No hay pago en PayPal');
        }

        setIsPaying(true);
        try {
            const { data } = await tesloApi.post('/orders/pay', {
                transactionId: details.id,
                orderId: order._id
            });

            router.reload();
        } catch (error) {
            setIsPaying(false);
            console.log(error);
            alert('Error');
        }
    }

    return (
        <ShopLayout 
            title={`Resumen de la orden ${_id}`} 
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
                                <Typography variant='subtitle1'>Direcci??n de entrega</Typography>
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
                                <Box 
                                    display='flex' 
                                    justifyContent='center' 
                                    className='fadeIn'
                                    sx={{ display: isPaying ? 'flex' : 'none' }}
                                >
                                    <CircularProgress />
                                </Box>

                                <Box
                                    sx={{ display: isPaying ? 'none' : 'flex', flex: 1 }}
                                    flexDirection='column'
                                >
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
                                            <PayPalButtons 
                                                createOrder={(data, actions) => {
                                                    return actions.order.create({
                                                        purchase_units: [
                                                            {
                                                                amount: {
                                                                    value: `${order.total}`,
                                                                },
                                                            },
                                                        ],
                                                    });
                                                }}
                                                onApprove={(data, actions) => {
                                                    return actions.order!.capture().then((details) => {
                                                        onOrderCompleted(details);
                                                        // console.log({ details });
                                                        // const name = details.payer.name!.given_name;
                                                        // alert(`Transaction completed by ${name}`);
                                                    });
                                                }}
                                            />
                                        )
                                    }
                                </Box>
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

    order.orderItems = order.orderItems.map(item => {
        const newImage = item.image.includes('http') ? item.image : `${process.env.HOST_NAME}products/${item.image}`;
        return {...item, image: newImage};
    });

    return {
        props: {
            order
        }
    }
}

export default OrderPage;