"use client";

import CabbookingList from '@/app/Api/CabBooking/CabbookingList';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { generateCabPaymentReceiptPrint } from '../CabBooking/CabbookingPdf/cabpaymentreceipt'
import getFireBookingId from '@/app/Api/FireApis/FireExtinghsherList/getFireBookingId';

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
    total_paid_amount: any;
    client_id: any;
}

interface FirePaymentProps {
    paymentinitialData?: any;
    PaymentId: number | null;
}

const FirePayment: React.FC<FirePaymentProps> = ({ paymentinitialData, PaymentId }) => {
    const [fireData, setFireData] = useState<any>("");
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
                const q_quotation_no = new URLSearchParams(window.location.search).get("id");
                if (q_quotation_no) {
                    const response = await getFireBookingId.GetFireBookingId(q_quotation_no);
                    setFireData(response.data[0]);
                    const data = response.data[0];
                    setHasPaymentDetails(data.paymentDetails && data.paymentDetails.length > 0);

                    setValue("name", data.client_firstName);
                    setValue("total_amount", data.q_final_amount)
                    setValue("advance_paid", data.total_paid_amount !== undefined ? data.total_paid_amount : 0);
                    setValue("client_id", data.client_id)




                    if (data.paymentDetails && data.paymentDetails.length > 0) {
                        const lastPaymentDetail = data.paymentDetails[data.paymentDetails.length - 1];
                        setValue("total_paid_amount", data.total_paid);


                    } else {
                        // setValue("actual_amount", data.endJourneyDetails.pending_balance);
                    }


                    setError('');
                } else {
                    setError('Id not found.');
                }
            }
            catch (error) {

                console.error('Error fetching fire data:', error);
            }
        };
        const handleURLChange = () => {
            const urlParams = new URLSearchParams(window.location.search);
            const febking_id = urlParams.get("id");
            if (febking_id) {
                getTicketDetail(febking_id);
            } else {
                setFireData(null);
            }
        };
        fetchData();
        window.addEventListener('popstate', handleURLChange);
        handleURLChange();
        return () => {
            window.removeEventListener('popstate', handleURLChange);
        };
    }, []);


    const getTicketDetail = async (q_quotation_no: string) => {
        try {
            const getTDetail = await getFireBookingId.GetFireBookingId(q_quotation_no);
            setFireData(getTDetail.data[0]);
            setError("");
            console.log("Fire details", getTDetail.data[0]);


        } catch (error) {
            setError("Error fetching fire data. Please try again later.");
            console.error("Error fetching fire data:", error);
        }
    };


    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');

    const handlePaymentMethodChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
        setSelectedPaymentMethod(event.target.value);
    };

    const paymentStatus = watch("payment_status");





    // const totalAmount = watch('total_amount');
    // const advancePaid = watch('advance_paid');
    // const paidAmount = watch('paid_amount');

    // useEffect(() => {
    //     if (totalAmount) {
    //         const total = parseFloat(totalAmount) || 0;
    //         const advance = parseFloat(advancePaid) || 0;
    //         const paid = parseFloat(paidAmount) || 0;

    //         const totalPaidAmount = Math.round(advance + paid);
    //         setValue("total_paid_amount", totalPaidAmount.toString());

    //         const pendingAmount = Math.max(0, Math.round(total - totalPaidAmount));
    //         setValue("pending_amount", pendingAmount.toString());
    //         setValue("payment_status", pendingAmount > 0 ? "pending" : "paid");
    //     }
    // }, [totalAmount, advancePaid, paidAmount, setValue]);





    const onSubmit: SubmitHandler<FormData> = async (formData) => {
        const dataToSubmit = {
            ...formData,
            booking_type: 'fire_booking',
            id: fireData.febking_id,
            created_by: localStorage.getItem('userData'),
        };

        console.log("Form Data:", dataToSubmit);
        try {
            const response = await axios.post('http://192.168.0.105:3001/payment/add_new_payment', dataToSubmit);
            console.log('Data submitted successfully:', response.data);
            if (fireData?.q_quotation_no) {
                const q_quotation_no = fireData.q_quotation_no
                    ;
                try {
                    const getTDetail = await getFireBookingId.GetFireBookingId(q_quotation_no);
                    console.log("Fetched details:", getTDetail.data[0]);
                    const value = getTDetail.data[0]
                    const lastPaymentDetail = value.payment_details[value.payment_details.length - 1];
                    generateCabPaymentReceiptPrint(lastPaymentDetail)
                    window.location.reload();
                } catch (error) {
                    console.error('Error fetching ticket data:', error);
                }
            }
            // window.location.reload();

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
                            {...register('payment_method', {
                                required: true
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
                        {(selectedPaymentMethod === 'gpay' || selectedPaymentMethod === 'phonepay' || selectedPaymentMethod === 'paytm' || selectedPaymentMethod === 'cheque') && (
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

export default FirePayment;
