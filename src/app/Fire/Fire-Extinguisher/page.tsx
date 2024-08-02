"use client";

import YourFormComponent from '@/components/Client';
import Header from '@/components/Dashboard/Header'
import FireData from '@/components/Fire/FireDataForm'
import React from 'react'

const page = () => {
  return (
    <>
    
    
    
    
    <Header/>
   <br/>

   
{/* 
   <div className="container-fluid">
<FireData/>
</div> */}

<FireData/>


{/* <div className="comtainer">
<YourFormComponent/>

</div> */}
    
    </>
  )
}

export default page