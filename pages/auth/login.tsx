import { useEffect, useState } from 'react';
import { GetServerSideProps } from 'next'
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { getSession, signIn, getProviders } from 'next-auth/react';


import { Box, Button, Chip, Divider, Grid, Link, TextField, Typography } from '@mui/material';
import { useForm } from 'react-hook-form';
import { ErrorOutline } from '@mui/icons-material';

import { AuthLayout } from '../../components/layouts';
import { validations } from '../../utils';

type FormData = {
    email   : string;
    password: string;
}

const LoginPage = () => {
    const router = useRouter();
    const { register, handleSubmit, watch, formState: { errors } } = useForm<FormData>();
    const [showError, setShowError] = useState(false);
    const [providers, setProviders] = useState<any>({});

    useEffect(() => {
        getProviders().then(prov => {
            setProviders(prov);
        });
    }, []);

    const onLoginUser = async({ email, password }: FormData) => {
        setShowError(false);
        await signIn('credentials', { email, password });
        // const isLoggedIn = await login(email, password);
        
        // if(!isLoggedIn) {
        //     setShowError(true);
        //     setTimeout(() => setShowError(false), 4000);
        //     return;
        // }

        // const destination = router.query.p?.toString() || '/';
        // router.replace(destination);
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
                            <NextLink href={router.query.p ? `/auth/register?p=${router.query.p}` : '/auth/register'} passHref>
                                <Link underline='always'>
                                    ¿Aún no tienes una cuenta?
                                </Link>
                            </NextLink>
                        </Grid>

                        <Grid item xs={12} display='flex' flexDirection='column'>
                            <Divider sx={{ width: '100%', mb: 2 }}/>
                            {
                                Object.values(providers).map((provider: any) => {
                                    if(provider.id === 'credentials') return (<div key='credentials'></div>)

                                    return  (
                                        <Button
                                            key={ provider.id }
                                            variant='outlined'
                                            fullWidth
                                            color='primary'
                                            sx={{ mb: 1 }}
                                            onClick={ () => signIn(provider.id) }
                                        >
                                            { provider.name }
                                        </Button>
                                    )
                                })
                            }
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

export default LoginPage;