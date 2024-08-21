


"use client";
import React, { useState, ChangeEvent, useEffect } from 'react'
import axios from 'axios';
import Card from 'react-bootstrap/Card';
import { useForm, SubmitHandler } from 'react-hook-form';
import CityList from '@/app/Api/CityList';
import StateList from '@/app/Api/StateList';
import ticketNo from '@/app/Api/ticketNo';

import { useRouter } from 'next/navigation';

import EditTicketData from '@/app/Api/EditTicketData';
import handleUpdatePrint from '@/app/ticket_list/Ticket_data/EditPrint';
import Link from 'next/link';



type FormData = {
  ticket_id: string,
  from_state: string,
  travel_from: string,
  to_state: string,
  travel_to: string,
  bus_type: string,
  tkt_no: string,
  bdate: string;
  jdate: string;
  mobile_no: string;
  name: string;
  cmp_name: string;
  cmp_mobile: string;
  booking_type: 'seater' | 'sleeper' | 'both';
  is_duplicate: boolean;
  is_extra: boolean;
  slr: number;
  slr_rate: number;
  slr_total_amount: number;
  slr_print_rate: number;
  slr_total_print_rate: number;
  st: number;
  whatsapp_no: any;
  st_rate: number;
  st_total_amount: number;
  st_print_rate: number;
  st_total_print_rate: number;
  ex: number; ex_rate: number;
  ex_total_amount: number;
  ex_print_rate: number;
  st_no: string;
  sI_no: string;
  ex_total_print_rate: number;
  rep_time: string;
  dep_time: string;
  bus_name: string;
  bus_no: string;
  boarding: string;
  payment_method: string;
  final_total_amount: number;
  ticket_actual_total: number;
  print_final_total_amount: number;
  paid_amount: number;
  remaining_amount: number;
  print_paid_amount: number;
  print_remaining_amount: number;
  remarks: string;
  user_id: any;
  received: 'Get'
  from_state_name: string;
  to_state_name: string;
  from_city_name: string;
  to_city_name: string;
  ticket_no: string
  passengers_proof_type: string;
  passengers_proof_details: string;
  transection_id: String;


};



interface City {
  name: string;
  id: number;
  city_name: string;
  state_id: string;
}

interface State {
  id: number;
  name: string;
}
function EditForm() {

  //------------------------------------api validation for get data------------------------  //
  useEffect(() => {
    fetchStates(true);
    fetchStates(false);
    const handleURLChange = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const ticketToken = urlParams.get("token");
      if (ticketToken) {
        getTicketDetail(ticketToken);
      } else {
        setTicketData(null);
      }
    };

    window.addEventListener('popstate', handleURLChange);
    handleURLChange();

    return () => {
      window.removeEventListener('popstate', handleURLChange);
    };
  }, []);

  const [ticketData, setTicketData] = useState<any>("");
  const [error, setError] = useState<string>('');


  const getTicketDetail = async (ticketToken: string) => {
    try {
      const getTDetail = await EditTicketData.getEditTicktetData(ticketToken);
      const { from_state, travel_from, to_state, travel_to } = getTDetail.data[0];
      setSelectedFromStateId(from_state);
      setSelectedToStateId(to_state);
      fetchCities(from_state, true);
      fetchCities(to_state, false);
      setTicketData(getTDetail.data[0]);
      setError('');
      console.log("KKKKKKK", getTDetail);


    } catch (error) {
      setError('Error fetching ticket data. Please try again later.');
      console.error('Error fetching ticket data:', error);
    }
  };

  // const handleFieldChange = (fieldName: string, value: string) => {
  //   // Update ticketData state with the new value for the specified field
  //   const updatedTicketData = { ...ticketData, [fieldName]: value };
  //   setTicketData(updatedTicketData);

  //   // If the field being updated is related to the state, fetch cities accordingly
  //   if (fieldName === 'from_state') {
  //     setSelectedFromStateId(value);
  //     fetchCities(value, true);
  //   } else if (fieldName === 'to_state') {
  //     setSelectedToStateId(value);
  //     fetchCities(value, true);
  //   }
  // };
  const handleFieldChange = (fieldName: string, value: string) => {
    // Update ticketData state with the new value for the specified field
    const updatedTicketData = { ...ticketData, [fieldName]: value };

    if (fieldName === 'is_extra' && value === '0') {
      updatedTicketData.ex = '';
      updatedTicketData.ex_rate = '';
      updatedTicketData.ex_total_amount = '';
      updatedTicketData.ex_print_rate = '';
      updatedTicketData.ex_total_print_rate = '';
    }

    if (fieldName === 'booking_type') {
      if (value === 'seater') {
        // If seater is selected, reset sleeper and both related fields
        updatedTicketData['slr'] = '';
        updatedTicketData['slr_rate'] = '';
        updatedTicketData['slr_print_rate'] = '';
      } else if (value === 'sleeper') {
        // If sleeper is selected, reset seater and both related fields
        updatedTicketData['st'] = '';
        updatedTicketData['st_rate'] = '';
        updatedTicketData['st_print_rate'] = '';
      } else if (value === 'both') {
        // If both is selected, reset both seater and sleeper related fields
        updatedTicketData['slr'] = '';
        updatedTicketData['slr_rate'] = '';
        updatedTicketData['slr_print_rate'] = '';
        updatedTicketData['st'] = '';
        updatedTicketData['st_rate'] = '';
        updatedTicketData['st_print_rate'] = '';
      }
    }

    // Calculate amounts
    const slr = updatedTicketData['slr'] || 0;
    const slr_rate = updatedTicketData['slr_rate'] || 0;
    const slr_print_rate = updatedTicketData['slr_print_rate'] || 0;
    const st = updatedTicketData['st'] || 0;
    const st_rate = updatedTicketData['st_rate'] || 0;
    const st_print_rate = updatedTicketData['st_print_rate'] || 0;
    const ex = updatedTicketData['ex'] || 0;
    const ex_rate = updatedTicketData['ex_rate'] || 0;
    const ex_print_rate = updatedTicketData['ex_print_rate'] || 0;

    const slr_total_amount = slr * slr_rate;
    const slr_total_print_rate = slr * slr_print_rate;
    const st_total_amount = st * st_rate;
    const st_total_print_rate = st * st_print_rate;
    const ex_total_amount = ex * ex_rate;
    const ex_total_print_rate = ex * ex_print_rate;

    const total = slr_total_amount + st_total_amount + ex_total_amount;
    const print_final_total_amount = slr_total_print_rate + st_total_print_rate + ex_total_print_rate;
    const paid_amount = updatedTicketData['paid_amount'] || 0;
    const print_paid_amount = updatedTicketData['print_paid_amount'] || 0;
    const remaining_amount = total - paid_amount;
    const print_remaining_amount =
      print_final_total_amount - print_paid_amount;

    // Update ticketData state with calculated values
    updatedTicketData['slr_total_amount'] = slr_total_amount;
    updatedTicketData['slr_total_print_rate'] = slr_total_print_rate;
    updatedTicketData['st_toal_amount'] = st_total_amount;
    updatedTicketData['st_total_print_rate'] = st_total_print_rate;
    updatedTicketData['ex_total_amount'] = ex_total_amount;
    updatedTicketData['ex_total_print_rate'] = ex_total_print_rate;
    updatedTicketData['final_total_amount'] = total;
    updatedTicketData['print_final_total_amount'] = print_final_total_amount;
    updatedTicketData['remaining_amount'] = remaining_amount;
    updatedTicketData['print_remaining_amount'] = print_remaining_amount;

    setTicketData(updatedTicketData);
  };

  const storedData = localStorage.getItem('userData');


  // console.log("aaaa",ticketData.from_state);
  // console.log("sssss",ticketData.from_state);
  const { register, handleSubmit, formState: { errors }, watch, setValue, reset } = useForm<FormData>({
    defaultValues: {
      ticket_id: ticketData.id || '',
      from_state: '',
      travel_from: '',
      to_state: '',
      travel_to: '',
      is_duplicate: ticketData.is_duplicate,
      mobile_no: '',
      name: '',
      cmp_name: '',
      cmp_mobile: '',
      is_extra: ticketData.is_extra || '',
      slr: 0,
      slr_rate: 0,
      slr_total_amount: 0,
      slr_print_rate: 0,
      slr_total_print_rate: 0,
      st: 0,
      st_rate: 0,
      st_total_amount: 0,
      st_print_rate: 0,
      st_total_print_rate: 0,
      ex: 0, ex_rate: 0,
      ex_total_amount: 0,
      ex_print_rate: 0,
      ex_total_print_rate: 0,
      sI_no: '',
      st_no: '',
      rep_time: '',
      dep_time: '',
      print_remaining_amount: 0,
      bus_no: '',
      boarding: '',
      payment_method: '',
      final_total_amount: 0,
      ticket_actual_total: 0,
      paid_amount: 0,
      remaining_amount: 0,
      bus_name: '',
      print_final_total_amount: 0,
      print_paid_amount: 0,
      remarks: '',
      ticket_no: '',
      received: 'Get',
      user_id: storedData,
      transection_id: '',



    },
  });
  setValue("ticket_id", ticketData.id)
  setValue("from_state", ticketData.from_state)
  setValue("travel_from", ticketData.travel_from)
  setValue("to_state", ticketData.to_state)
  setValue("travel_to", ticketData.travel_to)
  setValue("bus_type", ticketData.bus_type)
  setValue("ticket_no", ticketData.tkt_no)
  setValue("bdate", ticketData.bdate)
  setValue("jdate", ticketData.jdate)
  setValue("name", ticketData.name)
  setValue("mobile_no", ticketData.mobile)
  setValue("cmp_mobile", ticketData.cmp_mobile)
  setValue("cmp_name", ticketData.cmp_name)
  setValue("is_duplicate", ticketData.is_duplicate)
  setValue("is_extra", ticketData.is_extra)
  setValue("slr", ticketData.slr)
  setValue("slr_rate", ticketData.slr_rate)
  setValue("slr_total_amount", ticketData.slr_total_amount)
  setValue("slr_print_rate", ticketData.slr_print_rate)
  setValue("slr_total_print_rate", ticketData.slr_total_print_rate)
  setValue("st", ticketData.st)
  setValue("st_rate", ticketData.st_rate)
  setValue("st_total_amount", ticketData.st_toal_amount)
  setValue("st_print_rate", ticketData.st_print_rate)
  setValue("st_total_print_rate", ticketData.st_total_print_rate)
  setValue("ex", ticketData.ex)
  setValue("ex_rate", ticketData.ex_rate)
  setValue("ex_total_amount", ticketData.ex_total_amount)
  setValue("ex_print_rate", ticketData.ex_print_rate)
  setValue("st_no", ticketData.st_no)
  setValue("sI_no", ticketData.sI_no)
  setValue("ex_total_print_rate", ticketData.ex_total_print_rate)
  setValue("rep_time", ticketData.rep_time)
  setValue("dep_time", ticketData.dep_time)
  setValue("bus_name", ticketData.bus_name)
  setValue("bus_no", ticketData.bus_no)
  setValue("boarding", ticketData.boarding)
  // setValue("payment_method", ticketData.payment_method)
  setValue("final_total_amount", ticketData.final_total_amount)
  setValue("ticket_actual_total", ticketData.final_total_amount)
  setValue("print_final_total_amount", ticketData.print_final_total_amount)
  setValue("paid_amount", ticketData.paid_amount)
  setValue("remaining_amount", ticketData.remaining_amount)
  setValue("print_paid_amount", ticketData.print_paid_amount)
  setValue("print_remaining_amount", ticketData.print_remaining_amount)
  setValue("remarks", ticketData.remarks)

  const paymentMethod = watch('payment_method');


  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');


  useEffect(() => {
    if (ticketData) {
      setSelectedPaymentMethod(ticketData.payment_method);
      setValue('payment_method', ticketData.payment_method);
      setValue('transection_id', ticketData.transection_id || '');
    }
  }, [ticketData, setValue]);








  const currentDate = new Date().toISOString().split('T')[0]; // Get current date in YYYY-MM-DD format

  //------------------------------------------calculation data----------------------------------------------------

  const bookingType = watch('booking_type');



  //----------------------------------------Api validation---------------------------------------------------------------------
  const [selectedFromStateId, setSelectedFromStateId] = useState<string>('');
  const [selectedToStateId, setSelectedToStateId] = useState<string>('');
  const [fromStates, setFromStates] = useState<State[]>([]);
  const [fromCities, setFromCities] = useState<City[]>([]);
  const [toStates, setToStates] = useState<State[]>([]);
  const [toCities, setToCities] = useState<City[]>([]);

  const fetchStates = async (isFrom: boolean) => {
    try {
      StateList.getAllStateListApi().then((res: any) => {
        if (isFrom) {
          setFromStates(res.data);
        } else {
          setToStates(res.data);
        }
      }).catch((e: any) => {
        console.log('Error fetching states:', e);
      });
    } catch (error) {
      console.error('Error fetching states:', error);
    }
  };

  const fetchCities = async (stateId: string, isFrom: boolean) => {
    try {
      CityList.getStateCityList(stateId).then((res: any) => {
        if (isFrom) {
          setFromCities(res.data);
        } else {
          setToCities(res.data);
        }
      }).catch((e: any) => {
        console.log('Error fetching cities:', e);
      });
    } catch (error) {
      console.error('Error fetching cities:', error);
    }
  };

  const handleStateChange = (event: React.ChangeEvent<HTMLSelectElement>, isFrom: boolean) => {
    const stateId = event.target.value;
    if (isFrom) {
      setSelectedFromStateId(stateId);
      fetchCities(stateId, true);
    } else {
      setSelectedToStateId(stateId);
      fetchCities(stateId, false);
    }
  };


  const [showCustomCityInput, setShowCustomCityInput] = useState(false);
  const [customCity, setCustomCity] = useState('');
  const [showCustomToCityInput, setShowCustomToCityInput] = useState(false);
  const [customToCity, setCustomToCity] = useState('');

  const handleCustomToCityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCustomToCity(event.target.value);
  };

  const handleCustomCityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCustomCity(event.target.value);
  };

  const router = useRouter();


  const onSubmit: SubmitHandler<FormData> = async (formData: any) => {
    try {
      // Initialize state and city names
      let fromStateName = '';
      let toStateName = '';
      let fromCityName = '';
      let toCityName = '';

      // Initialize tkt_no variable
      const tkt_no = formData.ticket_no;

      // Convert state.id to a string
      const selectedFromStateIdStr = String(selectedFromStateId);
      const selectedToStateIdStr = String(selectedToStateId);

      // Fetch state names directly from the `fromStates` and `toStates` arrays
      const fromState = fromStates.find(state => String(state.id) === selectedFromStateIdStr);
      const toState = toStates.find(state => String(state.id) === selectedToStateIdStr);

      if (fromState) {
        fromStateName = fromState.name;
      }
      if (toState) {
        toStateName = toState.name;
      }

      // Fetch city names directly from the `fromCities` and `toCities` arrays
      const fromCity = fromCities.find(city => String(city.id) === formData.travel_from);
      const toCity = toCities.find(city => String(city.id) === formData.travel_to);

      if (fromCity) {
        fromCityName = fromCity.city_name;
      }
      if (toCity) {
        toCityName = toCity.city_name;
      }

      // Custom city handling if applicable
      if (showCustomCityInput && customCity) {
        const response = await axios.post('http://localhost:3000/ticket/add_new_city_from_state', {
          city_name: customCity,
          state_id: selectedFromStateIdStr,
        });
        formData.travel_from = response.data.city_id; // Assuming API returns city_id
        fromCityName = customCity;
      }

      if (showCustomToCityInput && customToCity) {
        const response = await axios.post('http://localhost:3000/ticket/add_new_city_from_state', {
          city_name: customToCity,
          state_id: selectedToStateIdStr,
        });
        formData.travel_to = response.data.city_id; // Assuming API returns city_id
        toCityName = customToCity;
      }

      // Populate formData with state and city names
      formData.from_state = selectedFromStateIdStr;
      formData.to_state = selectedToStateIdStr;
      formData.from_state_name = fromStateName;
      formData.to_state_name = toStateName;
      formData.from_city_name = fromCityName;
      formData.to_city_name = toCityName;

      // Set tkt_no in formData (if needed to include it)
      formData.tkt_no = tkt_no;

      // Submit the final form data
      const response = await axios.post('http://192.168.0.100:3001/ticket/update_ticket_detail_data', formData);
      console.log('Form submitted successfully:', response.data);
      handleUpdatePrint(formData);
      router.push('/ticket_list');
    } catch (error) {
      console.error('Error submitting form:', error);
      // Handle errors
    }
  };





  const handleShowCustomCityInput = () => {
    setShowCustomCityInput(true);
  };

  const handleShowCustomToCityInput = () => {
    setShowCustomToCityInput(true);
  };


  // const onSubmit: SubmitHandler<FormData> = async (formData: any) => {
  //   console.log(formData);

  //   try {
  //     // Make a POST request to the API endpoint with the ticket ID in the URL
  //     const response = await axios.post(`http://localhost:3000/ticket/update_ticket_detail_data`, formData);
  //     console.log('Form submitted successfully:', response.data);
  //     router.push('/ticket_list');
  //   } catch (error) {
  //     console.error('Error submitting form:', error);
  //     // Handle errors
  //   }
  // };

  // const onSubmit: SubmitHandler<FormData> = (data) => {
  //     console.log(data)
  // }



  //----------------------------------------------phonevalidation----------------------------------------------------------------------------------------------------------


  const handlePhoneChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.replace(/\D/g, '').slice(0, 10); // Only allow digits and limit to 10 characters

    setTicketData({ ...ticketData, mobile: value });


  };

  const handleCmpPhoneChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.replace(/\D/g, '').slice(0, 10); // Only allow digits and limit to 10 characters

    setTicketData({ ...ticketData, cmp_mobile: value });
  };


  const handleWMobileNoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^\d]/g, '').slice(0, 10);
    setTicketData({ ...ticketData, whatsapp_no: value });

  };


  const [selectedOption, setSelectedOption] = useState<string | null>();
  const handleOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedOption(event.target.value)
  };



  const aadhaarPattern = /^\d{12}$/;
  const panPattern = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
  const gstPattern = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[0-9]{1}[A-Z]{1}[0-9A-Z]{1}$/;

  //--------------------------------------------------------------------------------------------------------------------------------
  return (
    <>

      <div className='container-fluid' >
        <br />

        <Card>


          <Card.Header><div  style={{ display: "flex", justifyContent: "space-between" }}>
            <h4>Update Booking Detail</h4>
            <div>
             

              <Link href="/ticket_list" className="btn btn-sm btn-success" style={{ float: "right", marginRight: "8px" }}>Back</Link>

            </div>
          </div>
          </Card.Header>
          {error && <p>{error}</p>}
          {ticketData && (
            <Card.Body>
              <form onSubmit={handleSubmit(onSubmit)}>
                {/* First-Row */}
                <div className='row mb-3'>
                  <div className="col-lg-3 ">
                    <label className="form-label " htmlFor="from">From State</label>
                    <select
                      id="from_state_select"
                      {...register('from_state')}
                      value={selectedFromStateId}
                      onChange={(e) => handleStateChange(e, true)}
                      className="form-control form-control-sm set_option_clr"
                    >

                      <option value="">Select</option>
                      {/* Populate options for states */}
                      {fromStates.map((state) => (
                        <option key={state.id} value={state.id}>
                          {state.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  < div className="col-lg-3 " >
                    <label className="form-label " htmlFor="from">From</label>
                    <select
                      id="travel_from_select"
                      {...register('travel_from')}
                      value={ticketData?.travel_from || ""}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (ticketData) {
                          if (value === "tkt_from_other") {
                            // Show input field for new city
                            setTicketData({ ...ticketData, travel_from: '' });
                            setShowCustomCityInput(true); // State to toggle input field
                          } else {
                            setTicketData({ ...ticketData, travel_from: value });
                            setShowCustomCityInput(false); // Hide input field if not "Add new City"
                          }
                        }
                      }}
                      className="form-control form-control-sm set_option_clr"
                    >
                      <option value="">Select</option>
                      {/* Populate options for cities */}
                      {fromCities.map((city) => (
                        <option key={city.id} value={city.id}>
                          {city.city_name}
                        </option>
                      ))}
                      <option style={{ background: '#4682B4', color: "#F5FFFA" }} value="tkt_from_other">Add new City</option>
                    </select>

                    {/* Render input field for new city if selected */}
                    {showCustomCityInput && (
                      <input
                        type="text"
                        className="form-control form-control-sm mt-2"
                        placeholder="Enter Custom City"
                        onChange={(e) => setCustomCity(e.target.value)}
                      />
                    )}

                  </div>

                  <div className="col-lg-3">
                    <label className="form-label" htmlFor="to">To State</label>
                    <select
                      id="to_state_select"
                      {...register('to_state')}
                      value={selectedToStateId}
                      onChange={(e) => handleStateChange(e, false)}
                      className="form-control form-control-sm set_option_clr"
                    >
                      <option value="">Select</option>
                      {/* Populate options for states */}
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
                      id="travel_to_select"
                      {...register('travel_to')}
                      value={ticketData?.travel_to || ""}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (ticketData) {
                          if (value === "tkt_to_other") {
                            // Show input field for new city
                            setTicketData({ ...ticketData, travel_to: '' });
                            setShowCustomToCityInput(true); // State to toggle input field
                          } else {
                            setTicketData({ ...ticketData, travel_to: value });
                            setShowCustomToCityInput(false); // Hide input field if not "Add new City"
                          }
                        }
                      }}
                      className="form-control form-control-sm set_option_clr"
                    >
                      <option value="">Select</option>
                      {/* Populate options for cities */}
                      {toCities.map((city) => (
                        <option key={city.id} value={city.id}>
                          {city.city_name}
                        </option>
                      ))}
                      <option style={{ background: '#4682B4', color: "#F5FFFA" }} value="tkt_to_other">Add new City</option>
                    </select>

                    {/* Render input field for new city if selected */}
                    {showCustomToCityInput && (
                      <input
                        type="text"
                        className="form-control form-control-sm mt-2"
                        placeholder="Enter Custom City"
                        onChange={(e) => setCustomToCity(e.target.value)}
                      />
                    )}
                  </div>

                </div>
                {/* Second-Row */}
                <div className="row mb-3">
                  <div className="col-lg-6">
                    <label className="form-label" htmlFor="bus_type">Bus type</label>


                    <select {...register('bus_type')} value={ticketData.bus_type} onChange={(e) => handleFieldChange('bus_type', e.target.value)} className="form-control form-control-sm" id="bus_type">
                      <option value="">--Select--</option>
                      <option value="Ac">AC</option>
                      <option value="Non-Ac">Non-AC</option>
                    </select>

                  </div>
                  <div className="col-lg-3">
                    <label className="form-label" htmlFor="bdate">Booking date</label>
                    <input  {...register('bdate')} value={ticketData.bdate} onChange={(e) => handleFieldChange('bdate', e.target.value)} className="form-control form-control-sm" type="date" id="bdate" placeholder="Enter Booking date" />
                  </div>

                  <div className="col-lg-3">
                    <label className="form-label" htmlFor="jdate">Journey date</label>
                    <input  {...register('jdate')} value={ticketData.jdate} onChange={(e) => handleFieldChange('jdate', e.target.value)} className="form-control form-control-sm" type="date" id="jdate" placeholder="Enter J.date" />
                  </div>

                </div>

                {/* Fourth-Row */}
                <div className="row mb-3">
                  <div className="col-lg-6">
                    <label className="form-label" htmlFor="name">Passenger Name</label>
                    <input {...register('name')} value={ticketData.name} onChange={(e) => handleFieldChange('name', e.target.value)} className="form-control form-control-sm" type="text" id="name" placeholder="Enter Name" />
                  </div>

                  <div className="col-lg-6">
                    <label className="form-label" htmlFor="mobile_no">Passenger mobile_no No</label>
                    <input type="text"
                      {...register("mobile_no", {
                        minLength: 10,
                        pattern: /^[0-9]+$/

                      })}
                      className="form-control form-control-sm" value={ticketData.mobile} maxLength={10}
                      onChange={handlePhoneChange} id="mobile_no" placeholder="Enter mobile_no No" />
                    {errors.mobile_no?.type === "required" && <span id="show_mobile_err" className="error">Enter 10 Digits Mobile Number.</span>}
                    {errors?.mobile_no?.type === "minLength" && <span id="show_mobile_err" className="error">Enter 10 Digits Mobile Number.</span>}


                  </div>
                </div>
                {/* Fifth-Row */}
                <div className="row mb-4">
                  <div className="col-lg-4">
                    <label className="form-label" htmlFor="name">Company Name</label>
                    <input {...register('cmp_name')} value={ticketData.cmp_name} onChange={(e) => handleFieldChange('cmp_name', e.target.value)} className="form-control form-control-sm" type="text" id="cmp_name" placeholder="Enter Company Name" />
                  </div>

                  <div className="col-lg-4">
                    <label className="form-label" style={{ appearance: "textfield" }} htmlFor="mobile">Company Mobile No</label>
                    <input type="text"
                      {...register("cmp_mobile", {
                        minLength: 10,


                      })} value={ticketData.cmp_mobile} maxLength={10}
                      onChange={handleCmpPhoneChange} className="form-control form-control-sm" name="cmp_mobile" id="cmp_mobile" placeholder="Enter Company Mobile No" />
                    {errors.cmp_mobile?.type === "required" && <span id="show_mobile_err" className="error">Enter 10 Digits Mobile Number.</span>}
                    {errors?.cmp_mobile?.type === "minLength" && <span id="show_mobile_err" className="error">Enter 10 Digits Mobile Number.</span>}

                  </div>

                  <div className="col-lg-4">
                    <label className="form-label" style={{ appearance: "textfield" }} htmlFor="mobile">What's-up No</label>
                    <input
                      type="text"
                      {...register("whatsapp_no", {
                        required: true,
                        minLength: 10,
                        maxLength: 10,
                        pattern: /^[0-9]+$/
                      })}
                      value={ticketData.whatsapp_no}
                      onChange={handleWMobileNoChange}
                      className={`form-control form-control-sm ${errors.whatsapp_no ? 'is-invalid' : ''}`}
                      id="whatsapp_no"

                      placeholder="Enter Mobile No"
                    />
                    {errors?.whatsapp_no?.type === "required" && <span className="error">Enter 10 Digits Mobile Number.</span>}
                    {errors?.whatsapp_no?.type === "minLength" && <span className="error">Enter 10 Digits Mobile Number.</span>}
                    {errors?.whatsapp_no?.type === "pattern" && <span className="error">Enter numeric characters only.</span>}

                  </div>
                </div>



                <div className="row mb-3">
                  <div className="col-lg-6">
                    <label className="form-label" htmlFor="passengers_proof_type">Select Sender ID Proof Type</label><br />
                    <input type="radio"
                      {...register('passengers_proof_type')}
                      value="Aadhar_no"
                      checked={ticketData.passengers_proof_type === "Aadhar_no"}
                      onChange={() => {
                        handleFieldChange('passengers_proof_type', "Aadhar_no")

                      }} /> Aadhar


                    <input

                      type="radio"
                      {...register('passengers_proof_type')}
                      value="Pan_no"
                      checked={ticketData.passengers_proof_type === "Pan_no"}
                      onChange={() => {
                        handleFieldChange('passengers_proof_type', "Pan_no")

                      }}


                    /> PAN

                    <input type='radio' {...register('passengers_proof_type')}
                      value="Gst_no"
                      checked={ticketData.passengers_proof_type === "Gst_no"}
                      onChange={() => {
                        handleFieldChange('passengers_proof_type', "Gst_no")

                      }} /> GST
                  </div>


                </div>

                {/* --------------*/}
                <div className="col-lg-6">
                  <label className="form-label" htmlFor="send_mob">Sender Adhar No./PAN No./GST No.</label>
                  <input
                    {...register('passengers_proof_details', {
                      required: ticketData.passengers_proof_type === 'Aadhar_no' ? 'Invalid Aadhaar number format' : ticketData.passengers_proof_type === 'Pan_no' ? 'Invalid PAN number format' : 'Invalid GST number format',
                      pattern: {
                        value: ticketData.passengers_proof_type === 'Aadhar_no' ? aadhaarPattern : ticketData.passengers_proof_type === 'Pan_no' ? panPattern : gstPattern,
                        message: ticketData.passengers_proof_type === 'Aadhar_no' ? 'Invalid Aadhaar number format' : ticketData.passengers_proof_type === 'Pan_no' ? 'Invalid PAN number format' : 'Invalid GST number format',
                      }
                    })}
                    value={ticketData.passengers_proof_details}
                    onChange={(e) => handleFieldChange('passengers_proof_details', e.target.value)}
                    className="form-control form-control-sm"
                    type="text"
                    name="passengers_proof_details"
                    placeholder="Enter Sender ID Proof Detail" />

                  {errors.passengers_proof_details && <span className='error'>{errors.passengers_proof_details.message}</span>}
                </div>



























                {/* Select-seat */}
                <div className="row mb-3">
                  <div className="col-lg-6 col-sm-6">
                    <label className="form-label">Booking Type</label><br />
                    <input
                      type="radio"
                      {...register('booking_type')}
                      value="seater" // Set the value attribute to "seater"
                      checked={ticketData.booking_type === "seater"}
                      onChange={() => {
                        handleFieldChange('booking_type', "seater")
                        setValue("booking_type", "seater");
                      }}
                    /> Seater
                    <input
                      type="radio"
                      {...register('booking_type')}
                      value="sleeper" // Set the value attribute to "sleeper"
                      checked={ticketData.booking_type === "sleeper"}
                      onChange={() => {
                        handleFieldChange('booking_type', "sleeper")
                        setValue("booking_type", "sleeper");
                      }}
                    /> Sleeper
                    <input
                      type="radio"
                      {...register('booking_type')}
                      value="both" // Set the value attribute to "both"
                      checked={ticketData.booking_type === "both"}
                      onChange={() => {
                        handleFieldChange('booking_type', "both")
                        setValue("booking_type", "both");
                      }}
                    /> Both
                  </div>
                  <div className="col-lg-6 col-sm-6">
                    <label className="form-label">Is Extra?</label><br />
                    <input
                      type="checkbox"
                      checked={ticketData.is_extra === "1"} // Check if ticketData.is_extra is "1"
                      onChange={(e) => handleFieldChange('is_extra', e.target.checked ? "1" : "0")} // Handle checkbox change event
                    /> Yes
                    {/* <input type="checkbox" {...register('is_extra')} value={ticketData.is_extra}/> Yes */}
                  </div>
                </div>
                {(ticketData.booking_type === 'sleeper' || ticketData.booking_type === 'both') && (
                  <div id="sleeper_show">
                    <div className="row mb-3">
                      <div className="col-lg-2 col-sm-2">
                        <label className="form-label">No Of Sleeper</label>
                        <input {...register('slr')} className="form-control form-control-sm" onChange={(e) => handleFieldChange('slr', e.target.value)} type="number" />
                      </div>
                      <div className="col-lg-2 col-sm-2">
                        <label className="form-label">Sleeper Rate</label>
                        <input {...register('slr_rate')} className="form-control form-control-sm" onChange={(e) => handleFieldChange('slr_rate', e.target.value)} type="number" />
                      </div>
                      <div className="col-lg-2 col-sm-2">
                        <label className="form-label">Total Amount</label>
                        <input readOnly className="form-control-plaintext" type="number" value={ticketData.slr_total_amount} />
                      </div>
                      <div className="col-lg-2 col-sm-2">
                        <label className="form-label">Print Rate</label>
                        <input {...register('slr_print_rate')} className="form-control form-control-sm" onChange={(e) => handleFieldChange('slr_print_rate', e.target.value)} type="number" />
                      </div>
                      <div className="col-lg-2 col-sm-2">
                        <label className="form-label">Total Print Amount</label>
                        <input readOnly className="form-control-plaintext" type="number" value={ticketData.slr_total_print_rate} />
                      </div>
                      <div className="col-lg-2 col-sm-2">
                        <label className="form-label">SI No</label>
                        <input {...register('sI_no')} value={ticketData.sI_no} onChange={(e) => handleFieldChange('sI_no', e.target.value)} className="form-control form-control-sm" type="text" />
                      </div>
                    </div>
                  </div>
                )}

                {(ticketData.booking_type === 'seater' || ticketData.booking_type === 'both') && (
                  <div id="seater_show">
                    <div className="row mb-3">
                      <div className="col-lg-2 col-sm-2">
                        <label className="form-label">No Of Seater</label>
                        <input {...register('st')} value={ticketData.st} className="form-control form-control-sm" onChange={(e) => handleFieldChange('st', e.target.value)} type="number" />
                      </div>
                      <div className="col-lg-2 col-sm-2">
                        <label className="form-label">Seater Rate</label>
                        <input {...register('st_rate')} value={ticketData.st_rate} className="form-control form-control-sm" onChange={(e) => handleFieldChange('st_rate', e.target.value)} type="number" />
                      </div>
                      <div className="col-lg-2 col-sm-2">
                        <label className="form-label">Total Amount</label>
                        <input readOnly className="form-control-plaintext" type="number" value={ticketData.st_toal_amount} />
                      </div>
                      <div className="col-lg-2 col-sm-2">
                        <label className="form-label">Print Rate</label>
                        <input {...register('st_print_rate')} value={ticketData.st_print_rate} onChange={(e) => handleFieldChange('st_print_rate', e.target.value)} className="form-control form-control-sm" type="number" />
                      </div>
                      <div className="col-lg-2 col-sm-2">
                        <label className="form-label">Total Print Amount</label>
                        <input readOnly className="form-control-plaintext" value={ticketData.st_total_print_rate} type="number" />
                      </div>
                      <div className="col-lg-2 col-sm-2">
                        <label className="form-label">St No.</label>
                        <input {...register('st_no')} value={ticketData.st_no} onChange={(e) => handleFieldChange('st_no', e.target.value)} className="form-control form-control-sm" type="text" />
                      </div>
                    </div>
                  </div>
                )}
                {ticketData.is_extra === "1" && (
                  <div id="show_extra">
                    <div className="row mb-3">
                      <div className="col-lg-2 col-sm-2">
                        <label className="form-label">Extra Qty</label>
                        <input {...register('ex')} className="form-control form-control-sm" value={ticketData.ex} onChange={(e) => handleFieldChange('ex', e.target.value)} type="number" />
                      </div>
                      <div className="col-lg-2 col-sm-2">
                        <label className="form-label">Extra Rate</label>
                        <input {...register('ex_rate')} className="form-control form-control-sm" value={ticketData.ex_rate} onChange={(e) => handleFieldChange('ex_rate', e.target.value)} type="number" />
                      </div>
                      <div className="col-lg-3 col-sm-3">
                        <label className="form-label">Total Amount</label>
                        <input readOnly className="form-control-plaintext" type="number" value={ticketData.ex_total_amount} />
                      </div>
                      <div className="col-lg-2 col-sm-2">
                        <label className="form-label">Print Rate</label>
                        <input {...register('ex_print_rate')} className="form-control form-control-sm" value={ticketData.ex_print_rate} onChange={(e) => handleFieldChange('ex_print_rate', e.target.value)} type="number" />
                      </div>
                      <div className="col-lg-2 col-sm-2">
                        <label className="form-label">Total Print Amount</label>
                        <input readOnly className="form-control-plaintext" type="number" value={ticketData.ex_total_print_rate} />
                      </div>
                    </div>
                  </div>
                )}





                <div className="row mb-3">
                  <div className="col-lg-6">
                    <label className="form-label">Reporting Time</label>
                    <input {...register('rep_time')} value={ticketData.rep_time} onChange={(e) => handleFieldChange('rep_time', e.target.value)} className="form-control form-control-sm" type="time" />
                  </div>
                  <div className="col-lg-6">
                    <label className="form-label">Departure Time</label>
                    <input {...register('dep_time')} value={ticketData.dep_time} onChange={(e) => handleFieldChange('dep_time', e.target.value)} className="form-control form-control-sm" type="time" required />
                  </div>
                </div>

                <div className="row mb-3">
                  <div className="col-lg-6">
                    <label className="form-label">Bus Name</label>
                    <input {...register('bus_name')} value={ticketData.bus_name} onChange={(e) => handleFieldChange('bus_name', e.target.value)} className="form-control form-control-sm" type="text" required />
                  </div>
                  <div className="col-lg-6">
                    <label className="form-label">Bus No.</label>
                    <input {...register('bus_no')} value={ticketData.bus_no} onChange={(e) => handleFieldChange('bus_no', e.target.value)} className="form-control form-control-sm" type="text" />
                  </div>
                </div>

                <div className="row mb-3">
                  <div className="col-lg-6">
                    <label className="form-label">Boarding</label>
                    <input {...register('boarding')} value={ticketData.boarding} onChange={(e) => handleFieldChange('boarding', e.target.value)} className="form-control form-control-sm" type="text" required />
                  </div>
                </div>

                <div className="row mb-3">
                  <div className="col-lg-3">
                    <label className="form-label">Payment Method</label>
                    <select {...register('payment_method')} value={ticketData.payment_method} onChange={(e) => handleFieldChange('payment_method', e.target.value)} className="form-control">
                      <option value="">--Select-</option>
                      <option value="cash">Cash</option>
                      <option value="transfer">Transfer</option>
                      <option value="pending">Pending</option>
                      <option value="gpay">G-pay</option>
                      <option value="phonepay">PhonePay</option>
                      <option value="paytm">Paytm</option>
                      <option value="credit">Credit</option>
                    </select>


                    {(paymentMethod === 'gpay' || paymentMethod === 'phonepay' || paymentMethod === 'paytm') && (
                      <div className="mt-2">
                        <label className="form-label">Transaction ID</label>
                        <input
                          {...register('transection_id')}
                          type="text"
                          className="form-control"
                          placeholder="Enter transaction ID"
                          defaultValue={ticketData?.transection_id || ''}
                        />
                      </div>
                    )}
                  </div>
                  <div className="col-lg-3">
                    <label className="form-label">Actual Total</label>
                    <input readOnly className="form-control-plaintext" type="number" value={ticketData.final_total_amount} {...register('final_total_amount')} />
                    <input type="hidden" {...register('ticket_actual_total')} />
                  </div>
                  <div className="col-lg-3">
                    <label className="form-label">Total Print Amount</label>
                    <input readOnly className="form-control-plaintext" type="number" value={ticketData.print_final_total_amount} {...register('print_final_total_amount')} />
                  </div>
                </div>

                <div className="row mb-3">
                  <div className="col-lg-3">
                    <label className="form-label">Actual Paid Amount</label>
                    <input {...register('paid_amount')} value={ticketData.paid_amount} onChange={(e) => handleFieldChange('paid_amount', e.target.value)} className="form-control form-control-sm" type="number" />
                  </div>
                  <div className="col-lg-3">
                    <label className="form-label">Actual Balance Amount</label>
                    <input readOnly className="form-control-plaintext" value={ticketData.remaining_amount} type="number" {...register('remaining_amount')} />
                  </div>
                  <div className="col-lg-3">
                    <label className="form-label">Print Paid Amount</label>
                    <input {...register('print_paid_amount')} value={ticketData.print_paid_amount} onChange={(e) => handleFieldChange('print_paid_amount', e.target.value)} className="form-control form-control-sm" type="number" />
                  </div>
                  <div className="col-lg-3">
                    <label className="form-label">Print Balance Amount</label>
                    <input readOnly className="form-control-plaintext" type="number" value={ticketData.print_remaining_amount} {...register('print_remaining_amount')} />
                  </div>
                </div>



                {/* <----------> */}
                <div className="row mb-3">
                  <div className="col-lg-6">
                    <label className="form-label" htmlFor="remark">Remark</label>
                    <textarea {...register('remarks')} value={ticketData.remarks} onChange={(e) => handleFieldChange('remarks', e.target.value)} className="form-control form-control-sm" id="remark" placeholder="Enter Remark"></textarea>

                  </div>
                  <div className="col-lg-6">
                    <label className="form-label" htmlFor="remark">Is Duplicate?</label><br />
                    <input  {...register('is_duplicate')} checked={ticketData.is_duplicate === "1"} // Check if ticketData.is_duplicate is "1"
                      onChange={(e) => handleFieldChange('is_duplicate', e.target.checked ? "1" : "0")} value={ticketData.is_duplicate} type="checkbox" id="is_duplicate" />
                  </div>
                </div>

                {/* <----------> */}
                <div className="row">
                  <div className="text-center">
                    <button className="btn btn-primary" type="submit" id="save_ticket" name="save_form" >
                      Update
                    </button>
                  </div>
                </div>
              </form>
            </Card.Body>
          )}
        </Card >

      </div >

    </>
  )
}

export default EditForm







