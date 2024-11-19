"use client";

import Header from '@/components/Dashboard/Header';
import ViewTicketDetail from '@/components/Ticket/ViewTicketDetail'
import React, { Suspense, useEffect, useState } from 'react'
import "../../../../public/css/style.css"
import Footer from '@/components/Dashboard/Footer';
import AuthProvider from '@/components/Dashboard/AuthProvider';
import LoadingSpinner from '@/components/Loading/BusLoader';

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
            <ViewTicketDetail />
            <Footer />
          </Suspense>
        )}
      </AuthProvider >

    </>
  )
}

export default page