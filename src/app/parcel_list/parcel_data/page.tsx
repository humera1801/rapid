"use client";

import AuthProvider from '@/components/Dashboard/AuthProvider';
import Footer from '@/components/Dashboard/Footer';
import Header from '@/components/Dashboard/Header';
import LoadingSpinner from '@/components/Loading/ParcelLoader';
import ViewParcelData from '@/components/Parcel/ViewParcelData'
import React, { Suspense, useEffect, useState } from 'react'

const page = () => {

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


            <ViewParcelData />

            <Footer />
          </Suspense>
        )}
      </AuthProvider >




    </>
  )
}

export default page