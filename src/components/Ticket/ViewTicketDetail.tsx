"use client";

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import EditTicketData from '@/app/Api/EditTicketData';
import Link from 'next/link';
import "../../../public/css/ticketview.css"

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
    final_total_amount: number;
    ticket_actual_total: number;
    print_final_total_amount: number;
    paid_amount: number;
    remaining_amount: number;
    print_paid_amount: number;
    print_remaining_amount: number;
    remarks: string;
    user_id: 14;
    received: 'Get'

};

const ViewTicketDetail = () => {
    const [ticketData, setTicketData] = useState<any>("");
    const [error, setError] = useState<string>('');

    useEffect(() => {
        const handleURLChange = () => {
            const urlParams = new URLSearchParams(window.location.search);
            const ticketToken = urlParams.get('token');
            if (ticketToken) {
                getTicketDetail(ticketToken);
            }
        };

        window.addEventListener('popstate', handleURLChange);
        handleURLChange();

        return () => {
            window.removeEventListener('popstate', handleURLChange);
        };
    }, []);

    const getTicketDetail = async (ticketToken: string) => {
        try {
            const getTDetail = await EditTicketData.getEditTicktetData(ticketToken);
            setError('');

            setTicketData(getTDetail.data[0]);

            console.log("get data", getTDetail);
        } catch (error) {
            setError('Error fetching ticket data. Please try again later.');
            console.error('Error fetching ticket data:', error);
        }
    };
    console.log("gffgdfhjf" ,ticketData)

    const { register, handleSubmit, formState: { errors }, watch, setValue, reset } = useForm<FormData>({
        defaultValues: {


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
            final_total_amount: 0,
            ticket_actual_total: 0,
            paid_amount: 0,
            remaining_amount: 0,
            bus_name: '',
            print_final_total_amount: 0,
            print_paid_amount: 0,
            remarks: '',
            ticket_no: ticketData.tkt_no || '',
            received: 'Get',
            user_id: 14,
            bus_type: ticketData.bus_type || '',



        },
    });

    const is_extra = watch('is_extra');




    return (
        <>





            <div className="d-flex justify-content-center">
                <div className="container-fluid mt-3">
                    <div className="card mb-3" style={{ width: "auto" }}>
                        <div className="card-header" style={{ display: "flex", justifyContent: "space-between" }}>
                            <h4>View Booking Detail</h4>
                            <div>
                                <Link href="/ticket_list" target="_blank" className="btn btn-sm btn-primary" style={{ float: "right" }}>Print</Link>

                                <Link href="/ticket_list" className="btn btn-sm btn-success" style={{ float: "right", marginRight: "8px" }}>Back</Link>

                            </div>
                        </div>
                        <div className="card-body">
                            <form>
                                <div className="card mb-3" style={{ width: "auto" }}>
                                    {error && <p>{error}</p>}
                                    {ticketData && (
                                        <div className="card-body">
                                            <div className="row mb-3">
                                                <div className="col-lg-6 ">
                                                    <label className="set_label">Ticket No:</label>
                                                    <span  >{ticketData.tkt_no}</span>
                                                </div>
                                                <div className="col-lg-6">
                                                    <label className="set_label">Bus Type:</label>
                                                    <span>{ticketData.bus_type}</span>
                                                </div>

                                            </div>
                                            <div className="row mb-3">
                                                <div className="col-lg-6 ">
                                                    <label className="set_label">From:</label>
                                                    <span>{ticketData.from_state_name} - {ticketData.from_city_name}</span>
                                                </div>
                                                <div className="col-lg-6">
                                                    <label className="set_label">To: </label>
                                                    <span>{ticketData.to_state_name} - {ticketData.to_city_name}</span>
                                                </div>


                                            </div>
                                            <div className="row mb-3">
                                                <div className="col-lg-6 ">
                                                    <label className="set_label">Booking Date:</label>
                                                    <span>{ticketData.bdate}</span>
                                                </div>
                                                <div className="col-lg-6">
                                                    <label className="set_label">Journey Date:</label>
                                                    <span>{ticketData.jdate}</span>
                                                </div>

                                            </div>


                                            <div className="row mb-3">
                                                <div className="col-lg-6">
                                                    <label className="set_label">Passenger Name:</label>
                                                    <span>{ticketData.name}</span>
                                                </div>
                                                <div className="col-lg-6">
                                                    <label className="set_label">Passenger Mobile No:</label>
                                                    <span>{ticketData.mobile}</span>
                                                </div>
                                            </div>
                                            <div className="row mb-3">
                                                <div className="col-lg-6">
                                                    <label className="set_label">Created At:</label>
                                                    <span>{ticketData.created_at}</span>
                                                </div>
                                                <div className="col-lg-6">
                                                    <label className="set_label">Added By:</label>
                                                    <span>{ticketData.added_by_name}</span>
                                                </div>
                                            </div>

                                            <div className="row mb-3">
                                                <div className="col-lg-6">
                                                    <label className="set_label">Updated By</label>
                                                    <span>{ticketData.updated_by_name}</span>
                                                </div>
                                                <div className="col-lg-6">
                                                    <label className="set_label">Updated At</label>
                                                    <span>{ticketData.updated_at}</span>
                                                </div>
                                            </div>
                                            <br />
                                            <div className="row mb-3">
                                                <div className="col-lg-6 col-sm-6" style={{ visibility: "hidden" }}>
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
                                                <div className="col-lg-6 col-sm-6" style={{ visibility: "hidden" }}>
                                                    <label className="form-label">Is Extra?</label><br />
                                                    {/* <input type="checkbox" checked={ticketData.is_extra === "1"} onChange={(e) => handleFieldChange('is_extra', e.target.checked ? "1" : "0")} /> Yes */}
                                                    <input type="checkbox" {...register('is_extra')} /> Yes
                                                </div>
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
                                            <br />
                                            <div className="row mb-3">
                                                <div className="col-lg-2">
                                                    <label className="set_label">Reporting time:</label>
                                                    <span>{ticketData.rep_time}</span>
                                                </div>
                                                <div className="col-lg-3">
                                                    <label className="set_label">Dep Time:</label>
                                                    <span>{ticketData.dep_time}</span>
                                                </div>
                                                <div className="col-lg-2">
                                                    <label className="set_label">Bus Name:</label>
                                                    <span>{ticketData.bus_name} </span>
                                                </div>
                                                <div className="col-lg-2">
                                                    <label className="set_label">Bus No:</label>
                                                    <span>{ticketData.bus_no}</span>
                                                </div>
                                                <div className="col-lg-3">
                                                    <label className="set_label">Boarding:</label>
                                                    <span>{ticketData.boarding}</span>
                                                </div>

                                            </div>
                                            <br/>

                                            <div className="row mb-3">
                                                <div className="col-lg-2">
                                                    <label className="set_label">Payment Method</label>

                                                    <p>{ticketData.payment_method}</p>
                                                </div>

                                                <div className="col-lg-3">
                                                    <label className="set_label">Actual Total Amount</label>
                                                    <p>{ticketData.final_total_amount} </p>
                                                </div>
                                                <div className="col-lg-2">
                                                    <label className="set_label">Actual Paid Amount</label>
                                                    <p>{ticketData.paid_amount}</p>
                                                </div>
                                                <div className="col-lg-3">
                                                    <label className="set_label">Actual Balance Amount</label>
                                                    <p>{ticketData.remaining_amount}</p>
                                                </div>

                                            </div>
                                            <div className="row mb-3">
                                                <div className="col-lg-2">
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
                                                <div className="col-lg-6">
                                                    <label className="set_label">Particulars</label>
                                                    <span></span>
                                                </div>
                                            </div>


                                        </div>
                                    )}
                                </div>
                            </form>
                        </div>
                    </div>




                </div>

            </div>















        </>
    )
}

export default ViewTicketDetail