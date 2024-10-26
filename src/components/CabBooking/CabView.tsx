"use client";
import React, { useEffect, useState } from 'react';
import { useFieldArray, useForm, SubmitHandler } from 'react-hook-form';

import CabbookingList from '@/app/Api/CabBooking/CabbookingList';
import { Button } from 'react-bootstrap';
import JourneyStartModal from './JourneyStartModel';
import JourneyEndModal from './JourneyEndModel';
import GetJourneryStratId from '@/app/Api/CabBooking/GetJourneryStratId';
import JourneyPaymentModel from './PaymentModel';
import { generateCabPaymentReceiptPrint } from "../CabBooking/CabbookingPdf/cabpaymentreceipt"
import Link from 'next/link';
import axios from 'axios';
import { useRouter } from 'next/navigation';

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






const CabView = () => {

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

    const [fireData, setFireData] = useState<any>("");
    const [error, setError] = useState<string>('');


    useEffect(() => {


        const fetchData = async () => {
            try {
                const cb_id = new URLSearchParams(window.location.search).get("id");
                if (cb_id) {
                    const response = await CabbookingList.GetcabBookingId(cb_id);
                    setFireData(response.data[0]);
                    console.log("discount", response.data[0].discount);

                    if (response.data && response.data.length > 0) {
                        const client_id = response.data[0].client_id;
                        setFormData({
                            client_id: response.data[0].client_id,
                            firstName: response.data[0].firstName,
                            address: response.data[0].client_address,
                            email: response.data[0].client_email,
                            gstNo: response.data[0].gstNo,
                            vendorCode: response.data[0].vendorCode,
                            poNo: response.data[0].poNo,
                            mobileNo: response.data[0].mobileNo,
                            client_city: response.data[0].client_city,
                            client_state: response.data[0].client_state,
                            client_pincode: response.data[0].client_pincode,
                        });


                        setValue("email", response.data[0].client_email)
                        setValue("client_id", response.data[0].client_id)
                        setValue("firstName", response.data[0].firstName);
                        setValue("address", response.data[0].client_address);
                        setValue("gstNo", response.data[0].gstNo);
                        setValue("mobileNo", response.data[0].mobileNo);
                        setValue("client_city", response.data[0].client_city);
                        setValue("client_state", response.data[0].client_state);
                        setValue("client_pincode", response.data[0].client_pincode);


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
            const cb_id = urlParams.get("id");
            if (cb_id) {
                getTicketDetail(cb_id);
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

    const getTicketDetail = async (cb_id: string) => {
        try {
            const getTDetail = await CabbookingList.GetcabBookingId(cb_id);;
            setFireData(getTDetail.data[0]);
            setError("");
            console.log("Fire details", getTDetail.data[0]);


        } catch (error) {
            setError("Error fetching fire data. Please try again later.");
            console.error("Error fetching fire data:", error);
        }
    };

    //-------------------------------------------------------------------------------------------------------------------------------------
    const storedData = localStorage.getItem('userData');


    const { register, control, handleSubmit, formState: { errors }, watch, setValue, getValues } = useForm<FormData>({
        defaultValues: {
            cb_id: fireData.cb_id || '',
            client_id: "",
            firstName: '',
            address: '',
            email: '',
            gstNo: '',
            mobileNo: '',
        }
    });


    const handlePrintPayment = async (cb_id: string) => {
        try {
            const getTDetail = await CabbookingList.GetcabBookingId(cb_id);
            generateCabPaymentReceiptPrint(getTDetail.data[0])
        } catch (error) {
            console.error("Error fetching ticket data:", error);
        }
    };

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


    //-----------------------------------------------------------------------------------------------------------------------------------

    const [capacityData, setCapacityData] = useState<any[]>([]);
    const [StartId, setStartId] = useState<number | null>(null);

    const [showModal, setShowModal] = useState(false);

    const handleJourneystart = async (cb_id: number) => {
        try {
            const response = await GetJourneryStratId.getJourneyStrat(cb_id.toString());
            if (response.data) {
                setStartId(response.data[0].cb_id);

                setCapacityData(response.data[0]);
                setShowModal(true);
            }
        } catch (error) {
            console.error('Error handling journey start:', error);
        }
    };

    //-----------------------------------------------------------------------------------------------------------


    const [showEndModal, setShowEndModal] = useState(false);
    const [EndId, setEndId] = useState<number | null>(null);
    const [journeyend, setJourneyEnd] = useState<any[]>([]);

    const handleJourneyEnd = async (cb_id: number) => {
        try {
            const response = await CabbookingList.GetcabBookingId(cb_id.toString());


            if (response.data[0].startJourneyDetails && response.data[0].startJourneyDetails.cb_id) {
                
                const response = await GetJourneryStratId.getJourneyEnd(cb_id.toString());
                setEndId(response.data[0].cb_id);
                setJourneyEnd(response.data[0])
                console.log(">>>>>>", response.data[0]);

                setShowEndModal(true);
            } else {

                alert('journey has been not started yet');
            }

            console.log(">>>>>>", response.data[0]);

        } catch (error) {
            console.error('Error handling journey end:', error);
        }
    };





    
    //-----------------------------------------------------------------------------------------------------------


    const [paymentModel, setpaymentModel] = useState(false);
    const [PaymentId, setPaymentId] = useState<number | null>(null);
    const [Paymentdata, setPaymentdata] = useState<any[]>([]);

    const handleJourneyPayment = async (cb_id: number) => {

        try {
            const response = await CabbookingList.GetcabBookingId(cb_id.toString());

            setPaymentId(response.data[0].cb_id);
            setPaymentdata(response.data[0])  // data get 


            setpaymentModel(true);
        } catch (error) {
            console.error('Error handling journey start:', error);
        }
    };
   


    //-----------------------------------------------------------------------------------------------------------
    return (
        <div className="container" style={{ fontSize: "12px" }}>
            <br />
            <div className="" style={{ display: "flex", justifyContent: "space-between" }}>
                <h4>View Cab Booking Details </h4>
                <div style={{ fontSize: "12px" }}>
                    {/* <Link href="/CabBooking/JourneyEnd" className="btn btn-sm btn-success" style={{ float: "right", marginRight: "8px" }}>Journey End</Link> */}

                    <Button variant="success" size="sm" className="btn btn-sm btn-success" style={{ float: "right", marginRight: "8px", fontSize: "12px" }} onClick={() => handleJourneyPayment(fireData.cb_id)}>Payment</Button>

                    <Button variant="success" size="sm" className="btn btn-sm btn-success" style={{ float: "right", marginRight: "8px", fontSize: "12px" }} onClick={() => handleJourneyEnd(fireData.cb_id)}>Journey End</Button>

                    <Button variant="success" size="sm" className="btn btn-sm btn-success" style={{ float: "right", marginRight: "8px", fontSize: "12px" }} onClick={() => handleJourneystart(fireData.cb_id)}>Journey Start</Button>

                    <Button variant="danger" size="sm" className="btn btn-sm btn-success" style={{ float: "right", marginRight: "8px", fontSize: "12px" }} onClick={(e) => handleDeleteTicket(fireData.cb_id, e)}>Delete</Button>

                    <Link href="/CabBooking/CabList" className="btn btn-sm btn-primary" style={{ float: "right", marginRight: "8px", fontSize: "12px" }}>
                        Back
                    </Link>

                    <JourneyStartModal
                        show={showModal}
                        handleClose={() => setShowModal(false)}
                        initialData={capacityData}
                        StartId={StartId}



                    />
                    <JourneyEndModal
                        show={showEndModal}
                        handleClose={() => setShowEndModal(false)}
                        endinitialData={journeyend}
                        EndId={EndId}
                    />


                    <JourneyPaymentModel
                        show={paymentModel}
                        handleClose={() => setpaymentModel(false)}
                        paymentinitialData={Paymentdata}
                        PaymentId={PaymentId} />
                </div>
            </div>
            <br />
            <div className="card cardbox mb-3" style={{ width: "auto" }} >




                {fireData && (
                    <div className="card-body" style={{ fontSize: "12px" }}>
                        <div className=" d-flex flex-wrap">
                            <div className="col-lg-6">
                                <label className="">Cab Sr.no : </label><span> {fireData.cb_serial_no}</span>
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
                                <span> {fireData.booking_date}</span>                                </div>
                            <div className="col-lg-3 col-sm-6">
                                <label className="form-label" htmlFor="bdate">Journery Start: </label>
                                <span> {fireData.journey_start_date}</span>

                            </div>
                            <div className="col-lg-3 col-sm-6">
                                <label className="form-label" htmlFor="bdate">Journey End: </label>
                                <span> {fireData.journey_end_date}</span>

                            </div>
                            <div className="col-lg-3">
                                <label className="form-label" htmlFor="Place_visit">Place visit:</label>
                                <span> {fireData.place_visit}</span>                                    {errors?.place_visit?.type === "required" && <span className="error">This field is required</span>}
                            </div>
                        </div>
                        <div className="row mb-3">
                            <div className="col-lg-2 col-sm-6 mb-2">
                                <label className="form-label" htmlFor="vehicleNo">Vehicle Type:</label>
                                <span> {fireData.vehicle_type}</span>                                </div>

                            <div className="col-lg-2 col-sm-6 mb-2">
                                <label className="form-label" htmlFor="vehicleNo">Engaged By:</label>
                                <span> {fireData.engaged_by}</span>                                </div>



                            <div className="col-lg-2 col-sm-12 mb-2">



                                <label htmlFor="rate_8hrs" className="form-label">{fireData.rate}:</label>
                                <span> {fireData.rate_text}</span>



                            </div>


                            <div className="col-lg-2 col-sm-6 mb-2">
                                <label className="form-label" htmlFor="driverName">Waiting Charge:</label>
                                <span> {fireData.waiting_charge}</span>

                            </div>
                            <div className="col-lg-2 col-sm-6 mb-2">
                                <label className="form-label" htmlFor="driverName">Driver Allowance:</label>
                                <span> {fireData.driver_allowance_charge}</span>

                            </div>
                            <div className="col-lg-2 col-sm-6 mb-2">
                                <label className="form-label" htmlFor="driverName">Night Charge:</label>
                                <span> {fireData.night_charge}</span>

                            </div>


                        </div>

                        {fireData.startJourneyDetails && (
                            <>
                                {fireData.startJourneyDetails.sj_id && (
                                    <div className="row mt-4">
                                        <div className="col-md-12">
                                            <h5>Journey Start Details:</h5>
                                        </div>
                                        <hr />
                                    </div>)}


                                <div className="row mb-3">
                                    {fireData.startJourneyDetails.d_name && (
                                        <div className="col-lg-3 col-sm-6">
                                            <label className="form-label" htmlFor="bdate">Driver Name: </label>
                                            <span> {fireData.startJourneyDetails.d_name}</span>
                                        </div>
                                    )}
                                    {fireData.startJourneyDetails.driver_mobile_no && (
                                        <div className="col-lg-3 col-sm-6">
                                            <label className="form-label" htmlFor="bdate">Driver Mobile No: </label>
                                            <span> {fireData.startJourneyDetails.driver_mobile_no}</span>
                                        </div>
                                    )}
                                    {fireData.startJourneyDetails.vehicle_no && (
                                        <div className="col-lg-3 col-sm-6">
                                            <label className="form-label" htmlFor="bdate">Vehicle No: </label>
                                            <span> {fireData.startJourneyDetails.vehicle_no}</span>
                                        </div>
                                    )}
                                    {fireData.startJourneyDetails.starting_kms && (
                                        <div className="col-lg-3">
                                            <label className="form-label" htmlFor="Place_visit">Starting KMs:</label>
                                            <span> {fireData.startJourneyDetails.starting_kms}</span>
                                            {errors?.place_visit?.type === "required" && <span className="error">This field is required</span>}
                                        </div>
                                    )}
                                </div>

                                <div className="row mb-3">
                                    {fireData.startJourneyDetails.vehicle_type && (
                                        <div className="col-lg-3 col-sm-6 mb-3">
                                            <label className="form-label" htmlFor="vehicleNo">Vehicle Type:</label>
                                            <span> {fireData.startJourneyDetails.vehicle_type}</span>
                                        </div>
                                    )}
                                    {fireData.startJourneyDetails.journey_start_time && (
                                        <div className="col-lg-3 col-sm-6 mb-3">
                                            <label className="form-label" htmlFor="vehicleNo">Time:</label>
                                            <span> {fireData.startJourneyDetails.journey_start_time}</span>
                                        </div>
                                    )}
                                    {fireData.startJourneyDetails.journey_start_date && (
                                        <div className="col-lg-3 col-sm-6 mb-3">
                                            <label className="form-label" htmlFor="driverName">Date:</label>
                                            <span> {fireData.startJourneyDetails.journey_start_date}</span>
                                        </div>
                                    )}
                                </div>
                            </>
                        )}


                        {fireData.endJourneyDetails && (
                            <>
                                {fireData.endJourneyDetails.ej_id && (
                                    <div className="row mt-4">
                                        <div className="col-md-12">
                                            <h5>Journey End Details:</h5>
                                        </div>
                                        <hr />
                                    </div>
                                )}

                                <div className="row mb-3">
                                    {fireData.endJourneyDetails.closing_kms && (
                                        <div className="col-lg-3 col-sm-6">
                                            <label className="form-label" htmlFor="closingKms">Closing KMs:</label>
                                            <span> {fireData.endJourneyDetails.closing_kms}</span>
                                            {errors?.place_visit?.type === "required" && <span className="error">This field is required</span>}
                                        </div>
                                    )}
                                    {fireData.endJourneyDetails.journey_end_time && (
                                        <div className="col-lg-3 col-sm-6">
                                            <label className="form-label" htmlFor="journeyEndTime">Time:</label>
                                            <span> {fireData.endJourneyDetails.journey_end_time}</span>
                                        </div>
                                    )}
                                    {fireData.endJourneyDetails.journey_end_date && (
                                        <div className="col-lg-3 col-sm-6">
                                            <label className="form-label" htmlFor="journeyEndDate">Date:</label>
                                            <span> {fireData.endJourneyDetails.journey_end_date}</span>
                                        </div>
                                    )}

                                    {fireData.endJourneyDetails.total_used_kms && (
                                        <div className="col-lg-3 col-sm-6">
                                            <label className="form-label" htmlFor="totalUsedKms">Total KM:</label>
                                            <span> {fireData.endJourneyDetails.total_used_kms}</span>
                                        </div>
                                    )}




                                    {fireData.endJourneyDetails.extra_kms && (
                                        <div className="col-lg-3 col-sm-6">
                                            <label className="form-label" htmlFor="extraKms">Extra KMs:</label>
                                            <span> {fireData.endJourneyDetails.extra_kms}</span>
                                        </div>
                                    )}
                                    {fireData.endJourneyDetails.extra_km_rate && (
                                        <div className="col-lg-3 col-sm-6">
                                            <label className="form-label" htmlFor="extraKmRate">Extra Rate/Km:</label>
                                            <span> {fireData.endJourneyDetails.extra_km_rate}</span>
                                        </div>
                                    )}
                                    {fireData.endJourneyDetails.extra_km_total_rate && (
                                        <div className="col-lg-3 col-sm-6">
                                            <label className="form-label" htmlFor="extraKmTotalRate">Extra KM Total Rate:</label>
                                            <span> {fireData.endJourneyDetails.extra_km_total_rate}</span>
                                        </div>
                                    )}
                                    {fireData.endJourneyDetails.extra_hrs && (
                                        <div className="col-lg-3 col-sm-6">
                                            <label className="form-label" htmlFor="extraHrs">Extra Hrs:</label>
                                            <span> {fireData.endJourneyDetails.extra_hrs}</span>
                                        </div>
                                    )}
                                    {fireData.endJourneyDetails.extra_hrs_rate && (
                                        <div className="col-lg-3 col-sm-6">
                                            <label className="form-label" htmlFor="extraHrsRate">Extra Rate/Hrs:</label>
                                            <span> {fireData.endJourneyDetails.extra_hrs_rate}</span>
                                        </div>
                                    )}
                                    {fireData.endJourneyDetails.extra_hrs_total_rate && (
                                        <div className="col-lg-3 col-sm-6">
                                            <label className="form-label" htmlFor="extraHrsTotalRate">Extra Hrs Total Rate:</label>
                                            <span> {fireData.endJourneyDetails.extra_hrs_total_rate}</span>
                                        </div>
                                    )}
                                    {fireData.endJourneyDetails.discount && (
                                        <div className="col-lg-3 col-sm-6">
                                            <label className="form-label">Discount:</label>
                                            <span> {fireData.endJourneyDetails.discount}%</span>
                                        </div>
                                    )}

                                    {fireData.endJourneyDetails.discount_amount && (
                                        <div className="col-lg-3 col-sm-6">
                                            <label className="form-label">Discount Amount:</label>
                                            <span> {fireData.endJourneyDetails.discount_amount}</span>
                                        </div>
                                    )}





                                </div>
                                <div className='row mb-3'>
                                    {fireData.endJourneyDetails.actual_amount && (
                                        <div className="col-lg-3 col-sm-6" style={{ fontWeight: "bold" }}>
                                            <label className="form-label" htmlFor="totalAmount" style={{}}>Final Amount:</label>
                                            <span> {fireData.endJourneyDetails.actual_amount}</span>
                                        </div>
                                    )}



                                </div>
                                {fireData.payment_status && (
                                    <div className="col-lg-3 col-sm-6">
                                        <label style={{ fontWeight: "bold" }} className="form-label">Payment:</label>
                                        <span
                                            style={{
                                                fontWeight: "bold",
                                                color: fireData.payment_status === "paid" ? "green" : "red"
                                            }}
                                        >
                                            {fireData.payment_status}
                                        </span>
                                    </div>
                                )}

                            </>
                        )}
                        {fireData.paymentDetails && fireData.paymentDetails.length > 0 && fireData.paymentDetails[0].id && (
                            <>
                                <div className="row mt-4">
                                    <div className="col-md-6">
                                        <h5>Payment Details:</h5>
                                    </div>
                                    <div className="col-md-6" style={{ textAlign: "right" }}>
                                        <Button
                                            variant="primary"
                                            size="sm"
                                            className="btn btn-sm btn-primary"
                                            style={{ float: "right", marginRight: "8px", marginBottom: "8px" }}
                                            onClick={() => handlePrintPayment(fireData.cb_id)}
                                        >
                                            Print
                                        </Button>
                                    </div>
                                    <hr />
                                </div>





                                {fireData.paymentDetails.map((paymentDetail: any, index: any) => (
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
                                        {paymentDetail.id && (
                                            <div className="col-lg-3">
                                                <label className="form-label">Total Paid Amount:</label>
                                                <span> {fireData.total_paid}</span>
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

export default CabView;

