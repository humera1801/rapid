"use client";


import ParcelBook from '@/components/Parcel/ParcelBooking';
import TicketBook from '@/components/Ticket/TicketBook';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import { useRouter } from 'next/navigation';
import Header from '@/components/Dashboard/Header';
import AuthProvider from '@/components/Dashboard/AuthProvider';
import FileUploadForm from '@/components/FireFormexample';
import App from '@/components/data';
import GenericPdfDownloader from '@/components/data';
import DownloadPdf from '@/components/data';




const page: React.FC = () => {










    return (
        <>
            <AuthProvider>
                <Header />
                <br />


   
                <div className="container">

              
                    <Tabs
                        defaultActiveKey="home"
                        id="uncontrolled-tab-example"
                        className="mb-3"
                    >
                        <Tab eventKey="home" title="Ticket Booking">
                            <TicketBook />
                            {/* <YourComponent/> */}
                        </Tab>
                        <Tab eventKey="profile" title="Parcel Booking">
                            <ParcelBook />
                        </Tab>

                    </Tabs>



                </div>
            </AuthProvider>
        </>
    )
}

export default page