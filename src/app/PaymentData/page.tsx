"use client";
import Header from '@/components/Dashboard/Header';
import PaymentList from '@/components/Payment/PaymentList';
import React from 'react'

const page = () => {
    return (
        <div>

            <Header />

            <PaymentList />

        </div>
    )
}

export default page