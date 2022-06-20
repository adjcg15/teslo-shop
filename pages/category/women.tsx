import { NextPage } from 'next';

import { Typography } from '@mui/material';

import { ShopLayout } from '../../components/layouts';
import { ProductList } from '../../components/products';
import { FullScreenLoading } from '../../components/ui';
import { useProducts } from '../../hooks';

const WomenPage: NextPage = () => {
    const { products, isLoading } = useProducts('/products?gender=women');

    return (
        <ShopLayout 
            title='TesloShop - Mujer'
            pageDescription='Encuentra los mejores productos de Teslo para ellas'
        >
            <Typography variant='h1' sx={{ mb: 4 }}>Mujeres</Typography>
            <Typography variant='h2' component='h2' sx={{ mb: 2, fontSize: 23 }}>Prendas para ellas</Typography>

            {
                isLoading
                ? <FullScreenLoading />
                : <ProductList products={ products }/>
            }

            
        </ShopLayout>
    )
}

export default WomenPage