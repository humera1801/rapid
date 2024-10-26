"use client";


import ParcelBook from '@/components/Parcel/OldParcelBooking';
import TicketBook from '@/components/Ticket/OldTicketBook';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import { useRouter } from 'next/navigation';
import Header from '@/components/Dashboard/Header';
import AuthProvider from '@/components/Dashboard/AuthProvider';
import HtmlToPdf from "../../components/HtmlToPdf"


const page: React.FC = () => {










    return (
        <>
            <AuthProvider>
                <Header />
                {/* <Navbar/> */}
                <br />

                <div>
                    <h3>Wel-Come to Dashboard</h3>


                </div>

                {/* <Footer/> */}
            </AuthProvider>
        </>
    )
}

export default page