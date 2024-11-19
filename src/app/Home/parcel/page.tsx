"use client";

import AuthProvider from '@/components/Dashboard/AuthProvider';
import Footer from '@/components/Dashboard/Footer';
import Header from '@/components/Dashboard/Header';
import LoadingSpinner from '@/components/Loading/ParcelLoader'; 
import ParcelBook from '@/components/Parcel/ParcelBooking'; 
import React, { Suspense, useState, useEffect } from 'react';

const Page = () => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false); 
        }, 1000); 
        return () => clearTimeout(timer);
    }, []);

    return (
        <>
            <AuthProvider>
                {loading ? (
                    <LoadingSpinner />
                ) : (
                    <Suspense fallback={<LoadingSpinner />}>
                        <Header />
                        <br />
                        <ParcelBook />
                        <Footer />

                    </Suspense>
                )}
            </AuthProvider>
        </>
    );
};

export default Page;
