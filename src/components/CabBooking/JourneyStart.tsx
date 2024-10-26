"use client";

import CabbookingList from '@/app/Api/CabBooking/CabbookingList';
import GetDriver from '@/app/Api/CabBooking/GetDriver';
import GetJourneryStratId from '@/app/Api/CabBooking/GetJourneryStratId';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Card } from 'react-bootstrap';
import { SubmitHandler, useForm } from 'react-hook-form';

interface FormData {
    vehicle_no: string;
    driver_name: number;
    Starting_rate?: number;
    place_visit?: string;
    closing_kms?: number;
    closing_time?: string;
    closing_date?: string;
    journey_start_time: string;
    starting_kms?: number;
    waiting_date?: string;
    journey_start_date: string;
    total_kms?: number;
    waiting?: string;
    rate_8hrs_80kms?: number;
    vehicle_type?: string;
    rate_12hrs_300kms?: number;
    extra_kms?: number;
    rate?: number;
    extra_hrs?: number;
    driver_allowance?: number;
    night_charges?: number;
    advance_rs?: number;
    driver_mobile_no: string;
    balance_rs?: number;
    d_name: any;
    d_id: any;
    cb_id?: number;
    vehicle_name?:string;

}

interface Driver {
    d_id: number;
    d_name: string;
}

interface JourneyStartProps {
    initialData?: any;
    StartId: number | null;

}

const JourneyStart: React.FC<JourneyStartProps> = ({ initialData, StartId }) => {
    const { register, handleSubmit, setValue, reset, watch, getValues, formState: { errors } } = useForm<FormData>({
        defaultValues: initialData || {}
    });



    const [Driver, setDriver] = useState<Driver[]>([]);
    const [selectedDriverId, setSelectedDriverId] = useState<number | null>(null);


    const currentDate = new Date().toISOString().split('T')[0];
    const getCurrentTime = () => {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        return `${hours}:${minutes}`;
    };
    const currentTime = getCurrentTime();


    useEffect(() => {
        const fetchDriverData = async () => {
            try {
                const response = await GetDriver.getAddDriver();
                setDriver(response);

                if (initialData?.d_name) {
                    // Find the driver ID by the driver's name
                    const driver = response.find((driver: { d_name: any; }) => driver.d_name === initialData.d_name);
                    if (driver) {
                        setSelectedDriverId(driver.d_id);
                        setValue('driver_name', driver.d_id); // Set default value for driver_name
                    }
                }
            } catch (error) {
                console.error('Error fetching drivers:', error);
            }
        };
        fetchDriverData();
    }, [initialData, setValue]);





    const [DrimobileNoValue, DrisetMobileNoValue] = useState<string>('');

    const handleDriverMobileNoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/[^\d]/g, '');
        if (value.length <= 10) {
            DrisetMobileNoValue(value);

            setValue("driver_mobile_no", value);
        }
    };







    

    const onSubmit: SubmitHandler<FormData> = async (formData) => {
        console.log("Filtered Form Data:", formData);

        try {
            const response = await axios.post('http://192.168.0.105:3001/cabbooking/add_cab_booking_start_journey_details', formData);
            console.log('Data submitted successfully:', response.data);
            reset();
            window.location.reload();
        } catch (error) {
            console.error('Error updating data:', error);
        }
    };

    return (


        <>

            <div className='container'>
                <br />
            
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="row mb-3">
                                <div className="col-lg-3 col-sm-6 mb-3">
                                    <label className="form-label" htmlFor="driverName">Driver Name</label>
                                    <select {...register("driver_name")} className="form-control form-control-sm" id="driverName">
                                        <option value="">--Select--</option>
                                        {Driver && Driver.length > 0 && Driver.map((driver) => (
                                            <option key={driver.d_id} value={driver.d_id}>{driver.d_name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="col-lg-3 col-sm-6">
                                    <label className="form-label" htmlFor="driverMobileNo">Driver Mobile No</label>
                                    <input
                                        {...register("driver_mobile_no", {
                                            required: true,
                                            minLength: 10,
                                            maxLength: 10,
                                            pattern: /^[0-9]+$/
                                        })}
                                        type="text"
                                        value={watch('driver_mobile_no')} onChange={handleDriverMobileNoChange}
                                        className="form-control form-control-sm"
                                        id="driverMobileNo"
                                        placeholder="Enter Mobile No"
                                    />
                                    {errors.driver_mobile_no && <span className="error">Enter a valid 10-digit mobile number.</span>}
                                </div>

                                <div className="col-lg-3 col-sm-6 mb-3">
                                    <label className="form-label" htmlFor="vehicleType">Vehicle Type</label>
                                    <input {...register("vehicle_type")} type="text" className="form-control form-control-sm" id="vehicleType" placeholder="Enter Vehicle Type" />
                                </div>

                               
                                <div className="col-lg-3 col-sm-6 mb-3">
                                    <label className="form-label" htmlFor="vehicleNo">Vehicle No</label>
                                    <input
                                        {...register("vehicle_no")}
                                        type="text"
                                        className="form-control form-control-sm"
                                        id="vehicleNo"
                                        placeholder="Enter Vehicle No"
                                    />
                                </div>
                                <div className="col-lg-4 col-sm-6">
                                    <label className="form-label" htmlFor="startingKms">Starting KMS</label>
                                    <input
                                        {...register("starting_kms", {
                                            pattern: {
                                                value: /^[0-9]*$/,
                                                message: "Please enter a valid number"
                                            }
                                        })}
                                        type="text"
                                        className="form-control form-control-sm"
                                        id="startingKms"
                                        placeholder="Starting KMS"
                                    />
                                    {errors.starting_kms && <span className="error">{errors.starting_kms.message}</span>}
                                </div>
                                <div className="col-lg-3">
                                    <label className="form-label">Time</label>
                                    <input defaultValue={currentTime} {...register('journey_start_time')} className="form-control form-control-sm" type="time" />
                                    {errors.journey_start_time && (
                                        <span className="error">This field is required.</span>
                                    )}
                                </div>

                                <div className="col-lg-3 col-sm-6">
                                    <label className="form-label" htmlFor="journeyStartDate">Date</label>
                                    <input defaultValue={currentDate}  {...register("journey_start_date")} className="form-control form-control-sm" type="date" id="journeyStartDate" placeholder="Enter Starting Date" />
                                </div>
                            </div>

                            <button type="submit" className="btn btn-success btn-sm" >Submit</button>
                        </form>
                    
            </div>

        </>




    );



};

export default JourneyStart;
