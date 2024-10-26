"use client";
import GetClientList from '@/app/Api/FireApis/FireExtinghsherList/GetClientList';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import EmployeeList from '@/app/Api/Employee/EmployeeList';
import { Card } from 'react-bootstrap';
import "../../../public/css/style.css"

interface FormData {
    e_id: any;
    e_name: string;
    e_email: string;
    e_password: string;
    e_mobile_no: string;
    e_address: string;
    e_signature: any;
    e_role: any;
    e_id_proof: any;
    remove_files: any
}


interface Role {
    role_id: string;
    role_title: string;
    role_task: any;
}

const EditEmp = () => {
    const [fireData, setFireData] = useState<FormData | null>(null);
    const [error, setError] = useState<string>('');
    const { register, handleSubmit, setValue, formState: { errors } } = useForm<FormData>();
    const [imageName, setImageName] = useState<string>('');
    const [idimageProof, setidimageProof] = useState<string[]>([]);


    useEffect(() => {
        const fetchData = async () => {
            const e_id = new URLSearchParams(window.location.search).get("id");
            if (e_id) {
                try {
                    const response = await EmployeeList.GetEmpId(e_id);
                    if (response.data) {
                        setFireData(response.data);
                        console.log(response.data);
                        setImageName(response.data.e_signature_url);
                        setidimageProof(response.data.e_id_proof_urls)
                        setValue("e_id", response.data.e_id);
                        setValue("e_email", response.data.e_email);
                        setValue("e_name", response.data.e_name);
                        setValue("e_mobile_no", response.data.e_mobile_no);
                        setValue("e_address", response.data.e_address);
                        setValue("e_role", response.data.e_role);






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
    }, [setValue]);


    const [imageError, setImageError] = useState<string | null>(null);

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const image = new Image();
            image.src = URL.createObjectURL(file);

            image.onload = () => {
                if (image.width > 100 || image.height > 100) {
                    setImageError('Signature image must be 100px by 100px or smaller.');
                    setImageName('');
                } else {
                    setImageError(null);
                    setImageName(image.src);
                }
            };
        }
    };


    const [roles, setRoles] = useState<Role[]>([]);

    useEffect(() => {
        const fetchRoles = async () => {
            try {
                const response = await axios.get('http://192.168.0.105:3001/employee/get_role_list');
                setRoles(response.data.data);
                console.log(response.data.data);

            } catch (error) {
                if (axios.isAxiosError(error)) {
                    setError(error.message);
                } else {
                    setError('An unexpected error occurred');
                }
            }
        };

        fetchRoles();
    }, []);
    //----------------------------------------------------
    const [removedFileNames, setRemovedFileNames] = useState<string[]>([]);

    const extractFileName = (url: string) => {
        return url.substring(url.lastIndexOf('/') + 1);
    };

    const removeImage = (image: string) => {
        const fileName = extractFileName(image);
        setRemovedFileNames((prevRemovedFileNames) => [...prevRemovedFileNames, fileName]);

        setidimageProof((prevImages: any[]) => prevImages.filter((url) => url !== image));
    };

    //-----------------------------------------------------------------------------------------------------------   
    const onSubmit = async (finaldata: FormData) => {

        const formData = {
            ...finaldata,
            role_id: fireData?.e_role
        };

        console.log(formData);


        formData.remove_files = removedFileNames;

        console.log("remove", removedFileNames);


        try {
            const response = await axios.post('http://192.168.0.105:3001/employee/edit_employee_details', formData);
            console.log('Data submitted successfully:', response.data);


            const E_Id = fireData?.e_id
            // const E_Id = response.data.e_id; 
            console.log(E_Id);



            if (formData.e_signature && formData.e_signature.length > 0) {
                const file = formData.e_signature[0];

                console.log("New image uploaded:", {
                    name: file.name,
                    size: file.size,
                    type: file.type,
                });

                await uploadClientProofId(file, E_Id);
            } else {
                console.log("No new image selected; skipping upload.");
            }

            if (formData.e_id_proof && formData.e_id_proof.length > 0) {
                await uploadMultipleIdProofs(formData.e_id_proof, E_Id);
            } else {
                console.log("No ID proofs selected; skipping upload.");
            }

        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                const { data } = error.response;
                if (data && data.error === 'Email already in use by another employee') {
                    alert('The email address is already in use by another employee.');
                } else {
                    alert('An error occurred while updating the data.');
                }
            } else {
                console.error('Error updating data:', error);
            }
        }
    };


    const uploadClientProofId = async (file: File, E_Id: number) => {
        const formData = new FormData();
        formData.append("e_signature", file);
        formData.append("e_id", E_Id.toString());

        try {
            const response = await axios.post('http://192.168.0.105:3001/employee/upload_employee_signature', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            console.log('Signature uploaded successfully:', response.data);
        } catch (error) {
            console.error('Error uploading client proof ID:', error);
        }
    };


    const uploadMultipleIdProofs = async (files: File[], E_Id: number) => {
        const formData = new FormData();
        for (const file of files) {
            formData.append("e_id_proof", file);
        }
        formData.append("e_id", E_Id.toString());

        try {
            const response = await axios.post('http://192.168.0.105:3001/employee/upload_employee_id_proof', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            console.log('ID proofs uploaded successfully:', response.data);
        } catch (error) {
            console.error('Error uploading ID proofs:', error);
        }
    };








    //--------------------------------------------------------------------------------------------------------------
    return (
        <>
            {fireData ? (
                <div className='container' style={{ width: "600px", fontSize: "12px" }}>
                    <br />
                    <h4>Edit Staff</h4>
                    <br />
                    <Card className="role-card cardbox">
                        <Card.Body>
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <div className="row mb-3">
                                    <div className="col-lg-6">
                                        <label className="form-label" htmlFor="name">Name</label>
                                        <input
                                            type="text"
                                            className={`form-control form-control-sm ${errors.e_name ? 'is-invalid' : ''}`}
                                            id="name"
                                            placeholder="Enter your name"
                                            {...register('e_name', { required: 'Name is required' })}
                                        />
                                        {errors.e_name && <div className="invalid-feedback">{errors.e_name.message}</div>}
                                    </div>
                                    <div className="col-lg-6">
                                        <label className="form-label" htmlFor="email">Email</label>
                                        <input
                                            type="text"
                                            className={`form-control form-control-sm ${errors.e_email ? 'is-invalid' : ''}`}
                                            id="email"
                                            placeholder="Enter your email"
                                            {...register('e_email', {
                                                required: 'Email is required',
                                                pattern: {
                                                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                                    message: 'Invalid email address'
                                                }
                                            })}
                                        />
                                        {errors.e_email && <div className="invalid-feedback">{errors.e_email.message}</div>}
                                    </div>
                                </div>
                                <div className="row mb-3">
                                    <div className="col-lg-6">
                                        <label className="form-label" htmlFor="mobile">Mobile No</label>
                                        <input
                                            type="text"
                                            className={`form-control form-control-sm ${errors.e_mobile_no ? 'is-invalid' : ''}`}
                                            id="mobile"
                                            maxLength={10}
                                            placeholder="Enter mobile no"
                                            {...register('e_mobile_no', {
                                                required: 'Mobile number is required',
                                                pattern: {
                                                    value: /^[0-9]{10}$/,
                                                    message: 'Mobile number must be 10 digits'
                                                }
                                            })}
                                        />
                                        {errors.e_mobile_no && <div className="invalid-feedback">{errors.e_mobile_no.message}</div>}
                                    </div>
                                    <div className="col-lg-6">
                                        <label className="form-label" htmlFor="address">Address</label>
                                        <textarea
                                            className="form-control form-control-sm"
                                            id="address"
                                            placeholder="Enter your address"
                                            {...register('e_address')}
                                        />
                                    </div>

                                    <div className="row mb-3">
                                        <div className="col-lg-5 col-sm-4">
                                            <label className="form-label" htmlFor='role'>Employee Role:</label>
                                            <select {...register("e_role")} className="form-control form-control-sm" id='role'>
                                                <option value="" >--Select--</option>
                                                {roles && roles.length > 0 && roles.map(role => (
                                                    <option key={role.role_id} value={role.role_id}>
                                                        {role.role_title}
                                                    </option>
                                                ))}

                                            </select>
                                        </div>
                                        <div className="col-lg-7">
                                            <label className="form-label" htmlFor="particulars">Signature Image Upload</label>
                                            <input
                                                className="form-control form-control-sm"
                                                type="file"
                                                {...register("e_signature")}
                                                onChange={handleImageChange}
                                            />
                                            {imageName && (
                                                <div className="col-lg-12 mt-2">
                                                    <img src={imageName} alt="Client ID Proof" style={{ width: '100px', height: '100px' }} />
                                                </div>
                                            )}
                                            {imageError && <span className="text-danger" style={{ fontSize: "10px" }}>{imageError}</span>}
                                            {/* <p className="error" style={{ fontSize: "10px" }}>Please upload an image with dimensions of 100px by 100px.</p> */}
                                        </div>
                                        <div className="row mb-3">

                                            <div className="col-lg-5">


                                                <label className="form-label" htmlFor="particulars">Employee Id Proof</label>
                                                <input className="form-control form-control-sm" type="file" {...register("e_id_proof")} multiple />


                                            </div>


                                            <div className="col-lg-7">
                                                <label className="set_labelData">Id Proof Images:</label>
                                                <div className="image-gallery">
                                                    {Array.isArray(idimageProof) && idimageProof.length > 0 ? (
                                                        <div className="col-lg-12 mt-2 d-flex flex-wrap">
                                                            {idimageProof.map((image, index) => (
                                                                <div key={index} style={{ position: 'relative', marginRight: '10px', marginBottom: '10px' }}>
                                                                    <img
                                                                        src={image}
                                                                        alt={`Employee ID Proof ${index + 1}`}
                                                                        style={{ width: '100px', height: '100px' }}
                                                                    />
                                                                    <button
                                                                        type='button'
                                                                        className="remove-button"
                                                                        onClick={() => removeImage(image)}
                                                                        style={{
                                                                            position: 'absolute',
                                                                            top: '0',
                                                                            right: '0',

                                                                            color: 'white',
                                                                            border: 'none',
                                                                            borderRadius: '50%',
                                                                            cursor: 'pointer',
                                                                            padding: '2px 5px',
                                                                        }}
                                                                    >
                                                                        ✕
                                                                    </button>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    ) : (
                                                        <p>No images available.</p>
                                                    )}
                                                </div>
                                            </div>


                                        </div>
                                    </div>

                                </div>
                                <button type="submit" className="btn btn-success btn-sm" >Submit</button>
                            </form>
                        </Card.Body>
                    </Card>
                </div>
            ) : (
                <div>{error}</div>
            )}
        </>
    );
};

export default EditEmp;
