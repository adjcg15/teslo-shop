import React, { useEffect, useState } from 'react'

import useSWR from 'swr';
import { Box, CircularProgress, Grid, Typography } from '@mui/material';
import { AccessTimeOutlined, AttachMoneyOutlined, CancelPresentationOutlined, CategoryOutlined, CreditCardOffOutlined, DashboardOutlined, GroupOutlined, ProductionQuantityLimitsOutlined } from '@mui/icons-material';

import { SummaryTile } from '../../components/admin';
import { AdminLayout } from '../../components/layouts';
import { DashboardSummaryResponse } from '../../interfaces';

const DashboardPage = () => {
    const { data, error } = useSWR<DashboardSummaryResponse>('/api/admin/dashboard', {
        refreshInterval: 30 * 1000
    });

    const [refreshIn, setRefreshIn] = useState(30);
    useEffect(() => {
        const interval = setInterval(() => {
            setRefreshIn(refreshIn => refreshIn > 0 ? refreshIn - 1 : 30);
        }, 1000);
        
        return () => clearInterval(interval);
    }, []);
    

    if(!error && !data) {
        return (
            <Box display='flex' alignItems='center' justifyContent='center' height='100vh'>
                <CircularProgress />
            </Box>
        )
    }

    if(error) {
        console.log(error)
        return (
            <Box display='flex' alignItems='center' justifyContent='center' height='100vh'>
                <Typography>Error al cargar la información</Typography>
            </Box>
        )
    }

    const {
        numberOfOrders,
        paidOrders,
        notPaidOrders,
        numberOfClients,
        numberOfProducts,
        productsWithNoInventory,
        lowInventory,
    } = data!;

    return (
        <AdminLayout
            headerTitle='Admin - dashboard'
            title='Dashboard'
            subTitle='Estadísticas generales'
            icon={ <DashboardOutlined /> }
        >
            <Grid container spacing={ 2 }>
                <SummaryTile 
                    title={ numberOfOrders }
                    subTitle='Órdenes totales'
                    icon={ <CreditCardOffOutlined color='secondary' sx={{ fontSize: 40 }}/> }
                />

                <SummaryTile 
                    title={ paidOrders }
                    subTitle='Órdenes pagadas'
                    icon={ <AttachMoneyOutlined color='success' sx={{ fontSize: 40 }}/> }
                />

                <SummaryTile 
                    title={ notPaidOrders }
                    subTitle='Órdenes pendientes'
                    icon={ <CreditCardOffOutlined color='error' sx={{ fontSize: 40 }}/> }
                />

                <SummaryTile 
                    title={ numberOfClients }
                    subTitle='Clientes'
                    icon={ <GroupOutlined color='primary' sx={{ fontSize: 40 }}/> }
                />

                <SummaryTile 
                    title={ numberOfProducts }
                    subTitle='Productos'
                    icon={ <CategoryOutlined color='warning' sx={{ fontSize: 40 }}/> }
                />

                <SummaryTile 
                    title={ productsWithNoInventory }
                    subTitle='Sin existencias'
                    icon={ <CancelPresentationOutlined color='error' sx={{ fontSize: 40 }}/> }
                />

                <SummaryTile 
                    title={ lowInventory }
                    subTitle='Bajo inventario'
                    icon={ <ProductionQuantityLimitsOutlined color='warning' sx={{ fontSize: 40 }}/> }
                />

                <SummaryTile 
                    title={ `${refreshIn}s` }
                    subTitle='Próxima actualización'
                    icon={ <AccessTimeOutlined color='secondary' sx={{ fontSize: 40 }}/> }
                />
            </Grid>
        </AdminLayout>
    )
}

export default DashboardPage;