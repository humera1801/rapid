"use client";

import Header from '@/components/Dashboard/Header';

import FireService from '@/components/Fire/Servicee/FireService';
import React from 'react'

const Page = () => {
    return (


        <>
            <Header />

            <div className="container">
                <br />

 <FireService/>
            </div>
        </>
    )
}

export default Page