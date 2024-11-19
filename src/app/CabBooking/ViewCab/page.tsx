"use client"

import CabView from '@/components/CabBooking/CabView'
import AuthProvider from '@/components/Dashboard/AuthProvider'
import Footer from '@/components/Dashboard/Footer'
import Header from '@/components/Dashboard/Header'
import CabLoadingSpinner from '@/components/Loading/cabLoader'
import useLoading from '@/components/Loading/UseLoading'
import React, { Suspense } from 'react'

const page = () => {

  const loading = useLoading(true, 1200);

  return (
    <>
      <AuthProvider>
        {loading ? (
          <CabLoadingSpinner />
        ) : (
          <Suspense fallback={<CabLoadingSpinner />}>

            <Header />
            <CabView/>
          </Suspense>
        )}
      </AuthProvider >
      {/* <Footer/> */}


    </>
  )
}

export default page
