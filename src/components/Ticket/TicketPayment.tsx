"use client";

import CabbookingList from '@/app/Api/CabBooking/CabbookingList';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { generateCabPaymentReceiptPrint } from '../CabBooking/CabbookingPdf/cabpaymentreceipt'
import EditTicketData from '@/app/Api/EditTicketData';

interface FormData {
    id: any;
    cb_id?: number;
    name: string;
    advance_paid: string;
    payment_details: string;
    discount?: string;
    discount_amount: string;
    pending_amount: string;
    payment_method: string;
    total_amount: string;
    paid_amount: string;
    payment_status: string;
    booking_type: string;
    actual_amount: any;
    client_id:any;
    total_paid_amount: any;
}

interface TicketPaymentProps {
    paymentinitialData?: any;
    PaymentId: number | null;
}

const TicketPayment: React.FC<TicketPaymentProps> = ({ paymentinitialData, PaymentId }) => {
    const [ticketData, setticketData] = useState<any>("");
    const [error, setError] = useState<string>('');
    const [hasPaymentDetails, setHasPaymentDetails] = useState(false);

    const { register, handleSubmit, watch, setValue } = useForm<FormData>({
        defaultValues: {
            payment_details: "",

        }
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const ticketToken = new URLSearchParams(window.location.search).get("token");
                if (ticketToken) {
                    const response = await EditTicketData.getEditTicktetData(ticketToken);
                    const data = response.data[0];
                    
                    setticketData(data);
                  

                    setValue("total_amount", data.final_total_amount);

                    if (data.paymentDetails && data.paymentDetails.length > 0) {
                        const lastPaymentDetail = data.paymentDetails[data.paymentDetails.length - 1];
                        setValue("total_paid_amount", data.total_paid);
                      

                    } else {
                        // setValue("actual_amount", data.endJourneyDetails.pending_balance);
                    }

                    setValue("name", data.client_firstName);
                    setValue("client_id" , data.client_id)
                    setError('');
                } else {
                    setError('Id not found.');
                }
            } catch (error) {
                console.error('Error fetching ticket data:', error);
                setError('An error occurred while fetching data.');
            }
        };

        fetchData();
    }, []);


    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');

    const handlePaymentMethodChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
        setSelectedPaymentMethod(event.target.value);
    };

    const paymentStatus = watch("payment_status");









    



    const onSubmit: SubmitHandler<FormData> = async (formData) => {
        // const id = new URLSearchParams(window.location.search).get("id");
        const dataToSubmit = {
            ...formData,
            booking_type: 'ticket_booking',
            id: ticketData.id,
            created_by: localStorage.getItem('userData'),
        };

        console.log("Form Data:", dataToSubmit);
        try {
            const response = await axios.post('http://192.168.0.105:3001/payment/add_new_payment', dataToSubmit);
            console.log('Data submitted successfully:', response.data);
            if (ticketData?.id) {
                const id = ticketData.id;
                try {
                    const getTDetail = await EditTicketData.getEditTicktetData(id);
                    console.log("Fetched details:", getTDetail.data[0]);
                    const value = getTDetail.data[0]
                    const lastPaymentDetail = value.payment_details[value.payment_details.length - 1];
                    generateCabPaymentReceiptPrint(lastPaymentDetail)
                    window.location.reload();
                } catch (error) {
                    console.error('Error fetching ticket data:', error);
                }
            }
            // window.location.reload()
        } catch (error) {
            console.error('Error updating data:', error);
        }
    };

    return (
        <div className='container'>

            <br />

            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="row mb-3">
                    <div className="col-lg-5 col-sm-6">
                        <label className="form-label" htmlFor="name">Name</label>
                        <input {...register("name")} type="text" className="form-control form-control-sm" id="name" placeholder="Enter name" />
                    </div>
                </div>

                <div className="row mb-3">
                    <div className="col-lg-3 col-sm-6">
                        <label className="form-label" htmlFor="total_amount">Total Amount</label>
                        <input
                            {...register("total_amount")}
                            readOnly
                            disabled
                            type="text"
                            className="form-control form-control-sm"
                            id="total_amount"
                            placeholder="Total Amount"
                        />
                    </div>





                    <div className="col-lg-3 col-md-4 col-sm-6">
                        <label className="form-label">Total Paid Amount</label>
                        <input
                            className="form-control form-control-sm"
                            {...register('total_paid_amount')}
                            type="text"
                            readOnly
                            disabled
                            placeholder='Actual Payable Amount'
                        />
                    </div>
                </div>
                <div className="row mb-3">

                    <div className="col-lg-3 col-sm-6">
                        <label className="form-label" htmlFor="paid_amount">Paid Amount</label>

                        <input
                            {...register("paid_amount")}
                            type="text"

                            className="form-control form-control-sm"
                            id="paid_amount"
                            placeholder="Enter Amount"
                        />


                    </div>
                </div>
           

                <div className="row mt-4">
                    <div className="col-md-12">
                        <h5>Payment Mode:</h5>
                    </div>
                    <hr />
                </div>

                <div className="row mb-3">

                    <div className="col-lg-4">
                        <label className="form-label">Payment Method</label>
                        <select
                            {...register('payment_method' ,{
                                required:true
                            })}
                            value={selectedPaymentMethod}
                            onChange={handlePaymentMethodChange}
                            className="form-control"
                        >
                            <option value="">--Select--</option>
                            <option value="cash">Cash</option>
                            {/* <option value="transfer">Transfer</option> */}
                            <option value="gpay">G-pay</option>
                            <option value="phonepay">PhonePay</option>
                            <option value="paytm">Paytm</option>
                            <option value="cheque">Cheque</option>
                            {/* <option value="credit">Credit</option> */}
                        </select>
                        {(selectedPaymentMethod === 'gpay' || selectedPaymentMethod === 'phonepay' || selectedPaymentMethod === 'paytm' || selectedPaymentMethod === 'cheq') && (
                            <div className="mt-2">
                                <label className="form-label">Payment Details</label>
                                <input
                                    {...register('payment_details')}
                                    type="text"
                                    className="form-control"
                                    placeholder="Enter transaction ID"
                                // Use appropriate handler or register here if using form libraries
                                />
                            </div>
                        )}
                    </div>
                </div>


                <button type="submit" className="btn btn-success btn-sm" >Submit</button>
            </form>
        </div>
    );
}

export default TicketPayment;
