"use client";

import CabbookingList from '@/app/Api/CabBooking/CabbookingList';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { SubmitHandler, useFieldArray, useForm } from 'react-hook-form';
import EditTicketData from '@/app/Api/EditTicketData';
import EditParcelDataList from '@/app/Api/EditParcelDataList';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinusCircle, faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import parceldate from '@/app/Api/FireApis/DataFilter/parceldate';
import handlevendorPrint from '@/components/Vendor/VedorVoucher';

interface FormData {
    id: any;
    particulars: any;
    parcel_id: any;
    cb_id?: number;
    vendor_name: string;
    gst_no: string;
    bank_name: string;
    ac_no: string;
    ac_type: string;
    ifsc_code: string;
    bank_branch: string;
    transaction_id: { upi_id: string }[];
    created_by: any;
    vendor_address: any;
    vendor_no: any;
    vendor_type: any;
    created_by_name: any
    payment_details: string;

    payment_method: string;
    total_amount: string;
    paid_amount: string;

    booking_type: string;

}

interface CabVendorpaymentProps {
    paymentinitialData?: any;
    PaymentId: number | null;
}

const CabVendorpayment: React.FC<CabVendorpaymentProps> = ({ paymentinitialData, PaymentId }) => {
    const [vendorData, setvendoredata] = useState<any>("");
    const [ParcelData, setParcelData] = useState<any>("");

    const [error, setError] = useState<string>('');
    const [hasPaymentDetails, setHasPaymentDetails] = useState(false);

    const { register, handleSubmit, watch, setValue, control } = useForm<FormData>({
        defaultValues: {
            payment_details: "",


        }
    });
    const { fields, append, remove } = useFieldArray({
        control,
        name: 'transaction_id',
    });


    useEffect(() => {
        const fetchData = async () => {
            try {
                const cb_id = new URLSearchParams(window.location.search).get("id");
                if (cb_id) {
                    const response = await CabbookingList.GetcabBookingId(cb_id);
                    const data = response.data[0];
                    setParcelData(data);
                    if (data) {
                        const bookingtype = "cab";
                        const vendor = await EditParcelDataList.getvendorParcelpayment(bookingtype)
                        console.log(vendor.data);
                        setvendoredata(vendor.data);



                    }

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



    const [vendorDetails, setVendorname] = useState<any>('');


    const fetchVendorData = async (id: string) => {
        try {
            const response = await CabbookingList.getvendorIdData(id);
            setVendorname(response.data);
            setValue("bank_name", response.data.bank_name)
            setValue("bank_branch", response.data.bank_branch)
            setValue("ifsc_code", response.data.ifsc_code)
            setValue("ac_no", response.data.ac_no)
            setValue("ac_type", response.data.ac_type)
            setValue("bank_name", response.data.bank_name)
            setValue("bank_name", response.data.bank_name)
            const transactionData = response.data.transaction_id || [];
            transactionData.forEach((upiId: string) => {
                const cleanedUpiId = upiId.trim().replace(/\s+/g, '');
                append({ upi_id: cleanedUpiId });
            });


            console.log("Vendor Data:", response.data);
        } catch (error) {
            console.error("Error fetching vendor data:", error);
        }
    };

    const handleVendorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedVendorId = e.target.value;
        if (selectedVendorId) {
            fetchVendorData(selectedVendorId);

        }
        setValue("transaction_id", [])
    };








    const onSubmit: SubmitHandler<FormData> = async (formData) => {

        const dataToSubmit = {
            ...formData,
            booking_type: 'cab',
            // vendor_name: vendorName.vendor_name,
            booking_id: ParcelData.cb_id,
            vendor_id: vendorDetails.id,
            created_by: localStorage.getItem('userData'),

        };

        console.log("Form Data:", dataToSubmit);
        try {
            const response = await axios.post('http://192.168.0.106:3001/vendor/add_vendor_payment', dataToSubmit);
            console.log('Data submitted successfully:', response.data);

            if (ParcelData?.cb_id) {
                const id = response.data.data.voucher_no;
                console.log('.............', response.data.voucher_no);

                try {
                    const getTDetail = await EditParcelDataList.getvendorVoucher(id);
                    console.log("Fetched details:", getTDetail.data[0]);
                    handlevendorPrint(getTDetail.data[0]);

                } catch (error) {
                    console.error('Error fetching ticket data:', error);
                }
            }
        } catch (error) {
            console.error('Error updating data:', error);
        }
    };

    return (
        <div className='container'>


            <form onSubmit={handleSubmit(onSubmit)}>

                <div className="row mb-3">
                    <div className="col-lg-3 col-sm-6 mb-3">
                        <label className="form-label" htmlFor="driverName">Vendor Name</label>
                        <select onChange={handleVendorChange}
                            className="form-control form-control-sm" id="driverName">
                            <option value="">--Select--</option>
                            {vendorData && vendorData.length > 0 && vendorData.map((vendors: any) => (
                                <option key={vendors.id} value={vendors.id}>{vendors.vendor_name}</option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className="row mb-3">
                    <div className="col-lg-3 col-sm-6">
                        <label className="form-label" htmlFor="particulars">Particulars</label>

                        <textarea
                            {...register("particulars")}

                            className="form-control form-control-sm"
                            id="particulars"
                            placeholder="Enter Amount"
                        />


                    </div>

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
                <div className="row mb-1">
                    <div className="col-md-12">
                        <h6 style={{ fontSize: "13px" }}>Bank Detail:</h6>
                    </div>
                    <hr />
                </div>
                <div className="row mb-1">
                    <div className="col-lg-3">
                        <label className="form-label " htmlFor="bank_name">Bank Name</label>
                        <input
                            {...register('bank_name')}
                            className="form-control form-control-sm"
                            type='text'
                            id='bank_name'

                            placeholder="Enter bank name"

                        />

                    </div>
                    <div className="col-md-4 mb-3">
                        <label className="form-label" htmlFor="ac_no">A/c No:</label>
                        <input
                            {...register('ac_no')}
                            className="form-control form-control-sm"
                            type='text'

                            id='ac_no'
                            placeholder="Enter account number"


                        />

                    </div>
                    <div className="col-md-3 mb-3">
                        <label className="form-label" htmlFor="ac_type">A/c Type:</label>
                        <input
                            {...register('ac_type')}
                            className="form-control form-control-sm"
                            type='text'
                            id='ac_type'
                            placeholder="Enter account type"
                        />

                    </div>

                </div>
                <div className="row mb-3">
                    <div className="col-md-4 mb-4">
                        <label className="form-label" htmlFor="ifsc_code">IFSC code:</label>
                        <input
                            {...register('ifsc_code')}
                            className="form-control form-control-sm"
                            type='text'

                            id='ifsc_code'
                            placeholder="Enter IFSC code"


                        />

                    </div>
                    <div className="col-lg-4">
                        <label className="form-label " htmlFor="bank_branch">Bank Brance</label>
                        <input
                            {...register('bank_branch')}
                            className="form-control form-control-sm"
                            type='text'
                            id='bank_branch'
                            placeholder="Enter bank branch"

                        />

                    </div>
                    {fields.map((field, index) => (
                        <div className="row" key={field.id}>
                            <div className="col-lg-3">
                                <label className="form-label">UPI Id</label>
                                <input
                                    className="form-control form-control-sm qty_cnt"
                                    type="text"
                                    {...register(`transaction_id.${index}.upi_id`, {
                                        required: "true",
                                        pattern: /^[0-9A-Za-z.-]{2,256}@[A-Za-z]{2,64}$/
                                    })}
                                    placeholder="Enter UPI"
                                    disabled
                                />
                            </div>


                        </div>
                    ))}


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
                            className="form-control form-control-sm"
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
                                    className="form-control form-control-sm"
                                    placeholder="Enter transaction ID"
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

export default CabVendorpayment;
