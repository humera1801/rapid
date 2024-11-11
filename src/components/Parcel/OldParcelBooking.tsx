"use client";

import React, { useState, useEffect, useMemo } from 'react'
import { Card } from 'react-bootstrap'
import { useForm, useFieldArray, SubmitHandler } from 'react-hook-form';
import { debounce } from 'lodash';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { faMinusCircle } from '@fortawesome/free-solid-svg-icons';
import StateList from '@/app/Api/StateList';
import CityList from '@/app/Api/CityList';
import receiptNo from '@/app/Api/receiptNo';
import UserProfile from '@/app/Api/UserProfile';
import { useRouter } from 'next/navigation';
import EditParcelDataList from '@/app/Api/EditParcelDataList';
import handleParcelPrint from '@/app/parcel_list/parcel_data/printpparcelUtils';
import GetClientList from '@/app/Api/FireApis/FireExtinghsherList/GetClientList';
import Footer from '../Dashboard/Footer';

type FormData = {
    is_delivery: boolean;
    particulars: string;
    whatsapp_no: any;
    parcel_imgs: any;
    transection_id: any;
    receipt_no: string;
    booking_date: string;
    dispatch_date: string;
    book_from: string,
    sender_name: string;
    rec_name: string;
    send_mob: string;
    rec_mob: string;
    send_add: string;
    rec_add: string;
    sender_proof_type: string;
    reciver_proof_type: string;
    sender_proof_detail: string;
    reciver_proof_detail: string
    pic_delivery_type: string;
    pic_charge: number;
    pic_address: { pickup_client_address: string; pickup_office_address: string }[];
    dis_address: { dispatch_client_address: string; dispatch_office_address: string }[];
    pic_office_detail: string;
    actual_paid_amount: any;
    dis_delivery_type: string;
    dis_charge: number;
    bus_no: string;
    driver_no: string;
    transport_charge: number;
    dis_office_detail: string;
    from_state: string,
    to_state: string,
    book_to: string,
    user_id: any;
    received: 'Get',
    total_print_rate: string;
    qty_total: number;
    payment_method: string;
    actual_total: string;
    print_total: string;
    gst_amount: string;
    print_gst_amount: string;
    bilty_charge: any;
    is_demurrage: boolean;
    actual_payable_amount: number;
    print_payable_amount: number;
    lr_no: number
    print_paid_amount: any;
    actual_bal_amount: any;
    print_bal_amount: any;
    total_demurrage_charges: number;
    demurrage_days: any;
    demurrage_charges: any;
    bill_detail: { e_way_bill_no: string; p_o_no: string; invoice_no: string; invoice_amount: string }[];
    parcel_detail: {
        parcel_type: string;
        weight: number;
        qty: number;
        rate: number;
        total_amount: number;
        print_rate: number;
        total_print_rate: number;
        QTYtotal: number;
    }[];
    firstName: string;
    address: string;
    client_city: string;
    client_state: string;
    client_pincode: string;
    email: string;

    gstNo: string;
    mobileNo: string;
    vendorCode: string;
    client_id: any;
};

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
}


// --add parcel---
interface ParcelDetail {

}

// ---add bill---
interface BillDetail {
    e_way_bill: string;
    prno: string;
    invoice_no: string;
    invoice_Amount: string;
}


interface OPTION {

    statevalue: string;
    label: string;
}

interface ToState {
    tostate: string;
    detail: string;
}

interface City {
    id: number;
    city_name: string;
    state_id: string;
}

interface State {
    id: number;
    name: string;
    state_code: string;
}

//--------------------------------------------------------------------------------------------------------------------

const ParcelBook: React.FC = () => {


    const storedData = localStorage.getItem('userData');


    const { register, control, handleSubmit, formState: { errors }, watch, setValue, getValues } = useForm<FormData>(
        {
            defaultValues: {
                is_delivery: false,
                particulars: '',
                is_demurrage: false,
                receipt_no: '',
                actual_total: '',
                sender_name: '',
                rec_name: '',
                send_mob: '',
                rec_mob: '',
                send_add: '',
                rec_add: '',
                gst_amount: '',
                print_gst_amount: '',
                sender_proof_type: '',
                reciver_proof_type: '',
                pic_delivery_type: '',
                pic_charge: 0,
                pic_office_detail: '',
                dis_delivery_type: '',
                dis_charge: 0,
                bus_no: '',
                driver_no: '',
                transport_charge: 0,
                dis_office_detail: '',
                actual_bal_amount: 0,
                from_state: '',
                book_from: '',
                to_state: '',
                book_to: '',
                sender_proof_detail: '',
                reciver_proof_detail: '',
                payment_method: '',
                total_print_rate: '',
                bill_detail: [{ e_way_bill_no: '', p_o_no: '', invoice_no: '', invoice_amount: '' }],
                pic_address: [{ pickup_client_address: '', pickup_office_address: '' }],
                dis_address: [{ dispatch_client_address: '', dispatch_office_address: '' }],
                parcel_detail: [{ parcel_type: '', weight: 0, qty: 0, rate: 0, total_amount: 0, print_rate: 0, total_print_rate: 0, QTYtotal: 0 }],
                lr_no: 0,
                actual_payable_amount: 0,
                user_id: storedData,
                received: 'Get',
                qty_total: 0,


            }
        }
    );
    const currentDate = new Date().toISOString().split('T')[0]; // Get current date in YYYY-MM-DD format
    const is_delivery = watch('is_delivery');
    const is_demurrage = watch('is_demurrage')


    //------------------------------------------------------check box-----------------------------------------------------------------------------------------


    const { fields: picAddressFields, append: appendPicAddress, remove: removePicAddress } = useFieldArray({
        control,
        name: 'pic_address'
    });

    const { fields: disAddressFields, append: appendDisAddress, remove: removeDisAddress } = useFieldArray({
        control,
        name: 'dis_address'
    });
    const { fields: EwayFields, append: appendEwayAddress, remove: removeEwayAddress } = useFieldArray({
        control,
        name: 'bill_detail'
    });


    const deliveryType = watch("pic_delivery_type");
    const deliveryTypedispatch = watch("dis_delivery_type");
    const dis_charge = watch('dis_charge');
    const lr_no = watch('lr_no');

    //-----------------------------------------------------  calculation data -------------------------------------------------------------------------------
    const demurrageDays = watch('demurrage_days') || 0;
    const demurrageCharges = watch('demurrage_charges') || 0;

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'parcel_detail',

    });


    const parcelDetail = watch('parcel_detail');
    const picCharge = watch('pic_charge') || 0;
    const disCharge = watch('dis_charge') || 0;

    // useEffect to handle calculations
    useEffect(() => {
        const totalCharge = parseFloat(picCharge.toString()) + parseFloat(disCharge.toString());
        setValue('transport_charge', totalCharge);

        const newTotalAmount = parcelDetail.reduce((sum, parcel) => sum + parcel.total_amount, 0);
        const formattedNewTotalAmount = newTotalAmount.toFixed(2);
        setValue('actual_total', formattedNewTotalAmount);

        const gstAmount = (newTotalAmount + totalCharge) * 0.05;
        setValue('gst_amount', gstAmount.toFixed(2));


        const totalPrintAmount = parcelDetail.reduce((sum, parcel) => {
            const totalPrintRate = parseFloat(parcel.total_print_rate?.toString() || '0'); // Handle undefined or null
            return sum + totalPrintRate;
        }, 0);

        const printGstAmount = (totalPrintAmount + totalCharge) * 0.05;
        setValue('print_gst_amount', printGstAmount.toFixed(2));


    }, [picCharge, disCharge, parcelDetail, watch, setValue]);

    const calculateAmounts = (index: number) => {
        const qty = watch(`parcel_detail.${index}.qty`);
        const rate = watch(`parcel_detail.${index}.rate`);
        const print_rate = watch(`parcel_detail.${index}.print_rate`);

        const total_amount = (qty * rate).toFixed(2); // Format to 2 decimal places
        const total_print_rate = (qty * print_rate).toFixed(2); // Format to 2 decimal places

        setValue(`parcel_detail.${index}.total_amount`, parseFloat(total_amount)); // Convert back to number
        setValue(`parcel_detail.${index}.total_print_rate`, parseFloat(total_print_rate)); // Convert back to number


    };



    useEffect(() => {
        fields.forEach((_, index) => {
            calculateAmounts(index);
        });

        const totalPrintAmount = watch('parcel_detail').reduce((sum, parcel) => sum + parcel.total_print_rate, 0);
        const formattedNewPrintTotalAmount = totalPrintAmount.toFixed(2);
        setValue('print_total', formattedNewPrintTotalAmount);

        const newTotalAmount = parcelDetail.reduce((sum, parcel) => sum + parcel.total_amount, 0);
        const formattedNewTotalAmount = newTotalAmount.toFixed(2);
        setValue('actual_total', formattedNewTotalAmount);

    }, [
        watch('parcel_detail'),

        watch('is_demurrage'),
        watch('demurrage_days'),
        watch('demurrage_charges'),

    ]);





    const paymentMethod = watch('payment_method');
    const actual_total = parseFloat(getValues('actual_total') || '0');
    const bilty_charge = parseFloat(getValues('bilty_charge') || '0');
    // const is_demurrage = getValues('is_demurrage');
    const demurrage_charges = parseFloat(getValues('demurrage_charges') || '0');
    const demurrage_days = parseFloat(getValues('demurrage_days') || '0');
    const actual_paid_amount = parseFloat(getValues('actual_paid_amount') || '0');
    const print_paid_amount = parseFloat(getValues('print_paid_amount') || '0');

    useEffect(() => {
        if (paymentMethod === 'credit') {
            // Reset all calculated fields to default values
            setValue('print_total', '0');
            setValue('gst_amount', '0');
            setValue('print_gst_amount', '0');
            setValue('total_demurrage_charges', 0);
            setValue('actual_payable_amount', 0);
            setValue('print_payable_amount', 0);
            setValue('actual_bal_amount', 0);
            setValue('print_bal_amount', 0);
            setValue('actual_total', '0');
            setValue('bilty_charge', '0');
            setValue('actual_paid_amount', '0');
            setValue('print_paid_amount', '0');
        } else {
            // Perform calculations based on current values if not 'credit'
            const print_total = (actual_total + bilty_charge).toFixed(2);
            const gst_amount = (actual_total * 0.05).toFixed(2); // Assuming 5% GST
            const total_demurrage_charges = is_demurrage ? (demurrage_charges * demurrage_days) : 0;
            const actual_payable_amount = (actual_total + parseFloat(gst_amount) + total_demurrage_charges).toFixed(2);
            const print_payable_amount = parseFloat(actual_payable_amount);

            // Update form values
            setValue('gst_amount', gst_amount);
            setValue('print_gst_amount', gst_amount);
            setValue('total_demurrage_charges', total_demurrage_charges);
            setValue('actual_payable_amount', parseFloat(actual_payable_amount));
            setValue('print_payable_amount', print_payable_amount);

            // Calculate balances
            const actual_bal_amount = (parseFloat(actual_payable_amount) - actual_paid_amount).toFixed(2);
            const print_bal_amount = (print_payable_amount - print_paid_amount).toFixed(2);

            setValue('actual_bal_amount', parseFloat(actual_bal_amount));
            setValue('print_bal_amount', parseFloat(print_bal_amount));
        }
    }, [paymentMethod, actual_total, bilty_charge, is_demurrage, demurrage_charges, demurrage_days, actual_paid_amount, print_paid_amount, setValue]);



    const handleQtyChange = (index: number, qty: number) => {

        const rate = watch(`parcel_detail.${index}.rate`);

        const totalAmount = qty * rate;
        setValue(`parcel_detail.${index}.total_amount`, totalAmount);

        const parcel_detail = watch('parcel_detail');


        const newTotalAmount = parcelDetail.reduce((sum, parcel) => sum + parcel.total_amount, 0);
        const formattedNewTotalAmount = newTotalAmount.toFixed(2);
        setValue('actual_total', formattedNewTotalAmount);

        const fixedBiltyCharge = 20;
        setValue("bilty_charge", fixedBiltyCharge)


        setValue(`parcel_detail.${index}.qty`, qty);

        const nextIndex = index + 1;
        const nextQty = nextIndex < parcelDetail.length ? parcelDetail[nextIndex].qty || 0 : 0;
        const qtytotal = qty + nextQty;

        setValue(`parcel_detail.${index}.QTYtotal`, qtytotal);
        console.log("ehgfrf", qtytotal);

        const qtyTotalAmount = parseFloat(parcelDetail.reduce((sum, parcel) => sum + (parcel.QTYtotal || 0), 0).toFixed(2));

        setValue('qty_total', qtyTotalAmount);

        console.log("final total", qtyTotalAmount)

        const newQty = qty === 0 ? 0 : qty;
        setValue(`parcel_detail.${index}.qty`, newQty);

        const totalPrintAmount = watch('parcel_detail').reduce((sum, parcel) => sum + parcel.total_print_rate, 0);
        const formattedNewPrintTotalAmount = totalPrintAmount.toFixed(2);
        setValue('print_total', formattedNewPrintTotalAmount);






    };


    const handleRateChange = (index: number, rate: number) => {
        const qty = watch(`parcel_detail.${index}.qty`);
        const totalAmount = qty * rate;
        setValue(`parcel_detail.${index}.total_amount`, totalAmount);
        const parcel_detail = watch('parcel_detail');
        const newTotalAmount = parcelDetail.reduce((sum, parcel) => sum + parcel.total_amount, 0);
        const formattedNewTotalAmount = newTotalAmount.toFixed(2);
        setValue('actual_total', formattedNewTotalAmount);

        setValue(`parcel_detail.${index}.print_rate`, rate);
        setValue(`parcel_detail.${index}.total_print_rate`, totalAmount);
        const transport_charge = watch('transport_charge') || 0;
        const totalCharge = parseFloat(picCharge.toString()) + parseFloat(disCharge.toString());
        setValue('transport_charge', totalCharge);
        const gstAmount = (newTotalAmount + totalCharge) * 0.05;
        setValue('gst_amount', gstAmount.toFixed(2));
        const totalPrintAmount = watch('parcel_detail').reduce((sum, parcel) => sum + parcel.total_print_rate, 0);
        const formattedNewPrintTotalAmount = totalPrintAmount.toFixed(2);
        setValue('print_total', formattedNewPrintTotalAmount);

        const printGstAmount = (totalPrintAmount + totalCharge) * 0.05;
        setValue('print_gst_amount', printGstAmount.toFixed(2));


        const newRate = rate === 0 ? 0 : rate;
        setValue(`parcel_detail.${index}.rate`, newRate);
        const blityCharge = parseFloat(watch('bilty_charge').toString());


        const actualPayableAmount = newTotalAmount + gstAmount + blityCharge;
        const printPayableAmount = totalPrintAmount + printGstAmount + blityCharge;

        setValue('actual_payable_amount', actualPayableAmount);
        setValue('print_payable_amount', printPayableAmount);



        const actual_paid_amount = watch('actual_paid_amount') || 0;
        const printReceive = watch('print_paid_amount') || 0;

        const actualbalamount = actualPayableAmount - actual_paid_amount;
        const printBalance = printPayableAmount - printReceive;
        setValue('actual_bal_amount', actualbalamount);
        setValue('print_bal_amount', printBalance);


    };


    const handlePrintRateChange = (index: number, printRate: number) => {
        const qty = watch(`parcel_detail.${index}.qty`);
        const totalAmount = qty * printRate;
        setValue(`parcel_detail.${index}.print_rate`, printRate);
        setValue(`parcel_detail.${index}.total_print_rate`, totalAmount);
        const totalPrintAmount = watch('parcel_detail').reduce((sum, parcel) => sum + parcel.total_print_rate, 0);
        const formattedNewPrintTotalAmount = totalPrintAmount.toFixed(2);
        setValue('print_total', formattedNewPrintTotalAmount);
        const totalCharge = parseFloat(picCharge.toString()) + parseFloat(disCharge.toString());
        setValue('transport_charge', totalCharge);


        const printGstAmount = (totalPrintAmount + totalCharge) * 0.05;
        setValue('print_gst_amount', printGstAmount.toFixed(2));

        const newPrintRate = printRate === 0 ? 0 : printRate;
        setValue(`parcel_detail.${index}.print_rate`, newPrintRate);
        const blityCharge = parseFloat(watch('bilty_charge').toString());
        const totalDemurrageCharges = demurrageDays * demurrageCharges;
        setValue('total_demurrage_charges', totalDemurrageCharges);

        const printPayableAmount = totalPrintAmount + printGstAmount + blityCharge + totalDemurrageCharges;

        setValue('print_payable_amount', printPayableAmount);


    };




    const updateTotalDemurrageCharges = (qty: number) => {


        const parcelDetail = watch('parcel_detail') || [];
        const qtyTotalAmount = parseFloat(parcelDetail.reduce((sum, parcel) => sum + (parcel.QTYtotal || 0), 0).toFixed(2));

        setValue('qty_total', qtyTotalAmount);

        console.log("final total", qtyTotalAmount)

        const demurrageDays = watch('demurrage_days') || 0;
        const demurrageCharges = watch('demurrage_charges') || 0;

        const totalDemurrageCharges = (demurrageDays * demurrageCharges) * qtyTotalAmount;
        setValue('total_demurrage_charges', totalDemurrageCharges);
        console.log("total", totalDemurrageCharges)

        const newTotalAmount = parcelDetail.reduce((sum, parcel) => sum + parcel.total_amount, 0);
        const formattedNewTotalAmount = newTotalAmount.toFixed(2);
        setValue('actual_total', formattedNewTotalAmount);
        const totalPrintAmount = watch('parcel_detail').reduce((sum, parcel) => sum + parcel.total_print_rate, 0);

        const blityCharge = parseFloat(watch('bilty_charge').toString());

        const totalCharge = parseFloat(picCharge.toString()) + parseFloat(disCharge.toString());
        setValue('transport_charge', totalCharge);


        const gstAmount = (newTotalAmount + totalCharge) * 0.05;
        setValue('gst_amount', gstAmount.toFixed(2));


        const printGstAmount = (totalPrintAmount + totalCharge) * 0.05;
        setValue('print_gst_amount', printGstAmount.toFixed(2));

        const actualPayableAmount = newTotalAmount + gstAmount + blityCharge + totalDemurrageCharges + totalCharge;
        const printPayableAmount = totalPrintAmount + printGstAmount + blityCharge + totalDemurrageCharges + totalCharge;

        setValue('actual_payable_amount', actualPayableAmount);
        setValue('print_payable_amount', printPayableAmount);




        const actual_paid_amount = watch('actual_paid_amount') || 0;
        const printReceive = watch('print_paid_amount') || 0;


        const actualbalamount = actualPayableAmount - actual_paid_amount;
        const printBalance = printPayableAmount - printReceive;


        setValue('actual_bal_amount', actualbalamount);
        setValue('print_bal_amount', printBalance);





    };

    useEffect(() => {
        fields.forEach((_, index) => {
            const qty = watch(`parcel_detail.${index}.qty`);
            updateTotalDemurrageCharges(qty);
        });
    }, [watch('parcel_detail'), watch('bilty_charge'), watch('demurrage_days'), watch('demurrage_charges')]);





    const handlePaidAmountChange = (amount: number, type: 'actual' | 'print') => {
        const actualPayableAmount = watch('actual_payable_amount');
        const printPayableAmount = watch('print_payable_amount');
        const printReceive = watch('print_paid_amount') || 0;

        if (type === 'actual') {
            const actualbalamount = actualPayableAmount - amount;
            setValue('actual_bal_amount', actualbalamount);
        } else if (type === 'print') {
            const printBalance = printPayableAmount - amount;
            setValue('print_bal_amount', printBalance);
        }
    };
















    const addRow = () => {
        append({ parcel_type: '', weight: 0, qty: 0, rate: 0, total_amount: 0, print_rate: 0, total_print_rate: 0, QTYtotal: 0 });
    };



    const [formError, setFormError] = useState<string>('');

    useEffect(() => {
        if (EwayFields.length === 0) {
            setFormError('At least one product data row is required.');
        } else {
            setFormError('');
        }
    }, [EwayFields]);






    //*************************************************************************************************************************** */
    const [selectedFromStateId, setSelectedFromStateId] = useState<string>('');
    const [selectedToStateId, setSelectedToStateId] = useState<string>('');
    const [fromStates, setFromStates] = useState<State[]>([]);
    const [toStates, setToStates] = useState<State[]>([]);
    const [fromCities, setFromCities] = useState<City[]>([]);
    const [toCities, setToCities] = useState<City[]>([]);
    const [showCustomFromCityInput, setShowCustomFromCityInput] = useState(false);
    const [showCustomToCityInput, setShowCustomToCityInput] = useState(false);
    const [addedFiles, setaddedFiles] = useState<any>([]);

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



    const [files, setFiles] = useState<FileList | null>(null);

    const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFiles(e.target.files);
        }
    };
    const [customFromCityName, setCustomFromCityName] = useState<string>('');
    const [customToCityName, setCustomToCityName] = useState<string>('');

    const onSubmit: SubmitHandler<FormData> = async (formData: FormData) => {
        console.log('form submitted', formData);

        let newFromCityId = formData.book_from;
        let newToCityId = formData.book_to;

        if (formData.book_from === 'tkt_from_other' && selectedFromStateId) {
            const fromCityResponse = await addNewCity(selectedFromStateId, customFromCityName);
            newFromCityId = fromCityResponse.city_id.toString();
        }

        if (formData.book_to === 'tkt_to_other' && selectedToStateId) {
            const toCityResponse = await addNewCity(selectedToStateId, customToCityName);
            newToCityId = toCityResponse.city_id.toString();
        }

        formData.book_from = newFromCityId;
        formData.book_to = newToCityId;

        try {
            const parcelDataResponse = await submitFormData(formData);
            console.log("aaa", parcelDataResponse);

            if (!parcelDataResponse.ok) {
                throw new Error('Failed to create parcel data');
            }

            const parcelData = await parcelDataResponse.json();
            console.log('Created parcel data:', parcelData.parcel_token);
            console.log("datadata", parcelData);

            if (parcelData.status == 1) {
                console.log("formData0", formData);

                if (formData.parcel_imgs.length > 0) {
                    const data = new FormData();

                    data.append("parcel_token", parcelData.parcel_token);

                    for (const file of formData.parcel_imgs) {
                        data.append("parcel_imgs", file);
                    }

                    console.log('FormData prepared:', data);

                    try {
                        const response = await fetch("http://192.168.0.106:3001/parcel/upload_parcel_image", {
                            method: "POST",
                            body: data,
                        });

                        const result = await response.json();
                        console.log('API response:', result);

                        if (result.status === "1") {
                            console.log("Added successfully");

                        } else {
                            console.log("failed to upload");
                        }
                    } catch (error) {
                        console.error("Error:", error);
                        alert("Failed to add record");
                    }
                    if (parcelData.parcel_token != "") {
                        const parcelToken = parcelData.parcel_token;
                        try {
                            const getTDetail = await EditParcelDataList.getEditParcelData(parcelToken);


                            console.log("get data", getTDetail.data[0]);
                            handleParcelPrint(getTDetail.data[0]);
                            router.push("/parcel_list")

                        } catch (error) {

                            console.error('Error fetching parcel data:', error);
                        }

                    };
                } else {
                    if (parcelData.parcel_token != "") {
                        const parcelToken = parcelData.parcel_token;
                        try {
                            const getTDetail = await EditParcelDataList.getEditParcelData(parcelToken);


                            console.log("get data", getTDetail.data[0]);
                            handleParcelPrint(getTDetail.data[0]);
                            router.push("/parcel_list")

                        } catch (error) {

                            console.error('Error fetching parcel data:', error);
                        }

                    };
                    console.log("No images to upload");
                }


            }


        } catch (error) {
            console.error('Error:', error);
        }
    };

    const router = useRouter();


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


    async function submitFormData(formData: FormData) {

        const response = await fetch('http://192.168.0.106:3001/parcel/create_parcel_data', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });

        return response;



        // if(response.status == 1){

        // }
    }

    //-------------------------------------------------------------------------------------------------------------------------------
    const [receipt_no, setReceiptNo] = useState();
    useEffect(() => {
        receiptNo.getRecieptNo()
            .then((res) => {
                console.log('receiptNo.getRecieptNo', res);
                setReceiptNo(res.data);
                setValue('receipt_no', res.data);
            })
            .catch((e) => {
                console.log('Err', e);
            });
        fetchStates(true); // Fetch "From" states
        fetchStates(false); // Fetch "To" states
    }, []);

    //---------------------------------------------------phone validation------------------------------------------------------------
    const [phoneNumber, setPhoneNumber] = useState<string>('');
    const handlePhoneChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const input = event.target.value;
        const sanitizedInput = input.replace(/\D/g, '');
        if (sanitizedInput.length <= 10) {
            setPhoneNumber(sanitizedInput);
        }
    };

    const [senderNo, setSenderNo] = useState<string>('');
    const handleCmpPhoneChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const input = event.target.value;
        const sanitizedInput = input.replace(/\D/g, '');
        if (sanitizedInput.length <= 10) {
            setSenderNo(sanitizedInput);
        }
    };

    const [driverNo, setDriverNo] = useState<string>('');
    const handleDriverPhone = (event: React.ChangeEvent<HTMLInputElement>) => {
        const input = event.target.value;
        const sanitizedInput = input.replace(/\D/g, '');
        if (sanitizedInput.length <= 10) {
            setDriverNo(sanitizedInput);
        }
    };



    //----------------------------------------Radio Button---------------------------------------------------------------------

    const [selectedOption, setSelectedOption] = useState<string | null>();
    const handleOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedOption(event.target.value)
    };

    const [idoption, setIdOption] = useState<string | null>();
    const handleOptionIdChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setIdOption(event.target.value)
    };




    const aadhaarPattern = /^\d{12}$/;
    const panPattern = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    const gstPattern = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[0-9]{1}[A-Z]{1}[0-9A-Z]{1}$/;


    const radioaadhaarPattern = /^\d{12}$/;
    const radiopanPattern = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    const radiogstPattern = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[0-9]{1}[A-Z]{1}[0-9A-Z]{1}$/;




    const [WmobileNoValue, setWMobileNoValue] = useState<string>('');
    const handleWMobileNoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/[^\d]/g, ''); // Remove non-digit characters
        if (value.length <= 10) { // Restrict to 10 digits
            setWMobileNoValue(value);
            setValue("whatsapp_no", value); // Update form value
        }
    };


    //--------------------------------------------------------------------------------------------------------


    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');

    // Handler for payment method change
    const handlePaymentMethodChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
        setSelectedPaymentMethod(event.target.value);
    };


    //------------------------------Client details------------------------------------------------
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
            setMobileNoValue(selectedClient.client_mobileNo); // Update mobileNoValue state
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
        setMobileNoValue('');

    };



























































    return (
        <>

            <div className="container" style={{fontSize:"12px"}}>
                <h3> Parcel Booking</h3>
                <br />

                <Card className='cardbox'>

                    <Card.Body>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            {/* First-Row */}
                            <div className="row mb-3">
                                {/* <div className="col-lg-6 ">
                                    <label className="form-label " htmlFor="receipt_no">Receipt No.</label>
                                    <input {...register("receipt_no")} className="form-control form-control-sm" value={receipt_no} id="receipt_no" type="text" />
                                </div> */}
                                <div className="col-lg-3">
                                    <label className="form-label" htmlFor="to">Booking date</label>
                                    <input {...register('booking_date',
                                        {
                                            required: true
                                        }
                                    )} className="form-control form-control-sm" type="date" id="booking_date" placeholder="Booking date" defaultValue={currentDate} min={currentDate} />

                                </div>
                                <div className="col-lg-3">
                                    <label className="form-label" htmlFor="to">Disptach date</label>
                                    <input {...register('dispatch_date', {
                                        required: true
                                    })} className="form-control form-control-sm" type="date" id="dispatch_date" placeholder="Disptach date" defaultValue={currentDate} min={currentDate} />

                                </div>
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
                                    {/* {errors.from_state?.type === "required" && <span id="show_mobile_err" className="error">This field is required.</span>} */}

                                </div>
                                <div className="col-lg-3">
                                    <label className="form-label" htmlFor="from">From</label>
                                    <select
                                        {...register('book_from', { required: true })}
                                        id="book_from_select"
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
                                    {/* {errors.book_from?.type === "required" && <span id="show_mobile_err" className="error">This field is required.</span>} */}

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
                            </div>

                            {/* second-Row */}
                            <div className='row mb-3'>

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
                                    {/* {errors.to_state?.type === "required" && <span id="show_mobile_err" className="error">This field is required.</span>} */}

                                </div>
                                <div className="col-lg-3">
                                    <label className="form-label" htmlFor="to">To</label>
                                    <select
                                        {...register('book_to', { required: true })}
                                        id="book_to_select"
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
                                    {/* {errors.book_to?.type === "required" && <span id="show_mobile_err" className="error">This field is required.</span>} */}

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
                                <div className="col-lg-3">
                                    <label className="form-label" htmlFor="sender_name">Sender Name</label>
                                    <input {...register('sender_name', {
                                        required: true,
                                    })} className="form-control form-control-sm" type="text" id="sender_name" placeholder="Sender Name" />
                                    {errors.sender_name?.type === "required" && <span id="show_mobile_err" className="error">This field is required.</span>}

                                </div>
                                <div className="col-lg-3">
                                    <label className="form-label" htmlFor="rec_name">Receiver Name</label>
                                    <input {...register('rec_name', {
                                        required: true,
                                    })} className="form-control form-control-sm" type="text" id="rec_name" placeholder="Rec. Name" />
                                    {errors.rec_name?.type === "required" && <span id="show_mobile_err" className="error">This field is required.</span>}

                                </div>
                            </div>
                            {/* Third-Row */}
                            {/* <div className="row mb-3">
                                <div className="col-lg-6">
                                    <label className="form-label" htmlFor="sender_name">Sender Name</label>
                                    <input {...register('sender_name', {
                                        required: true,
                                    })} className="form-control form-control-sm" type="text" id="sender_name" placeholder="Sender Name" />
                                </div>
                                <div className="col-lg-6">
                                    <label className="form-label" htmlFor="rec_name">Receiver Name</label>
                                    <input {...register('rec_name', {
                                        required: true,
                                    })} className="form-control form-control-sm" type="text" id="rec_name" placeholder="Rec. Name" />
                                </div>
                            </div> */}
                            {/* Fourth-Row */}
                            <div className="row mb-3">
                                <div className="col-lg-4">
                                    <label className="form-label" htmlFor="send_mob">Sender Mobile No.</label>
                                    <input type="number"
                                        {...register("send_mob", {
                                            required: true,
                                            minLength: 10,


                                        })} value={senderNo}
                                        onChange={handleCmpPhoneChange} className="form-control form-control-sm" name="send_mob" id="send_mob" placeholder="Enter Company Mobile No" />
                                    {errors.send_mob?.type === "required" && <span id="show_mobile_err" className="error">Enter 10 Digits Mobile Number.</span>}
                                    {errors?.send_mob?.type === "minLength" && <span id="show_mobile_err" className="error">Enter 10 Digits Mobile Number.</span>}                                    <span id="send_mobile_err" ></span>
                                </div>
                                <div className="col-lg-4">
                                    <label className="form-label" htmlFor="rec_mob">Receiver Mobile No.</label>
                                    <input type="number"
                                        {...register("rec_mob", {
                                            required: true,
                                            minLength: 10,


                                        })}
                                        className="form-control form-control-sm" value={phoneNumber}
                                        onChange={handlePhoneChange} name="rec_mob" id="rec_mob" placeholder="Enter Mobile No" />
                                    {errors.rec_mob?.type === "required" && <span id="show_mobile_err" className="error">Enter 10 Digits Mobile Number.</span>}
                                    {errors?.rec_mob?.type === "minLength" && <span id="show_mobile_err" className="error">Enter 10 Digits Mobile Number.</span>}

                                    <span id="rec_mobile_err" ></span>
                                </div>



                                <div className="col-lg-4">
                                    <label className="form-label" style={{ appearance: "textfield" }} htmlFor="mobile">Whatsapp No</label>
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
                                        className={`form-control form-control-sm ${errors.whatsapp_no ? 'is-invalid' : ''}`}
                                        id="whatsapp_no"

                                        placeholder="Enter Mobile No"
                                    />
                                    {errors?.whatsapp_no?.type === "required" && <span className="error">Enter 10 Digits Mobile Number.</span>}
                                    {errors?.whatsapp_no?.type === "minLength" && <span className="error">Enter 10 Digits Mobile Number.</span>}
                                    {errors?.whatsapp_no?.type === "pattern" && <span className="error">Enter numeric characters only.</span>}

                                </div>

                            </div>






                            {/* 
                            <div className="row mt-4">
                                <div className="col-md-12">
      <h6>Client Details:</h6>                                </div>
                                <hr />
                            </div> */}
                            {/* <div className="row mb-3">



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
                                <div className="col-lg-3">
                                    <label className="form-label" htmlFor="email">Email-id</label>
                                    <input
                                        {...register("email", { required: true })}
                                        type="email"
                                        className="form-control form-control-sm"
                                        placeholder="Enter your email"
                                    />
                                    {errors?.email?.type === "required" && <span className="error">This field is required</span>}

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



                            </div>
 */}

























                            {/* Fifth-Row */}
                            <div className="row mb-3">
                                <div className="col-lg-6">
                                    <label className="form-label" htmlFor="send_mob">Select Sender ID Proof Type</label>&nbsp;
                                    <br />
                                    <div className="d-flex gap-2">

                                        <input
                                            {...register('sender_proof_type', { required: true })}
                                            type="radio"
                                            checked={selectedOption === 'Aadhar_no'}
                                            onChange={handleOptionChange}
                                            value="Aadhar_no"
                                        /> Aadhar
                                        <input
                                            {...register('sender_proof_type')}
                                            type="radio"
                                            checked={selectedOption === 'Pan_no'}
                                            onChange={handleOptionChange}
                                            value="Pan_no"
                                        /> PAN
                                        <input
                                            {...register('sender_proof_type')}
                                            type="radio"
                                            checked={selectedOption === 'Gst_no'}
                                            onChange={handleOptionChange}
                                            value="Gst_no"
                                        /> GST
                                        <input
                                            {...register('sender_proof_type')}
                                            type="radio"
                                            checked={selectedOption === 'Other'}
                                            onChange={handleOptionChange}
                                            value="Other"
                                        /> Other
                                    </div>
                                </div>
                                <div className="col-lg-6">
                                    <label className="form-label" htmlFor="rec_mob">Select Receiver ID Proof Type</label>&nbsp;
                                    <br />
                                    <div className="d-flex gap-2">

                                        <input
                                            {...register('reciver_proof_type', { required: true })}
                                            type="radio"
                                            checked={idoption === 'Aadhar_no'}
                                            onChange={handleOptionIdChange}
                                            value="Aadhar_no"
                                        /> Aadhar
                                        <input
                                            {...register('reciver_proof_type')}
                                            type="radio"
                                            checked={idoption === 'Pan_no'}
                                            onChange={handleOptionIdChange}
                                            value="Pan_no"
                                        /> PAN
                                        <input
                                            {...register('reciver_proof_type')}
                                            type="radio"
                                            checked={idoption === 'Gst_no'}
                                            onChange={handleOptionIdChange}
                                            value="Gst_no"
                                        /> GST
                                        <input
                                            {...register('reciver_proof_type')}
                                            type="radio"
                                            checked={idoption === 'Other'}
                                            onChange={handleOptionIdChange}
                                            value="Other"
                                        /> Other
                                    </div>
                                </div>
                            </div>

                            <div className="row mb-3">
                                <div className="col-lg-6">
                                    <label className="form-label" htmlFor="send_mob">Sender Adhar No./PAN No./GST No.</label>
                                    <input
                                        {...register('sender_proof_detail', {
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
                                        name="sender_proof_detail"
                                        placeholder="Enter Sender ID Proof Detail"
                                    />
                                    {errors.sender_proof_detail && <span className='error'>{errors.sender_proof_detail.message}</span>}
                                </div>
                                <div className="col-lg-6">
                                    <label className="form-label" htmlFor="rec_mob">Receiver Adhar No./PAN No./GST No.</label>
                                    <input
                                        {...register('reciver_proof_detail', {
                                            required: idoption === 'Aadhar_no' ? 'Aadhaar number is required' :
                                                idoption === 'Pan_no' ? 'PAN number is required' :
                                                    idoption === 'Gst_no' ? 'GST number is required' :
                                                        idoption === 'Other' ? false : false,
                                            pattern: {
                                                value: idoption === 'Aadhar_no' ? radioaadhaarPattern : idoption === 'Pan_no' ? radiopanPattern : radiogstPattern,

                                                message: idoption === 'Aadhar_no' ? 'Invalid Aadhaar number format' : idoption === 'Pan_no' ? 'Invalid PAN number format' : idoption === 'Gst_no' ? 'Invalid GST number format ' : ''


                                            }
                                        })}
                                        className="form-control form-control-sm"
                                        type="text"
                                        name="reciver_proof_detail"
                                        placeholder="Enter Receiver ID Proof Detail"
                                    />
                                    {errors.reciver_proof_detail?.type === "required" && <span id="show_mobile_err" className="error">This field is required.</span>}
                                    {errors.reciver_proof_detail && <span className='error'>{errors.reciver_proof_detail.message}</span>}
                                </div>
                            </div>


                            {/* --------------*/}
                            <div className="row mb-3">
                                <div className="col-lg-6">
                                    <label className="form-label" htmlFor="send_add">Sender Address</label>
                                    <textarea {...register('send_add')} className="form-control form-control-sm" name="send_add" id="send_add" placeholder="Address"></textarea>
                                </div>
                                <div className="col-lg-6">
                                    <label className="form-label" htmlFor="ex_rate">Receiver Address</label>
                                    <textarea {...register('rec_add')} className="form-control form-control-sm" name="rec_add" id="rec_add" placeholder="Address"></textarea>
                                </div>
                            </div>




                            {/* parcel-data */}
                            {fields.map((field, index) => (
                                <div className="row mb-3" key={field.id}>
                                    <div className="col-lg-2">
                                        <label className="form-label" htmlFor={`select_type_${index}`}>Select Type</label>
                                        <select {...register(`parcel_detail.${index}.parcel_type`)} className="form-control" id={`select_type_${index}`}>
                                            <option value="">--Select--</option>
                                            <option value="box">Box</option>
                                            <option value="loose">Loose</option>
                                            <option value="wrape">Wrape</option>
                                            <option value="bag">Bag</option>
                                            <option value="drum">Drum</option>
                                            <option value="other">Other</option>
                                        </select>
                                    </div>
                                    <div className="col-lg-1">
                                        <label className="form-label">Weight</label>
                                        <input className="form-control form-control-sm" type="number" {...register(`parcel_detail.${index}.weight`, {
                                            required: true,
                                        })}
                                            value={watch(`parcel_detail.${index}.weight`) > 0 ? watch(`parcel_detail.${index}.weight`) : ''} placeholder="Weight" />
                                    </div>
                                    <div className="col-lg-1">
                                        <label className="form-label">Qty</label>
                                        <input className="form-control form-control-sm qty_cnt"
                                            type="number" {...register(`parcel_detail.${index}.qty`, {
                                                required: true,
                                            })}
                                            value={watch(`parcel_detail.${index}.qty`) > 0 ? watch(`parcel_detail.${index}.qty`) : ''}
                                            onChange={(e) => handleQtyChange(index, parseInt(e.target.value))}
                                            placeholder="Qty" />
                                    </div>
                                    <div className="col-lg-1">
                                        <label className="form-label">Rate</label>
                                        <input className="form-control form-control-sm" type="number" {...register(`parcel_detail.${index}.rate`,
                                            {
                                                required: true
                                            }
                                        )}

                                            onChange={(e) => handleRateChange(index, parseFloat(e.target.value))}
                                            value={watch(`parcel_detail.${index}.rate`) > 0 ? watch(`parcel_detail.${index}.rate`) : ''}
                                            placeholder="Rate" />
                                    </div>
                                    <div className="col-lg-2">
                                        <label className="form-label">Total</label>
                                        <input className="form-control form-control-sm" disabled type="number" {...register(`parcel_detail.${index}.total_amount`)}
                                            value={watch(`parcel_detail.${index}.total_amount`) > 0 ? watch(`parcel_detail.${index}.total_amount`) : ''} placeholder="Total Amount" />
                                    </div>

                                    <div className="col-lg-2" style={{ display: "none" }}>
                                        <label className="form-label">qtyTotal</label>
                                        <input className="form-control form-control-sm" disabled type="hidden" {...register(`parcel_detail.${index}.QTYtotal`)}
                                            value={watch(`parcel_detail.${index}.QTYtotal`) > 0 ? watch(`parcel_detail.${index}.QTYtotal`) : ''} placeholder="Total Amount" />
                                    </div>
                                    <div className="col-lg-2">
                                        <label className="form-label">Print Rate</label>
                                        <input className="form-control form-control-sm" type="number" {...register(`parcel_detail.${index}.print_rate`)}
                                            value={watch(`parcel_detail.${index}.print_rate`) > 0 ? watch(`parcel_detail.${index}.print_rate`) : ''}

                                            onChange={(e) => handlePrintRateChange(index, parseInt(e.target.value))}
                                            placeholder="Print Rate" />
                                    </div>
                                    <div className="col-lg-2">
                                        <label className="form-label">Print Total</label>
                                        <input className="form-control form-control-sm" disabled type="number" {...register(`parcel_detail.${index}.total_print_rate`)}
                                            onChange={(e) => handlePrintRateChange(index, parseInt(e.target.value))}
                                            value={watch(`parcel_detail.${index}.total_print_rate`) > 0 ? watch(`parcel_detail.${index}.total_print_rate`) : ''}
                                            placeholder="Total Print Amount" />
                                    </div>
                                    <div className="col-lg-1 new" style={{ padding: '10px' }}>
                                        {index > 0 && (
                                            <button type="button" className="btn btn-danger btn-sm" onClick={() => remove(index)}>
                                                <FontAwesomeIcon icon={faMinusCircle} />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                            <div className="col-lg-12 data">
                                <button type="button" style={{ marginRight: '52px' }} onClick={addRow} className="btn btn-primary btn-sm add_more_row">
                                    <FontAwesomeIcon icon={faPlusCircle} />
                                </button>
                            </div>



                            {formError && <p className="text-danger">{formError}</p>}


                            {/* Bill-details */}
                            {EwayFields.map((field, index) => (
                                <div key={field.id} className="row" id="bill_row_1">
                                    <div className="col-lg-3">
                                        <label className="form-label" htmlFor="st_no">E Way Bill No.</label>
                                        <input     {...register(`bill_detail.${index}.e_way_bill_no`)} className="form-control form-control-sm" type="text" id="eWayBill_1" placeholder="E Way Bill No" />
                                    </div>

                                    <div className="col-lg-3">
                                        <label className="form-label" htmlFor="st_no">P.O. No.</label>
                                        <input {...register(`bill_detail.${index}.p_o_no`)} className="form-control form-control-sm" type="text" id="p_o_no_1" placeholder="P.O. No." />
                                    </div>

                                    <div className="col-lg-2">
                                        <label className="form-label" htmlFor="st_no">Invoice No.</label>
                                        <input   {...register(`bill_detail.${index}.invoice_no`)} className="form-control form-control-sm" type="text" id="invoice_no_1" placeholder="Invoice No." />
                                    </div>
                                    <div className="col-lg-2">
                                        <label className="form-label" htmlFor="st_no">Invoice Amount</label>
                                        <input {...register(`bill_detail.${index}.invoice_amount`)} className="form-control form-control-sm" type="text" id="invoice_amount_1" placeholder="Invoice Amount" />
                                    </div>
                                    <div className="col-lg-1 new" style={{ padding: "10px", marginTop: "20px" }}>

                                        <button type='button' className="btn btn-danger btn-sm" onClick={() => removeEwayAddress(index)} ><FontAwesomeIcon icon={faMinusCircle} /></button>
                                    </div>


                                </div>))}
                            {/* ---Add bill details---- */}
                            <div className="col-lg-12 data" >

                                <button type='button' style={{ marginRight: "12.60%", }}

                                    onClick={() => appendEwayAddress({ e_way_bill_no: '', p_o_no: '', invoice_no: '', invoice_amount: '' })} className="btn btn-primary  btn-sm add_more_row"><FontAwesomeIcon icon={faPlusCircle} /></button>

                            </div>






                            {/* ---checkbox--- */}
                            <div className="row mb-3">
                                <div className="col-lg-6">
                                    <label className="form-label" htmlFor="particulars">Particulars</label>
                                    <textarea {...register('particulars')} className="form-control form-control-sm" name="particulars" id="particulars" placeholder="Particulars"></textarea>

                                </div>
                                <div className="col-lg-6">
                                    <label className="form-label" htmlFor="particulars">Is Delivery</label><br />
                                    <input type="checkbox"  {...register('is_delivery')} /> ADD PICKUP / DELIVERY DETAIL

                                </div>
                            </div>

                            <div className="row mb-3">
                                <div className="col-lg-6">
                                    <label className="form-label" htmlFor="particulars">Image Upload</label>
                                    <input className="form-control form-control-sm" type="file" {...register("parcel_imgs")} multiple />

                                </div>

                            </div>




                            {/* ---checkbox visibility--- */}
                            {is_delivery && <div id="showDeliveryDetail">
                                <div className="row mt-4">
                                    <div className="col-md-12">
                                        <h5>Pickup Detail</h5>
                                    </div>
                                    <hr />
                                </div>
                                <div className="row">
                                    <div className="col-md-4">
                                        <label className="form-label">Delivery Type</label>
                                        <select
                                            className="form-control form-control-sm"
                                            id="pic_delivery_type"
                                            {...register("pic_delivery_type")}
                                        >
                                            <option value="">--Select--</option>
                                            <option value="1">Office</option>
                                            <option value="2">Client Location</option>
                                        </select>
                                    </div>
                                    <div className="col-md-4">
                                        <label className="form-label">Pickup Charge</label>
                                        <input
                                            type="number"
                                            id="pic_charge"
                                            className="form-control form-control-sm"
                                            placeholder="Enter Pickup Charge"
                                            {...register("pic_charge")}

                                            value={watch('pic_charge') > 0 ? watch('pic_charge') : ''}
                                        />
                                    </div>
                                </div>
                                <br />

                                {deliveryType === "2" && (
                                    <div id="pickup_client_detail">
                                        {picAddressFields.map((field, index) => (
                                            <div key={field.id} id="show_edit_pic_row_">
                                                <div className="row mt-3">
                                                    <div className="col-md-4">
                                                        <textarea
                                                            className="form-control form-control-sm"
                                                            placeholder="Client Address"
                                                            {...register(`pic_address.${index}.pickup_client_address`)}
                                                        ></textarea>
                                                    </div>
                                                    <div className="col-md-4">
                                                        <textarea
                                                            className="form-control form-control-sm"
                                                            placeholder="Office Address"
                                                            {...register(`pic_address.${index}.pickup_office_address`)}
                                                        ></textarea>
                                                    </div>
                                                    <div className="col-lg-1" style={{ padding: '10px' }}>
                                                        {index > 0 && (
                                                            <button type="button"
                                                                className="btn btn-danger remove_pickup_row"
                                                                onClick={() => removePicAddress(index)}>
                                                                <FontAwesomeIcon icon={faMinusCircle} />
                                                            </button>
                                                        )}
                                                    </div>
                                                    <div className="col-md" style={{ marginTop: "8px" }}>
                                                        <button
                                                            type="button"
                                                            className="btn btn-primary add_more_pickup_row"
                                                            onClick={() => appendPicAddress({ pickup_client_address: '', pickup_office_address: '' })}
                                                        >
                                                            <FontAwesomeIcon icon={faPlusCircle} />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}


                                {deliveryType === "1" && (
                                    <div id="pickup_office_detail">
                                        <div className="row">
                                            <div className="col-md-4">
                                                <label className="form-label">Office Detail</label>
                                                <textarea
                                                    {...register("pic_office_detail")}
                                                    className="form-control form-control-sm"
                                                    placeholder="Office Detail"
                                                ></textarea>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                <br />

                                <div className="row">
                                    <div className="col-md-12">
                                        <h5>Dispatch Detail</h5>
                                    </div>
                                    <hr />
                                </div>

                                <div className="row">
                                    <div className="col-md-4">
                                        <label className="form-label">Delivery Type</label>
                                        <select
                                            className="form-control form-control-sm"
                                            id="dis_delivery_type"
                                            {...register("dis_delivery_type")}
                                        >
                                            <option value="">--Select--</option>
                                            <option value="1">Office</option>
                                            <option value="2">Client Location</option>
                                        </select>
                                    </div>
                                    <div className="col-md-4">
                                        <label className="form-label">Dispatch Charge</label>
                                        <input
                                            type="number"
                                            id="dis_charge"
                                            className="form-control form-control-sm"
                                            placeholder="Enter dispatch Charge"
                                            {...register("dis_charge")}
                                            value={watch('dis_charge') > 0 ? watch('dis_charge') : ''}

                                        />
                                    </div>
                                </div>
                                <br />

                                {deliveryTypedispatch === "2" && (
                                    <div id="dispatch_client_detail">
                                        {disAddressFields.map((field, index) => (
                                            <div key={field.id} id="show_edit_pic_row_">
                                                <div className="row mt-3">
                                                    <div className="col-md-4">
                                                        <textarea
                                                            className="form-control form-control-sm"
                                                            placeholder="Client Address"
                                                            {...register(`dis_address.${index}.dispatch_client_address`)}
                                                        ></textarea>
                                                    </div>
                                                    <div className="col-md-4">
                                                        <textarea
                                                            className="form-control form-control-sm"
                                                            placeholder="Office Address"
                                                            {...register(`dis_address.${index}.dispatch_office_address`)}
                                                        ></textarea>
                                                    </div>
                                                    <div className="col-lg-1" style={{ padding: '10px' }}>
                                                        {index > 0 && (
                                                            <button type="button"
                                                                className="btn btn-danger remove_pickup_row"
                                                                onClick={() => removeDisAddress(index)}>
                                                                <FontAwesomeIcon icon={faMinusCircle} />
                                                            </button>
                                                        )}
                                                    </div>
                                                    <div className="col-md" style={{ marginTop: "8px" }}>
                                                        <button
                                                            type="button"
                                                            className="btn btn-primary add_more_pickup_row"
                                                            onClick={() => appendDisAddress({ dispatch_client_address: '', dispatch_office_address: '' })}
                                                        >
                                                            <FontAwesomeIcon icon={faPlusCircle} />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {deliveryTypedispatch === "1" && (
                                    <div id="dispatch_office_detail" >
                                        <div className="row">
                                            <div className="col-md-4">
                                                <label className="form-label">Office Detail</label>
                                                <textarea
                                                    {...register("dis_office_detail")}
                                                    className="form-control form-control-sm"
                                                    placeholder="Office Detail"
                                                ></textarea>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <br />


                                <div className="row">
                                    <div className="col-md-12">
                                        <h5>Add Delivery Detail</h5>

                                    </div>
                                    <hr />
                                </div>
                                <div className="row">
                                    <div className="col-md-3">
                                        <label className="form-label">LR No.</label>
                                        <input {...register('lr_no')}

                                            type="text" className="form-control form-control-sm" placeholder="LR No." />
                                    </div>
                                    <div className="col-md-3">
                                        <label className="form-label">Bus No.</label>
                                        <input {...register('bus_no')} type="text" name="bus_no" className="form-control form-control-sm" placeholder="Bus No." />
                                    </div>
                                    <div className="col-md-3">
                                        <label className="form-label">Driver Phone No.</label>
                                        <input {...register('driver_no',
                                            {

                                                minLength: 10,
                                                pattern: /^[0-9]+$/
                                            }
                                        )} type="number" value={driverNo} onChange={handleDriverPhone} className="form-control form-control-sm" placeholder="Phone No." />
                                        {errors.driver_no?.type === "required" && <span id="show_mobile_err" className="error">Enter 10 Digits Mobile Number.</span>}
                                        {errors?.driver_no?.type === "minLength" && <span id="show_mobile_err" className="error">Enter 10 Digits Mobile Number.</span>}
                                    </div>
                                    <div className="col-md-3">
                                        <label className="form-label">Transport Charge</label>
                                        <input {...register('transport_charge')} type="number" id="transport_charge" className="form-control form-control-sm" placeholder="Transport Charge" />
                                    </div>
                                </div>


                            </div>}


                            {/* ---Payment Details--- */}
                            <div className="row mt-4">
                                <div className="col-md-12">
                                    <h5>Payment Detail</h5>

                                </div>
                                <hr />
                            </div>
                            <div className="row mb-3">

                                <div className="col-lg-3">
                                    <label className="form-label" htmlFor="total">Payment Method</label>

                                    <select {...register('payment_method')}
                                        value={selectedPaymentMethod}
                                        onChange={handlePaymentMethodChange}
                                        className="form-control" name="payment_method" id="payment_method">
                                        <option value="">--Select-</option>
                                        <option value="cash">Cash</option>
                                        <option value="transfer">Transfer</option>
                                        <option value="pending">Pending</option>
                                        <option value="gpay">G-pay</option>
                                        <option value="phonepay">PhonePay</option>
                                        <option value="paytm">Paytm</option>
                                        <option value="credit">Credit</option>
                                    </select>
                                    {/* Conditionally render the transaction ID input field */}
                                    {(selectedPaymentMethod === 'gpay' || selectedPaymentMethod === 'phonepay' || selectedPaymentMethod === 'paytm') && (
                                        <div className="mt-2">
                                            <label className="form-label">Transaction ID</label>
                                            <input
                                                {...register('transection_id')}
                                                type="text"
                                                className="form-control"
                                                placeholder="Enter transaction ID"
                                            // Use appropriate handler or register here if using form libraries
                                            />
                                        </div>
                                    )}

                                </div>
                                <div className="col-lg-2">
                                    <label className="form-label" htmlFor="total">Actual Final Total</label>
                                    <input
                                        {...register('actual_total')}
                                        className="form-control-plaintext"
                                        type="number"
                                        value={watch('actual_total')}
                                        readOnly
                                    />
                                </div>
                                <div className="col-lg-2" style={{ display: "none" }}>
                                    <label className="form-label" htmlFor="total"> Final Total</label>
                                    <input
                                        {...register('qty_total')}
                                        className="form-control-plaintext"
                                        type="hidden"
                                        value={watch('qty_total')}
                                        readOnly
                                    />
                                </div>
                                <div className="col-lg-3">
                                    <label className="form-label" htmlFor="total">Print Final Total</label>
                                    <input {...register('print_total')} className="form-control-plaintext" readOnly type="number" id="final_print_total_parcel_booking" placeholder="Enter Print Total" />
                                </div>
                                <div className="col-lg-2">
                                    <label className="form-label">Actual GST 5%</label>
                                    <input  {...register('gst_amount')}
                                        value={watch('gst_amount')}
                                        type="text" id="total_gst_show" className="form-control-plaintext" />
                                    <input type="hidden" name="gst_amount" id="total_gst" className="form-control" />

                                </div>
                                <div className="col-lg-2">
                                    <label className="form-label">Print GST 5%</label>
                                    <input {...register('print_gst_amount')}
                                        value={watch('print_gst_amount')}
                                        type="text" id="print_total_gst_show" className="form-control-plaintext" />
                                    <input type="hidden" name="print_gst_amount" id="print_total_gst" className="form-control" />

                                </div>
                            </div>
                            <div className="row mb-3">
                                <div className="col-md-2">
                                    <label className="form-label">Bilty Charges</label>
                                    <input {...register('bilty_charge')}
                                        className="form-control" type="number" id="bilty_charge" placeholder="Blity Charge" />
                                </div>

                                <div className="col-md-3">
                                    <label className="form-label">Is Demurrage Charges ?</label><br />
                                    <input {...register('is_demurrage', {
                                        required: true
                                    })} type="checkbox"
                                        id="is_demurrage" />&nbsp;
                                    {errors?.is_demurrage?.type === "required" && <span id="show_mobile_err" className="error">This field is required.</span>}

                                </div>

                                <div className="col-lg-3">
                                    <label className="form-label" htmlFor="receive">Actual Payable Amount</label>
                                    <input {...register('actual_payable_amount')}

                                        className="form-control-plaintext" type="number" id="actual_payable_amount" />
                                    <input className="form-control-plaintext" type="hidden" id="actual_payable_amount" placeholder="Enter Balance" />

                                </div>
                                <div className="col-lg-3">
                                    <label className="form-label" htmlFor="receive">Print Payable Amount</label>


                                    <input {...register('print_payable_amount')}
                                        className="form-control-plaintext" type="number" id="print_payable_amount" />
                                </div>

                            </div>

                            {is_demurrage && <div className="row mb-3">

                                <div className="col-md-3">
                                    <label className="form-label">Demurrage Charges</label>
                                    <input  {...register('demurrage_charges')}

                                        type="number" id="demurrage_charges" className="form-control" defaultValue="10" />
                                </div>

                                <div className="col-md-3">
                                    <label className="form-label">Demurrage Days</label>
                                    <input  {...register('demurrage_days')} type="number" id="demurrage_days" className="form-control" placeholder="Enter days" />
                                </div>
                                <div className="col-md-3">
                                    <label className="form-label">Total Demurrage Charges</label>
                                    <input   {...register('total_demurrage_charges')} type="text" id="total_demurrage_charge" className="form-control-plaintext" />
                                </div>
                            </div>}


                            <div className="row mb-3">
                                <div className="col-lg-3">
                                    <label className="form-label" htmlFor="receive">Actual Paid Amount</label>
                                    <input  {...register('actual_paid_amount')} onChange={(e) => handlePaidAmountChange(parseFloat(e.target.value), 'actual')}

                                        className="form-control form-control-sm" type="number" id="parcel_receive" placeholder="Enter Received" />
                                </div>
                                <div className="col-lg-3">
                                    <label className="form-label" htmlFor="receive">Print Paid Amount</label>
                                    <input  {...register('print_paid_amount')} onChange={(e) => handlePaidAmountChange(parseFloat(e.target.value), 'print')} className="form-control form-control-sm" type="number" id="print_parcel_receive" placeholder="Enter Received" />
                                </div>
                                <div className="col-lg-3">
                                    <label className="form-label" htmlFor="balance">Actual Balance Amount</label>
                                    <input  {...register('actual_bal_amount')} className="form-control-plaintext" type="number" id="parcel_balance_show" readOnly placeholder="Enter Balance" />

                                    <input className="form-control-plaintext" type="hidden" id="parcel_balance" placeholder="Enter Balance" />

                                </div>
                                <div className="col-lg-3">
                                    <label className="form-label" htmlFor="balance">Print Balance Amount</label>
                                    <input {...register('print_bal_amount')} className="form-control-plaintext" type="number" readOnly id="print_parcel_balance_show" placeholder="Enter Balance" />

                                    <input className="form-control-plaintext" value="20" type="hidden" id="print_parcel_balance" placeholder="Enter Balance" />

                                </div>
                            </div>

                             <div className="row">
                                <div className="text-center">
                                    <input className="btn btn-success btn-sm" type="submit" id="save_ticket" name="save_form" />
                                </div>
                            </div>
                        </form>

                    </Card.Body>

                </Card>





            </div >
           

            <Footer />
        </>
    )
}

export default ParcelBook