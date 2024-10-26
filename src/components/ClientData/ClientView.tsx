"use client";
import React, { useEffect, useState } from 'react';
import { useFieldArray, useForm, SubmitHandler } from 'react-hook-form';

import CabbookingList from '@/app/Api/CabBooking/CabbookingList';
import { Button, Tab, Tabs } from 'react-bootstrap';

import { generateCabPaymentReceiptPrint } from "../CabBooking/CabbookingPdf/cabpaymentreceipt"
import Link from 'next/link';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import GetPaymentListApi from '@/app/Api/PaymentApi/GetPaymentListApi';
import ClientListApi from '@/app/Api/ClientApi/ClientListApi';
import ClientBookinglist from './ClientBookinglist';
import ClientBookingList from './ClientBookinglist';
import ClientFireBookingList from './ClientFireList';
import "../../../public/css/style.css"
import ClientTicketList from './ClientTicketList';
import ClientParcelList from './ClientParcelList';








const ClientView = () => {

    //-------------------------------------------------------------------------------------------------------------------------------------





    const [paymentData, setPaymentData] = useState<any>("");
    const [error, setError] = useState<string>('');
    const [imageName, setImageName] = useState<string>('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const urlParams = new URLSearchParams(window.location.search);
                const client_id = urlParams.get("client_id");

                if (client_id) {
                    const response = await ClientListApi.getclientdataView(client_id);
                    setPaymentData(response.data);
                    await fetchTabData(client_id);
                    setImageName(response.data.id_proof_url)

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
            const client_id = urlParams.get("client_id");

            if (client_id) {
                getTicketDetail(client_id);
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

    const getTicketDetail = async (client_id: string) => {
        try {
            const getTDetail = await ClientListApi.getclientdataView(client_id);
            setPaymentData(getTDetail.data);
            setError("");
        } catch (error) {
            setError("Error fetching payment data. Please try again later.");
            console.error("Error fetching payment data:", error);
        }
    };



    //-------------------------------------------------------------------------------------------------------------------------------------
    const storedData = localStorage.getItem('userData');
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    const handleImageClick = (imageName: string) => {
        setSelectedImage(imageName);
    };

    const handleCloseModal = () => {
        setSelectedImage(null);
    };


//---------------------------------------------------------------------

    const router = useRouter();


    const handletransaction = (clientId: string, e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();

        router.push(`/ClientDetails/TransactionList?client_id=${clientId}`);
    };
    //----------------------------------------------------------------------------------------------------
    const [tabData, setTabData] = useState({
        ticketBooking: null,
        parcelBooking: null,
        fireBooking: null,
        cabBooking: null,
    });


    const fetchTabData = async (client_id: any) => {
        // Fetch data for each tab here
        // Example API calls:
        const ticketBookingData = await ClientListApi.getTicketBookingData(client_id);

        const parcelBookingData = await ClientListApi.getParcelBookingData(client_id);
        const fireBookingData = await ClientListApi.getFireBookingData(client_id);
        const cabBookingData = await ClientListApi.getCabBookingData(client_id);
        console.log(fireBookingData);


        setTabData({
            ticketBooking: ticketBookingData,
            parcelBooking: parcelBookingData,
            fireBooking: fireBookingData,
            cabBooking: cabBookingData,

        });

    };





    //-----------------------------------------------------------------------------------------------------------
    return (
        <div className="container-fluid">

            <div className="card mb-3" style={{ width: "auto" }} >
                <div className="card-header" style={{ display: "flex", justifyContent: "space-between" }}>
                    <h3>View Client Details </h3>
                    <div style={{ fontSize: "12px" }}>


                        {/* <Link href="/CabBooking/JourneyEnd" className="btn btn-sm btn-success" style={{ float: "right", marginRight: "8px" }}>Transaction History</Link> */}



                        <Button size="sm" className="btn btn-sm btn-success" style={{ float: "right", marginRight: "8px", fontSize: "12px" }} onClick={(e) => handletransaction(paymentData.client_id, e)}>Transaction History</Button>

                        <Link href="/PaymentData" className="btn btn-sm btn-primary" style={{ float: "right", marginRight: "8px", fontSize: "12px" }}>
                            Back
                        </Link>


                    </div>
                </div>



                {paymentData && (
                    <div className="card-body" style={{ fontSize: "12px" }}>
                        <div className="row mb-3">
                            <div className="col-lg-3">
                                <label className="">Receipt no : </label><span> {paymentData.client_id}</span>
                            </div>
                            <div className="col-lg-3 col-sm-6">
                                <label className="form-label" htmlFor="bdate">Client Name: </label>
                                <span> {paymentData.client_firstName}</span>
                            </div>
                            <div className="col-lg-3 col-sm-6">
                                <label className="form-label" htmlFor="bdate">Client Email: </label>
                                <span> {paymentData.client_email}</span>

                            </div>
                            <div className="col-lg-3 col-sm-6">
                                <label className="form-label" htmlFor="bdate">Client Mobile No: </label>
                                <span> {paymentData.client_mobileNo}</span>

                            </div>
                        </div>





                        <div className="row mb-3">


                            <div className="col-lg-3">
                                <label className="form-label" htmlFor="Place_visit">Client Address:</label>
                                <span> {paymentData.client_address}</span>
                            </div>
                            <div className="col-lg-3">
                                <label className="form-label" htmlFor="Place_visit">Client City:</label>
                                <span> {paymentData.client_city}</span>
                            </div>
                            <div className="col-lg-3">
                                <label className="form-label" htmlFor="Place_visit">Client State:</label>
                                <span> {paymentData.client_state}</span>
                            </div>
                            <div className="col-lg-3">
                                <label className="form-label" htmlFor="Place_visit">Client Pin-code:</label>
                                <span> {paymentData.client_pincode}</span>
                            </div>
                        </div>





                        <div className="row mb-3">


                            <div className="col-lg-3">
                                <label className="form-label" htmlFor="Place_visit">Client Gstno:</label>
                                <span> {paymentData.client_gstNo}</span>
                            </div>
                            <div className="col-lg-3">
                                <label className="form-label" htmlFor="Place_visit">Client VendorCode:</label>
                                <span> {paymentData.vendorCode}</span>
                            </div>
                            <div className="col-lg-3">
                                <label className="form-label" htmlFor="Place_visit">Client PoNo:</label>
                                <span> {paymentData.poNo}</span>
                            </div>

                            {/* <div className="col-lg-12">
                                    <label className="set_labelData">Client IdProof:</label>
                                    <div className="image-gallery1">
                                        {parcelImages.length > 0 ? (
                                            parcelImages.map((imageUrl, index) => (
                                                <img
                                                    key={index}
                                                    src={imageUrl}
                                                    alt={`Parcel ${index}`}
                                                    className="parcel-image1"
                                                    onClick={() => handleImageClick(imageUrl)}
                                                    style={{ cursor: 'pointer' }}
                                                />
                                            ))
                                        ) : (
                                            <p>No images available.</p>
                                        )}
                                    </div>


                                    {selectedImage && (
                                        <div className="modal-parcel" onClick={handleCloseModal}>
                                            <span className="close" onClick={handleCloseModal}>&times;</span>
                                            <img src={selectedImage} alt="Enlarged" className="modal-content-parcel" />

                                        </div>
                                    )}
                                </div> */}

                            {/* <div className="col-lg-3">
                                <label className="form-label" htmlFor="Place_visit">Client IdProof:</label>
                                {imageName && (
                                    <div className="col-lg-12 mt-2">
                                        <img src={imageName} alt="Client ID Proof" style={{ width: '100px', height: '100px' }} />
                                    </div>
                                )}
                            </div> */}

                            <div className="col-lg-3">
                                <label className="form-label" htmlFor="Place_visit">Client IdProof:</label>
                                {imageName ? (
                                    <div className="image-gallery">
                                        <img
                                            src={imageName}
                                            alt="Client ID Proof"
                                            style={{ width: '100px', height: '100px', cursor: 'pointer' }}
                                            onClick={() => handleImageClick(imageName)}
                                        />
                                    </div>
                                ) : (
                                    <p>No image available.</p>
                                )}

                                {selectedImage && (
                                    <div className="modal-parcel" onClick={handleCloseModal}>
                                        <span className="close" onClick={handleCloseModal}>&times;</span>
                                        <img src={selectedImage} alt="Enlarged" className="modal-content-parcel" />
                                    </div>
                                )}
                            </div>



                        </div>
                        <br />
                        <div className='row mb-3'>
                            {paymentData && (
                                <Tabs defaultActiveKey="ticketBooking" className="mb-3">
                                    <Tab eventKey="ticketBooking" title="Ticket Booking">
                                        <ClientTicketList title="Ticket Booking" data={tabData.ticketBooking} />
                                    </Tab>
                                    <Tab eventKey="parcelBooking" title="Parcel Booking">
                                        <ClientParcelList title="Parcel Booking" data={tabData.parcelBooking} />
                                    </Tab>
                                    <Tab eventKey="fireBooking" title="Fire Booking">
                                        <ClientFireBookingList title="Fire Booking" data={tabData.fireBooking} />
                                    </Tab>
                                    <Tab eventKey="cabBooking" title="Cab Booking">
                                        <ClientBookingList title="Cab Booking" data={tabData.cabBooking} />
                                    </Tab>
                                </Tabs>
                            )}
                        </div>



                    </div>


                )}


            </div>



        </div >
    );
};

export default ClientView;

