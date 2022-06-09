import { useContext, useState } from 'react';
import { NextPage, GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router';

import { Box, Button, Chip, Grid, Typography } from '@mui/material';

import { dbProducts } from '../../database';
import { CartContext } from '../../context';
import { IProduct, ICartProduct, ISize } from '../../interfaces';
import { ShopLayout } from '../../components/layouts';
import { ItemCounter } from '../../components/ui';
import { ProductSlideshow, SizeSelector } from '../../components/products';

interface Props {
    product: IProduct;
}

const ProductPage:NextPage<Props> = ({ product }) => {
    const router = useRouter();
    const { addProductToCart } = useContext(CartContext);
    
    const [tempCartProduct, setTempCartProduct] = useState<ICartProduct>({
        _id: product._id,
        image: product.images[0],
        price: product.price,
        size: undefined,
        slug: product.slug,
        title: product.title,
        gender: product.gender,
        quantity: 1,
    });

    const onSelectedSize = (size: ISize) => {
        setTempCartProduct(currentProduct => ({
            ...currentProduct,
            size
        }));
    }

    const onUpdateQuantity = (quantity: number) => {
        setTempCartProduct(currentProduct => ({
            ...currentProduct,
            quantity
        }));
    }

    const onAddProduct = () => {
        if(!tempCartProduct.size) return;
        addProductToCart(tempCartProduct);
        router.push('/cart');
    }

    return (
        <ShopLayout title={product.title} pageDescription={product.description}>
            <Grid container spacing={6}>
                <Grid item xs={12} sm={7}>
                    <ProductSlideshow 
                        images={ product.images }
                    />
                </Grid>

                <Grid item xs={12} sm={5}>
                    <Box display='flex' flexDirection='column' >
                        <Typography variant='h1' component='h1' fontSize={40} fontWeight={ 500 }>
                            { product.title }
                        </Typography>
                        <Typography variant='subtitle1' component='h1'>
                            {`$${ product.price }`}
                        </Typography>

                        <Box sx={{ my: 3 }}>
                            <Typography variant='subtitle2'>
                                Cantidad
                            </Typography>
                            <ItemCounter 
                                currentValue={ tempCartProduct.quantity }
                                updateQuantity={ onUpdateQuantity }
                                maxValue={ product.inStock }
                            />
                            <SizeSelector 
                                sizes={ product.sizes }
                                selectedSize={ tempCartProduct.size }
                                onSelectedSize={ onSelectedSize }
                            />
                        </Box>

                        {
                            (product.inStock > 0)
                            ? (
                                <Button 
                                    color='secondary' 
                                    className='circular-btn' 
                                    size='large'
                                    disabled={ !tempCartProduct.size }
                                    sx={{ maxWidth: 300 }}
                                    variant={!tempCartProduct.size ? 'outlined' : 'contained'}
                                    onClick={ onAddProduct }
                                >
                                    {
                                        tempCartProduct.size
                                        ? 'Agregar al carrito'
                                        : 'Seleccione una talla'
                                    }
                                </Button>
                            )
                            : (
                                <Chip 
                                    label='No hay disponibles'
                                    color='error'
                                    variant='outlined'
                                    sx={{ width: 300 }}
                                    size='medium'
                                />
                            )
                        }

                        <Box sx={{ mt: 3 }}>
                            <Typography variant='subtitle1'>Descripción</Typography>
                            <Typography variant='body1'>{ product.description }</Typography>
                        </Box>
                    </Box>
                </Grid>
            </Grid>
        </ShopLayout>
    )
}

/*============================= USANDO SSR =============================*/
// export const getServerSideProps: GetServerSideProps = async({ params }) => {
//     const { slug = '' } = params as { slug: string }
//     const product = await getProductBySlug(slug);

//     if(!product) {
//         return {
//             redirect: {
//                 destination: '/',
//                 permanent: false
//             }
//         }
//     }

//     return {
//         props: {
//             product
//         }
//     }
// }

export const getStaticPaths: GetStaticPaths = async (ctx) => {
    const slugs = await dbProducts.getAllProductSlugs();
    const paths = slugs.map(({ slug }) => ({
        params: {
            slug
        }
    }));

    return {
        paths,
        fallback: 'blocking'
    }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
    const { slug = '' } = params as { slug: string };
    const product = await dbProducts.getProductBySlug(slug);

    if(!product) {
        return {
            redirect: {
                destination: '/',
                permanent: false
            }
        }
    }

    return {
        props: {
            product
        },
        revalidate: 60*60*24
    }
}

export default ProductPage