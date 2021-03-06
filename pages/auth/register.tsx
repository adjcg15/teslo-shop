import { useContext, useState } from 'react';
import { GetServerSideProps } from 'next';
import NextLink from 'next/link';
import { getSession, signIn } from 'next-auth/react';

import { Box, Button, Chip, Grid, Link, TextField, Typography } from '@mui/material';
import { useForm } from 'react-hook-form';

import { AuthLayout } from '../../components/layouts';
import { ErrorOutline } from '@mui/icons-material';
import { validations } from '../../utils';
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

        await signIn('credentials', { email, password });
        // const destination = router.query.p?.toString() || '/';
        // router.replace(destination);
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
                                        minLength: { value: 2, message: 'M??nimo 2 caracteres' }
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
                                label='Contrase??a'
                                type='password'
                                fullWidth
                                { 
                                    ...register('password', {
                                        required: 'La contrase??a es requerida',
                                        minLength: { value:6, message: 'M??nimo 6 caracteres' }
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
                            <NextLink href={router.query.p ? `/auth/login?p=${router.query.p}` : '/auth/login'} passHref>
                                <Link underline='always'>
                                    ??Ya tienes una cuenta?
                                </Link>
                            </NextLink>
                        </Grid>
                    </Grid>
                </Box>
            </form>
        </AuthLayout>
    )
}

export const getServerSideProps: GetServerSideProps = async ({ req, query }) => {
    const session = await getSession({ req });
    const { p = '/' } = query;

    if(session) {
        return {
            redirect: {
                destination: p.toString(),
                permanent: false
            }
        }
    }

    return {
        props: {
            
        }
    }
}

export default RegisterPage;