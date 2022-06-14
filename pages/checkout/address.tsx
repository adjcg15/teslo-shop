import { useContext, useEffect, useState } from 'react';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';

import { Box, Button, FormControl, Grid, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material';
import { useForm } from 'react-hook-form';
import Cookies from 'js-cookie';

import { ShopLayout } from '../../components/layouts';
import { countries, jwt } from '../../utils';
import { CartContext } from '../../context';

type FormData = {
    firstName: string;
    lastName : string;
    address  : string;
    address2?: string;
    zip      : string;
    city     : string;
    country  : string;
    phone    : string;
}

const getAddressFromCookies = (): FormData => {
    return {
        firstName: Cookies.get('firstName') || '',
        lastName : Cookies.get('lastName') || '',
        address  : Cookies.get('address') || '',
        address2 : Cookies.get('address2') || '',
        zip      : Cookies.get('zip') || '',
        city     : Cookies.get('city') || '',
        country  : Cookies.get('country') || countries[0].code,
        phone    : Cookies.get('phone') || ''
    }
}

const AddressPage = () => {
    const router = useRouter();
    const { updateAddress } = useContext(CartContext);
    const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
        defaultValues: {
            firstName: '',
            lastName : '',
            address  : '',
            address2 : '',
            zip      : '',
            city     : '',
            country  : countries[0].code,
            phone    : '',
        }
    });
    const [defaultCountry, setDefaultCountry] = useState('');

    useEffect(() => {
        const addressFromCookies = getAddressFromCookies();
        reset(addressFromCookies);
        setDefaultCountry(addressFromCookies.country || countries[0].code);
    }, [reset]);

    const onSubmitAddress = (data: FormData) => {
        updateAddress(data);
        router.push('/checkout/summary');
    }

    if (defaultCountry === '') return null;

    return (
        <ShopLayout title='Dirección' pageDescription='Confirmar dirección del destino'>
            <form onSubmit={ handleSubmit(onSubmitAddress) }>
                <Typography variant='h1' component='h1' sx={{ mb: 2 }}>Dirección</Typography>

                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <TextField 
                            label='Nombre' 
                            variant='outlined' 
                            fullWidth
                            { 
                                ...register('firstName', {
                                    required: 'El nombre es requerido'
                                })
                            }
                            error={ !!errors.firstName }
                            helperText={ errors.firstName?.message }
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField 
                        label='Apellido' 
                        variant='outlined' 
                        fullWidth
                        { 
                            ...register('lastName', {
                                required: 'El apellido es requerido'
                            })
                        }
                        error={ !!errors.lastName }
                        helperText={ errors.lastName?.message }
                    />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField 
                            label='Dirección' 
                            variant='outlined' 
                            fullWidth
                            { 
                                ...register('address', {
                                    required: 'La dirección es requerida'
                                })
                            }
                            error={ !!errors.address }
                            helperText={ errors.address?.message }
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField 
                            label='Dirección 2' 
                            variant='outlined' 
                            fullWidth
                            { ...register('address2') }
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField 
                            label='Código postal' 
                            variant='outlined' 
                            fullWidth
                            { 
                                ...register('zip', {
                                    required: 'El código postal es requerido'
                                })
                            }
                            error={ !!errors.zip }
                            helperText={ errors.zip?.message }
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField 
                            label='Ciudad' 
                            variant='outlined' 
                            fullWidth
                            { 
                                ...register('city', {
                                    required: 'La ciudad es requerida'
                                })
                            }
                            error={ !!errors.city }
                            helperText={ errors.city?.message }
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <FormControl fullWidth>
                            {
                                !!defaultCountry && (
                                    <TextField
                                        select
                                        variant='outlined'
                                        label='País'
                                        defaultValue={ defaultCountry }
                                        { 
                                            ...register('country', {
                                                required: 'El país es requerido'
                                            })
                                        }
                                        error={ !!errors.country }
                                        helperText={ errors.country?.message }
                                    >
                                        {
                                            countries.map(country => (
                                                <MenuItem 
                                                    key={ country.code }
                                                    value={ country.code }
                                                >
                                                    { country.name }
                                                </MenuItem>
                                            ))
                                        }
                                    </TextField>
                                )
                            }
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField 
                            label='Teléfono' 
                            variant='outlined' 
                            fullWidth
                            { 
                                ...register('phone', {
                                    required: 'El teléfono es requerido'
                                })
                            }
                            error={ !!errors.phone }
                            helperText={ errors.phone?.message }
                        />
                    </Grid>
                </Grid>
                
                <Box sx={{ mt: 5 }} display='flex' justifyContent='flex-end'>
                    <Button 
                        type='submit'
                        color='secondary' 
                        className='circular-btn' 
                        size='large'
                    >
                        Realizar pedido
                    </Button>
                </Box>
            </form>
        </ShopLayout>
    )
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
    const { token = '' } = req.cookies;
    let isValidToken = false;

    try {
        await jwt.isValidToken(token);
        isValidToken = true;
    } catch (error) {
        isValidToken = false;
    }

    if(!isValidToken) {
        return {
            redirect: {
                destination: '/auth/login?p=/checkout/address',
                permanent: false
            }
        }
    }

    return {
        props: {
            
        }
    }
}

export default AddressPage