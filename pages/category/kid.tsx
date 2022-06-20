import { NextPage } from 'next';

import { Typography } from '@mui/material';

import { ShopLayout } from '../../components/layouts';
import { ProductList } from '../../components/products';
import { FullScreenLoading } from '../../components/ui';
import { useProducts } from '../../hooks';

const KidPage: NextPage = () => {
    const { products, isLoading } = useProducts('/products?gender=kid');

    return (
        <ShopLayout 
            title='TesloShop - Niños'
            pageDescription='Encuentra los mejores productos de Teslo para niños'
        >
            <Typography variant='h1' sx={{ mb: 4 }}>Niños</Typography>
            <Typography variant='h2' component='h2' sx={{ mb: 2, fontSize: 23 }}>Productos para los pequeños</Typography>

            {
                isLoading
                ? <FullScreenLoading />
                : <ProductList products={ products }/>
            }

            
        </ShopLayout>
    )
}

export default KidPage