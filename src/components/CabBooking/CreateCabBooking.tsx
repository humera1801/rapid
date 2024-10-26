"use client";

import GetClientList from '@/app/Api/FireApis/FireExtinghsherList/GetClientList';
import axios from 'axios';
import { debounce } from 'lodash';
import { useRouter } from 'next/navigation';
import "../../../public/css/style.css"
import React, { useEffect, useState } from 'react'
import { Card } from 'react-bootstrap'
import { SubmitHandler, useForm } from 'react-hook-form';
import Footer from '../Dashboard/Footer';
import router from 'next/navigation';
import CabbookingList from '@/app/Api/CabBooking/CabbookingList';

interface FormData {
    cb_vehicle_type: any;
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
    client_id_proof: any;
    cb_extra_km_charges: any;
    cb_extra_hrs_charges: any;
    night_charge: any;
    driver_allowance_charge: any;
    waiting_charge: any;
    rate_12_hrs: any
}

interface ClientData {
    client_id: number;
    client_firstName: string;
    client_address: string;
    client_email: string;
    client_gstNo: string;
    client_mobileNo: string;
    poNo: string;
    vendorCode: string;
    client_city: string;
    client_state: string;
    client_pincode: string;
    client_id_proof: any;
    id_proof_url: any;

}

interface Vehicle {
    v_id: any;
    v_type: any;
    rate_12_hrs: any;
    rate_8_hrs: any;
}



type RateOption = '8 Hrs/80 KMs' | '12 Hrs/300 KMs' | "Other" | '';


//-------------------------------------------------------------------------------------------------------------------------------

const CreateCabBooking = () => {
    const storedData = localStorage.getItem('userData');

    const { register, control, handleSubmit, formState: { errors }, watch, setValue, clearErrors } = useForm<FormData>({
        defaultValues: {
            created_by: storedData,
            client_id: "",

        }

    });

    const currentDate = new Date().toISOString().split('T')[0]; // Get current date in YYYY-MM-DD format

    //----------------------------------------------------------------------------------------------------
    const [mobileNoValue, setMobileNoValue] = useState<string>('');

    const handleMobileNoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/[^\d]/g, ''); // Remove non-digit characters
        if (value.length <= 10) { // Restrict to 10 digits
            setMobileNoValue(value);
            setValue("mobileNo", value); // Update form value
        }
    };

    const [vehicles, setvehicles] = useState<Vehicle[]>([]);

    useEffect(() => {

        fetchvehicleList();
    }, []);

    const fetchvehicleList = async () => {
        try {
            const response = await CabbookingList.getVehicleList();
            setvehicles(response.data);
        } catch (error) {
            console.error('Error fetching vehicle:', error);
        }
    };


    //-------------------------------------Client data------------------------------------------------------------------------------------------

    const [clientData, setClientData] = useState<ClientData[]>([]);
    const [selectedClientId, setSelectedClientId] = useState<number | null>(null);
    const [inputValue, setInputValue] = useState<string>('');
    const [filteredClients, setFilteredClients] = useState<ClientData[]>([]);
    const [isAddingNewClient, setIsAddingNewClient] = useState<boolean>(false);
    const [imageName, setImageName] = useState<string>('');


    const debounceApiCall = debounce((value: string) => {
        if (value.trim() === '') {
            setFilteredClients([]);
            return;
        }
        fetchclientData(value);
    }, 100);

    const fetchclientData = async (value: string) => {
        try {
            const res = await GetClientList.getclientListData(value);
            console.log('GetClientList.getclientListData', res);
            setClientData(res);
            setFilteredClients(res);
        } catch (error) {

            console.error('Error fetching client data:', error);
        }
    };

    const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.toLowerCase();
        setInputValue(value);

        if (value.trim() === '') {
            setFilteredClients([]);
            return;
        }
        if (clientData.length === 0) {
            await fetchclientData(value);
        }

        const filtered = clientData.filter(client =>
            client.client_firstName.toLowerCase().includes(value)
        );

        setFilteredClients(filtered);
        debounceApiCall(value);
    };


    const handleSelectClient = (clientId: number) => {
        setSelectedClientId(clientId);
        setInputValue(clientData.find(client => client.client_id === clientId)?.client_firstName || '');
        setFilteredClients([]);

        const selectedClient = clientData.find(client => client.client_id === clientId);
        if (selectedClient) {
            setValue("firstName", selectedClient.client_firstName);
            setValue("address", selectedClient.client_address);
            setValue("email", selectedClient.client_email);
            setValue("gstNo", selectedClient.client_gstNo);
            setValue("client_city", selectedClient.client_city);
            setValue("client_state", selectedClient.client_state);
            setValue("client_pincode", selectedClient.client_pincode);
            setValue("mobileNo", selectedClient.client_mobileNo);
            setValue("client_id_proof", selectedClient.client_id_proof);

            setMobileNoValue(selectedClient.client_mobileNo);

            const fileProof = selectedClient.id_proof_url;
            setImageName(fileProof)

            console.log(fileProof);

            
            clearErrors([

                "address",
                "email",
                "client_city",
                "client_state",
                "client_pincode",
                "mobileNo",
                "gstNo"

            ]);


        }
    };


    const handleAddNewClient = () => {
        setSelectedClientId(null);
        setIsAddingNewClient(true);
        setInputValue('');
        setFilteredClients([]);
        // Clear existing form values
        setValue("firstName", '');
        setValue("address", '');
        setValue("email", '');
        setValue("gstNo", '');
        setValue("mobileNo", '');
        setValue("client_city", '');
        setValue("client_state", '');
        setValue("client_pincode", '');
        setValue("client_id_proof", '');

        setMobileNoValue('');

    };

    //-----------------------rate-----------------------------------------
    const [vRate8hrs, setVRate8hrs] = useState('');
    const [vRate12hrs, setVRate12hrs] = useState('');

    const handleVehicleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedVehicleId = Number(event.target.value);
        console.log('Selected Vehicle ID:', selectedVehicleId);

        const selectedVehicle = vehicles.find(vehicle => vehicle.v_id === selectedVehicleId);
        console.log('Selected Vehicle:', selectedVehicle);

        if (selectedVehicle) {
            setVRate8hrs(selectedVehicle.rate_8_hrs);
            setVRate12hrs(selectedVehicle.rate_12_hrs);

             setSelectedRate('')
        } else {
            console.warn('No vehicle found for the selected ID');
            setVRate8hrs('');
            setVRate12hrs('');
        }
    };


    const [selectedRate, setSelectedRate] = useState<RateOption>('');

    const handleRateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newRate = event.target.value as RateOption;
        setSelectedRate(newRate);
    
        if (newRate === 'Other') {
            setValue("rate_text", ''); 
        } else if (newRate === '8 Hrs/80 KMs') {
            setValue("rate_text", vRate8hrs);
        } else {
            setValue("rate_text", vRate12hrs);
        }
       
    };





    //-------------------------------------------------------------------------------------------------------------------------------








    const onSubmit: SubmitHandler<FormData> = async (data) => {
        console.log(data);
        try {
            const finalData: FormData = {
                ...data,
            };
            let clientId: number | undefined;


            if (isAddingNewClient) {
                const response = await submitNewClientFormData(finalData);
                console.log('Form data submitted successfully for new client.', finalData);
                clientId = response.client_id;
                console.log(clientId);

                setIsAddingNewClient(false);
            } else if (selectedClientId) {
                finalData.client_id = selectedClientId;
                clientId = selectedClientId;
                await submitFormData(finalData, clientId);
                console.log('Form data submitted successfully with selected client id:', clientId);
            } else {
                console.log('Please select a client or add a new client before submitting.');
                return;
            }


            if (data.client_id_proof && data.client_id_proof.length > 0) {
                const file = data.client_id_proof[0];

                // Only upload if a new file is provided
                console.log("New image uploaded:", {
                    name: file.name,
                    size: file.size,
                    type: file.type,
                });

                if (clientId !== undefined) { // Check if clientId is defined
                    await uploadClientProofId(file, clientId);
                } else {
                    console.error('Client ID is undefined; cannot upload image.');
                }
            } else {
                console.log("No new image selected; skipping upload.");
            }


        } catch (error) {
            console.error('Error submitting form data:', error);
        }
    };

    const uploadClientProofId = async (file: File, clientId: number) => {
        const formData = new FormData();
        formData.append("client_id_proof", file); // Append the single file
        formData.append("client_id", clientId.toString());

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

    const router = useRouter();

    const submitFormData = async (formData: FormData, clientId: number) => {
        try {
            const response = await axios.post('http://192.168.0.105:3001/cabbooking/create_cab_booking', formData);
            console.log("Form data submitted successfully:", response.data);
            window.location.reload()
            router.push("/CabBooking/CabList")
        } catch (error) {
            console.error('Error submitting form data:', error);
        }
    };

    const submitNewClientFormData = async (formData: FormData) => {
        try {
            const response = await axios.post('http://192.168.0.105:3001/cabbooking/create_cab_booking', formData);
            console.log('Form data submitted successfully for new client.', response.data);
            return response.data; // Ensure this returns the data with client_id

        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error('Axios Error Details:', {
                    message: error.message,
                    code: error.code,
                    config: error.config,
                    request: error.request,
                    response: error.response
                });
            } else {
                console.error('Unexpected Error:', error);
            }
        }
    };





















    return (
        <>
            <br />
            <div className='container' style={{ fontSize: "12px" }}>
                <h4>Cab Booking</h4>
                <br />

                <Card className='cardbox'>

                    <Card.Body>
                        <form onSubmit={handleSubmit(onSubmit)}>



                            <div className="row mb-3">
                                <div className="col-lg-3 col-sm-3">
                                    <label className="form-label" htmlFor="clientId">Select Client:</label>
                                    <div className="">
                                        {isAddingNewClient ? (
                                            <input
                                                {...register("firstName", { required: true })}
                                                type="text"
                                                className="form-control form-control-sm"
                                                placeholder="Enter Client Name"
                                            />
                                        ) : (
                                            <>
                                                <input
                                                    {...register("firstName", { required: true })}
                                                    type="text"
                                                    className="form-control form-control-sm"
                                                    id="clientId"
                                                    onInput={() => {
                                                        if (errors.firstName) {
                                                            clearErrors("firstName");
                                                        }
                                                    }}
                                                    value={inputValue}
                                                    onChange={handleInputChange}
                                                    placeholder="Enter Client Name"
                                                />
                                                {errors?.firstName?.type === "required" && <span className="error">This field is required</span>}

                                                {(inputValue.length > 0 || selectedClientId !== null) && (
                                                    <div className="list-group autocomplete-items">
                                                        {inputValue.length > 0 && (
                                                            <button
                                                                type="button"
                                                                className="list-group-item list-group-item-action text-primary"
                                                                onClick={handleAddNewClient}
                                                            >
                                                                Add New Client
                                                            </button>
                                                        )}

                                                        {filteredClients.map(client => (
                                                            <button
                                                                key={client.client_id}
                                                                type="button"
                                                                className="list-group-item list-group-item-action"
                                                                onClick={() => handleSelectClient(client.client_id)}
                                                            >
                                                                {client.client_firstName}
                                                            </button>
                                                        ))}
                                                    </div>
                                                )}
                                            </>
                                        )}
                                    </div>
                                </div>


                                <div className="col-lg-3">
                                    <label className="form-label" htmlFor="address">Address</label>
                                    <textarea
                                        {...register("address", { required: true })}
                                        className="form-control form-control-sm"
                                        id="address"
                                        placeholder="Enter Address"
                                    />
                                    {errors?.address?.type === "required" && <span className="error">This field is required</span>}

                                </div>

                                <div className="col-lg-2">
                                    <label className="form-label" htmlFor="state">State</label>
                                    <input
                                        {...register("client_state", { required: true })}
                                        className="form-control form-control-sm"
                                        id="state"
                                        placeholder="Enter state"
                                    />
                                    {errors?.client_state?.type === "required" && <span className="error">This field is required</span>}

                                </div>
                                <div className="col-lg-2">
                                    <label className="form-label" htmlFor="city">city</label>
                                    <input
                                        {...register("client_city", { required: true })}
                                        className="form-control form-control-sm"
                                        id="city"
                                        placeholder="Enter city"
                                    />
                                    {errors?.client_city?.type === "required" && <span className="error">This field is required</span>}

                                </div>
                                <div className="col-lg-2">
                                    <label className="form-label" htmlFor="pincode">Pin-Code:</label>
                                    <input
                                        {...register("client_pincode", {
                                            required: true,
                                            maxLength: 6,
                                            minLength: 6

                                        })}
                                        className="form-control form-control-sm"
                                        id="pincode"
                                        placeholder="Enter pincode"
                                    />
                                    {errors?.client_pincode?.type === "required" && <span className="error">This field is required</span>}
                                    {errors?.client_pincode?.type === "minLength" && <span className="error">Enter valid Pin-code number. </span>}
                                    {errors?.client_pincode?.type === "maxLength" && <span className="error">Enter valid Pin-code number .</span>}
                                </div>
                            </div>
                            <div className="row mb-3">
                                <div className="col-lg-3">
                                    <label className="form-label" htmlFor="email">Email-id</label>
                                    <input
                                        {...register("email", { required: true })}
                                        type="email"
                                        className="form-control form-control-sm"
                                        placeholder="Enter your email"
                                    />
                                    {errors?.email?.type === "required" && <span className="error">This field is required</span>}
                                    {/* {errors?.gstNo?.type === "pattern" && <span className="error">Enetr GST valid Number</span>} */}

                                </div>

                                <div className="col-lg-3">
                                    <label className="form-label" htmlFor="gstNo">Gst-no</label>
                                    <input
                                        {...register("gstNo", {
                                            required: true,
                                            pattern: /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[0-9]{1}[A-Z]{1}[0-9A-Z]{1}$/
                                        })}
                                        className="form-control form-control-sm"
                                        type="text"
                                        placeholder="Enter Gst no."
                                    />
                                    {errors?.gstNo?.type === "required" && <span className="error">This field is required</span>}
                                    {errors?.gstNo?.type === "pattern" && <span className="error">Enetr GST valid Number</span>}


                                </div>

                                <div className="col-lg-3">
                                    <label className="form-label" htmlFor="client_mobileNo">Mobile No</label>
                                    <input
                                        type="text"
                                        {...register("mobileNo", {
                                            required: true,
                                            minLength: 10,
                                            maxLength: 10,
                                            pattern: /^[0-9]+$/
                                        })}
                                        value={mobileNoValue}
                                        onChange={handleMobileNoChange}
                                        className={`form-control form-control-sm ${errors.mobileNo ? 'is-invalid' : ''}`}
                                        id="mobileNo"

                                        placeholder="Enter Mobile No"
                                    />
                                    {errors?.mobileNo?.type === "required" && <span className="error">Enter 10 Digits Mobile Number.</span>}
                                    {errors?.mobileNo?.type === "minLength" && <span className="error">Enter 10 Digits Mobile Number.</span>}
                                    {errors?.mobileNo?.type === "pattern" && <span className="error">Enter numeric characters only.</span>}
                                </div>

                                <div className="col-lg-3">
                                    <label className="form-label" htmlFor="particulars">Image Upload</label>
                                    <input className="form-control form-control-sm" type="file" {...register("client_id_proof")} />
                                    {/* {imageName && <span style={{ marginTop: "10px" }} className="mb-2">{imageName}</span>} Display selected image name */}
                                    {imageName && (
                                        <div className="col-lg-12 mt-2">
                                            <img src={imageName} alt="Client ID Proof" style={{ width: '100px', height: '100px' }} />
                                        </div>
                                    )}
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
                                    <label className="form-label" htmlFor="bdate">Booking Date </label>
                                    <input {...register("booking_date")} className="form-control form-control-sm" type="date" id="bdate" placeholder="Enter Booking date" defaultValue={currentDate} min={currentDate} />
                                </div>
                                <div className="col-lg-3 col-sm-6">
                                    <label className="form-label" htmlFor="bdate">Journery Start </label>
                                    <input {...register("journey_start_date")} className="form-control form-control-sm" type="date" id="bdate" placeholder="Enter Booking date" min={currentDate} />
                                </div>
                                <div className="col-lg-3 col-sm-6">
                                    <label className="form-label" htmlFor="bdate">Journey End </label>
                                    <input {...register("journey_end_date")} className="form-control form-control-sm" type="date" id="bdate" placeholder="Enter Booking date" min={currentDate} />
                                </div>
                                <div className="col-lg-3">
                                    <label className="form-label" htmlFor="Place_visit">Place visit</label>
                                    <input {...register("place_visit", { required: true })} className="form-control form-control-sm" id="Place_visit" placeholder="Enter Place_visit" />
                                    {errors?.place_visit?.type === "required" && <span className="error">This field is required</span>}
                                </div>
                            </div>
                            <div className="row mb-3">
                                <div className="col-lg-2 col-sm-4">
                                    <label className="form-label" >Vehicle Type:</label>
                                    <select className="form-control form-control-sm" {...register("cb_vehicle_type", {
                                        required: true,
                                    })} onChange={handleVehicleChange}
                                    >
                                        <option value="">--Select--</option>
                                        {vehicles.map((vehicle: any) => (
                                            <option key={vehicle.v_id} value={vehicle.v_id}>{vehicle.v_type}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="col-lg-4 col-sm-12 mb-3">
                                    <label className="form-label font-weight-bold">Rate:</label>
                                    <div className="d-flex flex-column flex-sm-row gap-2 mb-3">
                                        <div className="form-check">
                                            <input
                                                type="radio"
                                                id="rate_8hrs"
                                                {...register("rate", { required: true })}
                                                value="8 Hrs/80 KMs"
                                                checked={selectedRate === '8 Hrs/80 KMs'}
                                                onChange={handleRateChange}
                                                className="form-check-input"
                                            />
                                            <label htmlFor="rate_8hrs" className="form-check-label ms-2">8 Hrs/80 KMs</label>
                                        </div>
                                        <div className="form-check">
                                            <input
                                                type="radio"
                                                id="rate_80kms"
                                                {...register("rate", { required: true })}
                                                value="12 Hrs/300 KMs"
                                                checked={selectedRate === '12 Hrs/300 KMs'}
                                                onChange={handleRateChange}
                                                className="form-check-input"
                                            />
                                            <label htmlFor="rate_80kms" className="form-check-label ms-2">12 Hrs/300 KMs</label>
                                        </div>
                                        <div className="form-check">
                                            <input
                                                type="radio"
                                                id="rate_80kms"
                                                {...register("rate", { required: true })}
                                                value="Other"
                                                checked={selectedRate === 'Other'}
                                                onChange={handleRateChange}
                                                className="form-check-input"
                                            />
                                            <label htmlFor="rate_80kms" className="form-check-label ms-2">Other</label>
                                        </div>
                                    </div>
                                    {selectedRate === '8 Hrs/80 KMs' && (
                                        <div className="col-4">
                                            <input
                                                type="text"
                                                {...register('rate_text')}
                                                // value={vRate8hrs}

                                                className="form-control form-control-sm"
                                                id="rate_8hrs_input"
                                                placeholder="Rate for 8 hrs/80Kms"
                                            />
                                        </div>
                                    )}
                                    {selectedRate === '12 Hrs/300 KMs' && (
                                        <div className="col-4">
                                            <input
                                                {...register('rate_text')}
                                                type="text"
                                                // value={vRate12hrs}
                                                className="form-control form-control-sm"
                                                id="rate_80kms_input"
                                                placeholder="Rate for 12 hrs/300Kms"
                                            />
                                        </div>
                                    )}
                                    {selectedRate === 'Other' && (
                                        <div className="col-4">
                                            <input
                                                {...register('rate_text')}
                                                type="text"
                                                className="form-control form-control-sm"
                                                id="rate_80kms_input"
                                                placeholder="Fixed amount"
                                            />
                                        </div>
                                    )}

                                </div>
                                <div className="col-lg-2 col-sm-6 mb-3">
                                    <label className="form-label" htmlFor="vehicleNo">Engaged By</label>
                                    <input {...register("engaged_by")} type="text" className="form-control form-control-sm" id="vehicleNo" placeholder="Enter name" />
                                </div>






                            </div>


                            <div className="row mb-3">
                                <div className="col-lg-2 col-sm-6 mb-3">
                                    <label className="form-label" htmlFor="vehicleNo">Extra Km Charge</label>
                                    <input {...register("cb_extra_km_charges")} type="text" className="form-control form-control-sm" id="vehicleNo" placeholder="Enter Extra km rate" />
                                </div>
                                <div className="col-lg-2 col-sm-6 mb-3">
                                    <label className="form-label" htmlFor="vehicleNo">Extra Hrs Charge</label>
                                    <input {...register("cb_extra_hrs_charges")} type="text" className="form-control form-control-sm" id="vehicleNo" placeholder="Enter Extra Hrs rate" />
                                </div>
                                <div className="col-lg-2">
                                    <label className="form-label" htmlFor="night_charge">Waiting Charge</label>
                                    <input {...register("waiting_charge", { required: true })} className="form-control form-control-sm" id="Place_visit" placeholder="Enter waiting charge" />
                                    {/* {errors?.place_visit?.type === "required" && <span className="error">This field is required</span>} */}
                                </div>
                                <div className="col-lg-2">
                                    <label className="form-label" htmlFor="driver_allowance_charge">Driver Allowance</label>
                                    <input {...register("driver_allowance_charge", { required: true })} className="form-control form-control-sm" id="Place_visit" placeholder="Enter driver allowance" />
                                    {/* {errors?.place_visit?.type === "required" && <span className="error">This field is required</span>} */}
                                </div> <div className="col-lg-2">
                                    <label className="form-label" htmlFor="night_charge">Night Charge</label>
                                    <input {...register("night_charge", { required: true })} className="form-control form-control-sm" id="Place_visit" placeholder="Enter night charge" />
                                    {/* {errors?.place_visit?.type === "required" && <span className="error">This field is required</span>} */}
                                </div>
                            </div>

                            <div className="row">
                                <div className="text-center">
                                    <input className="btn btn-success btn-sm" type="submit" id="save_form" name="save_form" />
                                </div>

                            </div>
                        </form>
                    </Card.Body>
                </Card>
            </div>

            <Footer />

        </>
    )
}

export default CreateCabBooking;
