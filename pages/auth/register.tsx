import { useContext, useState } from 'react';
import NextLink from 'next/link';

import { Box, Button, Chip, Grid, Link, TextField, Typography } from '@mui/material';
import { useForm } from 'react-hook-form';

import { AuthLayout } from '../../components/layouts';
import { ErrorOutline } from '@mui/icons-material';
import { validations } from '../../utils';
import { tesloApi } from '../../api';
import { useRouter } from 'next/router';
import { AuthContext } from '../../context';

type FormData = {
    email   : string;
    password: string;
    name    : string;
}

const RegisterPage = () => {
    const router = useRouter();
    const { registerUser } = useContext(AuthContext);
    const { register, handleSubmit, watch, formState: { errors } } = useForm<FormData>();
    
    const [showError, setShowError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const onRegisterForm = async({ name, email, password }: FormData) => {
        setShowError(false);
        const { hasError, message } = await registerUser(name, email, password);

        if(hasError) {
            setErrorMessage(message!);
            setShowError(true);
            setTimeout(() => setShowError(false), 4000);
            return;
        }

        router.replace('/');
    }
    return (
        <AuthLayout title='Crear cuenta'>
            <form onSubmit={ handleSubmit(onRegisterForm) }>
                <Box sx={{ width: 350, padding:'10px 20px'}}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Typography variant='h1' component='h1'>Registro</Typography>
                            <Chip 
                                label='Cuenta ya registrada'
                                color='error'
                                icon={ <ErrorOutline /> }
                                className='fadeIn'
                                sx={{ display: showError ? 'flex' : 'none', mt: 2 }}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField 
                                label='Nombre'
                                fullWidth
                                { 
                                    ...register('name', {
                                        required: 'El nombre es requerido',
                                        minLength: { value: 2, message: 'Mínimo 2 caracteres' }
                                    }) 
                                }
                                error={ !!errors.name }
                                helperText={ errors.name?.message }
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField 
                                type='email'
                                label='Correo'
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
                                        minLength: { value:6, message: 'Mínimo 6 caracteres' }
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
                                Registrarse
                            </Button>
                        </Grid>

                        <Grid item xs={12} display='flex' justifyContent='flex-end'>
                            <NextLink href='/auth/login' passHref>
                                <Link underline='always'>
                                    ¿Ya tienes una cuenta?
                                </Link>
                            </NextLink>
                        </Grid>
                    </Grid>
                </Box>
            </form>
        </AuthLayout>
    )
}

export default RegisterPage;