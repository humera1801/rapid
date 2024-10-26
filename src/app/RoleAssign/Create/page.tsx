"use client";
import RoleForm from '@/components/AddEmployee/AddNewRole';
import Header from '@/components/Dashboard/Header';
import CreateRole from '@/components/RoleAssign/CreateRoleOLd';
import React from 'react'

const page = () => {
  return (
    <>
    <Header/>
    {/* <CreateRole/> */}
    
    <RoleForm/>
    
    </>
  )
}

export default page