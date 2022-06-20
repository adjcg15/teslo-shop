import { GetServerSideProps, NextPage } from 'next';
import NextLink from 'next/link';

import { Box, Chip, Grid, Link, Typography } from '@mui/material';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import { getSession } from 'next-auth/react';

import { ShopLayout } from '../../components/layouts';
import { dbOrders } from '../../database';
import { IOrder } from '../../interfaces';
import { AddShoppingCartOutlined } from '@mui/icons-material';

const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 100 },
    { field: 'fullName', headerName: 'Nombre completo', width: 300 },
    {
        field: 'paid',
        headerName: 'Estado',
        description: 'Indica si el pedido está pagado o no',
        width: 200,
        renderCell: (params: GridValueGetterParams) => {
            return (
                params.row.paid
                    ? <Chip color='success' label='Pagada' variant='outlined' />
                    : <Chip color='error' label='Pendiente' variant='outlined' />
            )
        }
    },
    {
        field: 'orden',
        headerName: 'Ver orden',
        width: 200,
        sortable: false,
        renderCell: (params: GridValueGetterParams) => {
            return (
                <NextLink href={`/orders/${params.row.orderId}`} passHref>
                    <Link underline='always'>
                        Ver orden
                    </Link>
                </NextLink>
            )
        }
    },
];

interface Props {
    orders: IOrder[];
}

const HistoryPage:NextPage<Props> = ({ orders }) => {
    const rows = orders.map((order, index) => ({
        id: index + 1,
        paid: order.isPaid,
        fullName: `${order.shippingAddress.firstName} ${order.shippingAddress.lastName}`,
        orderId: order._id
    }));

    return (
        <ShopLayout 
            title='Historial de órdenes' 
            pageDescription='Historial de órdenes del cliente'
        >
            {
                orders.length === 0
                ? (
                    <>
                        <Box display='flex' flexDirection='column' height='calc(100vh - 200px)' justifyContent='center' alignItems='center'>
                            <Typography variant='h5' sx={{ mb: 2 }}>No hay órdenes aún</Typography>
                            <NextLink href='/' passHref>
                                <Link display='flex' flexDirection='column' alignItems='center' sx={{ ':hover': { color: 'secondary.main' }}}>
                                    <AddShoppingCartOutlined sx={{ fontSize: '60px' }} />
                                    <Typography>Comprar</Typography>
                                </Link>
                            </NextLink>
                        </Box>
                    </>
                )
                : (
                    <>
                        <Typography variant='h1' component='h1'>Historial de órdenes</Typography>

                        <Grid container className='fadeIn' sx={{ mt: 2 }}>
                            <Grid item xs={12} sx={{ height: '650px', width: '100%' }}>
                                <DataGrid 
                                    rows={ rows }
                                    columns={ columns }
                                    pageSize={ 10 }
                                    rowsPerPageOptions={ [10] }
                                />
                            </Grid>
                        </Grid>
                    </>
                )
            }
        </ShopLayout>
    )
}

export const getServerSideProps: GetServerSideProps = async({ req }) => {
    const session:any = await getSession({ req });

    if(!session) return {
        redirect: {
            destination: '/auth/login?p=/orders/history',
            permanent: false
        }
    }

    const orders = await dbOrders.getOrdersByUser(session.user._id);

    return {
        props: {
            orders
        }
    }
}

export default HistoryPage;