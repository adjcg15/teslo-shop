import { GetServerSideProps, NextPage } from 'next'
import { useRouter } from 'next/router';

import { Box, Card, CardContent, Chip, Divider, Grid, Typography } from '@mui/material';
import { AirplaneTicketOutlined, CreditCardOffOutlined, CreditScoreOutlined } from '@mui/icons-material';

import { CartList, OrderSummary } from '../../../components/cart';
import { AdminLayout } from '../../../components/layouts';
import { dbOrders } from '../../../database';
import { IOrder } from '../../../interfaces';

interface Props {
    order: IOrder
}

const OrderPage:NextPage<Props> = ({ order }) => {
    const router = useRouter();
    const { _id, isPaid, numberOfItems, shippingAddress, orderItems, subTotal, tax, total } = order;

    return (
        <AdminLayout
            headerTitle={`Resumen de la orden ${_id}`}
            title='Resumen de orden' 
            subTitle={`Orden ${_id}`}
            icon={ <AirplaneTicketOutlined /> }
        >
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
                                <Box
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
                                            <Chip 
                                                sx={{ px: 1 }}
                                                label='Pendiente de pago'
                                                variant='outlined'
                                                color='error'
                                                icon={ <CreditCardOffOutlined /> }
                                            />
                                        )
                                    }
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </AdminLayout>
    )
}


export const getServerSideProps: GetServerSideProps = async ({ query }) => {
    const { id = '' }  = query;

    const order = await dbOrders.getOrderById(id.toString());
    if(!order) return {
        redirect: {
            destination: '/admin/orders',
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