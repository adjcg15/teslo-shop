import { FC, ReactNode } from 'react';

import { SideMenu } from '../ui';
import { AdminNavbar } from '../admin';
import { Box, Typography } from '@mui/material';
import Head from 'next/head';

interface Props {
    headerTitle: string;
    title: string;
    subTitle: string;
    icon?: JSX.Element;
    children: ReactNode;
}

export const AdminLayout:FC<Props> = ({ headerTitle, children, title, subTitle, icon }) => {
    return (
        <>
            <Head>
                <title>{ headerTitle }</title>
            </Head>
            <nav>
                <AdminNavbar />
            </nav>

            <SideMenu />

            <main style={{
                margin: '80px auto',
                maxWidth: '1440px',
                padding: '0px 30px'
            }}>
                <Box display='flex' flexDirection='column'>
                    <Box display='flex' alignItems='center'>
                        { icon }
                        <Typography sx={{ ml: 1 }} variant='h1' component='h1'>{ title }</Typography>
                    </Box>
                    <Typography variant='h2' sx={{ mb: 2 }}>{ subTitle }</Typography>
                </Box>
                <Box className='fadeIn'>
                    { children }
                </Box>
            </main>
        </>
    )
}