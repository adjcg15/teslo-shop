import { FC } from 'react';
import { Grid } from '@mui/material';

import { IProduct } from '../../interfaces';
import { ProductCard } from './ProductCard';

interface Props {
    products: IProduct[];
}

export const ProductList:FC<Props> = ({ products }) => {
    return (
        <Grid container spacing={{ xs: 3, md: 6 }}>
            {
                products.map(product => (
                    <ProductCard 
                        product={ product }
                        key={ product.slug }
                    />
                ))
            }
        </Grid>
    )
}
