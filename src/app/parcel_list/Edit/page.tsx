"use client"
import Footer from '@/components/Dashboard/Footer'
import Header from '@/components/Dashboard/Header'
import EditParcelData from '@/components/Parcel/EditParcelData'
import React from 'react'

const page = () => {
  return (
    <>
    
    <Header/>
    {/* <ParcelDetails/> */}
    
    <EditParcelData/>
    <Footer/>

    </>
  )
}

export default page