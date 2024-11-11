"use client";
import React, { useEffect, useState } from 'react';
import { useFieldArray, useForm, SubmitHandler } from 'react-hook-form';

import CabbookingList from '@/app/Api/CabBooking/CabbookingList';
import { Button } from 'react-bootstrap';

import { generateCabPaymentReceiptPrint } from "../CabBooking/CabbookingPdf/cabpaymentreceipt"
import Link from 'next/link';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import GetPaymentListApi from '@/app/Api/PaymentApi/GetPaymentListApi';
import ClientListApi from '@/app/Api/ClientApi/ClientListApi';
import EmployeeList from '@/app/Api/Employee/EmployeeList';
import Header from '../Dashboard/Header';









const Viewvendor = () => {

    //-------------------------------------------------------------------------------------------------------------------------------------





    const [vendorData, setvendorData] = useState<any>("");
    const [error, setError] = useState<string>('');
    const [imageName, setImageName] = useState<string>('');
    const [idimageProof, setidimageProof] = useState<any>('');

    useEffect(() => {
        const fetchData = async () => {
            const id = new URLSearchParams(window.location.search).get("id");
            if (id) {
                try {
                    const response = await CabbookingList.getvendorIdData(id);
                    if (response.data) {
                        setvendorData(response.data);
                        console.log(response.data);
                        setError('');
                    } else {
                        setError('No vendor data found.');
                    }
                } catch (error) {
                    setError('Error fetching vendor data.');
                    console.error('Error fetching data:', error);
                }
            } else {
                setError('Id not found.');
            }
        };

        fetchData();
    }, []);

    // const getTicketDetail = async (client_id: string) => {
    //     try {
    //         const getTDetail = await ClientListApi.getclientdataView(client_id);
    //         setvendorData(getTDetail.data);
    //         setError("");
    //         console.log("emp Details:", getTDetail.data);
    //     } catch (error) {
    //         setError("Error fetching emp data. Please try again later.");
    //         console.error("Error fetching emp data:", error);
    //     }
    // };



    //-------------------------------------------------------------------------------------------------------------------------------------

    //-----------------------------------------------------------------------------------------------------------
    return (
        <><Header />
            <div className="container">
                <br />
                <div className="mb-3" style={{ display: "flex", justifyContent: "space-between" }}>
                    <h5>View Vendor Details </h5>
                    <div style={{ fontSize: "12px" }}>
                        <Link href="/Vendor/vendorList" className="btn btn-sm btn-primary" style={{ float: "right", marginRight: "8px", fontSize: "12px" }}>
                            Back
                        </Link>


                    </div>
                </div>
                <div className="card cardbox" style={{ width: "auto" }} >




                    {vendorData && (
                        <div className="card-body" style={{ fontSize: "12px" }}>
                            <div className="row mb-3">
                                {/* Vendor ID */}
                                

                                {/* Vendor Name */}
                                <div className="col-lg-3 col-sm-6">
                                    <label className="form-label">Vendor Name: </label>
                                    <span>{vendorData.vendor_name}</span>
                                </div>

                                {/* Vendor Address */}
                                <div className="col-lg-3 col-sm-6">
                                    <label className="form-label">Vendor Address: </label>
                                    <span>{vendorData.vendor_address}</span>
                                </div>

                                {/* Vendor Mobile No */}
                                <div className="col-lg-3 col-sm-6">
                                    <label className="form-label">Vendor Mobile No: </label>
                                    <span>{vendorData.vendor_no}</span>
                                </div>
                            </div>

                            <div className="row mb-3">
                                {/* GST No */}
                                <div className="col-lg-3">
                                    <label className="form-label">GST No: </label>
                                    <span>{vendorData.gst_no}</span>
                                </div>

                                {/* Bank Name */}
                                <div className="col-lg-3">
                                    <label className="form-label">Bank Name: </label>
                                    <span>{vendorData.bank_name}</span>
                                </div>

                                {/* Account Number */}
                                <div className="col-lg-3">
                                    <label className="form-label">A/C No: </label>
                                    <span>{vendorData.ac_no}</span>
                                </div>

                                {/* Account Type */}
                                <div className="col-lg-3">
                                    <label className="form-label">A/C Type: </label>
                                    <span>{vendorData.ac_type}</span>
                                </div>
                            </div>

                            <div className="row mb-3">
                                {/* IFSC Code */}
                                <div className="col-lg-3">
                                    <label className="form-label">IFSC Code: </label>
                                    <span>{vendorData.ifsc_code}</span>
                                </div>

                                {/* Bank Branch */}
                                <div className="col-lg-3">
                                    <label className="form-label">Bank Branch: </label>
                                    <span>{vendorData.bank_branch}</span>
                                </div>

                                {/* Created By */}
                                <div className="col-lg-3">
                                    <label className="form-label">Created By: </label>
                                    <span>{vendorData.created_by_name}</span>
                                </div>
                            </div>


                        </div>



                    )}


                </div>



            </div >
        </>
    );
};

export default Viewvendor;

