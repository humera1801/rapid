import Header from '@/components/Dashboard/Header'
import { Certificate } from '@/components/Fire/certificate/certificateform'

import React from 'react'

const page = () => {
  return (
    <>


      <Header />
      <div className="container">
        <Certificate />
      </div>
    </>
  )
}

export default page