"use client";
import GetClientList from '@/app/Api/FireApis/FireExtinghsherList/GetClientList';
import axios from 'axios';
import { debounce } from 'lodash';
import React, { useEffect, useState } from 'react';
import { useFieldArray, useForm, SubmitHandler } from 'react-hook-form';
import { useRouter } from 'next/navigation';

import CabbookingList from '@/app/Api/CabBooking/CabbookingList';
import Link from 'next/link';

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
    updated_by: any;
    client_id_proof: any;
    cb_extra_km_charges: any;
    cb_extra_hrs_charges: any;
    night_charge: any;
    driver_allowance_charge: any;
    waiting_charge: any;


}

interface Service {
    selected: boolean | undefined;
    fest_id: any,
    fest_name: string,
    fest_created_by: any

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
    id_proof_url: any;
    client_id_proof: any;


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
    city: string;
    state: string;
    pincode: string;
    client_id_proof: any;

}
type RateOption = '8 Hrs/80 KMs' | '12 Hrs/300 KMs' | 'Other' | '';


interface Vehicle {
    v_id: any;
    v_type: any;
    rate_12_hrs: any;
    rate_8_hrs: any;
}


const EditCabBooking = () => {

    const [formData, setFormData] = useState<Client>({
        client_id: "",
        firstName: '',
        address: '',
        email: '',
        gstNo: '',
        vendorCode: '',
        poNo: '',
        mobileNo: '',
        city: "",
        state: "",
        pincode: "",
        client_id_proof: "",
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
                        setSelectedClientId(client_id);
                        // Set form data based on fetched client details
                        setFormData({
                            client_id: response.data[0].client_id,
                            firstName: response.data[0].firstName,
                            address: response.data[0].client_address,
                            email: response.data[0].client_email,
                            gstNo: response.data[0].gstNo,
                            vendorCode: response.data[0].vendorCode,
                            poNo: response.data[0].poNo,
                            mobileNo: response.data[0].mobileNo,
                            city: response.data[0].client_city,
                            state: response.data[0].client_state,
                            pincode: response.data[0].client_pincode,
                            client_id_proof: response.data[0].client_id_proof
                        });
                        setInputValue(response.data[0].firstName);

                        setValue("cb_id", response.data[0].cb_id);

                        setValue("email", response.data[0].client_email)
                        setValue("client_id", response.data[0].client_id)
                        setValue("firstName", response.data[0].firstName);
                        setValue("address", response.data[0].client_address);
                        setValue("gstNo", response.data[0].gstNo);
                        setValue("vendorCode", response.data[0].vendorCode);
                        setValue("mobileNo", response.data[0].mobileNo);
                        setValue("client_city", response.data[0].client_city);
                        setValue("client_state", response.data[0].client_state);
                        setValue("client_pincode", response.data[0].client_pincode);
                        setImageName(response.data[0].id_proof_url)

                        setValue("booking_date", response.data[0].booking_date);
                        setValue("journey_start_date", response.data[0].journey_start_date);
                        setValue("journey_end_date", response.data[0].journey_end_date);
                        setValue("place_visit", response.data[0].place_visit);

                        setValue("cb_extra_km_charges", response.data[0].cb_extra_km_charges);
                        setValue("cb_extra_hrs_charges", response.data[0].cb_extra_hrs_charges);
                        setValue("night_charge", response.data[0].night_charge);
                        setValue("driver_allowance_charge", response.data[0].driver_allowance_charge);
                        setValue("waiting_charge", response.data[0].waiting_charge);


                        setValue("engaged_by", response.data[0].engaged_by);;
                        setValue("advance_amount", response.data[0].advance_amount);
                        setSelectedRate(response.data[0].rate); // Set selected rate
                        setValue("rate_text", response.data[0].rate_text);


                        setMobileNoValue(response.data[0].mobileNo);

                        setValue("vehicle_type", response.data[0].vehicle_type);
                        // setvehicles(response.data[0].vehicle_type)
                        const newselectedVehicleId = response.data[0].vehicle_type;
                        const response2 = await CabbookingList.getVehicleIdData(newselectedVehicleId);
                        console.log("response2.data[0]", response2.data[0]);

                        const selectedVehicle = response2.data[0];

                        if (selectedVehicle) {
                            setVRate8hrs(selectedVehicle.rate_8_hrs);
                            setVRate12hrs(selectedVehicle.rate_12_hrs);


                        } else {
                            console.warn('No vehicle found for the selected ID');
                            setVRate8hrs('');
                            setVRate12hrs('');
                        }



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
            const getTDetail = await CabbookingList.GetcabBookingId(cb_id);
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
            created_by: storedData,
            updated_by: storedData,
            client_id: "",
            firstName: '',
            address: '',
            email: '',
            gstNo: '',
            vendorCode: '',
            mobileNo: '',
        }
    });




    //----------------------------------------------------------------------------------------------------
    const [mobileNoValue, setMobileNoValue] = useState<string>('');

    const handleMobileNoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/[^\d]/g, ''); // Remove non-digit characters
        if (value.length <= 10) { // Restrict to 10 digits
            setMobileNoValue(value);
            setValue("mobileNo", value); // Update form value
        }
    };

    //-----------------------------------------------get Client list -----------------------------------------------------------------

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

            // if (typeof fileProof === 'string') {
            //     setSelectedFile(null);
            //     setImageName(''); 
            // } else {
            //     setSelectedFile(fileProof);
            //     setImageName(fileProof.name); 
            // }


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


    //-----------------------------------------------------------------------------------------------------------

    const router = useRouter();


    const currentDate = new Date().toISOString().split('T')[0]; // Get current date in YYYY-MM-DD format


    //-----------------------------------------------------------------------------------------------------

    const onSubmit: SubmitHandler<FormData> = async (data) => {
        try {
            const finalData: FormData = {
                ...data,
            };

            let clientId: number | undefined;


            if (isAddingNewClient) {
                finalData.client_id = "";
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

         
            router.push("/CabBooking/CabList")

        } catch (error) {
            console.error('Error submitting form data:', error);
        }
    };

    const uploadClientProofId = async (file: File, clientId: number) => {
        const formData = new FormData();
        formData.append("client_id_proof", file); // Append the single file
        formData.append("client_id", clientId.toString());

        try {
            const response = await axios.post('http://192.168.0.106:3001/booking/upload_client_id_proof', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            console.log('Client proof ID uploaded successfully:', response.data);
        } catch (error) {
            console.error('Error uploading client proof ID:', error);
        }
    };


    const submitFormData = async (formData: FormData, clientId: number) => {
        try {
            const response = await axios.post('http://192.168.0.106:3001/cabbooking/edit_cab_booking_details', formData);
            console.log("Form data submitted successfully:", response.data);

        } catch (error) {
            console.error('Error submitting form data:', error);
        }
    };

    const submitNewClientFormData = async (formData: FormData) => {
        try {
            const response = await axios.post('http://192.168.0.106:3001/cabbooking/edit_cab_booking_details', formData);
            console.log('Form data submitted successfully for new client.', response.data);
            // window.location.reload()
            return response.data;


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

    //--------------------------------------------------------------------------------------------------------------------------
    const [vehicles, setvehicles] = useState<Vehicle[]>([]);

    useEffect(() => {

        fetchvehicleList();
    }, []);

    const fetchvehicleList = async () => {
        try {
            const response = await CabbookingList.getVehicleList();
            console.log('Vehicle API Response:', response.data); // Check the structure here
            if (Array.isArray(response.data)) {
                setvehicles(response.data);
            } else {
                console.error('Expected an array but got:', response.data);
                setvehicles([]);
            }
        } catch (error) {
            console.error('Error fetching vehicle:', error);
        }
    };


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






    //-----------------------------------------------------------------------------------------------------------
    return (
        <>
            <br />
            <div className="container" style={{ fontSize: "12px" }}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <h4>Update Cab Booking details </h4>
                        <div>


                            <Link href="/CabBooking/CabList" className="btn btn-sm btn-primary" style={{ float: "right" }}>
                                Back
                            </Link>
                        </div>


                    </div>
                    <br />
                    <div className="card cardbox">

                        {fireData && (
                            <div className="card-body">
                                <div className="row mb-3">
                                    <div className="col-lg-4 col-sm-4">
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
                                                        value={inputValue}
                                                        onChange={handleInputChange}
                                                        placeholder="Enter Client Name"
                                                    />
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

                                    <div className="col-lg-2">
                                        <label className="form-label" htmlFor="address">Address</label>
                                        <textarea
                                            {...register("address", { required: true })}

                                            className="form-control form-control-sm"
                                            id="address"
                                            placeholder="Enter Address"
                                        />
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

                                    <div className="col-lg-3">
                                        <label className="form-label" htmlFor="email">Email-id</label>
                                        <input
                                            {...register("email", { required: true })}
                                            type="email"
                                            className="form-control form-control-sm"
                                            placeholder="Enter your email"
                                        />
                                    </div>

                                    <div className="col-lg-3">
                                        <label className="form-label" htmlFor="gstNo">Gst-no</label>
                                        <input
                                            {...register("gstNo", { required: true })}
                                            className="form-control form-control-sm"
                                            type="text"
                                            placeholder="Enter Gst no."
                                        />
                                    </div>




                                    <div className="col-lg-3">
                                        <label className="form-label" htmlFor="mobileNo">Mobile No</label>
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
                                        <input {...register("booking_date")} className="form-control form-control-sm" type="date" id="bdate" placeholder="Enter Booking date" />
                                    </div>
                                    <div className="col-lg-3 col-sm-6">
                                        <label className="form-label" htmlFor="bdate">Journery Start </label>
                                        <input {...register("journey_start_date")} className="form-control form-control-sm" type="date" id="bdate" placeholder="Enter Booking date" />
                                    </div>
                                    <div className="col-lg-3 col-sm-6">
                                        <label className="form-label" htmlFor="bdate">Journey End </label>
                                        <input {...register("journey_end_date")} className="form-control form-control-sm" type="date" id="bdate" placeholder="Enter Booking date" />
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
                                        <select className="form-control form-control-sm" {...register("vehicle_type", {
                                            required: true,
                                        })} onChange={handleVehicleChange}
                                        >
                                            <option value="">--Select--</option>
                                            {vehicles.map((vehicle: any) => (
                                                <option key={vehicle.v_id} value={vehicle.v_id}>{vehicle.v_type}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="col-lg-3 col-sm-12 mb-3">
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
                                            <div className="mt-3">
                                                <input
                                                    type="text"
                                                    {...register('rate_text')}

                                                    className="form-control form-control-sm"
                                                    id="rate_8hrs_input"
                                                    placeholder="Rate for 8 hrs/80Kms"
                                                />
                                            </div>
                                        )}
                                        {selectedRate === '12 Hrs/300 KMs' && (
                                            <div className="mt-3">
                                                <input
                                                    {...register('rate_text')}
                                                    type="text"

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
                                        <input {...register("engaged_by")} type="text" className="form-control form-control-sm" id="vehicleNo" placeholder="Enter Vehicle No" />
                                    </div>





                                    <div className="col-lg-2 col-sm-6 mb-3">
                                        <label className="form-label" htmlFor="vehicleNo">Extra Km Charge</label>
                                        <input {...register("cb_extra_km_charges")} type="text" className="form-control form-control-sm" id="vehicleNo" placeholder="Enter Extra km rate" />
                                    </div>
                                    <div className="col-lg-2 col-sm-6 mb-3">
                                        <label className="form-label" htmlFor="vehicleNo">Extra Hrs Charge</label>
                                        <input {...register("cb_extra_hrs_charges")} type="text" className="form-control form-control-sm" id="vehicleNo" placeholder="Enter Extra Hrs rate" />
                                    </div>

                                    <div className="row mb-3">
                                        <div className="col-lg-3">
                                            <label className="form-label" htmlFor="night_charge">Waiting Charge</label>
                                            <input {...register("waiting_charge", { required: true })} className="form-control form-control-sm" id="Place_visit" placeholder="Enter waiting charge" />
                                        </div>
                                        <div className="col-lg-3">
                                            <label className="form-label" htmlFor="driver_allowance_charge">Driver Allowance</label>
                                            <input {...register("driver_allowance_charge", { required: true })} className="form-control form-control-sm" id="Place_visit" placeholder="Enter driver allowance" />
                                        </div> <div className="col-lg-3">
                                            <label className="form-label" htmlFor="night_charge">Night Charge</label>
                                            <input {...register("night_charge", { required: true })} className="form-control form-control-sm" id="Place_visit" placeholder="Enter night charge" />
                                        </div>
                                    </div>
                                </div>




                                <div className="row mb-3">
                                    <div className="col-12">
                                        <button type="submit" className="btn btn-success btn-sm">
                                            Update
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>


                </form >
            </div>
        </>
    );
};

export default EditCabBooking;


