import { useContext, useState } from 'react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';

import { Box, Button, Chip, Grid, Link, TextField, Typography } from '@mui/material';
import { useForm } from 'react-hook-form';
import { ErrorOutline } from '@mui/icons-material';

import { AuthContext } from '../../context';
import { tesloApi } from '../../api';
import { AuthLayout } from '../../components/layouts';
import { validations } from '../../utils';

type FormData = {
    email   : string;
    password: string;
}

const LoginPage = () => {
    const router = useRouter();
    const { login } = useContext(AuthContext);
    const { register, handleSubmit, watch, formState: { errors } } = useForm<FormData>();
    const [showError, setShowError] = useState(false);

    const onLoginUser = async({ email, password }: FormData) => {
        setShowError(false);
        const isLoggedIn = await login(email, password);
        
        if(!isLoggedIn) {
            setShowError(true);
            setTimeout(() => setShowError(false), 4000);
            return;
        }

        router.replace('/');
    }

    return (
        <AuthLayout title='Iniciar sesión'>
            <form onSubmit={ handleSubmit(onLoginUser) }>
                <Box sx={{ width: 350, padding:'10px 20px'}}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Typography variant='h1' component='h1'>Iniciar sesión</Typography>
                            <Chip 
                                label='Correo o contraseña incorrectos'
                                color='error'
                                icon={ <ErrorOutline /> }
                                className='fadeIn'
                                sx={{ display: showError ? 'flex' : 'none', mt: 2 }}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField 
                                label='Correo'
                                type='email'
                                fullWidth
                                { 
                                    ...register('email', {
                                        required: 'El correo es requerido',
                                        validate: validations.isEmail
                                    })
                                }
                                error={ !!errors.email }
                                helperText={ errors.email?.message }
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField 
                                label='Contraseña'
                                type='password'
                                fullWidth
                                { 
                                    ...register('password', {
                                        required: 'La contraseña es requerida',
                                        minLength: { value:6, message: 'La Mínimo 6 caracteres' }
                                    }) 
                                }
                                error={ !!errors.password }
                                helperText={ errors.password?.message }
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <Button
                                type='submit'
                                color='secondary'
                                className='circular-btn'
                                size='large'
                                fullWidth
                            >
                                Ingresar
                            </Button>
                        </Grid>

                        <Grid item xs={12} display='flex' justifyContent='flex-end'>
                            <NextLink href='/auth/register' passHref>
                                <Link underline='always'>
                                    ¿Aún no tienes una cuenta?
                                </Link>
                            </NextLink>
                        </Grid>
                    </Grid>
                </Box>
            </form>
        </AuthLayout>
    )
}

export default LoginPage;