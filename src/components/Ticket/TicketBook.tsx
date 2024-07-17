


"use client";
import React, { useState, ChangeEvent, useEffect } from 'react'
import axios from 'axios';
import Card from 'react-bootstrap/Card';
import { useForm, SubmitHandler } from 'react-hook-form';
import CityList from '@/app/Api/CityList';
import StateList from '@/app/Api/StateList';
import ticketNo from '@/app/Api/ticketNo';

import { useRouter } from 'next/navigation';
import { log } from 'console';
import UserProfile from '@/app/Api/UserProfile';



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
    print_remaining_amount: number; remarks: string; user_id: any; received: 'Get'

};


enum BUSDATA {
    Ac = "AC",
    NonAC = "Non-AC"

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




    //     const [userData, setUserData] = useState<any[]>([]);

    //     const [error, setError] = useState<string | null>(null);

    //     const fetchUserData = async (userId: string) => {
    //       try {
    //         const data = await UserProfile.getUserData(userId);
    //         setUserData(data); // Assuming data is an array of user objects


    // console.log("user_id", data);

    //       } catch (error) {
    //         setError('Error fetching user data. Please try again.');
    //         console.error('Error in fetchUserData:', error);
    //       }
    //     };

    //     // Example usage: Fetch user data on component mount
    //     useEffect(() => {
    //       const userId = '14'; // Replace with actual user ID
    //       fetchUserData(userId);
    //     }, []);








    const storedData = localStorage.getItem('userData');







    const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm<FormData>({
        defaultValues: {

            from_state: '', travel_from: '', to_state: '', travel_to: '', is_duplicate: false,
            mobile_no: '', name: '', cmp_name: '', cmp_mobile: '', is_extra: false,
            booking_type: 'seater', slr: 0, slr_rate: 0, slr_total_amount: 0, slr_print_rate: 0,
            slr_total_print_rate: 0, st: 0, st_rate: 0, st_total_amount: 0, st_print_rate: 0,
            st_total_print_rate: 0, ex: 0, ex_rate: 0, ex_total_amount: 0, ex_print_rate: 0,
            ex_total_print_rate: 0, sI_no: '', st_no: '', rep_time: '', dep_time: '',
            print_remaining_amount: 0, bus_no: '', boarding: '', payment_method: '', final_total_amount: 0,
            ticket_actual_total: 0, paid_amount: 0, remaining_amount: 0, bus_name: '', print_final_total_amount: 0,
            print_paid_amount: 0, remarks: '', ticket_no: '', received: 'Get', user_id: storedData

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
                fetchCities(stateId, true); // Fetch cities for "From" state
            }
        } else {
            setSelectedToStateId(stateId);
            if (stateId) {
                fetchCities(stateId, false); // Fetch cities for "To" state
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

    //-----------------------------------------------------------------------------------------------------------------------------------

    const [ticket_no, setTktNo] = useState();

    useEffect(() => {
        ticketNo.getTicketNo()
            .then((res) => {
                console.log('ticketNo.getTicketNo', res);
                setTktNo(res.data);
                setValue('ticket_no', res.data);  // Set the value in the form
            })
            .catch((e) => {
                console.log('Err', e);
            });
    }, [setValue]);
    const router = useRouter();

    //--------------------------------------------------------------------------------------------------------------------------------



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

        // Submit the form
        const ticketDataResponse = await submitFormData(formData);
        if (!ticketDataResponse.ok) {
            throw new Error('Failed to create ticket data');
        }

        const ticketData = await ticketDataResponse.json();
        console.log('Created ticket data:', ticketData);
    };



    async function addNewCity(stateId: string, cityName: string) {
        const requestBody = { city_name: cityName, state_id: stateId };
        const response = await fetch('http://localhost:3000/ticket/add_new_city_from_state', {
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

    async function submitFormData(formData: FormData) {


        const response = await fetch('http://localhost:3000/ticket/create_ticket_data', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
            
        });
        router.push('/ticket_list');

        return response;
    }





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


    // ------------------------------radio button selection------------------------------------------------------------------
    const [selectedOption, setSelectedOption] = useState<string | null>('option1');
    const handleOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedOption(event.target.value);




    };






    //--------------------------------------------------------------------------------------------------------------------------
    return (
        <>

            <div className='container-fluid' >
                <br />

                <Card>


                    <Card.Header><h3>Ticket booking</h3></Card.Header>

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
                                    <label className="form-label" htmlFor="from">From</label>
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
                                    <label className="form-label" htmlFor="to">To</label>
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

                                <div className="col-lg-3">
                                    <label className="form-label" htmlFor="bdate">Booking date</label>
                                    <input  {...register('bdate')} className="form-control form-control-sm" type="date" id="bdate" placeholder="Enter Booking date" defaultValue={currentDate}                 min={currentDate} />
                                </div>

                                <div className="col-lg-3">
                                    <label className="form-label" htmlFor="jdate">Journey date</label>
                                    <input  {...register('jdate')} className="form-control form-control-sm" type="date" id="jdate" placeholder="Enter J.date" defaultValue={currentDate}  min={currentDate} />

                                </div>

                            </div>
                            {/* Third-Row */}
                            {/* <div className="row mb-3">
                                <div className="col-lg-6">
                                    <label className="form-label" htmlFor="bdate">Booking date</label>
                                    <input  {...register('bdate')} className="form-control form-control-sm" type="date" id="bdate" placeholder="Enter Booking date" defaultValue={currentDate} />
                                </div>

                                <div className="col-lg-6">
                                    <label className="form-label" htmlFor="jdate">Journey date</label>
                                    <input  {...register('jdate')} className="form-control form-control-sm" type="date" id="jdate" placeholder="Enter J.date" defaultValue={currentDate} />
                                </div>
                            </div> */}
                            {/* Fourth-Row */}
                            <div className="row mb-3">
                                <div className="col-lg-6">
                                    <label className="form-label" htmlFor="name">Passenger Name</label>
                                    <input {...register('name')} className="form-control form-control-sm" type="text" id="name" placeholder="Enter Name" />
                                </div>

                                <div className="col-lg-6">
                                    <label className="form-label" htmlFor="mobile_no">Passenger Mobile No</label>
                                    <input type="text"
                                        {...register("mobile_no", {
                                            required: true,
                                            minLength: 10,
                                            pattern: /^[0-9]+$/

                                        })}
                                        className="form-control form-control-sm" value={phoneNumber}
                                        onChange={handlePhoneChange} id="mobile_no" placeholder="Enter Mobile No" />
                                    {errors.mobile_no?.type === "required" && <span id="show_mobile_err" className="error">Enter 10 Digits Mobile Number.</span>}
                                    {errors?.mobile_no?.type === "minLength" && <span id="show_mobile_err" className="error">Enter 10 Digits Mobile Number.</span>}


                                </div>
                            </div>
                            {/* Fifth-Row */}
                            <div className="row mb-3">
                                <div className="col-lg-6">
                                    <label className="form-label" htmlFor="name">Company Name</label>
                                    <input {...register('cmp_name')} className="form-control form-control-sm" type="text" id="cmp_name" placeholder="Enter Company Name" />
                                </div>

                                <div className="col-lg-6">
                                    <label className="form-label" style={{ appearance: "textfield" }} htmlFor="mobile">Company Mobile No</label>
                                    <input type="number"
                                        {...register("cmp_mobile", {
                                            required: true,
                                            minLength: 10,


                                        })} value={cmpNumber}
                                        onChange={handleCmpPhoneChange} className="form-control form-control-sm" name="cmp_mobile" id="cmp_mobile" placeholder="Enter Company Mobile No" />
                                    {errors.cmp_mobile?.type === "required" && <span id="show_mobile_err" className="error">Enter 10 Digits Mobile Number.</span>}
                                    {errors?.cmp_mobile?.type === "minLength" && <span id="show_mobile_err" className="error">Enter 10 Digits Mobile Number.</span>}

                                </div>
                            </div>
                            {/* Select-seat */}

                            <div className="row mb-3">
                                <div className="col-lg-6 col-sm-6">
                                    <label className="form-label">Booking Type</label><br />
                                    <input type="radio" {...register('booking_type')} value="seater" /> Seater
                                    <input type="radio" {...register('booking_type')} value="sleeper" /> Sleeper
                                    <input type="radio" {...register('booking_type')} value="both" /> Both
                                </div>
                                <div className="col-lg-6 col-sm-6">
                                    <label className="form-label">Is Extra?</label><br />
                                    <input type="checkbox" {...register('is_extra')} /> Yes
                                </div>
                            </div>

                            {bookingType !== 'seater' && (
                                <div id="sleeper_show">
                                    <div className="row mb-3">
                                        <div className="col-lg-2 col-sm-2">
                                            <label className="form-label">No Of Sleeper</label>
                                            <input {...register('slr')} className="form-control form-control-sm" value={watch('slr') > 0 ? watch('slr') : ''} type="number"  placeholder='Enter slr'/>
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
                                            <input {...register('sI_no')} className="form-control form-control-sm" type="text" placeholder='Enter Sl No'/>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {bookingType !== 'sleeper' && (
                                <div id="seater_show">
                                    <div className="row mb-3">
                                        <div className="col-lg-2 col-sm-2">
                                            <label className="form-label">No Of Seater</label>
                                            <input {...register('st')} className="form-control form-control-sm" value={watch('st') > 0 ? watch('st') : ''} type="number" placeholder='Enter st'/>
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
                                            <input readOnly className="form-control-plaintext"  type="number" value={watch('st_total_print_rate')} />
                                        </div>
                                        <div className="col-lg-2 col-sm-2">
                                            <label className="form-label">St No.</label>
                                            <input {...register('st_no')} className="form-control form-control-sm"  placeholder='Enter St No.' type="text" />
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
                                <div className="col-lg-6">
                                    <label className="form-label">Reporting Time</label>
                                    <input {...register('rep_time')} className="form-control form-control-sm" type="time" />
                                </div>
                                <div className="col-lg-6">
                                    <label className="form-label">Departure Time</label>
                                    <input {...register('dep_time')} className="form-control form-control-sm" type="time" required />
                                </div>
                            </div>

                            <div className="row mb-3">
                                <div className="col-lg-6">
                                    <label className="form-label">Bus Name</label>
                                    <input {...register('bus_name')} placeholder='Enter Bus name' className="form-control form-control-sm" type="text" required />
                                </div>
                                <div className="col-lg-6">
                                    <label className="form-label">Bus No.</label>
                                    <input {...register('bus_no')} placeholder='Enter Bus no' className="form-control form-control-sm" type="text" />
                                </div>
                            </div>

                            <div className="row mb-3">
                                <div className="col-lg-6">
                                    <label className="form-label">Boarding</label>
                                    <input {...register('boarding')} placeholder='Enter Boarding' className="form-control form-control-sm" type="text" required />
                                </div>
                            </div>

                            <div className="row mb-3">
                                <div className="col-lg-3">
                                    <label className="form-label">Payment Method</label>
                                    <select {...register('payment_method')} className="form-control">
                                        <option value="">--Select-</option>
                                        <option value="cash">Cash</option>
                                        <option value="transfer">Transfer</option>
                                        <option value="pending">Pending</option>
                                        <option value="gpay">G-pay</option>
                                        <option value="phonepay">PhonePay</option>
                                        <option value="paytm">Paytm</option>
                                        <option value="credit">Credit</option>
                                    </select>
                                </div>
                                <div className="col-lg-3">
                                    <label className="form-label">Actual Total</label>
                                    <input readOnly className="form-control-plaintext" type="number" {...register('final_total_amount')} />
                                    <input type="hidden" {...register('ticket_actual_total')} />
                                </div>
                                <div className="col-lg-3">
                                    <label className="form-label">Total Print Amount</label>
                                    <input readOnly className="form-control-plaintext" placeholder='Total amount' type="number" {...register('print_final_total_amount')} />
                                </div>
                            </div>

                            <div className="row mb-3">
                                <div className="col-lg-3">
                                    <label className="form-label">Actual Paid Amount</label>
                                    <input {...register('paid_amount')} className="form-control form-control-sm" type="number" />
                                </div>
                                <div className="col-lg-3">
                                    <label className="form-label">Actual Balance Amount</label>
                                    <input readOnly className="form-control-plaintext" type="number" {...register('remaining_amount')} />
                                </div>
                                <div className="col-lg-3">
                                    <label className="form-label">Print Paid Amount</label>
                                    <input {...register('print_paid_amount')} className="form-control form-control-sm" type="number" />
                                </div>
                                <div className="col-lg-3">
                                    <label className="form-label">Print Balance Amount</label>
                                    <input readOnly className="form-control-plaintext" type="number" {...register('print_remaining_amount')} />
                                </div>
                            </div>



                            {/* <----------> */}
                            <div className="row mb-3">
                                <div className="col-lg-6">
                                    <label className="form-label" htmlFor="remark">Remark</label>
                                    <textarea {...register('remarks')} className="form-control form-control-sm" id="remark" placeholder="Enter Remark"></textarea>

                                </div>
                                <div className="col-lg-6">
                                    <label className="form-label" htmlFor="remark">Is Duplicate?</label><br />
                                    <input  {...register('is_duplicate')} type="checkbox" id="is_duplicate" value="yes" />
                                </div>
                            </div>

                            {/* <----------> */}
                            <div className="row">
                                <div className="text-center">
                                    <input className="btn btn-primary" type="submit" id="save_ticket" name="save_form" />
                                </div>
                            </div>
                        </form>
                    </Card.Body>

                </Card >

            </div >
        </>
    )
}

export default TicketBook







