"use client";

import Header from '@/components/Dashboard/Header';
import FireIngredient from '@/components/Fire/Ingredient/FireIngredient';
import React from 'react'

const Page = () => {
    return (


        <>
            <Header />

            <div className="container">
                <br />

                <FireIngredient />
            </div>
        </>
    )
}

export default Page