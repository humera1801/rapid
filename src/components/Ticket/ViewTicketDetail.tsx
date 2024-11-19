"use client";

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import EditTicketData from '@/app/Api/EditTicketData';
import Link from 'next/link';
import "../../../public/css/ticketview.css"
import handlePrint from '@/app/ticket_list/Ticket_data/printUtils';
import { Button } from 'react-bootstrap';
import TicketPaymentModel from './TicketPaymentModel';
import VendorPaymentModel from './VenodorTicketPayModel';

type FormData = {
    ticket_id: string,
    from_state: string,
    travel_from: string,
    to_state: string,
    travel_to: string,
    bus_type: string,
    ticket_no: string,
    bdate: string;
    jdate: string;
    mobile_no: string;
    name: string;
    cmp_name: string;
    cmp_mobile: string;
    booking_type: 'seater' | 'sleeper' | 'both';
    is_duplicate: boolean;
    is_extra: boolean;
    slr: number;
    slr_rate: number;
    slr_total_amount: number;
    slr_print_rate: number;
    slr_total_print_rate: number;
    st: number;
    st_rate: number;
    st_total_amount: number;
    st_print_rate: number;
    st_total_print_rate: number;
    ex: number; ex_rate: number;
    ex_total_amount: number;
    ex_print_rate: number;
    st_no: string;
    sI_no: string;
    ex_total_print_rate: number;
    rep_time: string;
    dep_time: string;
    bus_name: string;
    bus_no: string;
    boarding: string;
    payment_method: string;
    final_total_amount: string;
    ticket_actual_total: number;
    print_final_total_amount: string;
    paid_amount: number;
    remaining_amount: number;
    print_paid_amount: number;
    print_remaining_amount: number;
    remarks: string;
    user_id: 14;
    received: 'Get';
    tkt_no: string;
    from_state_name: string;
    to_state_name: string;
    from_city_name: string;
    to_city_name: string;
    added_by_name: string;
    mobile: string;
    transection_id: string;

};

const ViewTicketDetail = () => {
    const [ticketData, setTicketData] = useState<any>("");
    const [error, setError] = useState<string>('');
    const [imageName, setImageName] = useState<string>('');

    useEffect(() => {
        const handleURLChange = () => {
            const urlParams = new URLSearchParams(window.location.search);
            const ticketToken = urlParams.get('token');
           
            if (ticketToken) {


                getTicketDetail(ticketToken);




            } else {

            }
        };

        window.addEventListener('popstate', handleURLChange);
        handleURLChange(); // Call on initial render

        return () => {
            window.removeEventListener('popstate', handleURLChange);
        };
    }, []);







    const getTicketDetail = async (ticketToken: string) => {
        try {
            const getTDetail = await EditTicketData.getEditTicktetData(ticketToken);
            setError('');

            setTicketData(getTDetail.data[0]);
            setImageName(getTDetail.data[0].id_proof_urls)

            // handlePrint(getTDetail.data[0])

            console.log("get data", getTDetail.data[0]);
        } catch (error) {
            setError('Error fetching ticket data. Please try again later.');
            console.error('Error fetching ticket data:', error);
        }
    };










    console.log("gffgdfhjf", ticketData)

    const { register, handleSubmit, formState: { errors }, watch, setValue, reset } = useForm<FormData>({
        defaultValues: {
            ticket_id: ticketData.id || '',

            // booking_type:'',
            to_state: '',
            travel_to: '',
            is_duplicate: false,
            mobile_no: '',
            name: '',
            cmp_name: '',
            cmp_mobile: '',
            booking_type: ticketData.booking_type || '',
            is_extra: ticketData.is_extra || '',
            slr: 0,
            slr_rate: 0,
            slr_total_amount: 0,
            slr_print_rate: 0,
            slr_total_print_rate: 0,
            st: 0,
            st_rate: 0,
            st_total_amount: 0,
            st_print_rate: 0,
            st_total_print_rate: 0,
            ex: 0, ex_rate: 0,
            ex_total_amount: 0,
            ex_print_rate: 0,
            ex_total_print_rate: 0,
            sI_no: '',
            st_no: '',
            rep_time: '',
            dep_time: '',
            print_remaining_amount: 0,
            bus_no: '',
            boarding: '',
            payment_method: '',
            final_total_amount: '',
            ticket_actual_total: 0,
            paid_amount: 0,
            remaining_amount: 0,
            bus_name: '',
            print_final_total_amount: '',
            print_paid_amount: 0,
            remarks: '',
            ticket_no: ticketData.tkt_no || '',
            received: 'Get',
            user_id: 14,
            bus_type: ticketData.bus_type || '',



        },
    });

    const is_extra = watch('is_extra');
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
    const paymentMethod = watch('payment_method');

    useEffect(() => {
        if (ticketData) {
            setSelectedPaymentMethod(ticketData.payment_method);
            setValue('payment_method', ticketData.payment_method);
            setValue('transection_id', ticketData.transection_id || '');
        }
    }, [ticketData, setValue]);





    const [paymentModel, setpaymentModel] = useState(false);
    const [PaymentId, setPaymentId] = useState<number | null>(null);
    const [Paymentdata, setPaymentdata] = useState<any[]>([]);

    const handlePayment = async (ticketToken: number) => {
        try {
            const response = await EditTicketData.getEditTicktetData(ticketToken.toString());


            console.log(">>>>>>", response.data[0]);

            setPaymentId(response.data[0].ticketToken);
            setPaymentdata(response.data[0]);
            setpaymentModel(true);





        } catch (error) {
            console.error('Error handling journey start:', error);
            alert('Error occurred while handling payment journey.');
        }
    };






    const [MakepaymentModel, setMakepaymentModel] = useState(false);
    const [MakepaymentId, setMakepaymentId] = useState<number | null>(null);
    const [Makepaymentdata, setMakepaymentdata] = useState<any[]>([]);

    const handleMakePayment = async (ticketToken: number) => {
        try {
            const response = await EditTicketData.getEditTicktetData(ticketToken.toString());



            setPaymentId(response.data[0].ticketToken);
            setMakepaymentdata(response.data[0]);
            setMakepaymentModel(true);





        } catch (error) {
            console.error('Error handling journey start:', error);
            alert('Error occurred while handling payment journey.');
        }
    };












    return (
        <>







            <div className="container mt-3">
                <br />
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <h4>Ticket Booking Detail</h4>
                    <div>
                        <button className="btn btn-sm btn-primary" onClick={() => handlePrint(ticketData)}
                            style={{ float: "right", fontSize: "12px" }}  >Print</button>

                        <Link href="/ticket_list" className="btn btn-sm btn-primary" style={{ float: "right", marginRight: "8px", fontSize: "12px" }}>Back</Link>
                        <Button variant="success" size="sm" className="btn btn-sm btn-success" style={{ float: "right", marginRight: "8px", fontSize: "12px" }} onClick={() => handlePayment(ticketData.token)}>Receive Payment</Button>
                        <Button variant="success" size="sm" className="btn btn-sm btn-success" style={{ float: "right", marginRight: "8px", fontSize: "12px" }}  onClick={() => handleMakePayment(ticketData.token)}>Make Payment</Button>

                        <TicketPaymentModel
                            show={paymentModel}
                            handleClose={() => setpaymentModel(false)}
                            paymentinitialData={Paymentdata}
                            PaymentId={PaymentId}
                        />

                        <VendorPaymentModel
                            show={MakepaymentModel}
                            handleClose={() => setMakepaymentModel(false)}
                            paymentinitialData={Makepaymentdata}
                            PaymentId={MakepaymentId}
                        />
                    </div>

                </div>
                <br />
                <div className="card cardbox mb-3" style={{ width: "auto" }}>

                    <div className="card-body" style={{ fontSize: "11px" }}>
                        <form>

                            {error && <p>{error}</p>}
                            {ticketData && (
                                <>
                                    <div className="row mb-3">
                                        <div className="col-lg-6 ">
                                            <label className="set_label">Ticket No:</label>
                                            <span  >{ticketData.tkt_no}</span>
                                        </div>
                                    </div>

                                    <div className="row mt-4">
                                        <div className="col-md-12">
                                            <h6>Client Details:</h6>
                                        </div>
                                        <hr />
                                    </div>




                                    <div className="row mb-3">
                                        <div className="col-lg-3 col-sm-3">
                                            <label className="form-label" htmlFor="clientId">Client Name: </label>
                                            <span> {ticketData.client_firstName}</span>

                                        </div>

                                        <div className="col-lg-3">
                                            <label className="form-label" htmlFor="address">Address:</label>
                                            <span> {ticketData.client_address}</span>
                                        </div>
                                        <div className="col-lg-3">
                                            <label className="form-label" htmlFor="address">City:</label>
                                            <span> {ticketData.client_city}</span>
                                        </div>
                                        <div className="col-lg-3">
                                            <label className="form-label" htmlFor="address">State:</label>
                                            <span> {ticketData.client_state}</span>
                                        </div>
                                    </div>
                                    <div className="row mb-3">
                                        <div className="col-lg-3">
                                            <label className="form-label" htmlFor="address">Pin-code:</label>
                                            <span> {ticketData.client_pincode}</span>
                                        </div>

                                        <div className="col-lg-3">
                                            <label className="form-label" htmlFor="email">Email-id:</label>
                                            <span> {ticketData.email}</span>
                                        </div>

                                        <div className="col-lg-3">
                                            <label className="form-label" htmlFor="mobileNo">Mobile No:</label>

                                            <span> {ticketData.client_mobileNo}</span>
                                        </div>


                                        <div className="col-lg-3">
                                            <label className="form-label" htmlFor="Place_visit">Client Id Proof:</label>
                                            {imageName && (
                                                <div className="col-lg-12 mt-2">
                                                    <img src={imageName} alt="Client ID Proof" style={{ width: '100px', height: '100px' }} />
                                                </div>
                                            )}
                                        </div>
                                        <div className="row mt-4">

                                            <div className="col-lg-3">
                                                <label className="set_label">whatsapp No:</label>
                                                <span>{ticketData.whatsapp_no}</span>
                                            </div>
                                        </div>
                                    </div>





                                    <div className="row mt-4">
                                        <div className="col-md-12">
                                            <h6>Bus Details:</h6>
                                        </div>
                                        <hr />
                                    </div>
                                    <div className="row mb-3">
                                        <div className="col-lg-3 ">
                                            <label className="set_label">From:</label>
                                            <span>{ticketData.from_state_name} - {ticketData.from_city_name}</span>
                                        </div>
                                        <div className="col-lg-3">
                                            <label className="set_label">To: </label>
                                            <span>{ticketData.to_state_name} - {ticketData.to_city_name}</span>
                                        </div>



                                    </div>
                                    <div className="row mb-3">
                                        <div className="col-lg-3 ">
                                            <label className="set_label">Booking Date:</label>
                                            <span>{ticketData.bdate}</span>
                                        </div>
                                        <div className="col-lg-3">
                                            <label className="set_label">Journey Date:</label>
                                            <span>{ticketData.jdate}</span>
                                        </div>
                                        <div className="col-lg-3">
                                            <label className="set_label">Reporting time:</label>
                                            <span>{ticketData.rep_time}</span>
                                        </div>
                                        <div className="col-lg-3">
                                            <label className="set_label">Dep Time:</label>
                                            <span>{ticketData.dep_time}</span>
                                        </div>

                                    </div>
                                    <div className="row mb-3">

                                        <div className="col-lg-3">
                                            <label className="set_label">Bus Name:</label>
                                            <span>{ticketData.bus_name} </span>
                                        </div>
                                        <div className="col-lg-3">
                                            <label className="set_label">Bus No:</label>
                                            <span>{ticketData.bus_no}</span>
                                        </div>
                                        <div className="col-lg-3">
                                            <label className="set_label">Bus Type:</label>
                                            <span>{ticketData.bus_type}</span>
                                        </div>
                                        <div className="col-lg-3">
                                            <label className="set_label">Boarding:</label>
                                            <span>{ticketData.boarding}</span>
                                        </div>

                                    </div>

                                    <div style={{ visibility: "hidden", display: "none" }}>
                                        <label className="form-label">Booking Type</label><br />
                                        <input
                                            type="radio"
                                            {...register('booking_type')}
                                            checked={ticketData.booking_type === "seater"}


                                        /> Seater
                                        <input
                                            type="radio"
                                            {...register('booking_type')}
                                            checked={ticketData.booking_type === "sleeper"}

                                        /> Sleeper
                                        <input
                                            type="radio"
                                            {...register('booking_type')}
                                            checked={ticketData.booking_type === "both"}

                                        /> Both
                                    </div>
                                    <div style={{ visibility: "hidden" }}>
                                        <label className="form-label">Is Extra?</label><br />
                                        {/* <input type="checkbox" checked={ticketData.is_extra === "1"} onChange={(e) => handleFieldChange('is_extra', e.target.checked ? "1" : "0")} /> Yes */}
                                        <input type="checkbox" {...register('is_extra')} /> Yes
                                    </div>

                                    {(ticketData.booking_type === 'sleeper' || ticketData.booking_type === 'both') && (
                                        <div className="row mb-3">
                                            <div className="col-lg-2">
                                                <label className="set_label">Slr:</label>
                                                <span>{ticketData.slr}</span>
                                            </div>
                                            <div className="col-lg-2">
                                                <label className="set_label">Slr Rate:</label>
                                                <span>{ticketData.slr_rate}</span>
                                            </div>
                                            <div className="col-lg-2">
                                                <label className="set_label">Slr Total:</label>
                                                <span>{ticketData.slr_total_amount}:</span>
                                            </div>
                                            <div className="col-lg-2">
                                                <label className="set_label">Slr Print Rate:</label>
                                                <span>{ticketData.slr_print_rate}</span>
                                            </div>
                                            <div className="col-lg-2">
                                                <label className="set_label">Slr Print Total:</label>
                                                <span>{ticketData.slr_total_print_rate}</span>
                                            </div>
                                            <div className="col-lg-2">
                                                <label className="set_label">SL No:</label>
                                                <span>{ticketData.sI_no}</span>
                                            </div>
                                        </div>
                                    )}
                                    {(ticketData.booking_type === 'seater' || ticketData.booking_type === 'both') && (

                                        <div className="row mb-3">
                                            <div className="col-lg-2">
                                                <label className="set_label">St:</label>
                                                <span>{ticketData.st}</span>
                                            </div>
                                            <div className="col-lg-2">
                                                <label className="set_label">St Rate:</label>
                                                <span>{ticketData.st_rate}</span>
                                            </div>
                                            <div className="col-lg-2">
                                                <label className="set_label">St Total:</label>
                                                <span>{ticketData.st_toal_amount}</span>
                                            </div>
                                            <div className="col-lg-2">
                                                <label className="set_label">St Print Rate:</label>
                                                <span>{ticketData.st_print_rate}</span>
                                            </div>
                                            <div className="col-lg-2">
                                                <label className="set_label">St Print Total:</label>
                                                <span>{ticketData.st_total_print_rate}</span>
                                            </div>
                                            <div className="col-lg-2">
                                                <label className="set_label">St No:</label>
                                                <span>{ticketData.st_no}</span>
                                            </div>
                                        </div>
                                    )}
                                    {ticketData.is_extra === "1" && (
                                        <div className="row mb-3">
                                            <div className="col-lg-2">
                                                <label className="set_label">Ex:</label>
                                                <span>{ticketData.ex}</span>
                                            </div>
                                            <div className="col-lg-2">
                                                <label className="set_label">Ex Rate:</label>
                                                <span>{ticketData.ex_rate}</span>
                                            </div>
                                            <div className="col-lg-2">
                                                <label className="set_label">Ex Total:</label>
                                                <span>{ticketData.ex_total_amount}</span>
                                            </div>
                                            <div className="col-lg-2">
                                                <label className="set_label">Ex Print Rate:</label>
                                                <span>{ticketData.ex_print_rate}</span>
                                            </div>
                                            <div className="col-lg-2">
                                                <label className="set_label">Ex Print Total:</label>
                                                <span>{ticketData.ex_total_print_rate}</span>
                                            </div>

                                        </div>)}

                                    <br />

                                    <div className="row mb-3">

                                        <div className="col-lg-3">
                                            <label className="set_label">Actual Total Amount</label>
                                            <p>{ticketData.final_total_amount} </p>
                                        </div>
                                        <div className="col-lg-3">
                                            <label className="set_label">Print Total Amount</label>
                                            <p>{ticketData.print_final_total_amount}</p>
                                        </div>
                                        <div className="col-lg-3">
                                            <label className="set_label">Print Paid Amount</label>
                                            <p>{ticketData.print_paid_amount}</p>
                                        </div>
                                        <div className="col-lg-3">
                                            <label className="set_label">Print Balance Amount</label>
                                            <p>{ticketData.print_remaining_amount}</p>
                                        </div>

                                    </div>



                                    <div className="row mb-3">
                                        <div className="col-lg-3">
                                            <label className="set_label">Created At:</label>
                                            <span>{ticketData.created_at}</span>
                                        </div>
                                        <div className="col-lg-3">
                                            <label className="set_label">Added By:</label>
                                            <span>{ticketData.added_by_name}</span>
                                        </div>
                                        <div className="col-lg-3">
                                            <label className="set_label">Updated By:</label>
                                            <span>{ticketData.updated_by_name}</span>
                                        </div>
                                        <div className="col-lg-3">
                                            <label className="set_label">Updated At</label>
                                            <span>{ticketData.updated_at}</span>
                                        </div>
                                    </div>

                                    <div className="row mb-3">
                                        <div className="col-lg-6">
                                            <label className="set_label">Particulars</label>
                                            <span>{ticketData.remarks}</span>
                                        </div>

                                    </div>


                                    {ticketData.paymentDetails && ticketData.paymentDetails.length > 0 && ticketData.paymentDetails[0].id && (
                                        <>
                                            <div className="row mt-4">
                                                <div className="col-md-6">
                                                    <h5>Payment Details:</h5>
                                                </div>

                                                <hr />
                                            </div>

                                            <div className="row mb-3">
                                                {ticketData.payment_status && (
                                                    <div className="col-lg-3 col-sm-6">
                                                        <label style={{ fontWeight: "bold" }} className="form-label">Payment Status : </label>
                                                        <span
                                                            style={{
                                                                fontWeight: "bold",
                                                                color: ticketData.payment_status === "paid" ? "green" : "red"
                                                            }}
                                                        >
                                                            {ticketData.payment_status}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>


                                            {ticketData.paymentDetails.map((paymentDetail: any, index: any) => (
                                                <div className="row mb-3" key={index}>
                                                    {paymentDetail.payment_method && (
                                                        <div className="col-lg-3 col-sm-6">
                                                            <label className="form-label">Payment Method:</label>
                                                            <span> {paymentDetail.payment_method}</span>
                                                        </div>
                                                    )}

                                                    {paymentDetail.total_amount && (
                                                        <div className="col-lg-3">
                                                            <label className="form-label">Total  Amount:</label>
                                                            <span> {paymentDetail.total_amount}</span>
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
                                                            <span> {paymentDetail.paid_amount}</span>
                                                        </div>
                                                    )}
                                                    {paymentDetail.payment_details && (
                                                        <div className="col-lg-3 col-sm-6">
                                                            <label className="form-label">Payment Details:</label>
                                                            <span> {paymentDetail.payment_details}</span>
                                                        </div>
                                                    )}

                                                </div>
                                            ))}
                                        </>
                                    )}




                                </>
                            )}

                        </form>
                    </div>
                </div>




            </div>

















        </>
    )
}

export default ViewTicketDetail