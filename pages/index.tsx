import type { NextPage } from 'next';
import { Typography } from '@mui/material';

import { ShopLayout } from '../components/layouts';
import { ProductList } from '../components/products';
import { initialData } from '../database/products';

const Home: NextPage = () => {
    return (
        <ShopLayout 
            title='TesloShop - Home'
            pageDescription='Encuentra los mejores productos de Teslo'
        >
            <Typography variant='h1'>Tienda</Typography>
            <Typography variant='h2' sx={{ mb: 1 }}>Todos los productos</Typography>

            <ProductList 
                products={ initialData.products as any }
            />
        </ShopLayout>
    )
}

export default Home
