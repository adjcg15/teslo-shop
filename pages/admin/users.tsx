import React, { useEffect, useState } from 'react';

import useSWR from 'swr';
import { PeopleOutline } from '@mui/icons-material';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import { Box, CircularProgress, Grid, MenuItem, Select } from '@mui/material';

import { AdminLayout } from '../../components/layouts';
import { IUser } from '../../interfaces';
import { tesloApi } from '../../api';

const UsersPage = () => {
    const { data, error } = useSWR<IUser[]>('/api/admin/users');
    const [users, setUsers] = useState<IUser[]>([]);

    useEffect(() => {
        if(data) setUsers(data);
    }, [data]);

    const onRolUpdated = async(userId: string, newRole: string) => {
        const previousUsers = users.map(user => ({...user}));
        const updatedUsers = users.map(user => ({
            ...user,
            role: userId === user._id ? newRole : user.role
        }));
        setUsers(updatedUsers);

        try {
            await tesloApi.put('/admin/users', { userId, role: newRole });
        } catch (error) {
            setUsers(previousUsers);
            console.log(error);
            alert('No se pudo actualizar el rol del usuario');
        } 
    }

    if(!error && !data) {
        return (
            <Box display='flex' alignItems='center' justifyContent='center' height='100vh'>
                <CircularProgress />
            </Box>
        )
    }

    const columns: GridColDef[] = [
        { field: 'email', headerName: 'Correo', width: 250 },
        { field: 'name', headerName: 'Nombre', width: 300 },
        { 
            field: 'role', 
            headerName: 'Rol', 
            width: 250,
            renderCell: ({row}: GridValueGetterParams) => {
                return (
                    <Select
                        value={ row.role }
                        label='Rol'
                        onChange={ ({ target }) => onRolUpdated(row.id, target.value) }
                        sx={{ width: '250px' }}
                    >
                        <MenuItem value='admin'>Admin</MenuItem>
                        <MenuItem value='client'>Client</MenuItem>
                        <MenuItem value='super-user'>Super User</MenuItem>
                        <MenuItem value='SEO'>SEO</MenuItem>
                    </Select>
                )
            }
        },
    ];

    const rows = users.map(user => ({
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role
    }));

    return (
        <AdminLayout
            headerTitle='Admin - usuarios'
            title='Usuarios'
            subTitle='Mantenimiento de usuarios'
            icon={ <PeopleOutline /> }
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

export default UsersPage