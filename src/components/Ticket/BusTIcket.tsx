


"use client";
import React, { useState, ChangeEvent, useEffect } from 'react'
import axios from 'axios';
import Card from 'react-bootstrap/Card';
import { useForm, SubmitHandler } from 'react-hook-form';
import CityList from '@/app/Api/CityList';
import StateList from '@/app/Api/StateList';
import ticketNo from '@/app/Api/ticketNo';
import { useRouter } from 'next/navigation';
import { debounce } from 'lodash';
import GetClientList from '@/app/Api/FireApis/FireExtinghsherList/GetClientList';
import Footer from '../Dashboard/Footer';
import EditTicketData from '@/app/Api/EditTicketData';
import handlePrint from '@/app/ticket_list/Ticket_data/printUtils';
import Header from '../Dashboard/Header';



type FormData = {
    from_state: string, travel_from: string, to_state: string, travel_to: string,
    bus_type: string, ticket_no: string, bdate: string; jdate: string;
    mobile_no: string; name: string; cmp_name: string; cmp_mobile: string;
    booking_type: 'seater' | 'sleeper' | 'both'; is_duplicate: boolean; is_extra: boolean; slr: number;
    slr_rate: number; slr_total_amount: number; slr_print_rate: number; slr_total_print_rate: number;
    st: number; st_rate: number; st_total_amount: number; st_print_rate: number;
    st_total_print_rate: number; ex: number; ex_rate: number; ex_total_amount: number;
    ex_print_rate: number; st_no: string; sI_no: string; ex_total_print_rate: number;
    rep_time: string; dep_time: string; bus_name: string; bus_no: string;
    boarding: string; payment_method: string; final_total_amount: number; ticket_actual_total: number;
    print_final_total_amount: number; paid_amount: number; remaining_amount: number; print_paid_amount: number;
    print_remaining_amount: number; remarks: string; user_id: any; received: 'Get'; whatsapp_no: any;
    passengers_proof_type: string;
    reciver_proof_type: string;
    passengers_proof_details: string;
    reciver_proof_detail: string; rep_date: string;
    transection_id: String;
    firstName: string;
    client_city: string;
    client_state: string;
    client_pincode: string;
    email: string;
    client_id: any
    driver_no: any;
    mobileNo: string;
    address: any;
    client_id_proof: any;



};

interface ClientData {
    client_id: number;
    client_firstName: string;
    client_address: string;
    client_email: string;

    client_mobileNo: string;

    client_city: string;
    client_state: string;
    client_pincode: string;
    client_id_proof: any;
    id_proof_url: any;

}




interface City {
    id: number;
    city_name: string;
    state_id: string;
}

interface State {
    id: number;
    name: string;
}
function TicketBook() {






    const storedData = localStorage.getItem('userData');


    const { register, handleSubmit, formState: { errors }, watch, setValue, clearErrors } = useForm<FormData>({
        defaultValues: {

            from_state: '', travel_from: '', to_state: '', travel_to: '', 
            mobile_no: '', name: '', cmp_name: '', cmp_mobile: '', is_extra: false,
            booking_type: 'seater', slr: 0, slr_rate: 0, slr_total_amount: 0, slr_print_rate: 0,
            slr_total_print_rate: 0, st: 0, st_rate: 0, st_total_amount: 0, st_print_rate: 0,
            st_total_print_rate: 0, ex: 0, ex_rate: 0, ex_total_amount: 0, ex_print_rate: 0,
            ex_total_print_rate: 0, sI_no: '', st_no: '', rep_time: '', dep_time: '',
            print_remaining_amount: 0, bus_no: '', boarding: '', payment_method: '', final_total_amount: 0,
            ticket_actual_total: 0, paid_amount: 0, remaining_amount: 0, bus_name: '', print_final_total_amount: 0,
            print_paid_amount: 0, remarks: '', ticket_no: '', received: 'Get', user_id: storedData, transection_id: "",

        },
    });



    const bookingType = watch('booking_type');
    const isExtra = watch('is_extra');

    const calculateAmounts = () => {
        const slr = watch('slr');
        const slr_rate = watch('slr_rate');
        const slr_print_rate = watch('slr_print_rate');
        const st = watch('st');
        const st_rate = watch('st_rate');
        const st_print_rate = watch('st_print_rate');
        const ex = watch('ex');
        const ex_rate = watch('ex_rate');
        const ex_print_rate = watch('ex_print_rate');

        const slr_total_amount = slr * slr_rate;
        const slr_total_print_rate = slr * slr_print_rate;
        const st_total_amount = st * st_rate;
        const st_total_print_rate = st * st_print_rate;
        const ex_total_amount = ex * ex_rate;
        const ex_total_print_rate = ex * ex_print_rate;

        const total = slr_total_amount + st_total_amount + ex_total_amount;
        const print_final_total_amount = slr_total_print_rate + st_total_print_rate + ex_total_print_rate;
        const paid_amount = watch('paid_amount');
        const print_paid_amount = watch('print_paid_amount');

        setValue('slr_total_amount', slr_total_amount);
        setValue('slr_total_print_rate', slr_total_print_rate);
        setValue('st_total_amount', st_total_amount);
        setValue('st_total_print_rate', st_total_print_rate);
        setValue('ex_total_amount', ex_total_amount);
        setValue('ex_total_print_rate', ex_total_print_rate);
        setValue('final_total_amount', total);
        setValue('print_final_total_amount', print_final_total_amount);
        setValue('remaining_amount', total - paid_amount);
        setValue('print_remaining_amount', print_final_total_amount - print_paid_amount);
    };

    useEffect(() => {
        calculateAmounts();
    }, [
        watch('slr'),
        watch('slr_rate'),
        watch('slr_print_rate'),
        watch('st'),
        watch('st_rate'),
        watch('st_print_rate'),
        watch('ex'),
        watch('ex_rate'),
        watch('ex_print_rate'),
        watch('paid_amount'),
        watch('print_paid_amount'),
    ]);
    const calculatePrintRate = (seatRate: number) => {
        // Modify this calculation based on your requirement
        return seatRate;
    };

    useEffect(() => {
        const seatRate = watch('st_rate');
        if (seatRate) {
            const printRate = calculatePrintRate(seatRate);
            setValue('st_print_rate', printRate);
        }
    },
        [watch('st_rate')]

    );

    const calculateSlPrintRate = (slRate: number) => {
        // Modify this calculation based on your requirement
        return slRate;
    };

    useEffect(() => {
        const slRate = watch('slr_rate');
        if (slRate) {
            const printslRate = calculateSlPrintRate(slRate);
            setValue('slr_print_rate', printslRate);
        }
    }, [watch('slr_rate')]);


    const calculateExPrintRate = (exRate: number) => {
        // Modify this calculation based on your requirement
        return exRate;
    };

    useEffect(() => {
        const exRate = watch('ex_rate');
        if (exRate) {
            const printexRate = calculateExPrintRate(exRate);
            setValue('ex_print_rate', printexRate);
        }
    }, [watch('ex_rate')]);




    const currentDate = new Date().toISOString().split('T')[0]; // Get current date in YYYY-MM-DD format



    //----------------------------------------Api validation---------------------------------------------------------------------
    const [selectedFromStateId, setSelectedFromStateId] = useState<string>('');
    const [selectedToStateId, setSelectedToStateId] = useState<string>('');
    const [fromStates, setFromStates] = useState<State[]>([]);
    const [toStates, setToStates] = useState<State[]>([]);
    const [fromCities, setFromCities] = useState<City[]>([]);
    const [toCities, setToCities] = useState<City[]>([]);
    const [showCustomFromCityInput, setShowCustomFromCityInput] = useState(false);
    const [showCustomToCityInput, setShowCustomToCityInput] = useState(false);

    useEffect(() => {
        fetchStates(true); // Fetch "From" states
        fetchStates(false); // Fetch "To" states
    }, []);

    const fetchStates = async (isFrom: boolean) => {
        try {
            StateList.getAllStateListApi().then((res: any) => {
                console.log('StateList.getAllStateListApi', res);
                if (isFrom) {
                    setFromStates(res.data);
                } else {
                    setToStates(res.data);
                }
            }).catch((e: any) => {
                console.log('Err', e);
            });
        } catch (error) {
            console.error(error);
        }
    };

    const fetchCities = async (stateId: string, isFrom: boolean) => {
        try {
            CityList.getStateCityList(stateId).then((res: any) => {
                console.log('StateList.getStateCityList', res);
                if (isFrom) {
                    setFromCities(res.data);
                } else {
                    setToCities(res.data);
                }
            }).catch((e: any) => {
                console.log('Err', e);
            });
        } catch (error) {
            console.error(error);
        }
    };

    const handleStateChange = (event: React.ChangeEvent<HTMLSelectElement>, isFrom: boolean) => {
        const stateId = event.target.value;
        if (isFrom) {
            setSelectedFromStateId(stateId);
            if (stateId) {
                fetchCities(stateId, true);
            }
        } else {
            setSelectedToStateId(stateId);
            if (stateId) {
                fetchCities(stateId, false);
            }
        }
    };

    const handleCustomCity = async (e: React.ChangeEvent<HTMLSelectElement>, isFrom: boolean) => {
        const cityId = e.target.value;
        if (isFrom && cityId === 'tkt_from_other') {
            setShowCustomFromCityInput(true);
        } else if (!isFrom && cityId === 'tkt_to_other') {
            setShowCustomToCityInput(true);
        } else {
            if (isFrom) {
                setShowCustomFromCityInput(false);
            } else {
                setShowCustomToCityInput(false);
            }
        }
    };


    //--------------------------------------------------------------------------------------------------------------------------------

    const router = useRouter();


    const [customFromCityName, setCustomFromCityName] = useState<string>('');
    const [customToCityName, setCustomToCityName] = useState<string>('');

    const onSubmit: SubmitHandler<FormData> = async (formData: FormData) => {
        console.log('form submitted', formData);

        let newFromCityId = formData.travel_from;  // Initialize with existing values
        let newToCityId = formData.travel_to;  // Initialize with existing values

        // Add new city for "From" state
        if (formData.travel_from === 'tkt_from_other' && selectedFromStateId) {
            const fromCityResponse = await addNewCity(selectedFromStateId, customFromCityName);
            newFromCityId = fromCityResponse.city_id.toString();
        }

        // Add new city for "To" state
        if (formData.travel_to === 'tkt_to_other' && selectedToStateId) {
            const toCityResponse = await addNewCity(selectedToStateId, customToCityName);
            newToCityId = toCityResponse.city_id.toString();
        }

        // Update form data with new city ids if they were added
        formData.travel_from = newFromCityId;
        formData.travel_to = newToCityId;




        try {
            const finalData: FormData = {
                ...formData,
            };

            let clientId: number | undefined;


            if (isAddingNewClient) {
                const response = await submitNewClientFormData(finalData);
                console.log('Form data submitted successfully for new client.', finalData);
                clientId = response.client_id;
                console.log(clientId);
                if (formData.client_id_proof && formData.client_id_proof.length > 0) {
                    const file = formData.client_id_proof[0];

                    console.log("New image uploaded:", {
                        name: file.name,
                        size: file.size,
                        type: file.type,
                    });

                    if (clientId !== undefined) {
                        await uploadClientProofId(file, clientId);
                    } else {
                        console.error('Client ID is undefined; cannot upload image.');
                    }

                } else {
                    console.log("No new image selected; skipping upload.");
                }
                if (!response.ok) {
                    throw new Error('Failed to get ticket data');
                }
                const ticketData = await response.json();
                console.log("datadata", ticketData)

                console.log('Form data submitted successfully with selected client id:', clientId);
                if (ticketData.ticket_token != "") {
                    const ticketToken = ticketData.ticket_token;
                    try {
                        const getTDetail = await EditTicketData.getEditTicktetData(ticketToken);


                        console.log("get data", getTDetail.data[0]);
                        handlePrint(getTDetail.data[0])
                        router.push("/ticket_list")

                    } catch (error) {

                        console.error('Error fetching parcel data:', error);
                    }

                };
                setIsAddingNewClient(false);


            } else if (selectedClientId) {
                finalData.client_id = selectedClientId;
                clientId = selectedClientId;
                const ticketDataResponse = await submitFormData(finalData, clientId);

                if (formData.client_id_proof && formData.client_id_proof.length > 0) {
                    const file = formData.client_id_proof[0];

                    console.log("New image uploaded:", {
                        name: file.name,
                        size: file.size,
                        type: file.type,
                    });

                    if (clientId !== undefined) {
                        await uploadClientProofId(file, clientId);
                    } else {
                        console.error('Client ID is undefined; cannot upload image.');
                    }

                } else {
                    console.log("No new image selected; skipping upload.");
                }


                if (!ticketDataResponse.ok) {
                    throw new Error('Failed to create parcel data');
                }
                const ticketData = await ticketDataResponse.json();
                console.log("datadata", ticketData)

                console.log('Form data submitted successfully with selected client id:', clientId);
                if (ticketData.ticket_token != "") {
                    const ticketToken = ticketData.ticket_token;
                    try {
                        const getTDetail = await EditTicketData.getEditTicktetData(ticketToken);


                        console.log("get data", getTDetail.data[0]);
                        handlePrint(getTDetail.data[0])
                        router.push("/ticket_list")

                    } catch (error) {

                        console.error('Error fetching parcel data:', error);
                    }

                };
            } else {
                console.log('Please select a client or add a new client before submitting.');
                return;
            }




        } catch (error) {
            console.error('Error submitting form data:', error);
        }



    };


    async function uploadClientProofId(file: File, clientId: number) {
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
    }


    async function addNewCity(stateId: string, cityName: string) {
        const requestBody = { city_name: cityName, state_id: stateId };
        const response = await fetch('http://192.168.0.106:3001/ticket/add_new_city_from_state', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
        });
        if (!response.ok) {
            throw new Error('Failed to add city');
        }
        return await response.json();
    }

    async function submitFormData(formData: FormData, clientId: number | undefined) {
        const response = await fetch('http://192.168.0.106:3001/ticket/create_ticket_data', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });

        console.log("Response from form submission:", response);
        return response;
    }

    async function submitNewClientFormData(formData: FormData) {
        try {
            const response = await axios.post('http://192.168.0.106:3001/ticket/create_ticket_data', formData);
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
    }































    //-----------------------------------------------------------------------------------------------------------------------------------


    //     // const onSubmit: SubmitHandler<FormData> = async (formData: any) => {
    //     //     console.log(formData)
    // }

    // const onSubmit: SubmitHandler<FormData> = (data) => {
    //     console.log(data)
    // }



    //----------------------------------------------phonevalidation----------------------------------------------------------------------------------------------------------










    const [phoneNumber, setPhoneNumber] = useState<string>('');
    const handlePhoneChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const input = event.target.value;
        const sanitizedInput = input.replace(/\D/g, '');
        if (sanitizedInput.length <= 10) {
            setPhoneNumber(sanitizedInput);
        }
    };

    const [cmpNumber, setCmpNumber] = useState<string>('');
    const handleCmpPhoneChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const input = event.target.value;
        const sanitizedInput = input.replace(/\D/g, '');
        if (sanitizedInput.length <= 10) {
            setCmpNumber(sanitizedInput);
        }
    };


    const [WmobileNoValue, setWMobileNoValue] = useState<string>('');
    const handleWMobileNoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/[^\d]/g, ''); // Remove non-digit characters
        if (value.length <= 10) { // Restrict to 10 digits
            setWMobileNoValue(value);
            setValue("whatsapp_no", value); // Update form value
        }
    };
    //-------------------------------------Client data------------------------------------------------------------------------------------------
    const [mobileNoValue, setMobileNoValue] = useState<string>('');

    const handleMobileNoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/[^\d]/g, ''); // Remove non-digit characters
        if (value.length <= 10) { // Restrict to 10 digits
            setMobileNoValue(value);
            setValue("mobileNo", value); // Update form value
        }
    };


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
            clearErrors([

                "address",
                "email",
                "client_city",
                "client_state",
                "client_pincode",
                "mobileNo",

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
        setValue("mobileNo", '');
        setValue("client_city", '');
        setValue("client_state", '');
        setValue("client_pincode", '');
        setValue("client_id_proof", '');

        setMobileNoValue('');

    };


    // ------------------------------radio button selection------------------------------------------------------------------

    const [selectedOption, setSelectedOption] = useState<string | null>();
    const handleOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedOption(event.target.value)
    };




    const aadhaarPattern = /^\d{12}$/;
    const panPattern = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    const gstPattern = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[0-9]{1}[A-Z]{1}[0-9A-Z]{1}$/;



    const journeyDate = watch('jdate');
    const departureTime = watch('dep_time');

    useEffect(() => {
        if (journeyDate && departureTime) {
            const [depHours, depMinutes] = departureTime.split(':').map(Number);
            const departureDateTime = new Date(`${journeyDate}T${departureTime}`);

            const reportingDateTime = new Date(departureDateTime.getTime() - 30 * 60 * 1000);

            const reportingDate = reportingDateTime.toISOString().split('T')[0];
            const reportingTime = reportingDateTime.toTimeString().split(' ')[0].slice(0, 5);

            setValue('rep_date', reportingDate);
            setValue('rep_time', reportingTime);
        }
    }, [journeyDate, departureTime, setValue]);


    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');

    // Handler for payment method change
    const handlePaymentMethodChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
        setSelectedPaymentMethod(event.target.value);
    };



    //--------------------------------------------------------------------------------------------------------------------------
    return (
        <>
            <Header />
            <br />
            <div className='container' style={{ fontSize: "12px" }} >

                <h4 className='headtitle'>Bus Ticket booking</h4>
                <br />
                <Card className='cardbox'>




                    <Card.Body>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            {/* First-Row */}
                            <div className='row mb-3'>
                                <div className="col-lg-3">
                                    <label className="form-label" htmlFor="from">From State</label>
                                    <select
                                        id="from_state_select"
                                        {...register('from_state', { required: true })}
                                        value={selectedFromStateId}
                                        onChange={(e) => handleStateChange(e, true)}
                                        className="form-control form-control-sm set_option_clr"
                                    >
                                        <option value="">--Select--</option>
                                        {fromStates.map((state) => (
                                            <option key={state.id} value={state.id}>
                                                {state.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="col-lg-3">
                                    <label className="form-label" htmlFor="from">From City</label>
                                    <select
                                        {...register('travel_from', { required: true })}
                                        id="travel_from_select"
                                        className="form-control form-control-sm set_option_clr"
                                        onChange={(e) => handleCustomCity(e, true)}
                                    >
                                        <option value="">--Select--</option>
                                        {fromCities.map((city) => (
                                            <option key={city.id} value={city.id}>
                                                {city.city_name}
                                            </option>
                                        ))}
                                        {selectedFromStateId && (
                                            <option style={{ background: '#4682B4', color: "#F5FFFA" }} value="tkt_from_other">Add new City</option>
                                        )}
                                    </select>
                                    {showCustomFromCityInput && (
                                        <div id="custom_city_input">
                                            <input

                                                type="text"
                                                className="form-control form-control-sm mt-2"
                                                placeholder="Enter Custom City"
                                                value={customFromCityName}
                                                onChange={(e) => setCustomFromCityName(e.target.value)}
                                            />
                                        </div>
                                    )}
                                </div>

                                <div className="col-lg-3">
                                    <label className="form-label" htmlFor="to">To State</label>
                                    <select
                                        {...register('to_state', { required: true })}
                                        id="to_state_select"
                                        value={selectedToStateId}
                                        onChange={(e) => handleStateChange(e, false)}
                                        className="form-control form-control-sm set_option_clr"
                                    >
                                        <option value="">--Select--</option>
                                        {toStates.map((state) => (
                                            <option key={state.id} value={state.id}>
                                                {state.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="col-lg-3">
                                    <label className="form-label" htmlFor="to">To City</label>
                                    <select
                                        {...register('travel_to', { required: true })}
                                        id="travel_to_select"
                                        className="form-control form-control-sm set_option_clr"
                                        onChange={(e) => handleCustomCity(e, false)}
                                    >
                                        <option value="">--Select--</option>
                                        {toCities.map((city) => (
                                            <option key={city.id} value={city.id}>
                                                {city.city_name}
                                            </option>
                                        ))}
                                        {selectedToStateId && (
                                            <option style={{ background: '#4682B4', color: "#F5FFFA" }} value="tkt_to_other">Add new City</option>
                                        )}
                                    </select>
                                    {showCustomToCityInput && (
                                        <div id="custom_city_input">
                                            <input
                                                type="text"
                                                className="form-control form-control-sm mt-2"
                                                placeholder="Enter Custom City"
                                                value={customToCityName}
                                                onChange={(e) => setCustomToCityName(e.target.value)}
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                            {/* Second-Row */}
                            <div className="row mb-3">
                                <div className="col-lg-6">
                                    <label className="form-label" htmlFor="bus_type">Bus type</label>


                                    <select {...register('bus_type')} className="form-control form-control-sm" id="bus_type">
                                        <option value="">--Select--</option>
                                        <option value="Ac">AC</option>
                                        <option value="Non-Ac">Non-AC</option>
                                    </select>

                                </div>

                                <div className="col-lg-6">
                                    <label className="form-label" htmlFor="bdate">Booking date</label>
                                    <input  {...register('bdate')} className="form-control form-control-sm" type="date" id="bdate" placeholder="Enter Booking date" defaultValue={currentDate} min={currentDate} />
                                </div>



                            </div>

                            {/* Fourth-Row */}
                            <div className="row mb-3">


                                <div className="col-md-12">
                                    <h6>Client Detail:</h6>
                                </div>
                                <hr />
                            </div>

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
                                                    value={inputValue}
                                                    onInput={() => {
                                                        if (errors.firstName) {
                                                            clearErrors("firstName");
                                                        }
                                                    }}
                                                    onChange={handleInputChange}
                                                    placeholder="Enter Client Name"
                                                />
                                                {errors.firstName?.type === "required" && (
                                                    <span id="show_mobile_err" className="error">This field is required.</span>
                                                )}
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
                                    {errors.address?.type === "required" && (
                                        <span id="show_mobile_err" className="error">This field is required.</span>
                                    )}
                                </div>

                                <div className="col-lg-2">
                                    <label className="form-label" htmlFor="state">State</label>
                                    <input
                                        {...register("client_state", { required: true })}
                                        className="form-control form-control-sm"
                                        id="state"
                                        placeholder="Enter state"
                                    />
                                    {errors?.client_state?.type === "required" && (
                                        <span className="error">This field is required</span>
                                    )}
                                </div>


                                <div className="col-lg-2">
                                    <label className="form-label" htmlFor="city">city</label>
                                    <input
                                        {...register("client_city", { required: true })}
                                        className="form-control form-control-sm"
                                        id="city"
                                        placeholder="Enter city"
                                    />
                                    {errors?.client_city?.type === "required" && (<span className="error">This field is required</span>)}

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
                                    {errors?.client_pincode?.type === "required" && (<span className="error">This field is required</span>)}
                                    {errors?.client_pincode?.type === "minLength" && (<span className="error">Enter valid Pin-code number. </span>)}
                                    {errors?.client_pincode?.type === "maxLength" && (<span className="error">Enter valid Pin-code number .</span>)}
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
                                    {errors?.email?.type === "required" && (<span className="error">This field is required</span>)}

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
                                    {errors?.mobileNo?.type === "required" && (<span className="error">Enter 10 Digits Mobile Number.</span>)}
                                    {errors?.mobileNo?.type === "minLength" && (<span className="error">Enter 10 Digits Mobile Number.</span>)}
                                    {errors?.mobileNo?.type === "pattern" && (<span className="error">Enter numeric characters only.</span>)}
                                </div>

                                <div className="col-lg-3">
                                    <label className="form-label" htmlFor="particulars">Upload Id Proof</label>
                                    <input className="form-control form-control-sm" type="file" {...register("client_id_proof")} />
                                    {/* {imageName && <span style={{ marginTop: "10px" }} className="mb-2">{imageName}</span>} Display selected image name */}
                                    {imageName && (
                                        <div className="col-lg-12 mt-2">
                                            <img src={imageName} alt="Client ID Proof" style={{ width: '100px', height: '100px' }} />
                                        </div>
                                    )}
                                </div>

                            </div>

                            {/* Fifth-Row */}
                            <div className="row mb-3">
                                <div className="col-lg-4">
                                    <label className="form-label" htmlFor="name">Company Name</label>
                                    <input {...register('cmp_name')} className="form-control form-control-sm" type="text" id="cmp_name" placeholder="Enter Company Name" />
                                </div>


                                <div className="col-lg-4">
                                    <label className="form-label" style={{ appearance: "textfield" }} htmlFor="mobile">Company Mobile No </label>
                                    <input type="number"
                                        {...register("cmp_mobile", {

                                            minLength: 10,


                                        })} value={cmpNumber}
                                        onChange={handleCmpPhoneChange} className="form-control form-control-sm" name="cmp_mobile" id="cmp_mobile" placeholder="Enter Company Mobile No" />
                                    {errors.cmp_mobile?.type === "required" && <span id="show_mobile_err" className="error">Enter 10 Digits Mobile Number.</span>}
                                    {errors?.cmp_mobile?.type === "minLength" && <span id="show_mobile_err" className="error">Enter 10 Digits Mobile Number.</span>}

                                </div>


                                <div className="col-lg-4">
                                    <label className="form-label" style={{ appearance: "textfield" }} htmlFor="mobile">WhatsApp No</label>
                                    <input
                                        type="text"
                                        {...register("whatsapp_no", {
                                            required: true,
                                            minLength: 10,
                                            maxLength: 10,
                                            pattern: /^[0-9]+$/
                                        })}
                                        value={WmobileNoValue}
                                        onChange={handleWMobileNoChange}
                                        onInput={() => {
                                            if (errors.whatsapp_no) {
                                                clearErrors("whatsapp_no");
                                            }
                                        }}
                                        className="form-control form-control-sm"
                                        id="whatsapp_no"
                                        placeholder="Enter Mobile No"
                                    />
                                    {errors.whatsapp_no?.type === "required" && (
                                        <span id="show_mobile_err" className="error">This field is required.</span>
                                    )}
                                    {errors.whatsapp_no && errors.whatsapp_no.type === "minLength" && (
                                        <span className="error">Enter 10 Digits Mobile Number.</span>
                                    )}
                                    {errors.whatsapp_no && errors.whatsapp_no.type === "pattern" && (
                                        <span className="error">Enter numeric characters only.</span>
                                    )}
                                </div>



                            </div>


                            {/* id-proof details */}
                            <div className="row mb-3">
                                <div className="col-lg-6">
                                    <label className="form-label" htmlFor="send_mob"> Passenger ID Proof Type</label>&nbsp;
                                    <br />
                                    <div className="d-flex gap-2">
                                        <input
                                            {...register('passengers_proof_type', { required: true })}
                                            type="radio"
                                            onInput={() => {
                                                if (errors.passengers_proof_type) {
                                                    clearErrors("passengers_proof_type");
                                                }
                                            }}
                                            checked={selectedOption === 'Aadhar_no'}
                                            onChange={handleOptionChange}
                                            value="Aadhar_no"
                                        /> Aadhar
                                        <input
                                            {...register('passengers_proof_type')}
                                            type="radio"
                                            onInput={() => {
                                                if (errors.passengers_proof_type) {
                                                    clearErrors("passengers_proof_type");
                                                }
                                            }}
                                            checked={selectedOption === 'Pan_no'}
                                            onChange={handleOptionChange}
                                            value="Pan_no"
                                        /> PAN
                                        <input
                                            {...register('passengers_proof_type')}
                                            type="radio"
                                            checked={selectedOption === 'Gst_no'}
                                            onChange={handleOptionChange}
                                            onInput={() => {
                                                if (errors.passengers_proof_type) {
                                                    clearErrors("passengers_proof_type");
                                                }
                                            }}
                                            value="Gst_no"
                                        /> GST
                                        <input
                                            {...register('passengers_proof_type', { required: true })}
                                            type="radio"
                                            checked={selectedOption === 'Other'}
                                            onChange={handleOptionChange}
                                            onInput={() => {
                                                if (errors.passengers_proof_type) {
                                                    clearErrors("passengers_proof_type");
                                                }
                                            }}
                                            value="Other"
                                        /> Other
                                    </div>
                                    {errors.passengers_proof_type && (
                                        <span id="show_mobile_err" className="error">This field is required.</span>
                                    )}
                                </div>
                            </div>

                            {/* --------------*/}
                            <div className="row mb-3">
                                <div className="col-lg-6">
                                    <label className="form-label" htmlFor="send_mob">passenger Adhar No./PAN No./GST No.</label>
                                    <input
                                        {...register('passengers_proof_details', {
                                            required: selectedOption === 'Aadhar_no' ? 'Aadhaar number is required' :
                                                selectedOption === 'Pan_no' ? 'PAN number is required' :
                                                    selectedOption === 'Gst_no' ? 'GST number is required' : false,

                                            pattern: {
                                                value: selectedOption === 'Aadhar_no' ? aadhaarPattern : selectedOption === 'Pan_no' ? panPattern : gstPattern,


                                                message: selectedOption === 'Aadhar_no' ? 'Invalid Aadhaar number format' : selectedOption === 'Pan_no' ? 'Invalid PAN number format' : selectedOption === 'Gst_no' ? 'Invalid GST number format ' : ''

                                            }
                                        })}
                                        className="form-control form-control-sm"
                                        type="text"
                                        name="passengers_proof_details"
                                        placeholder="Enter Sender ID Proof Detail"
                                    />
                                    {errors.passengers_proof_details && <span className='error'>{errors.passengers_proof_details.message}</span>}
                                </div>
                            </div>




                            <div className="row mb-3">


                                <div className="col-md-12">
                                    <h6>Bus Detail:</h6>
                                </div>
                                <hr />
                            </div>

                            {/* Select-seat */}

                            <div className="row mb-3">
                                <div className="col-lg-6 col-sm-12 mb-2">
                                    <label className="form-label">Booking Type</label><br />
                                    <div className="d-flex gap-2">
                                        <div>
                                            <input type="radio" {...register('booking_type')} value="seater" /> Seater
                                        </div>
                                        <div>
                                            <input type="radio" {...register('booking_type')} value="sleeper" /> Sleeper
                                        </div>
                                        <div>
                                            <input type="radio" {...register('booking_type')} value="both" /> Both
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-6 col-sm-12 mb-2">
                                    <label className="form-label">Is Extra?</label><br />
                                    <input type="checkbox" {...register('is_extra')} /> Yes
                                </div>
                            </div>


                            {bookingType !== 'seater' && (
                                <div id="sleeper_show">
                                    <div className="row mb-3">
                                        <div className="col-lg-2 col-sm-2">
                                            <label className="form-label">No Of Sleeper</label>
                                            <input {...register('slr')} className="form-control form-control-sm" value={watch('slr') > 0 ? watch('slr') : ''} type="number" placeholder='Enter slr' />
                                        </div>
                                        <div className="col-lg-2 col-sm-2">
                                            <label className="form-label">Sleeper Rate</label>
                                            <input {...register('slr_rate')} className="form-control form-control-sm" value={watch('slr_rate') > 0 ? watch('slr_rate') : ''} type="number" placeholder='Enter slr Rate' />
                                        </div>
                                        <div className="col-lg-2 col-sm-2">
                                            <label className="form-label">Total Amount</label>
                                            <input readOnly className="form-control-plaintext" type="number" value={watch('slr_total_amount')} />
                                        </div>
                                        <div className="col-lg-2 col-sm-2">
                                            <label className="form-label">Print Rate</label>
                                            <input {...register('slr_print_rate')} className="form-control form-control-sm" value={watch('slr_print_rate') > 0 ? watch('slr_print_rate') : ''} type="number" placeholder='Enter slr Rate' />
                                        </div>
                                        <div className="col-lg-2 col-sm-2">
                                            <label className="form-label">Total Print Amount</label>
                                            <input readOnly className="form-control-plaintext" type="number" value={watch('slr_total_print_rate')} />
                                        </div>
                                        <div className="col-lg-2 col-sm-2">
                                            <label className="form-label">SI No</label>
                                            <input {...register('sI_no',
                                                {
                                                    required: true
                                                }
                                            )} className="form-control form-control-sm" type="text" placeholder='Enter Sl No' />
                                            {errors.sI_no?.type === "required" && <span id="show_mobile_err" className="error">This field is required.</span>}

                                        </div>
                                    </div>
                                </div>
                            )}

                            {bookingType !== 'sleeper' && (
                                <div id="seater_show">
                                    <div className="row mb-3">
                                        <div className="col-lg-2 col-sm-2">
                                            <label className="form-label">No Of Seater</label>
                                            <input {...register('st')} className="form-control form-control-sm" value={watch('st') > 0 ? watch('st') : ''} type="number" placeholder='Enter st' />
                                        </div>
                                        <div className="col-lg-2 col-sm-2">
                                            <label className="form-label">Seater Rate</label>
                                            <input {...register('st_rate')} className="form-control form-control-sm" value={watch('st_rate') > 0 ? watch('st_rate') : ''} type="number" placeholder='Enter st Rate' />
                                        </div>
                                        <div className="col-lg-2 col-sm-2">
                                            <label className="form-label">Total Amount</label>
                                            <input readOnly className="form-control-plaintext" type="number" value={watch('st_total_amount')} />
                                        </div>
                                        <div className="col-lg-2 col-sm-2">
                                            <label className="form-label">Print Rate</label>
                                            <input {...register('st_print_rate')} placeholder='Enter st rate' className="form-control form-control-sm" value={watch('st_print_rate') > 0 ? watch('st_print_rate') : ''} type="number" />
                                        </div>
                                        <div className="col-lg-2 col-sm-2">
                                            <label className="form-label">Total Print Amount</label>
                                            <input readOnly className="form-control-plaintext" type="number" value={watch('st_total_print_rate')} />
                                        </div>
                                        <div className="col-lg-2 col-sm-2">
                                            <label className="form-label">St No.</label>
                                            <input {...register('st_no',
                                                {
                                                    required: true
                                                }
                                            )} className="form-control form-control-sm" placeholder='Enter St No.' type="text" />
                                            {errors.st_no?.type === "required" && <span id="show_mobile_err" className="error">This field is required.</span>}

                                        </div>
                                    </div>
                                </div>
                            )}
                            {isExtra && (
                                <div id="show_extra">
                                    <div className="row mb-3">
                                        <div className="col-lg-2 col-sm-2">
                                            <label className="form-label">Extra Qty</label>
                                            <input {...register('ex')} className="form-control form-control-sm" placeholder='Enter Ex' value={watch('ex') > 0 ? watch('ex') : ''} type="number" />
                                        </div>
                                        <div className="col-lg-2 col-sm-2">
                                            <label className="form-label">Extra Rate</label>
                                            <input {...register('ex_rate')} className="form-control form-control-sm" placeholder='Enter Ex Rate' value={watch('ex_rate') > 0 ? watch('ex_rate') : ''} type="number" />
                                        </div>
                                        <div className="col-lg-2 col-sm-2">
                                            <label className="form-label">Total Amount</label>
                                            <input readOnly className="form-control-plaintext" type="number" value={watch('ex_total_amount')} />
                                        </div>
                                        <div className="col-lg-2 col-sm-2">
                                            <label className="form-label">Print Rate</label>
                                            <input {...register('ex_print_rate')} className="form-control form-control-sm" placeholder='Enter Print Rate' value={watch('ex_print_rate') > 0 ? watch('ex_print_rate') : ''} type="number" />
                                        </div>
                                        <div className="col-lg-2 col-sm-2">
                                            <label className="form-label">Total Print Amount</label>
                                            <input readOnly className="form-control-plaintext" type="number" value={watch('ex_total_print_rate')} />
                                        </div>

                                    </div>
                                </div>
                            )}

                            <div className="row mb-3">

                                <div className="col-lg-3">
                                    <label className="form-label" htmlFor="jdate">Journey Date</label>
                                    <input
                                        {...register('jdate')}
                                        className="form-control form-control-sm"
                                        type="date"
                                        id="jdate"
                                        placeholder="Enter J.date"
                                        defaultValue={currentDate}
                                        min={currentDate}
                                    />
                                </div>

                                <div className="col-lg-3">
                                    <label className="form-label">Departure Time</label>
                                    <input
                                        {...register('dep_time', { required: true })}
                                        className="form-control form-control-sm"
                                        type="time"
                                    />
                                    {errors.dep_time?.type === "required" && (
                                        <span id="show_mobile_err" className="error">This field is required.</span>
                                    )}
                                </div>


                                <div className="col-lg-3">
                                    <label className="form-label">Reporting Date</label>
                                    <input {...register('rep_date', {

                                    })} className="form-control form-control-sm" type="date" />

                                </div>
                                <div className="col-lg-3">
                                    <label className="form-label">Reporting Time</label>
                                    <input {...register('rep_time')} className="form-control form-control-sm" type="time" />

                                </div>
                            </div>

                            <div className="row mb-3">
                                <div className="col-lg-3">
                                    <label className="form-label">Bus Name</label>
                                    <input {...register('bus_name')} placeholder='Enter Bus name' className="form-control form-control-sm" type="text" />

                                </div>
                                <div className="col-lg-3">
                                    <label className="form-label">Bus No.</label>
                                    <input {...register('bus_no', {
                                        required: true,
                                    })} placeholder='Enter Bus no' className="form-control form-control-sm" type="text" />
                                    {errors.bus_no?.type === "required" && <span id="show_mobile_err" className="error">This field is required.</span>}

                                </div>
                                <div className="col-lg-3">
                                    <label className="form-label">Driver No.</label>
                                    <input {...register('driver_no', {
                                        required: true,
                                    })} minLength={10} maxLength={10} placeholder='Enter driver no' className="form-control form-control-sm" type="text" />
                                    {errors.driver_no?.type === "required" && <span id="show_mobile_err" className="error">This field is required.</span>}

                                </div>


                                <div className="col-lg-3">
                                    <label className="form-label">Boarding Point</label>
                                    <input {...register('boarding', {
                                        required: true
                                    })} placeholder='Enter Boarding' className="form-control form-control-sm" type="text" />
                                    {errors.boarding?.type === "required" && <span id="show_mobile_err" className="error">This field is required.</span>}

                                </div>
                            </div>
                            <div className="row mb-3">


                                <div className="col-md-12">
                                    <h6>Payment Detail:</h6>
                                </div>
                                <hr />
                            </div>
                            <div className="row mb-3">

                                <div className="col-lg-2">
                                    <label className="form-label">Actual Total</label>
                                    <input readOnly className="form-control-plaintext" type="number" {...register('final_total_amount')} />
                                    <input type="hidden" {...register('ticket_actual_total')} />
                                </div>
                                <div className="col-lg-2">
                                    <label className="form-label">Total Print Amount</label>
                                    <input readOnly className="form-control-plaintext" placeholder='Total amount' type="number" {...register('print_final_total_amount')} />
                                </div>
                                <div className="col-lg-2">
                                    <label className="form-label">Print Paid Amount</label>
                                    <input {...register('print_paid_amount')} className="form-control form-control-sm" type="number" />
                                </div>
                                <div className="col-lg-2">
                                    <label className="form-label">Print Balance Amount</label>
                                    <input readOnly className="form-control-plaintext" type="number" {...register('print_remaining_amount')} />
                                </div>
                            </div>





                            <div className="row mb-3">
                                <div className="col-lg-6">
                                    <label className="form-label" htmlFor="remark">Remark</label>
                                    <textarea {...register('remarks')} className="form-control form-control-sm" id="remark" placeholder="Enter Remark"></textarea>

                                </div>
                                <div className="col-lg-6">
                                    <label className="form-label" htmlFor="remark">Is Duplicate?</label><br />
                                    <input  {...register('is_duplicate')} type="checkbox" id="is_duplicate" value="1" />
                                </div>
                            </div>

                            <div className="row">
                                <div className="text-center">
                                    <input className="btn btn-success btn-sm" type="submit" id="save_ticket" name="save_form" />
                                </div>
                            </div>
                        </form>
                    </Card.Body>

                </Card >

            </div >
            <Footer />

        </>

    )
}

export default TicketBook







