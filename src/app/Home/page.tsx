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
import Footer from '@/components/Dashboard/Footer';
import Homepage from '@/components/Dashboard/Homepage';


const page: React.FC = () => {










    return (
        <>
            <AuthProvider>
               <div >
               <Header />
                <br />
                {/* <h3>Wel-Come to Dashboard</h3> */}
                <div style={{paddingBottom:"2%"}}>
                <Homepage records={[]} />
                </div>
                <Footer />

               </div>


            </AuthProvider>
        </>
    )
}

export default page