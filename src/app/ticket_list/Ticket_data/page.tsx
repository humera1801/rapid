"use client";

import Header from '@/components/Dashboard/Header';
import ViewTicketDetail from '@/components/Ticket/ViewTicketDetail'
import React from 'react'
import "../../../../public/css/style.css"
import Footer from '@/components/Dashboard/Footer';

const page = () => {
  return (
    <>
    
    <Header/>
  <ViewTicketDetail/>
  <Footer/>

    
    </>
  )
}

export default page