"use client"

import CreateCabBooking from '@/components/CabBooking/CreateCabBooking'
import AuthProvider from '@/components/Dashboard/AuthProvider'
import Footer from '@/components/Dashboard/Footer'
import Header from '@/components/Dashboard/Header'
import CabLoadingSpinner from '@/components/Loading/cabLoader'
import useLoading from '@/components/Loading/UseLoading'
import React, { Suspense, useEffect, useState } from 'react'

const page = () => {

  const loading = useLoading(true, 1000);  

  return (
    <>
      <AuthProvider>
        {loading ? (
          <CabLoadingSpinner />
        ) : (
          <Suspense fallback={<CabLoadingSpinner />}>

        <Header />
        <CreateCabBooking />
        </Suspense>
        )}
      </AuthProvider >


    </>
  )
}

export default page