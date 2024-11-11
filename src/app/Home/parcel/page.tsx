import Footer from '@/components/Dashboard/Footer'
import Header from '@/components/Dashboard/Header'
import ParcelBook from '@/components/Parcel/ParcelBooking'
import TicketBook from '@/components/Ticket/OldTicketBook'
import React from 'react'

const page = () => {
    return (
        <>



            <Header />
            <br />
                <ParcelBook />

        </>
    )
}

export default page