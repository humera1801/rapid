"use client";

import Footer from '@/components/Dashboard/Footer';
import Header from '@/components/Dashboard/Header';
import CreateQuotation from '@/components/Quatation/CreateQuotation'
import React from 'react'

const page = () => {
    return (
        <>

              <Header/>
            <CreateQuotation />

            <Footer/>


        </>
    )
}

export default page