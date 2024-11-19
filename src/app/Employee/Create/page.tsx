"use client";
import CreateEmployee from '@/components/AddEmployee/CreateEmployee';
import AuthProvider from '@/components/Dashboard/AuthProvider';
import Header from '@/components/Dashboard/Header';
import React from 'react'

const page = () => {
  return (
    <>
      <AuthProvider>
        
         <Header />
        <CreateEmployee />

      </AuthProvider>

    </>
  )
}

export default page