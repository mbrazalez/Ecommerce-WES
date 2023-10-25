import Navbar from '@/components/Navbar';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import React from 'react';

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div className = 'flex min-h-screen flex-col'>
            <Navbar />
            <Header />
            <main className = 'mx-auto w-full max-w-7xl px-4 py-4 sm_px-6 lg:px-8'>
                {children}
            </main>
            <Footer />
        </div>
    )
}// px-4 por defecto, pero si se entra desde una pantalla más larga, se pone px-6, y si se entra desde una pantalla más grande, se pone px-8