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









const PaymentDataView = () => {

    //-------------------------------------------------------------------------------------------------------------------------------------





    const [paymentData, setPaymentData] = useState<any>("");
    const [error, setError] = useState<string>('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const urlParams = new URLSearchParams(window.location.search);
                const receipt_no = urlParams.get("receipt_no");

                if (receipt_no) {
                    const response = await GetPaymentListApi.getreceiptpaymentdataView(receipt_no);
                    setPaymentData(response.data.data);
                    console.log("Payment Data:", response.data.data);
                    setError('');
                } else {
                    setError('Receipt number not found.');
                }
            } catch (error) {
                setError("Error fetching payment data. Please try again later.");
                console.error('Error fetching payment data:', error);
            }
        };

        const handleURLChange = () => {
            const urlParams = new URLSearchParams(window.location.search);
            const receipt_no = urlParams.get("receipt_no");

            if (receipt_no) {
                getTicketDetail(receipt_no);
            } else {
                setPaymentData(null);
                setError('Receipt number not found.');
            }
        };

        fetchData();
        window.addEventListener('popstate', handleURLChange);
        handleURLChange(); // Initial call on mount

        return () => {
            window.removeEventListener('popstate', handleURLChange);
        };
    }, []);

    const getTicketDetail = async (receipt_no: string) => {
        try {
            const getTDetail = await GetPaymentListApi.getreceiptpaymentdataView(receipt_no);
            setPaymentData(getTDetail.data[0]);
            setError("");
            console.log("Payment Details:", getTDetail.data[0]);
        } catch (error) {
            setError("Error fetching payment data. Please try again later.");
            console.error("Error fetching payment data:", error);
        }
    };



    //-------------------------------------------------------------------------------------------------------------------------------------
    const storedData = localStorage.getItem('userData');






    const router = useRouter();

    const handleDeleteTicket = async (cb_id: string, e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        console.log("id", cb_id);
        const formData = {
            cb_id: cb_id
        }
        try {
            const response = await axios.post(`http://192.168.0.106:3001/cabbooking/delete_cab_booking`, formData);
            console.log('Cab booking deleted successfully:', response.data);
            router.push("/CabBooking/CabList")
        } catch (error) {
            console.error('Error deleting Cab:', error);
        }
    };






    //-----------------------------------------------------------------------------------------------------------
    return (
        <>
            <br />
            <div className="container">
                <div  style={{ display: "flex", justifyContent: "space-between" }}>
                    <h5>View Payment Details </h5>
                    <div style={{ fontSize: "12px" }}>
                        {/* <Link href="/CabBooking/JourneyEnd" className="btn btn-sm btn-success" style={{ float: "right", marginRight: "8px" }}>Journey End</Link> */}



                        {/* <Button variant="danger" size="sm" className="btn btn-sm btn-success" style={{ float: "right", marginRight: "8px", fontSize: "12px" }} onClick={(e) => handleDeleteTicket(paymentData.cb_id, e)}>Delete</Button> */}

                        <Link href="/PaymentData" className="btn btn-sm btn-primary" style={{ float: "right", marginRight: "8px", fontSize: "12px" }}>
                            Back
                        </Link>


                    </div>
                </div>
                <br />

                <div className="card cardbox mb-3" style={{ width: "auto" }} >


                    {paymentData && (
                        <div className="card-body" style={{ fontSize: "12px" }}>
                            <div className=" d-flex flex-wrap">
                                <div className="col-lg-4">
                                    <label className="">Receipt no : </label><span> {paymentData.receipt_no}</span>
                                </div>
                                <div className="col-lg-4">
                                    <label className="">Payment by : </label><span> {paymentData.name}</span>
                                </div>
                                <div className="col-lg-3 col-sm-6">
                                    <label className="form-label" htmlFor="bdate">Booking Type: </label>
                                    <span> {paymentData.booking_type}</span>
                                </div>
                            </div>




                            <div className="row mt-4">
                                <div className="col-md-12">
                                    <h5>Payment Details:</h5>
                                </div>
                                <hr />

                            </div>
                            <div className="row mb-3">

                                <div className="col-lg-2 col-sm-6">
                                    <label className="form-label" htmlFor="bdate">Total Amount: </label>
                                    <span> {paymentData.total_amount}</span>

                                </div>

                                <div className="col-lg-2">
                                    <label className="form-label" htmlFor="Place_visit">paid amount:</label>
                                    <span> {paymentData.paid_amount}</span>
                                </div>







                                <div className="col-lg-2">
                                    <label className="form-label" htmlFor="Place_visit">Payment Method:</label>
                                    <span> {paymentData.payment_method}</span>
                                </div>
                                <div className="col-lg-2 col-sm-6 mb-2">
                                    <label className="form-label" htmlFor="vehicleNo">Payment Details:</label>
                                    <span> {paymentData.payment_details}</span>                                </div>

                                <div className="col-lg-2 col-sm-6 mb-2">
                                    <label className="form-label" htmlFor="vehicleNo">Created By:</label>
                                    <span> {paymentData.created_by_name}</span>                                </div>


                            </div>







                        </div>


                    )}


                </div>



            </div >
        </>
    );
};

export default PaymentDataView;

