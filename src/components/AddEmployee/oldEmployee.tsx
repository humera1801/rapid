import axios from 'axios';
import React, { useState } from 'react';
import { Card } from 'react-bootstrap';
import { SubmitHandler, useForm } from 'react-hook-form';

interface FormData {
    e_id: any;
    e_name: string;
    e_email: string;
    e_password: string;
    confirmPassword: string;
    e_mobile_no: string;
    e_address: string;
    e_signature: any;
}

const CreateEmployee = () => {
    const { register, handleSubmit, setValue, reset, watch, getValues, formState: { errors } } = useForm<FormData>({
        defaultValues: {}
    });
    const [imageName, setImageName] = useState<string>('');




    const onSubmit: SubmitHandler<FormData> = async (formData) => {
        console.log("Filtered Form Data:", formData);
    
        const finalData = {
            ...formData,
        };
    
        try {
            const response = await axios.post('http://192.168.0.105:3001/employee/add_employee', finalData);
            console.log('Data submitted successfully:', response.data);
    
            const E_Id = response.data.id; // Assuming the response contains the new employee's ID
    
            if (formData.e_signature && formData.e_signature.length > 0) {
                const file = formData.e_signature[0];
    
                console.log("New image uploaded:", {
                    name: file.name,
                    size: file.size,
                    type: file.type,
                });
    
                // Pass the E_Id to the upload function
                await uploadClientProofId(file, E_Id);
            } else {
                console.log("No new image selected; skipping upload.");
            }
    
            // reset();
            // window.location.reload();
    
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                const { data } = error.response;
                if (data && data.error === 'Employee with this email already exists') {
                    alert('The email address is already in use. Please use a different email.');
                } else {
                    alert('An error occurred while adding the employee.');
                }
            } else {
                console.error('Error adding employee:', error);
            }
        }
    };
    


    const uploadClientProofId = async (file: File, E_Id: number) => {
        const formData = new FormData();
        formData.append("e_signature", file); // Append the single file
        formData.append("e_id", E_Id.toString()); // Append E_Id
    
        try {
            const response = await axios.post('http://192.168.0.105:3001/booking/upload_client_id_proof', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
    
            console.log('Client proof ID uploaded successfully:', response.data);
        } catch (error) {
            console.error('Error uploading client proof ID:', error);
        }
    };
    

    return (
        <>
            <div className='container' style={{ width: "700px", fontSize: "12px" }}>
                <br />
                <Card className="role-card">
                    <Card.Header className="role-header"><h3>Add Staff</h3></Card.Header>
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
                                    <label className="form-label" htmlFor="password">Password</label>
                                    <input
                                        type="password"
                                        className={`form-control form-control-sm ${errors.e_password ? 'is-invalid' : ''}`}
                                        id="password"
                                        placeholder="Enter your password"
                                        {...register('e_password', {
                                            required: 'Password is required',
                                            minLength: { value: 6, message: 'Password must be at least 6 characters long' }
                                        })}
                                    />
                                    {errors.e_password && <div className="invalid-feedback">{errors.e_password.message}</div>}
                                </div>

                                <div className="col-lg-6">
                                    <label className="form-label" htmlFor="confirmPassword">Confirm Password</label>
                                    <input
                                        type="password"
                                        className={`form-control form-control-sm ${errors.confirmPassword ? 'is-invalid' : ''}`}
                                        id="confirmPassword"
                                        placeholder="Confirm your password"
                                        {...register('confirmPassword', {
                                            required: 'Confirm Password is required',
                                            validate: value => value === watch('e_password') || 'Passwords do not match'
                                        })}
                                    />
                                    {errors.confirmPassword && <div className="invalid-feedback">{errors.confirmPassword.message}</div>}
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
                            </div>
                            <div className="row mb-3">

                                <div className="col-lg-7">
                                    <label className="form-label" htmlFor="particulars">Signature Image Upload</label>

                                    <input className="form-control form-control-sm" type="file" {...register("e_signature")} />
                                    {imageName && (
                                        <div className="col-lg-12 mt-2">
                                            <img src={imageName} alt="Client ID Proof" style={{ width: '100px', height: '100px' }} />
                                        </div>
                                    )}
                                    <p className="error" style={{ fontSize: "10px" }}>Please upload an image with dimensions of 50px by 50px.</p>

                                </div>
                            </div>

                            <button type="submit" className="btn btn-success btn-sm" >Submit</button>
                        </form>
                    </Card.Body>
                </Card>
            </div>
        </>
    );
}

export default CreateEmployee;
