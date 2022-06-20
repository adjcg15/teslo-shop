import type { NextPage, GetServerSideProps } from 'next';
import { Typography } from '@mui/material';

import { ShopLayout } from '../../components/layouts';
import { ProductList } from '../../components/products';
import { dbProducts } from '../../database';
import { IProduct } from '../../interfaces/products';

interface Props {
    products: IProduct[];
    foundProducts: boolean;
    query: string;
}

const SearchPage: NextPage<Props> = ({ products, foundProducts, query }) => {

    return (
        <ShopLayout 
            title='TesloShop - Search'
            pageDescription='Búsqueda personalizada'
        >
            <Typography variant='h1'>Resultados de búsqueda</Typography>
            {
                foundProducts 
                ? <Typography color='secondary' variant='h2' sx={{ mb: 1 }} textTransform='capitalize'>{ query }</Typography>
                : <Typography  variant='h2' sx={{ my: 2 }}>El término <Typography variant='h2' component='span' color='secondary'>{ query }</Typography> no arrojó coincidencias, pero tal vez te puedan interesar:</Typography>
            }
            <ProductList products={ products }/>
        </ShopLayout>
    )
}

export const getServerSideProps: GetServerSideProps = async({ params }) => {
    const { query = '' } = params as { query: string };
    if(query.length === 0) {
        return {
            redirect: {
                destination: '/',
                permanent: true
            }
        }
    }

    let products = await dbProducts.getProductsByTerm(query);
    const foundProducts = products.length > 0;

    if(!foundProducts) {
        products = await dbProducts.getAllProducts();
    }

    return {
        props: {
            products,
            foundProducts,
            query
        }
    }
}

export default SearchPage;