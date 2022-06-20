import React, { FC, useContext, useMemo, useState } from 'react';
import NextLink from 'next/link';
import { Grid, Card, CardActionArea, CardMedia, Box, Typography, Link, Chip, CardContent, Button, ListItem, List, Snackbar } from '@mui/material';

import { ICartProduct, IProduct, ISize } from '../../interfaces';
import { AddOutlined } from '@mui/icons-material';
import { CartContext } from '../../context';
import { useRouter } from 'next/router';

interface Props {
    product: IProduct;
}

export const ProductCard:FC<Props> = ({ product }) => {
    const router = useRouter();
    const { addProductToCart } = useContext(CartContext);
    const [isHovered, setIsHovered] = useState(false);
    const [quickAddHovered, setQuickAddHovered] = useState(false);
    const [isImageLoaded, setIsImageLoaded] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);

    const productImage = useMemo(() => {
        return isHovered
            ? product.images[1]
            : product.images[0]
    }, [isHovered, product.images]);

    const handleAddProduct = (size: ISize) => {
        setSnackbarOpen(true);
        const newProductToAdd = {
            _id: product._id,
            title: product.title,
            slug: product.slug,
            image: product.images[0],
            price: product.price,
            gender: product.gender,
            size,
            quantity: 1
        }

        addProductToCart(newProductToAdd);
    }

    const handleSnackbarClose = () => setSnackbarOpen(false);

    return (
        <Grid 
            item 
            xs={6} 
            sm={4}
        >
            <Card
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                sx={{ position: 'relative' }}
            >
                <NextLink href={`/product/${ product.slug }`} passHref prefetch={ false }>
                    <Link>
                        <CardActionArea>
                            {
                                (product.inStock === 0) && (
                                    <Chip 
                                        color='primary'
                                        label='Sin existencias'
                                        sx={{ position: 'absolute', zIndex: 1, top: '5px', left: '5px'}}
                                    />
                                )
                            }
                            <CardMedia
                                component='img'
                                className='fadeIn'
                                image={ productImage }
                                alt={ product.title }
                                onLoad={ () => setIsImageLoaded(true) }
                                sx={{ borderRadius: 0 }}
                            />
                        </CardActionArea>
                    </Link>
                </NextLink>
                {
                    isHovered && product.inStock > 0 && (
                        <CardContent
                            sx={{ 
                                position: 'absolute', 
                                zIndex: 1, 
                                bottom: 0, 
                                left: 0, 
                                width: '100%', 
                                bgcolor: '#ffffff',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                padding: '0 16px 0 !important',
                                height: '80px',
                                display: { xs: 'none', md: 'flex' }
                            }}
                            onMouseEnter={() => setQuickAddHovered(true)}
                            onMouseLeave={() => setQuickAddHovered(false)}
                        >
                            {
                                quickAddHovered 
                                ? (
                                    <>
                                        <Typography variant='subtitle1'>Talla</Typography>
                                        <List sx={{ display: 'flex', flexWrap: 'wrap', py: 0 }}>
                                            {
                                                product.sizes.map(size => (
                                                    <ListItem 
                                                        key={size}
                                                        sx={{ 
                                                            py: 0, 
                                                            px: '5px', 
                                                            flex: 0,
                                                            ':hover': { cursor: 'pointer', color: 'secondary.main' }
                                                        }}
                                                        onClick={ () => handleAddProduct(size) }
                                                    >
                                                        {size}
                                                    </ListItem>
                                                ))
                                            }
                                        </List>
                                    </>
                                )
                                : (
                                    <Button 
                                        fullWidth 
                                        endIcon={ <AddOutlined /> } 
                                        sx={{ ':hover': { bgcolor: '#ffffff', color: '#1E1E1E' }, py: 0 }}
                                    >
                                        <Typography variant='subtitle1'>Añadir rápido</Typography>
                                    </Button>
                                )
                            }
                        </CardContent>
                    )
                }
            </Card>

            <Box sx={{ mt: 1, display: isImageLoaded ? 'block' : 'none' }} className='fadeIn'>
                <Typography fontWeight={ 700 }>{ product.title }</Typography>
                <Typography fontWeight={ 500 }>{`$${ product.price }`}</Typography>
            </Box>

            <Snackbar
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                open={ snackbarOpen }
                autoHideDuration={ 4000 }
                message='Producto añadido al carrito'
                onClose={ handleSnackbarClose }
                sx={{ ':hover': { cursor: 'pointer' }}}
                onClick={ () => router.push('/cart') }
            />
        </Grid>
    )
}
