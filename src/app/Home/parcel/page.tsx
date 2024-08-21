import Header from '@/components/Dashboard/Header'
import ParcelBook from '@/components/Parcel/ParcelBooking'
import TicketBook from '@/components/Ticket/TicketBook'
import React from 'react'

const page = () => {
    return (
        <>



            <Header />
            <br />
            <div className="container">
                <ParcelBook />
            </div>
        </>
    )
}

export default page