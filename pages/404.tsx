import { Box, Typography } from '@mui/material';

import { ShopLayout } from '../components/layouts';

const Custom404 = () => {
    return (
        <ShopLayout
            title='Página no encontrada'
            pageDescription='No se encontró contenido para esta página'
        >
            <Box
                display='flex'
                justifyContent='center'
                alignItems='center'
                height='calc(100vh - 200px)'
                sx={{ flexDirection: { xs: 'column', sm: 'row'}}}
            >
                <Typography variant='h1' component='h1' fontSize={ 50 } fontWeight={ 200 }>
                    404 |
                </Typography>
                <Typography variant='h1' component='h1' fontSize={ 20 } fontWeight={ 200 } marginLeft={1}>
                    Esta página no existe
                </Typography>
            </Box>
        </ShopLayout>
    )
}

export default Custom404;
