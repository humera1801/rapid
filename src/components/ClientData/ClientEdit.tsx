"use client";
import GetClientList from '@/app/Api/FireApis/FireExtinghsherList/GetClientList';
import axios from 'axios';
import { debounce } from 'lodash';
import React, { useEffect, useState } from 'react';
import { useFieldArray, useForm, SubmitHandler } from 'react-hook-form';
import { useRouter } from 'next/navigation';

import CabbookingList from '@/app/Api/CabBooking/CabbookingList';
import ClientListApi from '@/app/Api/ClientApi/ClientListApi';

interface FormData {

    address: any;

    firstName: string;
    client_city: string;
    client_state: string;
    client_pincode: string;
    email: string;
    gstNo: string;
    mobileNo: string;
    created_by: any;
    vendorCode: any;
    client_id: any
    created_by_name: any;
    client_mobileNo: any;
    client_firstName: any;
    updated_by: any
    client_id_proof: any

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


const ClientEdit = () => {



    const [error, setError] = useState<string>('');
    const [imageName, setImageName] = useState<string>('');
    const [clientId, setClientId] = useState<number | null>(null);


    const [paymentData, setPaymentData] = useState<any>("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const urlParams = new URLSearchParams(window.location.search);
                const client_id = urlParams.get("client_id");

                if (client_id) {
                    const response = await ClientListApi.getclientdataView(client_id);
                    setPaymentData(response.data);
                    console.log("Payment Data:", response.data);



                    setImageName(response.data.id_proof_url)
                    setClientId(response.data.client_id)

                    setValue("firstName", response.data.client_firstName);
                    setValue("email", response.data.client_email)
                    setValue("client_id", response.data.client_id)
                    setValue("address", response.data.client_address);
                    setValue("gstNo", response.data.client_gstNo);
                    setValue("client_state", response.data.client_state);
                    setValue("client_city", response.data.client_city);
                    setValue("client_pincode", response.data.client_pincode);
                    setValue("mobileNo", response.data.client_mobileNo);
                    setMobileNoValue(response.data.client_mobileNo);


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
            console.log("Payment Details:", getTDetail.data);
        } catch (error) {
            setError("Error fetching payment data. Please try again later.");
            console.error("Error fetching payment data:", error);
        }
    };























    const storedData = localStorage.getItem('userData');


    const { register, control, handleSubmit, formState: { errors }, watch, setValue, getValues } = useForm<FormData>({
        defaultValues: {
            created_by: storedData,
            updated_by: storedData,
            client_id: paymentData.client_id || '',
            firstName: '',
            address: '',
            email: '',
            gstNo: '',
            vendorCode: '',
            mobileNo: '',
        }
    });






    //-----------------------------------------------get Client list -----------------------------------------------------------------
    const [mobileNoValue, setMobileNoValue] = useState<string>('');
    const [clientData, setClientData] = useState<ClientData[]>([]);
    const [selectedClientId, setSelectedClientId] = useState<number | null>(null);
    const [inputValue, setInputValue] = useState<string>('');
    const [filteredClients, setFilteredClients] = useState<ClientData[]>([]);
    const [isAddingNewClient, setIsAddingNewClient] = useState<boolean>(false);



    const handleMobileNoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/[^\d]/g, ''); // Remove non-digit characters
        if (value.length <= 10) { // Restrict to 10 digits
            setMobileNoValue(value);
            setValue("mobileNo", value);
        }
    };
    

    const debounceApiCall = debounce((value: string) => {
        if (value.trim() === '') {
            setFilteredClients([]);
            return;
        }
        fetchclientData(value);
    }, 10);

    const fetchclientData = async (value: string) => {
        try {
            const res = await GetClientList.getclientListData(value); // Assuming this is an async function
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
        setSelectedClientId(null);
        // setIsAddingNewClient(true);
        setInputValue('');
        setFilteredClients([]);
        // Clear existing form values
        setValue("client_id", "")
        setValue("firstName", '');
        setValue("address", '');
        setValue("email", '');
        setValue("gstNo", '');
        setValue("vendorCode", '');
        setValue("mobileNo", '');
        setMobileNoValue('');
        setSelectedClientId(clientId);
        setInputValue(clientData.find(client => client.client_id === clientId)?.client_firstName || '');
        setFilteredClients([]);

        const selectedClient = clientData.find(client => client.client_id === clientId);
        if (selectedClient) {
            
            setValue("client_id", clientId);
            setValue("firstName", selectedClient.client_firstName);
            setValue("address", selectedClient.client_address);
            setValue("email", selectedClient.client_email);
            setValue("gstNo", selectedClient.client_gstNo);
            setValue("vendorCode", selectedClient.vendorCode);
            setValue("mobileNo", selectedClient.client_mobileNo);
            setValue("client_city", selectedClient.client_city);
            setValue("client_state", selectedClient.client_state);
            setValue("client_pincode", selectedClient.client_pincode);
            setValue("client_id_proof", selectedClient.client_id_proof);

            setMobileNoValue(selectedClient.client_mobileNo);
        }
    };

    const handleAddNewClient = () => {
        setSelectedClientId(null);
        setIsAddingNewClient(true);
        setInputValue('');
        setFilteredClients([]);
        // Clear existing form values
        setValue("client_id", "")
        setValue("firstName", '');
        setValue("address", '');
        setValue("email", '');
        setValue("gstNo", '');
        setValue("vendorCode", '');
        setValue("mobileNo", '');
        setValue("client_city", '');
        setValue("client_state", '');
        setValue("client_pincode", '');
        setValue("client_id_proof", '');

        setMobileNoValue('');
    };


    //-----------------------------------------------------------------------------------------------------------

    const router = useRouter();



    //------------------------------------------------------------------------------------------------------

    const onSubmit = async (formData: any) => {

        if (clientId === null) {
            console.error('Client ID is null; cannot submit the form.');
            return; // Exit if clientId is null
        }
        const finalData = {
            ...formData,
            client_id: clientId, // Now TypeScript knows clientId is not null


        };
        console.log("fdg0", finalData);

        console.log("Filtered Form Data:", finalData);
        try {
            const response = await axios.post('http://192.168.0.105:3001/client/edit_client_details', finalData);
            console.log('Data submitted successfully:', response.data);


            if (formData.client_id_proof && formData.client_id_proof.length > 0) {
                const file = formData.client_id_proof[0];

                // Only upload if a new file is provided
                console.log("New image uploaded:", {
                    name: file.name,
                    size: file.size,
                    type: file.type,
                });

                await uploadClientProofId(file, clientId);

            } else {
                console.log("No new image selected; skipping upload.");
            }


            router.push("/ClientDetails/ClientList")

            console.log(paymentData.client_id);

        } catch (error) {
            console.error('Error updating data:', error);
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
    //-----------------------------------------------------------------------------------------------------------
    return (
        <div className="container" style={{fontSize:"12px"}}>
            <form onSubmit={handleSubmit(onSubmit)}>
          <br/>
                        <h3>Update Client details </h3>
                        <br/>
                <div className="card cardbox">
                   
                    {paymentData && (
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

                                <div className="col-lg-4">
                                    <label className="form-label" htmlFor="email">Email-id</label>
                                    <input
                                        {...register("email", { required: true })}
                                        type="email"
                                        className="form-control form-control-sm"
                                        placeholder="Enter your email"
                                    />
                                </div>

                                <div className="col-lg-4">
                                    <label className="form-label" htmlFor="gstNo">Gst-no</label>
                                    <input
                                        {...register("gstNo", { required: true })}
                                        className="form-control form-control-sm"
                                        type="text"
                                        placeholder="Enter Gst no."
                                    />
                                </div>




                                <div className="col-lg-4">
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
                                    {imageName && (
                                        <div className="col-lg-12 mt-2">
                                            <img src={imageName} alt="Client ID Proof" style={{ width: '100px', height: '100px' }} />
                                        </div>
                                    )}
                                </div>
                            </div>






                            <div className="row mb-3">
                                <div className="col-12">
                                    <button type="submit" className="btn btn-success btn-sm" >
                                        Update
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>


            </form >
        </div>
    );
};

export default ClientEdit;


