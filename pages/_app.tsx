import type { AppProps } from 'next/app';
import { SessionProvider } from 'next-auth/react';

import { CssBaseline, ThemeProvider } from '@mui/material';
import { SWRConfig } from 'swr';

import { lightTheme } from '../themes';
import { AuthProvider, CartProvider, UiProvider } from '../context';

import '../styles/globals.css';

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <SWRConfig
            value={{
                fetcher: (resource, init) => fetch(resource, init).then(res => res.json())
            }}
        >
            <SessionProvider>
                <AuthProvider>
                    <CartProvider>
                        <UiProvider>
                            <ThemeProvider theme={ lightTheme }>
                                <CssBaseline />
                                <Component {...pageProps} />
                            </ThemeProvider>
                        </UiProvider>
                    </CartProvider>
                </AuthProvider>
            </SessionProvider>
        </SWRConfig>
    );
}

export default MyApp
