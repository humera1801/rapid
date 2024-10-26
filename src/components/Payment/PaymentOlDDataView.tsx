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

interface FormData {
    cb_id: any;
    vehicle_type: any;
    booking_date: any;
    engaged_by: any;
    address: any;
    advance_amount: any;
    place_visit: any;
    rate_text: any;
    rate: any;
    firstName: string;
    client_city: string;
    client_state: string;
    client_pincode: string;
    email: string;
    gstNo: string;
    mobileNo: string;
    journey_start_date: any;
    created_by: any;
    vendorCode: any;
    client_id: any
    journey_end_date: any;
    created_by_name: any;
    cb_journey_end_date: any;
    cb_journey_start_date: any;
    cb_serial_no: any;
    cb_place_visit: any;
    cb_created_by: any;
    client_mobileNo: any;
    client_firstName: any;
    vehicle_no: any;
    driver_name: any;
    cb_booking_date: any;
    closing_kms: any;
    closing_time: any;
    closing_date: any;
    starting_time: any;
    starting_kms: any;
    waiting_date: any;
    starting_date: any;
    total_kms: any;
    waiting: any;
    rate_8hrs_80kms: any;
    rate_12hrs_300kms: any;
    extra_kms: any;
    extra_hrs: any;
    driver_allowance: any;
    night_charges: any;
    advance_rs: any;
    balance_rs: any;
    id:any;
    booking_type:any;

}

interface ClientData {
    client_id: number;
    client_firstName: string;
    client_address: string;
    client_email: string;
    client_gstNo: string;
    client_mobileNo: string;
    client_city: string;
    client_state: string;
    client_pincode: string;
    poNo: string;
    vendorCode: string;
}

interface Client {

    client_id: any,
    firstName: string;
    address: string;
    email: string;
    gstNo: string;
    mobileNo: string;
    vendorCode: string;
    poNo: string;
    client_city: string;
    client_state: string;
    client_pincode: string;
}






const PaymentDataView = () => {

    //-------------------------------------------------------------------------------------------------------------------------------------



    const [formData, setFormData] = useState<Client>({
        client_id: "",
        firstName: '',
        address: '',
        email: '',
        gstNo: '',
        vendorCode: '',
        poNo: '',
        mobileNo: '',
        client_city: "",
        client_state: "",
        client_pincode: "",
    });

    const [paymentData, setPaymentData] = useState<any>("");
    const [error, setError] = useState<string>('');


    useEffect(() => {
        const fetchData = async () => {
            try {
                const urlParams = new URLSearchParams(window.location.search);
                const id = urlParams.get("id");
                const booking_type = urlParams.get("booking_type"); // Correct this line
    
                if (id && booking_type) {
                    const response = await GetPaymentListApi.getpaymentdataView(booking_type, id); // Switch the order
                    setPaymentData(response.data.data);
                    console.log("Payment Data:", response.data.data);
                    setError('');
                } else {
                    setError('Id or booking type not found.');
                }
            } catch (error) {
                setError("Error fetching payment data. Please try again later.");
                console.error('Error fetching payment data:', error);
            }
        };
    
        const handleURLChange = () => {
            const urlParams = new URLSearchParams(window.location.search);
            const id = urlParams.get("id");
            const booking_type = urlParams.get("booking_type"); // Correct this line
    
            if (id && booking_type) {
                getTicketDetail(id, booking_type);
            } else {
                setPaymentData(null);
                setError('Id or booking type not found.');
            }
        };
    
        fetchData();
        window.addEventListener('popstate', handleURLChange);
        handleURLChange(); // Initial call on mount
    
        return () => {
            window.removeEventListener('popstate', handleURLChange);
        };
    }, []);
    
    const getTicketDetail = async (id: string, booking_type: string) => {
        try {
            const getTDetail = await GetPaymentListApi.getpaymentdataView(booking_type, id); // Switch the order
            setPaymentData(getTDetail.data[0]);
            setError("");
            console.log("Payment Details:", getTDetail.data);
        } catch (error) {
            setError("Error fetching payment data. Please try again later.");
            console.error("Error fetching payment data:", error);
        }
    };
    
    

    //-------------------------------------------------------------------------------------------------------------------------------------
    const storedData = localStorage.getItem('userData');


    const { register, control, handleSubmit, formState: { errors }, watch, setValue, getValues } = useForm<FormData>({
        defaultValues: {
            // id: paymentData.id || '',
            // booking_type:paymentData.id || '',
            client_id: "",
            firstName: '',
            address: '',
            email: '',
            gstNo: '',
            mobileNo: '',
        }
    });




    const router = useRouter();

    const handleDeleteTicket = async (cb_id: string, e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        console.log("id", cb_id);
        const formData = {
            cb_id: cb_id
        }
        try {
            const response = await axios.post(`http://192.168.0.105:3001/cabbooking/delete_cab_booking`, formData);
            console.log('Cab booking deleted successfully:', response.data);
            router.push("/CabBooking/CabList")
        } catch (error) {
            console.error('Error deleting Cab:', error);
        }
    };



  
   
   
    //-----------------------------------------------------------------------------------------------------------
    return (
        <div className="container-fluid">

            <div className="card mb-3" style={{ width: "auto" }} >
                <div className="card-header" style={{ display: "flex", justifyContent: "space-between" }}>
                    <h3>View Cab Booking Details </h3>
                    <div style={{ fontSize: "12px" }}>
                        {/* <Link href="/CabBooking/JourneyEnd" className="btn btn-sm btn-success" style={{ float: "right", marginRight: "8px" }}>Journey End</Link> */}

             

                        <Button variant="danger" size="sm" className="btn btn-sm btn-success" style={{ float: "right", marginRight: "8px", fontSize: "12px" }} onClick={(e) => handleDeleteTicket(paymentData.cb_id, e)}>Delete</Button>

                        <Link href="/CabBooking/CabList" className="btn btn-sm btn-primary" style={{ float: "right", marginRight: "8px", fontSize: "12px" }}>
                            Back
                        </Link>

                        
                    </div>
                </div>



                {paymentData && (
                    <div className="card-body" style={{ fontSize: "12px" }}>
                        <div className=" d-flex flex-wrap">
                            <div className="col-lg-6">
                                <label className="">Cab Sr.no : </label><span> {paymentData.cb_serial_no}</span>
                            </div>
                        </div>












                        <div className="row mt-4">
                            <div className="col-md-12">
                                <h4>Client Details:</h4>
                            </div>
                            <hr />
                        </div>




                        <div className="row mb-3">
                            <div className="col-lg-4 col-sm-4">
                                <label className="form-label" htmlFor="clientId">Client Name: </label>
                                <span> {formData.firstName}</span>

                            </div>

                            <div className="col-lg-4">
                                <label className="form-label" htmlFor="address">Address:</label>
                                <span> {formData.address}</span>
                            </div>
                            <div className="col-lg-4">
                                <label className="form-label" htmlFor="address">City:</label>
                                <span> {formData.client_city}</span>
                            </div>
                            <div className="col-lg-4">
                                <label className="form-label" htmlFor="address">State:</label>
                                <span> {formData.client_state}</span>
                            </div>
                            <div className="col-lg-4">
                                <label className="form-label" htmlFor="address">Pin-code:</label>
                                <span> {formData.client_pincode}</span>
                            </div>

                            <div className="col-lg-4">
                                <label className="form-label" htmlFor="email">Email-id:</label>
                                <span> {formData.email}</span>
                            </div>

                            <div className="col-lg-4">
                                <label className="form-label" htmlFor="gstNo">Gst-no:</label>
                                <span> {formData.gstNo}</span>
                            </div>



                            <div className="col-lg-4">
                                <label className="form-label" htmlFor="mobileNo">Mobile No:</label>

                                <span> {formData.mobileNo}</span>
                            </div>
                        </div>

                        <div className="row mt-4">
                            <div className="col-md-12">
                                <h5>Booking Details:</h5>
                            </div>
                            <hr />

                        </div>
                        <div className="row mb-3">
                            <div className="col-lg-3 col-sm-6">
                                <label className="form-label" htmlFor="bdate">Booking Date: </label>
                                <span> {paymentData.booking_date}</span>                                </div>
                            <div className="col-lg-3 col-sm-6">
                                <label className="form-label" htmlFor="bdate">Journery Start: </label>
                                <span> {paymentData.journey_start_date}</span>

                            </div>
                            <div className="col-lg-3 col-sm-6">
                                <label className="form-label" htmlFor="bdate">Journey End: </label>
                                <span> {paymentData.journey_end_date}</span>

                            </div>
                            <div className="col-lg-3">
                                <label className="form-label" htmlFor="Place_visit">Place visit:</label>
                                <span> {paymentData.place_visit}</span>                                    {errors?.place_visit?.type === "required" && <span className="error">This field is required</span>}
                            </div>
                        </div>
                        <div className="row mb-3">
                            <div className="col-lg-3 col-sm-6 mb-3">
                                <label className="form-label" htmlFor="vehicleNo">Vehicle Type:</label>
                                <span> {paymentData.vehicle_type}</span>                                </div>

                            <div className="col-lg-3 col-sm-6 mb-3">
                                <label className="form-label" htmlFor="vehicleNo">Engaged By:</label>
                                <span> {paymentData.engaged_by}</span>                                </div>



                            <div className="col-lg-3 col-sm-12 mb-3">



                                <label htmlFor="rate_8hrs" className="form-label">{paymentData.rate}:</label>
                                <span> {paymentData.rate_text}</span>



                            </div>


                            <div className="col-lg-3 col-sm-6 mb-3">
                                <label className="form-label" htmlFor="driverName">Advance Amount:</label>
                                <span> {paymentData.advance_amount}</span>

                            </div>


                        </div>

                        {paymentData.startJourneyDetails && (
                            <>
                                {paymentData.startJourneyDetails.sj_id && (
                                    <div className="row mt-4">
                                        <div className="col-md-12">
                                            <h5>Journey Start Details:</h5>
                                        </div>
                                        <hr />
                                    </div>)}


                                <div className="row mb-3">
                                    {paymentData.startJourneyDetails.d_name && (
                                        <div className="col-lg-3 col-sm-6">
                                            <label className="form-label" htmlFor="bdate">Driver Name: </label>
                                            <span> {paymentData.startJourneyDetails.d_name}</span>
                                        </div>
                                    )}
                                    {paymentData.startJourneyDetails.driver_mobile_no && (
                                        <div className="col-lg-3 col-sm-6">
                                            <label className="form-label" htmlFor="bdate">Driver Mobile No: </label>
                                            <span> {paymentData.startJourneyDetails.driver_mobile_no}</span>
                                        </div>
                                    )}
                                    {paymentData.startJourneyDetails.vehicle_no && (
                                        <div className="col-lg-3 col-sm-6">
                                            <label className="form-label" htmlFor="bdate">Vehicle No: </label>
                                            <span> {paymentData.startJourneyDetails.vehicle_no}</span>
                                        </div>
                                    )}
                                    {paymentData.startJourneyDetails.starting_kms && (
                                        <div className="col-lg-3">
                                            <label className="form-label" htmlFor="Place_visit">Starting KMs:</label>
                                            <span> {paymentData.startJourneyDetails.starting_kms}</span>
                                            {errors?.place_visit?.type === "required" && <span className="error">This field is required</span>}
                                        </div>
                                    )}
                                </div>

                                <div className="row mb-3">
                                    {paymentData.startJourneyDetails.vehicle_type && (
                                        <div className="col-lg-3 col-sm-6 mb-3">
                                            <label className="form-label" htmlFor="vehicleNo">Vehicle Type:</label>
                                            <span> {paymentData.startJourneyDetails.vehicle_type}</span>
                                        </div>
                                    )}
                                    {paymentData.startJourneyDetails.journey_start_time && (
                                        <div className="col-lg-3 col-sm-6 mb-3">
                                            <label className="form-label" htmlFor="vehicleNo">Time:</label>
                                            <span> {paymentData.startJourneyDetails.journey_start_time}</span>
                                        </div>
                                    )}
                                    {paymentData.startJourneyDetails.journey_start_date && (
                                        <div className="col-lg-3 col-sm-6 mb-3">
                                            <label className="form-label" htmlFor="driverName">Date:</label>
                                            <span> {paymentData.startJourneyDetails.journey_start_date}</span>
                                        </div>
                                    )}
                                </div>
                            </>
                        )}


                        {paymentData.endJourneyDetails && (
                            <>
                                {paymentData.endJourneyDetails.ej_id && (
                                    <div className="row mt-4">
                                        <div className="col-md-12">
                                            <h5>Journey End Details:</h5>
                                        </div>
                                        <hr />
                                    </div>
                                )}

                                <div className="row mb-3">
                                    {paymentData.endJourneyDetails.closing_kms && (
                                        <div className="col-lg-3 col-sm-6">
                                            <label className="form-label" htmlFor="closingKms">Closing KMs:</label>
                                            <span> {paymentData.endJourneyDetails.closing_kms}</span>
                                            {errors?.place_visit?.type === "required" && <span className="error">This field is required</span>}
                                        </div>
                                    )}
                                    {paymentData.endJourneyDetails.journey_end_time && (
                                        <div className="col-lg-3 col-sm-6">
                                            <label className="form-label" htmlFor="journeyEndTime">Time:</label>
                                            <span> {paymentData.endJourneyDetails.journey_end_time}</span>
                                        </div>
                                    )}
                                    {paymentData.endJourneyDetails.journey_end_date && (
                                        <div className="col-lg-3 col-sm-6">
                                            <label className="form-label" htmlFor="journeyEndDate">Date:</label>
                                            <span> {paymentData.endJourneyDetails.journey_end_date}</span>
                                        </div>
                                    )}

                                    {paymentData.endJourneyDetails.total_used_kms && (
                                        <div className="col-lg-3 col-sm-6">
                                            <label className="form-label" htmlFor="totalUsedKms">Total KM:</label>
                                            <span> {paymentData.endJourneyDetails.total_used_kms}</span>
                                        </div>
                                    )}




                                    {paymentData.endJourneyDetails.extra_kms && (
                                        <div className="col-lg-3 col-sm-6">
                                            <label className="form-label" htmlFor="extraKms">Extra KMs:</label>
                                            <span> {paymentData.endJourneyDetails.extra_kms}</span>
                                        </div>
                                    )}
                                    {paymentData.endJourneyDetails.extra_km_rate && (
                                        <div className="col-lg-3 col-sm-6">
                                            <label className="form-label" htmlFor="extraKmRate">Extra Rate/Km:</label>
                                            <span> {paymentData.endJourneyDetails.extra_km_rate}</span>
                                        </div>
                                    )}
                                    {paymentData.endJourneyDetails.extra_km_total_rate && (
                                        <div className="col-lg-3 col-sm-6">
                                            <label className="form-label" htmlFor="extraKmTotalRate">Extra KM Total Rate:</label>
                                            <span> {paymentData.endJourneyDetails.extra_km_total_rate}</span>
                                        </div>
                                    )}
                                    {paymentData.endJourneyDetails.extra_hrs && (
                                        <div className="col-lg-3 col-sm-6">
                                            <label className="form-label" htmlFor="extraHrs">Extra Hrs:</label>
                                            <span> {paymentData.endJourneyDetails.extra_hrs}</span>
                                        </div>
                                    )}
                                    {paymentData.endJourneyDetails.extra_hrs_rate && (
                                        <div className="col-lg-3 col-sm-6">
                                            <label className="form-label" htmlFor="extraHrsRate">Extra Rate/Hrs:</label>
                                            <span> {paymentData.endJourneyDetails.extra_hrs_rate}</span>
                                        </div>
                                    )}
                                    {paymentData.endJourneyDetails.extra_hrs_total_rate && (
                                        <div className="col-lg-3 col-sm-6">
                                            <label className="form-label" htmlFor="extraHrsTotalRate">Extra Hrs Total Rate:</label>
                                            <span> {paymentData.endJourneyDetails.extra_hrs_total_rate}</span>
                                        </div>
                                    )}
                                    {paymentData.endJourneyDetails.discount && (
                                        <div className="col-lg-3 col-sm-6">
                                            <label className="form-label">Discount:</label>
                                            <span> {paymentData.endJourneyDetails.discount}%</span>
                                        </div>
                                    )}

                                    {paymentData.endJourneyDetails.discount_amount && (
                                        <div className="col-lg-3 col-sm-6">
                                            <label className="form-label">Discount Amount:</label>
                                            <span> {paymentData.endJourneyDetails.discount_amount}</span>
                                        </div>
                                    )}





                                </div>
                                <div className='row mb-3'>
                                    {paymentData.endJourneyDetails.total_amount && (
                                        <div className="col-lg-3 col-sm-6" style={{ fontWeight: "bold" }}>
                                            <label className="form-label" htmlFor="totalAmount" style={{}}>Total Amount:</label>
                                            <span> {paymentData.endJourneyDetails.total_amount}</span>
                                        </div>
                                    )}
                                    {paymentData.endJourneyDetails.advance_paid && (
                                        <div className="col-lg-3 col-sm-6" >
                                            <label className="form-label advance-paid" htmlFor="advancePaid">Advance Paid:</label>
                                            <span className="form-label advance-paid"> {paymentData.endJourneyDetails.advance_paid}</span>
                                        </div>
                                    )}
                                    {paymentData.endJourneyDetails.pending_balance && (
                                        <div className="col-lg-3 col-sm-6">
                                            <label className="form-label pending-balance" htmlFor="pendingBalance">Pending Amount:</label>
                                            <span className="form-label pending-balance"> {paymentData.endJourneyDetails.pending_balance}</span>
                                        </div>
                                    )}



                                </div>
                                {paymentData.payment_status && (
                                    <div className="col-lg-3 col-sm-6">
                                        <label style={{ fontWeight: "bold" }} className="form-label">Payment:</label>
                                        <span
                                            style={{
                                                fontWeight: "bold",
                                                color: paymentData.payment_status === "paid" ? "green" : "red"
                                            }}
                                        >
                                            {paymentData.payment_status}
                                        </span>
                                    </div>
                                )}

                            </>
                        )}
                        {paymentData.paymentDetails && paymentData.paymentDetails.length > 0 && paymentData.paymentDetails[0].id && (
                            <>
                                <div className="row mt-4">
                                    <div className="col-md-6">
                                        <h5>Payment Details:</h5>
                                    </div>
                                    <div className="col-md-6" style={{ textAlign: "right" }}>
                                      
                                    </div>
                                    <hr />
                                </div>





                                {paymentData.paymentDetails.map((paymentDetail: any, index: any) => (
                                    <div className="row mb-3" key={index}>
                                        {paymentDetail.payment_method && (
                                            <div className="col-lg-3 col-sm-6">
                                                <label className="form-label">Payment Method:</label>
                                                <span> {paymentDetail.payment_method}</span>
                                            </div>
                                        )}
                                        {paymentDetail.payment_details && (
                                            <div className="col-lg-3 col-sm-6">
                                                <label className="form-label">Payment Details:</label>
                                                <span> {paymentDetail.payment_details}</span>
                                            </div>
                                        )}
                                        {paymentDetail.total_amount && (
                                            <div className="col-lg-3">
                                                <label className="form-label">Total  Amount:</label>
                                                <span> {paymentDetail.total_amount}</span>
                                            </div>
                                        )}
                                        {index === 0 && paymentDetail.discount && (
                                            <div className="col-lg-3 col-sm-6">
                                                <label className="form-label">Discount:</label>
                                                <span> {paymentDetail.discount}%</span>
                                            </div>
                                        )}
                                        {index === 0 && paymentDetail.discount_amount && (
                                            <div className="col-lg-3 col-sm-6">
                                                <label className="form-label">Discount Amount:</label>
                                                <span> {paymentDetail.discount_amount}</span>
                                            </div>
                                        )}


                                        {paymentDetail.actual_amount && (
                                            <div className="col-lg-3">
                                                <label className="form-label">Actual  Amount:</label>
                                                <span> {paymentDetail.actual_amount}</span>
                                            </div>
                                        )}
                                        {paymentDetail.paid_amount && (
                                            <div className="col-lg-3">
                                                <label className="form-label">Total Paid Amount:</label>
                                                <span> {paymentDetail.total_paid_amount}</span>
                                            </div>
                                        )}
                                        {/* {paymentDetail.pending_amount && (
                                            <div className="col-lg-3">
                                                <label className="form-label">Paid Amount:</label>
                                                <span> {paymentDetail.paid_amount}</span>
                                            </div>
                                        )} */}
                                        {/* {paymentDetail.pending_amount && (
                                            <div className="col-lg-3">
                                                <label className="form-label">Paid Amount:</label>
                                                <span> {paymentDetail.paid_amount}</span>
                                            </div>
                                        )} */}
                                    </div>
                                ))}
                            </>
                        )}



                    </div>


                )}


            </div>



        </div >
    );
};

export default PaymentDataView;

