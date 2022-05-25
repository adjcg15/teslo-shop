import NextLink from 'next/link';

import { Chip, Grid, Link, Typography } from '@mui/material';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';

import { ShopLayout } from '../../components/layouts';

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
                <NextLink href={`/orders/${params.row.id}`} passHref>
                    <Link underline='always'>
                        Ver orden
                    </Link>
                </NextLink>
            )
        }
    },
];

const rows = [
    { id: 1, paid: true, fullName: 'Fernando Herrera' },
    { id: 2, paid: false, fullName: 'Patricia Barragán' },
    { id: 3, paid: true, fullName: 'Ángel García' },
    { id: 4, paid: false, fullName: 'Donaji Navarro' },
    { id: 5, paid: true, fullName: 'Josue Jaimes' },
]

interface Props {

}

const HistoryPage = () => {
    return (
        <ShopLayout 
            title='Historial de órdenes' 
            pageDescription='Historial de órdenes del cliente'
        >
            <Typography variant='h1' component='h1'>Historial de órdenes</Typography>

            <Grid container>
                <Grid item xs={12} sx={{ height: '650px', width: '100%' }}>
                    <DataGrid 
                        rows={ rows }
                        columns={ columns }
                        pageSize={ 10 }
                        rowsPerPageOptions={ [10] }
                    />
                </Grid>
            </Grid>
        </ShopLayout>
    )
}

export default HistoryPage;