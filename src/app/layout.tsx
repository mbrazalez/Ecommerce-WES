import './globals.css';
import { Inter } from 'next/font/google';
import React from 'react';
import { CartItemsProvider } from '@/providers/cartItemsProvider';
import { NextAuthProvider} from '@/providers/NextAuthProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Chanchi Skates',
  description: 'Skates e-shop application for the WES course',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      <body className={`${inter.className}`}>
        <NextAuthProvider>
          <CartItemsProvider>
            {children}
          </CartItemsProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}
