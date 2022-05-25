import { Box, Button, FormControl, Grid, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material';

import { ShopLayout } from '../../components/layouts';

const AddressPage = () => {
    return (
        <ShopLayout title='Dirección' pageDescription='Confirmar dirección del destino'>
            <Typography variant='h1' component='h1' sx={{ mb: 2 }}>Dirección</Typography>

            <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                    <TextField label='Nombre' variant='outlined' fullWidth/>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField label='Apellido' variant='outlined' fullWidth/>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField label='Dirección' variant='outlined' fullWidth/>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField label='Dirección 2' variant='outlined' fullWidth/>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField label='Código postal' variant='outlined' fullWidth/>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField label='Ciudad' variant='outlined' fullWidth/>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                        <InputLabel id='pais-label'>País</InputLabel>
                        <Select 
                            labelId='pais-label'
                            variant='outlined'
                            label='País'
                        >
                            <MenuItem value={1}>Costa Rica</MenuItem>
                            <MenuItem value={2}>El Salvador</MenuItem>
                            <MenuItem value={3}>México</MenuItem>
                            <MenuItem value={4}>Colombia</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField label='Teléfono' variant='outlined' fullWidth/>
                </Grid>
            </Grid>
            
            <Box sx={{ mt: 5 }} display='flex' justifyContent='flex-end'>
                <Button color='secondary' className='circular-btn' size='large'>
                    Realizar pedido
                </Button>
            </Box>
        </ShopLayout>
    )
}

export default AddressPage