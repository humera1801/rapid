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









const ViewEmp = () => {

    //-------------------------------------------------------------------------------------------------------------------------------------





    const [empData, setempData] = useState<any>("");
    const [error, setError] = useState<string>('');
    const [imageName, setImageName] = useState<string>('');
    const [idimageProof, setidimageProof] = useState<any>('');

    useEffect(() => {
        const fetchData = async () => {
            const e_id = new URLSearchParams(window.location.search).get("id");
            if (e_id) {
                try {
                    const response = await EmployeeList.GetEmpId(e_id);
                    if (response.data) {
                        setempData(response.data);
                        console.log(response.data);
                        setImageName(response.data.e_signature_url);
                        setidimageProof(response.data.e_id_proof_urls)
                        // setValue("e_id", response.data.e_id);
                        // setValue("e_email", response.data.e_email);
                        // setValue("e_name", response.data.e_name);
                        // setValue("e_mobile_no", response.data.e_mobile_no);
                        // setValue("e_address", response.data.e_address);
                        // setValue("e_role", response.data.e_role);







                        // setRoles(response.data.e_role)
                        setError('');
                    } else {
                        setError('No employee data found.');
                    }
                } catch (error) {
                    setError('Error fetching employee data.');
                    console.error('Error fetching data:', error);
                }
            } else {
                setError('Id not found.');
            }
        };

        fetchData();
    }, []);

    const getTicketDetail = async (client_id: string) => {
        try {
            const getTDetail = await ClientListApi.getclientdataView(client_id);
            setempData(getTDetail.data);
            setError("");
            console.log("emp Details:", getTDetail.data);
        } catch (error) {
            setError("Error fetching emp data. Please try again later.");
            console.error("Error fetching emp data:", error);
        }
    };



    //-------------------------------------------------------------------------------------------------------------------------------------
    const storedData = localStorage.getItem('userData');


    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    const handleImageClick = (idimageProof: string) => {
        setSelectedImage(idimageProof);
    };

    const handleCloseModal = () => {
        setSelectedImage(null);
    };


    // const [SignatureImage, setSignatureImage] = useState<string | null>(null);

    // const handlesignatureImageClick = (imageName: string) => {
    //     setSignatureImage(imageName);
    // };

    // const handlesignatureCloseModal = () => {
    //     setSignatureImage(null);
    // };





















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
                    <h3>View Employee Details </h3>
                    <div style={{ fontSize: "12px" }}>
                        <Link href={`EmpEdit?id=${empData.e_id}`} className="btn btn-sm btn-success" style={{ float: "right", marginRight: "8px" }}>Edit</Link>


                        {/* <Button variant="danger" size="sm" className="btn btn-sm btn-success" style={{ float: "right", marginRight: "8px", fontSize: "12px" }} onClick={(e) => handleDeleteTicket(empData.cb_id, e)}>Delete</Button> */}

                        <Link href="/Employee/EmpList" className="btn btn-sm btn-primary" style={{ float: "right", marginRight: "8px", fontSize: "12px" }}>
                            Back
                        </Link>


                    </div>
                </div>



                {empData && (
                    <div className="card-body" style={{ fontSize: "12px" }}>
                        <div className="row mb-3">
                            <div className="col-lg-3">
                                <label className="">Employee Id : </label><span> {empData.e_id}</span>
                            </div>
                            <div className="col-lg-3 col-sm-6">
                                <label className="form-label" htmlFor="bdate">Employee Name: </label>
                                <span> {empData.e_name}</span>
                            </div>
                            <div className="col-lg-3 col-sm-6">
                                <label className="form-label" htmlFor="bdate">Employee Email: </label>
                                <span> {empData.e_email}</span>

                            </div>
                            <div className="col-lg-3 col-sm-6">
                                <label className="form-label" htmlFor="bdate">Employee Mobile No: </label>
                                <span> {empData.e_mobile_no}</span>

                            </div>
                        </div>





                        <div className="row mb-3">


                            <div className="col-lg-3">
                                <label className="form-label" htmlFor="Place_visit">Employee Address:</label>
                                <span> {empData.e_address}</span>
                            </div>
                            <div className="col-lg-3">
                                <label className="form-label" htmlFor="Place_visit">Employee Role:</label>
                                <span> {empData.role_title}</span>
                            </div>

                        </div>





                        <div className="row mb-3">

                            {/* <div className="col-lg-3">
                                <label className="form-label" htmlFor="Place_visit">Employee Id Proof:</label>
                                {idimageProof && (
                                    <div className="col-lg-12 mt-2">
                                        <img src={idimageProof} alt="Client ID Proof" style={{ width: '100px', height: '100px' }} />
                                    </div>
                                )}
                            </div> */}
                            <div className="col-lg-3">
                                <label className="form-label" htmlFor="EmployeeIdProof">Employee Id Proof:</label>
                                {idimageProof && idimageProof.length > 0 ? (
                                    <div className="image-gallery">
                                        {idimageProof.map((image: any, index: any) => (
                                            <img
                                                key={index}
                                                src={image}
                                                alt={`Employee ID Proof ${index + 1}`}
                                                style={{ width: '100px', height: '100px', cursor: 'pointer', marginRight: '5px' }}
                                                onClick={() => handleImageClick(image)}
                                            />
                                        ))}
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

                            <div className="col-lg-3">
                                <label className="form-label" htmlFor="Place_visit">Employee Signature:</label>
                                {imageName ? (
                                    <div className="image-gallery">
                                        <img
                                            src={imageName}
                                            alt="Employee Signature"
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





                    </div>


                )}


            </div>



        </div >
    );
};

export default ViewEmp;

