import useSWR from 'swr';
import { ConfirmationNumberOutlined } from '@mui/icons-material';
import { Box, Chip, CircularProgress, Grid } from '@mui/material';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';

import { AdminLayout } from '../../../components/layouts';
import { IOrder, IUser } from '../../../interfaces';

const columns:GridColDef[] = [
    { field: 'id', headerName: 'Order ID', width: 230 },
    { field: 'email', headerName: 'Correo', width: 250 },
    { field: 'name', headerName: 'Nombre', width: 200 },
    { field: 'total', headerName: 'Monto total', width: 100 },
    { 
        field: 'isPaid', 
        headerName: 'Pagada',
        renderCell: ({row}: GridValueGetterParams) => {
            return row.isPaid
            ? (<Chip variant='outlined' label='Pagada' color='success'/>)
            : (<Chip variant='outlined' label='Pendiente' color='error'/>)
        }, 
        width: 110
    },
    { field: 'noProducts', headerName: 'No. productos', align: 'center', width: 120 },
    { field: 'createdAt', headerName: 'Fecha de creación', width: 150 },
    { 
        field: 'check', 
        headerName: 'Ver orden',
        renderCell: ({row}: GridValueGetterParams) => {
            return (
                <a href={`/admin/orders/${row.id}`} target='_blank' rel='noreferrer'>Ver orden</a>
            )
        }
    },
]

const Orders = () => {
    const { data, error } = useSWR<IOrder[]>('/api/admin/orders');
    
    if(!error && !data) {
        return (
            <Box display='flex' alignItems='center' justifyContent='center' height='100vh'>
                <CircularProgress />
            </Box>
        )
    }

    const rows = data!.map(order => ({
        id    : order._id,
        email : (order.user as IUser).email,
        name  : (order.user as IUser).name,
        total : order.total,
        isPaid: order.isPaid,
        noProducts: order.numberOfItems,
        createdAt: order.createdAt!.slice(0, 10) || ''
    }));

    return (
        <AdminLayout
            headerTitle='Admin - ordenes'
            title='Ordenes'
            subTitle='Mantenimiento de órdenes'
            icon={ <ConfirmationNumberOutlined /> } 
        >
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
        </AdminLayout>
    )
}

export default Orders