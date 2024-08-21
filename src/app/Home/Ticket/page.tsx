"use client";

import AuthProvider from '@/components/Dashboard/AuthProvider'
import Header from '@/components/Dashboard/Header'
import TicketBook from '@/components/Ticket/TicketBook'
import React from 'react'

const page = () => {
    return (
        <>


            <AuthProvider>
                <Header />
                <br />
                <div className="container">
                    <TicketBook />
                </div>
            </AuthProvider>
        </>
    )
}

export default page