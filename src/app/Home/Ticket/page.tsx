"use client";

import AuthProvider from '@/components/Dashboard/AuthProvider'
import Header from '@/components/Dashboard/Header'
import TicketBook from '@/components/Ticket/BusTIcket';
import React from 'react'

const page = () => {
    return (
        <>


            <AuthProvider>
                
             
                <TicketBook />
            </AuthProvider>
        </>
    )
}

export default page