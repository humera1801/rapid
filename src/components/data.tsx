import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import GetClientList from '@/app/Api/FireApis/FireExtinghsherList/GetClientList'; // Adjust import path as per your project structure
import { debounce, throttle } from 'lodash';

interface ClientData {
    client_id: number;
    client_firstName: string;
    client_address: string;
    client_email: string;
    client_gstNo: string;
    vendorCode: string;
    poNo: string;
    client_mobileNo: string;
}

interface FormData {
    febking_total_gst: number;
    febking_total_sgst: any;
    febking_total_cgst: any;
    febking_entry_type: number;
    febking_created_by: any;
    febking_final_amount: any;
    fest_id: any;
    client_id: any;
    febking_total_amount: string;
    firstName: string;
    address: string;
    email: string;
    gstNo: string;
    mobileNo: string;
    vendorCode: string;
    invNo: string;
    certificateNo: string;
    poNo: string;
    product_data: {
        qty: any;
        rate: any;
        totalAmount: any;
        hsnCode: string;
        gst: number;
        capacity: string;
        feit_id: any;
        febd_sgst: any;
        febd_cgst: any;
        febd_sgst_amount: any;
        febd_cgst_amount: any;
        feb_id: string;
    }[];
}

const YourFormComponent: React.FC = () => {
    const { register, handleSubmit, setValue, formState: { errors } } = useForm<FormData>();
    const [clientData, setClientData] = useState<ClientData[]>([]);
    const [selectedClientId, setSelectedClientId] = useState<number | null>(null);
    const [inputValue, setInputValue] = useState<string>('');
    const [filteredClients, setFilteredClients] = useState<ClientData[]>([]);
    const [isAddingNewClient, setIsAddingNewClient] = useState<boolean>(false);
    const [mobileNoValue, setMobileNoValue] = useState<string>('');

    // useEffect(() => {
    //     // Fetch initial client data
    //     fetchClientData();
    // }, []);

    // Debounce function to delay API calls
    const debounceApiCall = debounce((value: string) => {
        if (value.trim() === '') {
            setFilteredClients([]);
            return;
        }
        fetchFilteredClients(value);
    }, 300); // Adjust debounce delay as needed (in milliseconds)

  
    const fetchFilteredClients = async (value: string) => {
        try {
            const res = await GetClientList.getclientListData(value);
            console.log('GetClientList.getclientListDataAutocomplete', res);
            setFilteredClients(res);
        } catch (error) {
            console.error('Error fetching filtered client data:', error);
            // Handle error state if needed
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.toLowerCase();
        setInputValue(value);
        debounceApiCall(value); // Call debounce function to handle API calls
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
            setValue("vendorCode", selectedClient.vendorCode);
            setValue("poNo", selectedClient.poNo);
            setValue("mobileNo", selectedClient.client_mobileNo);
            setMobileNoValue(selectedClient.client_mobileNo); // Update mobileNoValue state
        }
    };

    const handleAddNewClient = () => {
        setSelectedClientId(null);
        setIsAddingNewClient(true);
        setInputValue('');
        setFilteredClients([]);
        setValue("firstName", '');
        setValue("address", '');
        setValue("email", '');
        setValue("gstNo", '');
        setValue("vendorCode", '');
        setValue("poNo", '');
        setValue("mobileNo", '');
        setMobileNoValue('');
    };

    const handleMobileNoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/[^\d]/g, ''); // Remove non-digit characters
        if (value.length <= 10) { // Restrict to 10 digits
            setMobileNoValue(value);
            setValue("mobileNo", value); // Update form value
        }
    };

    const onSubmit = async (formData: FormData) => {
        try {
            if (isAddingNewClient) {
                await submitNewClientFormData(formData);
                console.log('Form data submitted successfully for new client.');
                setIsAddingNewClient(false); // Reset to normal client selection mode
            } else if (selectedClientId) {
                // Ensure client_id is set to selectedClientId for existing client submission
                formData.client_id = selectedClientId;
                await submitFormData(formData, selectedClientId);
                console.log('Form data submitted successfully with selected client id:', selectedClientId);
            } else {
                console.log('Please select a client or add a new client before submitting.');
            }
        } catch (error) {
            console.error('Error submitting form data:', error);
        }
    };

    const submitFormData = async (formData: FormData, clientId: number) => {
        try {
            console.log('Submitting form data:', formData, 'with client id:', clientId);
            // Implement submission logic here
        } catch (error) {
            console.error('Error submitting form data:', error);
        }
    };

    const submitNewClientFormData = async (formData: FormData) => {
        try {
            console.log('Submitting form data for new client:', formData);
            // Implement submission logic here
        } catch (error) {
            console.error('Error submitting form data:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
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

                <div className="col-lg-4">
                    <label className="form-label" htmlFor="address">Address</label>
                    <textarea
                        {...register("address", { required: true })}
                        className="form-control form-control-sm"
                        id="address"
                        placeholder="Enter Address"
                    />
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
                    <label className="form-label" htmlFor="vendorCode">Vendor code</label>
                    <input
                        {...register("vendorCode")}
                        className="form-control form-control-sm"
                        type="text"
                        id="vendorCode"
                        placeholder="Enter Vendor code"
                    />
                </div>

                <div className="col-lg-4">
                    <label className="form-label" htmlFor="poNo">P.o.No.</label>
                    <input
                        {...register("poNo")}
                        className="form-control form-control-sm"
                        type="text"
                        id="poNo"
                        placeholder="P.o.No."
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
                    {errors?.mobileNo?.type === "maxLength" && <span className="error">Enter 10 Digits Mobile Number.</span>}
                    {errors?.mobileNo?.type === "pattern" && <span className="error">Enter numeric characters only.</span>}
                </div>
            </div>

            <button type="submit" className="btn btn-primary">Submit</button>
        </form>
    );
};

export default YourFormComponent;


