"use client";

import CabbookingList from '@/app/Api/CabBooking/CabbookingList';
import { faMinusCircle, faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Card } from 'react-bootstrap'
import { SubmitHandler, useFieldArray, useForm } from 'react-hook-form';


interface FormData {
    cb_id?: number;
    closing_kms: any;
    journey_end_time: any;
    journey_end_date: any;
    extra_km_total_rate: any;
    total_used_kms: any;
    waiting: any;
    extra_kms: any;
    rate: any;
    extra_hrs_total_rate: any;
    extra_hrs: any;
    driver_allowance: any;
    total_night: any;
    extra_charges_total: any
    waiting_total_rate: any;
    driver_allowance_total_rate: any;
    night_charges_total_rate: any;
    total_amount: any;
    rate_text: any;
    actual_amount: any;
    discount: any;
    discount_amount: any
    extra_charges: {
        charge: any;
        rate: any;
    }[];
    cb_extra_km_charges: any;
    cb_extra_hrs_charges: any;
    total_used_hrs: any;
    night_charge: any;
    driver_allowance_charge: any;
    waiting_charge: any;

}

interface JourneryEndProps {
    endinitialData?: any;
    EndId: number | null;

}

const JourneyEnd: React.FC<JourneryEndProps> = ({ endinitialData, EndId }) => {

    const [fireData, setFireData] = useState<any>("");
    const [error, setError] = useState<string>('');
    const [totalKms, setTotalKms] = useState<number | ''>('');
    const [startingKms, setStartingKms] = useState<number>(0);
    const [AdvanceAmount, setAdvanceAmount] = useState('');
    const [startJourneyTime, setStartJourneyTime] = useState("");
    const [startdate, setstartdate] = useState("");



    useEffect(() => {
        const fetchData = async () => {
            try {
                const cb_id = new URLSearchParams(window.location.search).get("id");
                if (cb_id) {
                    const response = await CabbookingList.GetcabBookingId(cb_id);
                    const data = response.data[0];
                    setFireData(data);

                    setStartingKms(data.startJourneyDetails.starting_kms);
                    setstartdate(data.journey_start_date)
                    setAdvanceAmount(data.advance_amount)
                    console.log(data.startJourneyDetails.starting_kms);


                    console.log("details", data);

                    setValue("rate", data.rate)
                    setValue("rate_text", data.rate_text)
                    setValue("cb_extra_hrs_charges", data.cb_extra_hrs_charges)
                    setValue("waiting_charge", data.waiting_charge);
                    setValue("driver_allowance_charge", data.driver_allowance_charge);
                    setValue("night_charge", data.night_charge);

                    const startTime = data.startJourneyDetails.journey_start_time;
                    setStartJourneyTime(startTime);

                    // setValue("discount_amount", data.endJourneyDetails.discount_amount);
                    setError('');
                    return data;

                } else {
                    setError('Id not found.');
                }
            } catch (error) {
                console.error('Error fetching fire data:', error);
                setError('An error occurred while fetching data.');
            }
        };

        fetchData();
    }, []);

    //-----------------------------------------------------------------------------------------------------






    const { register, control, handleSubmit, formState: { errors }, watch, reset, setValue, getValues } = useForm<FormData>({
        defaultValues: endinitialData || {
            extra_charges: [{ charge: '', rate: 0 }]
        }
    });

    ;
    //-------------------------------------------------------------------------------------------------------------------------
    const rate = watch("rate");
    const totalUsedKms = watch("total_used_kms");
    const journeyEndTime = watch("journey_end_time");
    const closingKms = watch('closing_kms', 0);
    const journeyEndDate = watch("journey_end_date");
    const nightCharges = watch('total_night', 0);
    const nightChargesRate = watch('night_charge', 0);
    const waiting = watch('waiting', 0);
    const waitingRate = watch('waiting_charge', 0);
    const driverAllowance = watch('driver_allowance', 0);
    const driverAllowanceRate = watch('driver_allowance_charge', 0);
    const totalsumAmount = watch('total_amount');
    const discountPercentage = watch('discount');
    const extraChargesList = watch('extra_charges', []);

    const bookingrate = fireData.rate_text

    useEffect(() => {
        // Calculate extra kilometers
        const start = parseFloat(startingKms.toString()) || 0;
        const close = parseFloat(closingKms.toString()) || 0;


        if (startdate && journeyEndDate) {
            const start = new Date(startdate);
            const end = new Date(journeyEndDate);

            const timeDiff = end.getTime() - start.getTime();
            const dayDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
            const nightDiff = dayDiff > 0 ? dayDiff - 1 : 0;
            console.log(nightDiff);




            if (rate == "Other") {
                setValue("driver_allowance", 0)
            }
            else {
                setValue("driver_allowance", dayDiff)

            }

            if (rate == "Other") {
                setValue("total_night", 0)
            }
            else {
                setValue("total_night", nightDiff)

            }
        }

        if (journeyEndTime && startJourneyTime) {
            const startTimeParts = startJourneyTime.split(':');
            const endTimeParts = journeyEndTime.split(':');

            if (startTimeParts.length === 2 && endTimeParts.length === 2) {
                const startHours = parseInt(startTimeParts[0], 10);
                const startMinutes = parseInt(startTimeParts[1], 10);
                const endHours = parseInt(endTimeParts[0], 10);
                const endMinutes = parseInt(endTimeParts[1], 10);

                const startTime = new Date();
                startTime.setHours(startHours, startMinutes, 0);

                const endTime = new Date();
                endTime.setHours(endHours, endMinutes, 0);

                const totalUsedHrs = Math.floor((endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60)); // Convert milliseconds to whole hours


                if (totalUsedHrs <= 0) {
                    setValue("total_used_hrs", 0);
                } else {
                    setValue('total_used_hrs', totalUsedHrs);
                }




                // setValue("total_used_hrs", totalUsedHrs);

                if (rate) {
                    const rateMatch = rate.match(/(\d+)\s*Hrs/);
                    const rateHrs = rateMatch ? parseInt(rateMatch[1], 10) : 0;

                    const calculatedExtraHrs = totalUsedHrs - rateHrs;
                    setValue("extra_hrs", calculatedExtraHrs < 0 ? 0 : calculatedExtraHrs);

                    if (calculatedExtraHrs <= 0) {
                        setValue("cb_extra_hrs_charges", 0);
                    } else {
                        setValue("cb_extra_hrs_charges", fireData.cb_extra_hrs_charges || 0);
                    }
                    const extraHrCharges = parseFloat(getValues("cb_extra_hrs_charges")) || 0;
                    const currentExtraHrs = getValues("extra_hrs") || 0;
                    const totalHrRate = currentExtraHrs * extraHrCharges;
                    setValue("extra_hrs_total_rate", totalHrRate);

                }

            }
        }
        if (closingKms) {
            const calculatedTotalKms = close - start;


            if (calculatedTotalKms <= 0) {
                setValue("total_used_kms", 0);
            } else {
                setValue('total_used_kms', calculatedTotalKms.toString());
            }


            if (rate && totalUsedKms) {
                const rateKmMatch = rate.match(/(\d+)\s*KMs/);
                const rateKms = rateKmMatch ? parseInt(rateKmMatch[1], 10) : 0;

                const totalKms = parseInt(totalUsedKms, 10) || 0;
                const calculatedExtraKms = totalKms - rateKms;

                console.log(calculatedExtraKms);
                

                setValue("extra_kms", calculatedExtraKms < 0 ? 0 : calculatedExtraKms);

                if (calculatedExtraKms <= 0) {
                    setValue("cb_extra_km_charges", 0);
                } else {
                    setValue("cb_extra_km_charges", fireData.cb_extra_km_charges || 0);
                }

                const extraKmCharges = parseFloat(getValues("cb_extra_km_charges")) || 0;
                const currentExtraKms = getValues("extra_kms") || 0; //
                const totalRate = currentExtraKms * extraKmCharges;

                setValue("extra_km_total_rate", totalRate);
            }



            const waitingValue = parseFloat(waiting.toString()) || 0;
            const waitingRateValue = parseFloat(waitingRate.toString()) || 0;
            const waitingTotalRate = waitingValue * waitingRateValue;
            setValue('waiting_total_rate', waitingTotalRate.toString());


            const driverAllowanceValue = parseFloat(driverAllowance.toString()) || 0;
            const driverAllowanceRateValue = parseFloat(driverAllowanceRate.toString()) || 0;
            const driverAllowanceTotalRate = driverAllowanceValue * driverAllowanceRateValue;
            setValue('driver_allowance_total_rate', driverAllowanceTotalRate.toString());


            const nightChargesValue = parseFloat(nightCharges.toString()) || 0;
            const nightChargesRateValue = parseFloat(nightChargesRate.toString()) || 0;
            const nightChargesTotalRate = nightChargesValue * nightChargesRateValue;
            setValue('night_charges_total_rate', nightChargesTotalRate.toString());


            const totalExtraChargesRate = extraChargesList.reduce((sum, charge) => {
                const rateValue = parseFloat(charge.rate.toString()) || 0;
                return sum + rateValue;
            }, 0);

            const waitingTotal = parseFloat(waitingTotalRate.toString()) || 0;
            const driverAllowanceTotal = parseFloat(driverAllowanceTotalRate.toString()) || 0;
            const nightChargesTotal = parseFloat(nightChargesTotalRate.toString()) || 0;
            const extratotal = parseFloat(totalExtraChargesRate.toString()) || 0;
            const parsedBookingRate = parseFloat(bookingrate) || 0;
            

            const totalAmount = parsedBookingRate + getValues("extra_km_total_rate") +
                getValues("extra_hrs_total_rate") +
                waitingTotal + driverAllowanceTotal + nightChargesTotal + extratotal;


            setValue('total_amount', totalAmount.toString());

        }


    }, [rate, startdate, extraChargesList, journeyEndDate, nightCharges, totalsumAmount, nightChargesRate, driverAllowance, driverAllowanceRate, waiting, waitingRate, startingKms, closingKms, totalUsedKms, journeyEndTime, startJourneyTime, setValue]);


    const [isDisabled, setIsDisabled] = useState(false);


    useEffect(() => {
        if (rate === 'Other') {
            setIsDisabled(true);
            // setValue("closing_kms", "0");
            setValue("extra_kms", "0");
            setValue("extra_hrs", "0");
            setValue("waiting_total_rate", "0");
            setValue("waiting_charge", "0");
            setValue("total_amount", "0");
            setValue("driver_allowance_charge", "0");
            setValue("night_charge", "0");
            setValue("total_used_kms", "0");


            const parsedBookingRate = parseFloat(bookingrate) || 0;
            const totalAmount = parsedBookingRate



            setValue('total_amount', totalAmount.toString());

        } else {
            setIsDisabled(false);
        }
    }, [rate, setValue]);


    useEffect(() => {
        const total = parseFloat(watch('total_amount')) || 0;
        const discount = parseFloat(discountPercentage) || 0;

        const calculatedDiscountAmount = (total * discount) / 100;
        setValue("discount_amount", calculatedDiscountAmount.toFixed(2));

        const finalAmount = Math.round(total - calculatedDiscountAmount);
        setValue('actual_amount', finalAmount.toString());
    }, [discountPercentage, watch('total_amount'), setValue]);

    //----------------------------------------------------------------------------------------------------------------------------------










    //----------------------------------time----------------------------

    const currentDate = new Date().toISOString().split('T')[0];
    const getCurrentTime = () => {
        const now = new Date();

        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');

        return `${hours}:${minutes}`;
    };

    const currentTime = getCurrentTime();

    //--------------------------------------------------------------------









    const { fields, append, remove } = useFieldArray({
        control,
        name: 'extra_charges',
    });

    useEffect(() => {
        if (fields.length === 0) {
            append({ charge: '', rate: '' });
        }
    }, [fields, append]);


    React.useEffect(() => {
        if (endinitialData) {
            reset(endinitialData);
        }
    }, [endinitialData, reset]);


    const addRow = () => {
        append({
            charge: '', rate: '',
        });
    };

    const handleRemove = (index: number) => {
        remove(index);
    };





    const onSubmit: SubmitHandler<FormData> = async (formData) => {
        console.log(" Form Data:", formData);

        try {
            const response = await axios.post('http://192.168.0.105:3001/cabbooking/add_cab_booking_end_journey_details', formData);
            console.log('Data submitted successfully:', response.data);
            // window.location.reload();
        } catch (error) {
            console.error('Error updating data:', error);
        }
    };



    return (
        <>


            <div className='container' style={{ fontSize: "12px" }}>
                <br />

                <form onSubmit={handleSubmit(onSubmit)}>

                    <div className="row mb-3">
                        <div className="col-lg-4 col-sm-6">
                            <label className="form-label" htmlFor="closing">Closing KMS</label>
                            <input
                                {...register("closing_kms", {
                                    required: "Closing KMS is required.",
                                    validate: value => parseFloat(value) > startingKms || "Closing KMS must be greater than Starting KMS."
                                })}
                                type="text"
                                disabled={isDisabled}
                                className="form-control form-control-sm"
                                id="closing"
                                placeholder="Closing KMS"
                            />
                            {errors.closing_kms?.type === "validate" && (
                                <span id="show_closing_err" className="error">Closing KMS must be greater than Starting KMS.</span>
                            )}                        </div>
                        <div className="col-lg-4">
                            <label className="form-label"> Time</label>
                            <input defaultValue={currentTime}  {...register('journey_end_time')} className="form-control form-control-sm" type="time" />
                            {errors.journey_end_time?.type === "required" && (
                                <span id="show_mobile_err" className="error">This field is required.</span>
                            )}
                        </div>

                        <div className="col-lg-4 col-sm-6">
                            <label className="form-label" htmlFor="journey_end_date">Date</label>
                            <input defaultValue={currentDate} {...register("journey_end_date")} className="form-control form-control-sm" type="date" id="journey_end_date" placeholder="Enter Closing Date" />
                        </div>
                    </div>
                    <div className="row mb-3">
                        <div className="col-lg-3 col-sm-6">
                            <label className="form-label" htmlFor="rate">Booking Hrs/Kms</label>
                            <input {...register("rate")}
                                disabled type="text" className="form-control form-control-sm" id="total" placeholder="Total kms" />
                        </div>
                        <div className="col-lg-3">
                            <label className="form-label" htmlFor="rate_text">Booking Rate</label>
                            <input
                                disabled
                                {...register('rate_text')}
                                type="text"
                                className="form-control form-control-sm"
                                id="rate_80kms_input"

                            />
                        </div>
                        <div className="col-lg-3 col-sm-6">
                            <label className="form-label" htmlFor="total_used_kms">Total Used KMS</label>
                            <input {...register("total_used_kms")}
                                disabled type="text" className="form-control form-control-sm" id="total" placeholder="Total kms" />
                        </div>
                        <div className="col-lg-3 col-sm-6">
                            <label className="form-label" htmlFor="total_used_hrs">Total Used Hrs</label>
                            <input {...register("total_used_hrs")}
                                disabled type="text" className="form-control form-control-sm" id="total" placeholder="Total hrs" />
                        </div>



                    </div>

                    <div className='row mb-3'>
                        <div className="col-lg-4 col-sm-6">
                            <label className="form-label" htmlFor="extra_kms">Extra KMS</label>
                            <input {...register("extra_kms")} type="text" disabled className="form-control form-control-sm" id="extra_kms" placeholder="Extra kms" />
                        </div>

                        <div className="col-lg-4">
                            <label className="form-label"  htmlFor="cb_extra_km_charges">Rate/Km</label>
                            <input
                                {...register('cb_extra_km_charges')}
                                type="text"
                                disabled
                                className="form-control form-control-sm"
                                id="rate_80kms_input"
                                placeholder="Rate for 14 hrs/300Kms"
                            />
                        </div>
                        <div className="col-lg-4 col-sm-6">
                            <label className="form-label" htmlFor="extra_km_total_rate">Total</label>
                            <input {...register("extra_km_total_rate")} type="text" className="form-control form-control-sm" id="extra_km_total_rate" placeholder="Balance RS" />
                        </div>
                    </div>
                    <div className='row mb-3'>
                        <div className="col-lg-4 col-sm-6">
                            <label className="form-label" htmlFor="extra_hrs">Extra HRS</label>
                            <input {...register("extra_hrs")} disabled type="text" className="form-control form-control-sm" id="extra_hrs" placeholder="Extra hrs" />
                        </div>
                        <div className="col-lg-4">
                            <label className="form-label" htmlFor="cb_extra_hrs_charges">Rate/Hrs</label>
                            <input
                            disabled
                                {...register('cb_extra_hrs_charges')}
                                type="text"
                                className="form-control form-control-sm"
                                id="rate_80kms_input"
                                placeholder="Rate for 14 hrs/300Kms"
                            />
                        </div>
                        <div className="col-lg-4 col-sm-6">
                            <label className="form-label" htmlFor="total_used_kms">Total</label>
                            <input {...register("extra_hrs_total_rate")}
                                type="text" className="form-control form-control-sm" id="total" placeholder="Total kms" />
                        </div>
                    </div>
                    <div className='row mb-3'>
                        <div className="col-lg-4">
                            <label className="form-label"> Waiting</label>
                            <input {...register('waiting')} className="form-control form-control-sm" type="text" placeholder='Waiting' />
                            {errors.waiting?.type === "required" && (
                                <span id="show_mobile_err" className="error">This field is required.</span>
                            )}
                        </div>
                        <div className="col-lg-4">
                            <label className="form-label" htmlFor="waiting_charge">Rate/Hrs</label>
                            <input
                                {...register('waiting_charge')}
                                type="text"
                                className="form-control form-control-sm"
                                id="rate_80kms_input"
                                placeholder="Rate for 14 hrs/300Kms"
                            />
                        </div>
                        <div className="col-lg-4 col-sm-6">
                            <label className="form-label" htmlFor="waiting_total_rate">Total</label>
                            <input {...register("waiting_total_rate")}
                                type="text" className="form-control form-control-sm" id="total" placeholder="Total kms" />
                        </div>
                    </div>
                    <div className='row mb-3'>

                        <div className="col-lg-4 col-sm-6">
                            <label className="form-label" htmlFor="driver_allowance">Allowed/day</label>
                            <input {...register("driver_allowance")} disabled type="text" className="form-control form-control-sm" id="driver_allowance" placeholder="Driver allowance" />
                        </div>
                        <div className="col-lg-4">
                            <label className="form-label" htmlFor="driver_allowance_charge">Driver Allowance</label>
                            <input
                                {...register('driver_allowance_charge')}
                                type="text"
                                disabled
                                className="form-control form-control-sm"
                                id="rate_80kms_input"
                                placeholder="Rate for 12 hrs/300Kms"
                            />
                        </div>
                        <div className="col-lg-4 col-sm-6">
                            <label className="form-label" htmlFor="driver_allowance_total_rate">Total</label>
                            <input {...register("driver_allowance_total_rate")}
                                type="text" className="form-control form-control-sm" id="total" placeholder="Total kms" />
                        </div>
                    </div>

                    <div className='row mb-3'>
                        <div className="col-lg-4 col-sm-6">
                            <label className="form-label" htmlFor="total_night">Charge/Night</label>
                            <input {...register("total_night")} disabled type="text" className="form-control form-control-sm" id="night_charges" placeholder="Night charges" />
                        </div>
                        <div className="col-lg-4">
                            <label className="form-label" htmlFor="night_charge">Night Charges</label>
                            <input
                                {...register('night_charge')}
                                type="text"
                                disabled
                                className="form-control form-control-sm"
                                id="rate_80kms_input"
                                placeholder="Rate for 12 hrs/300Kms"
                            />
                        </div>
                        <div className="col-lg-4 col-sm-6">
                            <label className="form-label" htmlFor="night_charges_total_rate">Total</label>
                            <input {...register("night_charges_total_rate")}
                                type="text" className="form-control form-control-sm" id="total" placeholder="Total kms" />
                        </div>
                    </div>


                    <div className="row mt-4">
                        <div className="col-md-12">
                            <h5>Extra charges:</h5>
                        </div>
                        <hr />
                    </div>

                    {fields.map((field, index) => (
                        <div>
                            <div key={field.id} className="row mb-3">
                                <div className="col-lg-12 col-sm-5 line" style={{ display: "flex", gap: "15px" }}>

                                    <div className="col-lg-3 col-sm-4">
                                        <label className="form-label">Extra Charges:</label>
                                        <select {...register(`extra_charges.${index}.charge`)} className="form-control" id={`select_type_${index}`}>
                                            <option value="">--Select--</option>
                                            <option value="Toll Tax">Toll Tax</option>
                                            <option value="Permit">Permit</option>
                                            <option value="Tax">Tax</option>
                                            <option value="Entry">Entry</option>
                                            <option value="Parking">Parking</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>


                                    <div className="col-lg-2 col-sm-4">
                                        <label className="form-label">Rate</label>
                                        <input
                                            className="form-control form-control-sm qty_cnt"
                                            type='number'
                                            {...register(`extra_charges.${index}.rate`, {
                                            })}
                                            id='Rate'
                                            placeholder="rate"
                                        />
                                    </div>
                                    <div className="col-lg-1 col-sm-1 new" style={{ marginTop: "30px" }}>
                                        <button type="button" className="btn btn-danger btn-sm" onClick={() => handleRemove(index)}>
                                            <FontAwesomeIcon icon={faMinusCircle} />
                                        </button>
                                    </div>
                                </div>


                            </div>


                        </div>

                    ))}


                    <div className="row">
                        <div className="col-lg-12 finall">
                            <button type="button" style={{ float: "right", marginRight: "14px" }} onClick={addRow} className="btn btn-primary btn-sm add_more_row">
                                <FontAwesomeIcon icon={faPlusCircle} />
                            </button>
                        </div>

                    </div>
                    <div className="row mb-3">

                        <div className="col-lg-3 col-sm-6">
                            <label className="form-label" htmlFor="total_amount">Total Amount</label>
                            <input {...register("total_amount")} disabled type="text" className="form-control form-control-sm" id="balance_rs" placeholder="Balance RS" />
                        </div>
                        <div className="col-lg-3 col-sm-6" style={{ display: "none" }}>
                            <label className="form-label" htmlFor="extra_charges_total">Total Amount</label>
                            <input {...register("extra_charges_total")} disabled type="text" className="form-control form-control-sm" id="balance_rs" placeholder="Balance RS" />
                        </div>


                        <div className="col-lg-2 col-md-4 col-sm-6">
                            <label className="form-label">Discount (%)</label>
                            <input
                                className="form-control form-control-sm"
                                {...register('discount')}
                                type="text"
                                disabled={isDisabled}
                                placeholder='Enter Discount'
                            />
                        </div>

                        <div className="col-lg-3 col-md-4 col-sm-6">
                            <label className="form-label">Discount Amount</label>
                            <input
                                className="form-control form-control-sm"
                                {...register('discount_amount')}
                                type="text"
                                readOnly
                                disabled
                                placeholder='Discount Amount'
                            />
                        </div>


                        {/* <div className="col-lg-3 col-sm-6">
                                    <label className="form-label" htmlFor="actual_amount">Pending Balance</label>
                                    <input {...register("actual_amount")} disabled type="text" className="form-control form-control-sm" id="balance_rs" placeholder="Balance RS" />
                                </div> */}
                    </div>
                    <div className='row mb-3'><div className="col-lg-3 col-sm-6">
                        <label className="form-label" htmlFor="actual_amount">Final Amount</label>
                        <input {...register("actual_amount")} disabled type="text" className="form-control form-control-sm" id="balance_rs" placeholder="Balance RS" />
                    </div></div>
                    <button type="submit" className="btn btn-success btn-sm">Submit</button>
                </form >

            </div >

        </>
    )
}

export default JourneyEnd