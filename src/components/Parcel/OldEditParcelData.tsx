"use client"

import { Card } from 'react-bootstrap'
import { useForm, useFieldArray, SubmitHandler } from 'react-hook-form';
import axios from 'axios';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { faMinusCircle } from '@fortawesome/free-solid-svg-icons';
import StateList from '@/app/Api/StateList';
import CityList from '@/app/Api/CityList';
import receiptNo from '@/app/Api/receiptNo';
import { useEffect, useState } from 'react';
import EditParcelDataList from '@/app/Api/EditParcelDataList';

import { useRouter } from 'next/navigation';
import handleParcelPrint from '@/app/parcel_list/parcel_data/printpparcelUtils';
import UpdateParcelPrint from '@/app/parcel_list/parcel_data/EditParcelprint';
import Link from 'next/link';


type FormData = {
    parcel_id: string;
    is_delivery: boolean;
    particulars: string;
    qty_total: number;
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
    whatsapp_no: any;
    sender_proof_type: string;
    reciver_proof_type: string;
    sender_proof_detail: string;
    reciver_proof_detail: string
    pic_delivery_type: string;
    pic_charge: number;

    pic_office_detail: string;
    actual_paid_amount: number;
    dis_delivery_type: string;
    dis_charge: number;
    bus_no: string;
    driver_no: string;
    transport_charge: string;
    dis_office_detail: string;
    from_state: string,
    to_state: string,
    book_to: string,
    last_updated_by: any;
    user_id: any;

    pic_address: {
        pickup_client_address: string;
        pickup_office_address: string;
    }[];
    dis_address: {
        dispatch_client_address: string;
        dispatch_office_address: string;
    }[];
    payment_method: string;
    actual_total: number;
    print_total: number;
    gst_amount: number;
    print_gst_amount: number;
    bilty_charge: number;
    is_demurrage: boolean;
    actual_payable_amount: number;
    print_payable_amount: number;
    lr_no: number
    print_paid_amount: number;
    actual_bal_amount: number;
    print_bal_amount: number;
    total_demurrage_charges: number;
    demurrage_days: number;
    demurrage_charges: number;
    parcel_detail: ParcelDetail[];
    bill_detail: ParcelBillDetail[];
    parcel_imgs: any;
    remove_files: any;
    transection_id: any;

};

interface ParcelBillDetail {
    id: number;
    e_way_bill_no: string;
    p_o_no: string;
    invoice_no: string;
    invoice_amount: string;
}

interface ParcelDetail {
    id: number;
    parcel_type: string;
    weight: number;
    qty: number;
    rate: number;
    total_amount: number;
    print_rate: number;
    total_print_rate: number;
    QTYtotal: number;
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


const EditParcelData = () => {


    const [parcelImages, setParcelImages] = useState<string[]>([]);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);



    const [parcelData, setParcelData] = useState<any>("");
    const [parcelDetail, setparcelDetail] = useState<ParcelDetail[]>([]);
    const [error, setError] = useState<string>('');
    const [EwayFields, setEwayFields] = useState<ParcelBillDetail[]>([]);
    const [addressFields, setAddressFields] = useState<{
        pic_address: {
            pickup_client_address: string;
            pickup_office_address: string;
        }[];
        dis_address: {
            dispatch_client_address: string;
            dispatch_office_address: string;
        }[];
    }>({
        pic_address: [],
        dis_address: [],
    });

    useEffect(() => {

        const fetchData = async () => {
            fetchStates(true);
            fetchStates(false);
            try {
                const ticketToken = new URLSearchParams(window.location.search).get("token");
                if (ticketToken) {

                    const response = await EditParcelDataList.getEditParcelData(ticketToken);
                    if (response.data && response.data.length > 0) {


                        const fetchedBillDetail = response.data[0].parcel_bill_detail;
                        console.log("BILLDetail", response.data[0].parcel_bill_detail);

                        if (fetchedBillDetail) {
                            setEwayFields([...fetchedBillDetail]); // Populate EwayFields with fetched data
                        } else {
                            setError('No parcel bill details found.');
                        }
                        // Filter delivery details based on del_type
                        const picAddresses = response.data[0].delivery_detail
                            .filter((detail: any) => detail.del_type === 1)
                            .map((detail: any) => ({
                                parcel_id: detail.parcel_id || '',
                                pickup_client_address: detail.pic_start_point || '',
                                pickup_office_address: detail.pic_end_point || '',
                            }));
                        const disAddresses = response.data[0].delivery_detail
                            .filter((detail: any) => detail.del_type === 2)
                            .map((detail: any) => ({
                                parcel_id: detail.parcel_id || '',
                                dispatch_client_address: detail.dis_start_point || '',
                                dispatch_office_address: detail.dis_end_point || '',
                            }));

                        setAddressFields({
                            pic_address: picAddresses,
                            dis_address: disAddresses,

                        });

                        const fetchedParcelImages = response.data[0]?.parcel_imgs || [];
                        setParcelImages(fetchedParcelImages);

                        const fetchedParcelDetail = response.data[0]?.parcel_detail;
                        if (fetchedParcelDetail) {
                            const transformedParcelDetail: ParcelDetail[] = fetchedParcelDetail.map((item: any, index: number) => ({
                                id: index + 1,
                                parcel_type: item.parcel_type || '',
                                weight: Number(item.weight) || 0,
                                qty: Number(item.qty) || 0,
                                rate: Number(item.rate) || 0,
                                print_rate: Number(item.print_rate) || 0,
                                total_amount: Number(item.total_rate) || 0,
                                total_print_rate: Number(item.total_print_rate) || 0
                            }));
                            setparcelDetail(transformedParcelDetail);
                        } else {
                            setError('No parcel details found.');
                        }
                        // Assuming parcel_bill_detail is an array in your response


                        setError('');
                    }





                    else {
                        setError('No data found for this ticket token.');
                    }





                }

                else {


                    setparcelDetail([]); // Clear parcel data if no token is present
                    setError('Ticket token not found.');
                }
            } catch (error) {
                setError('Error fetching ticket data. Please try again later.');
                console.error('Error fetching ticket data:', error);
            }
        };

        const handleURLChange = () => {
            const urlParams = new URLSearchParams(window.location.search);
            const ticketToken = urlParams.get("token");
            if (ticketToken) {
                getTicketDetail(ticketToken);
            } else {
                setParcelData(null);
            }
        };

        // Initial fetch
        fetchData();

        // Event listener for URL change
        window.addEventListener('popstate', handleURLChange);
        handleURLChange();

        // Clean up event listener
        return () => {
            window.removeEventListener('popstate', handleURLChange);
        };
    }, []);




    const getTicketDetail = async (ticketToken: string) => {
        try {
            const getTDetail = await EditParcelDataList.getEditParcelData(ticketToken);
            const { from_state, book_from, to_state, book_to } = getTDetail.data[0];
            setSelectedFromStateId(from_state);
            setSelectedToStateId(to_state);
            fetchCities(from_state, true);
            fetchCities(to_state, false);
            setParcelData(getTDetail.data[0]);
            setError("");
            console.log("fgdjg", getTDetail);


        } catch (error) {
            setError("Error fetching ticket data. Please try again later.");
            console.error("Error fetching ticket data:", error);
        }
    };



    const storedData = localStorage.getItem('userData');


    //---------------------------------------------------------------------------------------------------------------------------------------

    const { register, control, handleSubmit, formState: { errors }, watch, setValue } = useForm<FormData>(
        {
            defaultValues: {
                parcel_id: parcelData.id || '',
                particulars: '',

                receipt_no: '',
                actual_total: 0,
                sender_name: '',
                rec_name: '',
                send_mob: '',
                rec_mob: '',
                send_add: '',
                rec_add: '',
                sender_proof_type: '',
                reciver_proof_type: '',
                pic_delivery_type: '',
                pic_charge: 0,
                qty_total: 0,
                print_total: 0,
                print_payable_amount: 0,
                print_gst_amount: 0,
                print_bal_amount: 0,
                print_paid_amount: 0,
                pic_address: [{ pickup_client_address: '', pickup_office_address: '' }],
                dis_address: [{ dispatch_client_address: '', dispatch_office_address: '' }],
                dis_charge: 0,
                bus_no: '',
                driver_no: '',
                transport_charge: '',
                dis_office_detail: '',
                actual_bal_amount: 0,
                from_state: '',
                book_from: '',
                to_state: '',
                book_to: '',
                sender_proof_detail: '',
                reciver_proof_detail: '',
                payment_method: '',
                parcel_detail: [],
                bill_detail: [],
                // parcel_detail: [{ parcel_type: '', weight: 0, qty: 0, rate: 0, total_amount: 0, print_rate: 0, total_print_rate: 0 }],
                bilty_charge: 20,
                lr_no: 0,
                actual_payable_amount: 0,
                user_id: storedData,
                last_updated_by: storedData,






            }
        }
    );
    setValue("parcel_id", parcelData.id)
    setValue("booking_date", parcelData.booking_date)
    setValue("actual_bal_amount", parcelData.actual_bal_amount)
    setValue("book_from", parcelData.book_from)
    setValue("book_to", parcelData.book_to)
    setValue("sender_name", parcelData.sender_name)
    setValue("particulars", parcelData.particulars)
    setValue("rec_name", parcelData.rec_name)
    setValue("send_add", parcelData.send_add)
    setValue("send_mob", parcelData.send_mob)
    setValue("rec_mob", parcelData.rec_mob)
    setValue("rec_add", parcelData.rec_add)
    setValue("sender_proof_type", parcelData.sender_proof_type)
    setValue("pic_delivery_type", parcelData.pic_delivery_type)
    setValue("pic_charge", parcelData.pic_charge)
    setValue("dis_delivery_type", parcelData.dis_delivery_type)
    setValue("bus_no", parcelData.bus_no)
    setValue("driver_no", parcelData.driver_no)
    setValue("transport_charge", parcelData.transport_charge)
    setValue("from_state", parcelData.from_state)
    setValue("to_state", parcelData.to_state)
    setValue("dispatch_date", parcelData.dispatch_date)
    // setValue("total_print_rate",parcelData.total_print_rate)
    setValue("reciver_proof_detail", parcelData.reciver_proof_detail)
    setValue("dis_office_detail", parcelData.dis_office_detail)
    setValue("pic_office_detail", parcelData.pic_office_detail)
    // setValue("payment_method", parcelData.payment_method)
    setValue("actual_total", parcelData.actual_total)
    setValue("print_total", parcelData.print_total)
    setValue("print_payable_amount", parcelData.print_payable_amount)
    setValue("print_gst_amount", parcelData.print_gst_amount)
    setValue("print_bal_amount", parcelData.print_bal_amount)
    setValue("actual_payable_amount", parcelData.actual_payable_amount)
    setValue("dis_charge", parcelData.dis_charge)
    setValue("sender_proof_detail", parcelData.sender_proof_detail)
    setValue("reciver_proof_type", parcelData.reciver_proof_type)
    setValue("lr_no", parcelData.lr_no)
    setValue("demurrage_charges", parcelData.demurrage_charges)
    setValue("demurrage_days", parcelData.demurrage_days)
    setValue("total_demurrage_charges", parcelData.total_demurrage_charges)
    setValue("is_demurrage", parcelData.is_demurrage)
    const paymentMethod = watch('payment_method');


    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');


    useEffect(() => {
        if (parcelData) {
            setSelectedPaymentMethod(parcelData.payment_method);
            setValue('payment_method', parcelData.payment_method);
            setValue('transection_id', parcelData.transection_id || '');
        }
    }, [parcelData, setValue]);




    //=========================================================================================================================   

    const appendPicAddress = () => {
        setAddressFields({
            ...addressFields,
            pic_address: [...addressFields.pic_address, { pickup_client_address: '', pickup_office_address: '' }],
        });
    };

    const removePicAddress = (index: number) => {
        const newAddresses = [...addressFields.pic_address];
        newAddresses.splice(index, 1);
        setAddressFields({
            ...addressFields,
            pic_address: newAddresses,
        });
        setValue('pic_address', newAddresses);
    };

    const appendDisAddress = () => {
        setAddressFields({
            ...addressFields,
            dis_address: [...addressFields.dis_address, { dispatch_client_address: '', dispatch_office_address: '' }],
        });
    };

    const removeDisAddress = (index: number) => {
        const newAddresses = [...addressFields.dis_address];
        newAddresses.splice(index, 1);
        setAddressFields({
            ...addressFields,
            dis_address: newAddresses,
        });
        setValue('dis_address', newAddresses);
    };

    /********************************************parcel_bill_details*******************************************************/


    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, index: number, field: keyof ParcelBillDetail) => {
        const updatedFields = [...EwayFields];
        updatedFields[index] = {
            ...updatedFields[index],
            [field]: e.target.value
        };
        setEwayFields(updatedFields);
    };

    const removeEwayAddress = (index: number) => {
        const updatedFields = [...EwayFields];
        updatedFields.splice(index, 1);
        setEwayFields(updatedFields);

        setValue('bill_detail', updatedFields);
    };

    const addBillField = () => {
        const newId = EwayFields.length > 0 ? EwayFields[EwayFields.length - 1].id + 1 : 1;
        setEwayFields([
            ...EwayFields,
            {
                id: newId,
                e_way_bill_no: '',
                p_o_no: '',
                invoice_no: '',
                invoice_amount: ''
            }
        ]);
    };

    const handleWMobileNoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/[^\d]/g, '').slice(0, 10);
        setParcelData({ ...parcelData, whatsapp_no: value });

    };




    const handleSelectChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
        index: number,
        field: keyof ParcelDetail
    ) => {
        const updatedFields = [...parcelDetail];
        const currentValue = Number(e.target.value);




        // Update the field in the specific index
        updatedFields[index] = {
            ...updatedFields[index],
            [field]: currentValue,
        };

        if (field === 'qty' || field === 'rate') {
            const qty = Number(updatedFields[index].qty);
            const rate = Number(updatedFields[index].rate);
            const print_rate = Number(updatedFields[index].print_rate);
            updatedFields[index].print_rate = print_rate;
            updatedFields[index].total_amount = qty * rate;
            updatedFields[index].total_print_rate = print_rate * qty;


            // const nextIndex = index + 1;
            // const nextQty = nextIndex < updatedFields.length ? updatedFields[nextIndex].qty || 0 : 0;
            // const qtytotal = qty + nextQty;
            // updatedFields[index].QTYtotal = qtytotal;

            // console.log("qty data" ,   updatedFields[index].QTYtotal )








            // Update print_rate and total_print_rate accordingly
            if (field === 'rate') {
                const print_rate = rate; // Example calculation, replace with your logic
                updatedFields[index].print_rate = print_rate;
                updatedFields[index].total_print_rate = print_rate * qty;
            }




        } else if (field === 'print_rate') {
            const print_rate = Number(updatedFields[index].print_rate);
            updatedFields[index].print_rate = print_rate;
            updatedFields[index].total_print_rate = print_rate * updatedFields[index].qty;



        }





        // Update actual_total and print_total
        const sumTotalAmount = updatedFields.reduce((acc, item) => acc + (item.total_amount || 0), 0);
        const formattedSumAmount = sumTotalAmount.toFixed(2);


        console.log("total_amount", formattedSumAmount);


        const sumPrintTotalAmount = updatedFields.reduce((acc, item) => acc + (item.total_print_rate || 0), 0);
        const formattedPrintSumAmount = sumPrintTotalAmount.toFixed(2);

        console.log("print_total", formattedPrintSumAmount);
        const totaltransportcharge = Number(parcelData.pic_charge) + Number(parcelData.dis_charge)





        // Calculate GST amount based on total_amount and transport_charge
        const totalAmountWithTransport = sumTotalAmount + totaltransportcharge; // Ensure transport_charge is converted to number
        const gstAmount = totalAmountWithTransport * 0.05;
        const formattedGstAmount = gstAmount.toFixed(2);



        const printtotalAmountWithTransport = sumPrintTotalAmount + totaltransportcharge; // Ensure transport_charge is converted to number
        const pritngstAmount = printtotalAmountWithTransport * 0.05;
        const printformattedGstAmount = pritngstAmount.toFixed(2);

        let runningQtyTotal = 0;
        for (let i = 0; i < updatedFields.length; i++) {
            runningQtyTotal += Number(updatedFields[i].qty || 0); // Accumulate qty values
            updatedFields[i].QTYtotal = runningQtyTotal; // Update QTYtotal for each item
        }

        console.log("qty data", runningQtyTotal)


        const blityCharge = Number(parcelData.bilty_charge); // Assuming blityCharge is fetched from parcelData
        // Assuming totalCharge is fetched from parcelData 
        const demurragedays = Number(parcelData.demurrage_days);
        const demurrageCharges = Number(parcelData.demurrage_charges);


        const totalDemurrageCharges = demurragedays * demurrageCharges * runningQtyTotal


        const actualPayableAmount = sumTotalAmount + gstAmount + blityCharge + totaltransportcharge + totalDemurrageCharges;



        const actualPrintamount = sumPrintTotalAmount + pritngstAmount + blityCharge + totaltransportcharge + totalDemurrageCharges;

        console.log("actual ", actualPrintamount);

        const actualbalamount = actualPayableAmount - Number(parcelData.actual_paid_amount);


        const actualprintbalamount = actualPrintamount - Number(parcelData.print_paid_amount);;

        console.log("dataaaaaaaa ", actualprintbalamount);

        // Update state with updatedFields, actual_total, print_total, and gst_amount
        setparcelDetail(updatedFields);
        setParcelData((prevState: any) => ({
            ...prevState,
            actual_total: formattedSumAmount,
            print_total: formattedPrintSumAmount,
            gst_amount: formattedGstAmount,
            print_gst_amount: printformattedGstAmount,
            actual_payable_amount: actualPayableAmount,
            print_payable_amount: actualPrintamount,
            total_demurrage_charges: totalDemurrageCharges,
            transport_charge: totaltransportcharge,
            actual_bal_amount: actualbalamount.toFixed(2),
            print_bal_amount: actualprintbalamount.toFixed(2)

        }));

        // Update form values for react-hook-form
        setValue('parcel_detail', updatedFields);

    };

    const handleFieldChange = (fieldName: string, value: string) => {
        // Update parcelData state with the new value for the specified field
        const updatedParcelData = { ...parcelData, [fieldName]: value };

        // Handle specific calculations based on field name
        if (fieldName === 'pic_charge' || fieldName === 'dis_charge') {
            const picCharge = parseFloat(updatedParcelData.pic_charge) || 0;
            const disCharge = parseFloat(updatedParcelData.dis_charge) || 0;
            updatedParcelData.transport_charge = (picCharge + disCharge).toString();
        }

        // Calculate totals
        const sumTotalAmount = parcelDetail.reduce((acc, item) => acc + (item.total_amount || 0), 0);
        const formattedSumAmount = sumTotalAmount.toFixed(2);



        // const sumPrintTotalAmount = parcelDetail.reduce((acc, item) => acc + (item.total_print_rate || 0), 0);
        // const formattedPrintSumAmount = sumPrintTotalAmount.toFixed(2);

        const sumPrintTotalAmount = parcelDetail.reduce((acc, item) => acc + (item.total_print_rate || 0), 0);
        const formattedPrintSumAmount = sumPrintTotalAmount.toFixed(2);

        const totaltransportcharge = Number(updatedParcelData.pic_charge) + Number(updatedParcelData.dis_charge);

        const totalAmountWithTransport = sumTotalAmount + totaltransportcharge;
        const gstAmount = totalAmountWithTransport * 0.05;
        const formattedGstAmount = gstAmount.toFixed(2);

        const printtotalAmountWithTransport = sumPrintTotalAmount + totaltransportcharge;
        const pritngstAmount = printtotalAmountWithTransport * 0.05;
        const printformattedGstAmount = pritngstAmount.toFixed(2);

        const blityCharge = Number(updatedParcelData.bilty_charge); // Assuming blityCharge is fetched from parcelData
        const demurragedays = Number(updatedParcelData.demurrage_days);
        const demurrageCharges = Number(updatedParcelData.demurrage_charges);

        let runningQtyTotal = 0;
        const updatedFields = parcelDetail.map(item => {
            runningQtyTotal += Number(item.qty || 0); // Accumulate qty values
            return {
                ...item,
                QTYtotal: runningQtyTotal // Update QTYtotal for each item
            };
        });

        const totalDemurrageCharges = demurragedays * demurrageCharges * runningQtyTotal;

        const actualPayableAmount = sumTotalAmount + gstAmount + blityCharge + totaltransportcharge + totalDemurrageCharges;
        const actualPrintPaybleamount = sumPrintTotalAmount + pritngstAmount + blityCharge + totaltransportcharge + totalDemurrageCharges;
        console.log("dghhtrregrreergdfgfj ", actualPrintPaybleamount);
        // Calculate actual balance amount
        const actualPaidAmount = parseFloat(updatedParcelData.actual_paid_amount) || 0;
        const actualbalamount = actualPayableAmount - actualPaidAmount;

        const actualPrintPaidAmount = parseFloat(updatedParcelData.print_paid_amount) || 0;
        const actualprintbalamount = actualPrintPaybleamount - actualPrintPaidAmount;


        // Update state with updatedParcelData, actual_total, print_total, and gst_amount
        setParcelData((prevState: any) => ({
            ...prevState,
            ...updatedParcelData,
            actual_total: formattedSumAmount,
            print_total: formattedPrintSumAmount,
            gst_amount: formattedGstAmount,
            print_gst_amount: printformattedGstAmount,
            actual_payable_amount: actualPayableAmount,
            print_payable_amount: actualPrintPaybleamount,
            total_demurrage_charges: totalDemurrageCharges,
            transport_charge: totaltransportcharge,
            actual_bal_amount: actualbalamount.toFixed(2),
            print_bal_amount: actualprintbalamount.toFixed(2)// Update actual_bal_amount with calculated value
        }));

        // Update parcelDetail state with updatedFields
        setparcelDetail(updatedFields);

        // Update form values for react-hook-form if needed
        // setValue('parcel_detail', updatedFields); // Uncomment if using react-hook-form
    };


    const removeParcelDetail = (index: number) => {
        // Step 1: Remove the item from parcelDetail
        const updatedFields = [...parcelDetail];
        updatedFields.splice(index, 1);

        // Step 2: Recalculate totals and other values
        const sumTotalAmount = updatedFields.reduce((acc, item) => acc + (item.total_amount || 0), 0);
        const formattedSumAmount = sumTotalAmount.toFixed(2);

        const sumPrintTotalAmount = updatedFields.reduce((acc, item) => acc + (item.total_print_rate || 0), 0);
        const formattedPrintSumAmount = sumPrintTotalAmount.toFixed(2);

        const totaltransportcharge = Number(parcelData.pic_charge) + Number(parcelData.dis_charge);

        const totalAmountWithTransport = sumTotalAmount + totaltransportcharge;
        const gstAmount = totalAmountWithTransport * 0.05;
        const formattedGstAmount = gstAmount.toFixed(2);

        const printtotalAmountWithTransport = sumPrintTotalAmount + totaltransportcharge;
        const pritngstAmount = printtotalAmountWithTransport * 0.05;
        const printformattedGstAmount = pritngstAmount.toFixed(2);

        // Recalculate QTYtotal for remaining items
        let runningQtyTotal = 0;
        const recalculatedFields = updatedFields.map(item => {
            runningQtyTotal += Number(item.qty || 0); // Accumulate qty values
            return {
                ...item,
                QTYtotal: runningQtyTotal // Update QTYtotal for each item
            };
        });

        const blityCharge = Number(parcelData.bilty_charge); // Assuming blityCharge is fetched from parcelData
        const demurragedays = Number(parcelData.demurrage_days);
        const demurrageCharges = Number(parcelData.demurrage_charges);

        const totalDemurrageCharges = demurragedays * demurrageCharges * runningQtyTotal;

        const actualPayableAmount = sumTotalAmount + gstAmount + blityCharge + totaltransportcharge + totalDemurrageCharges;
        const actualPrintPaybleamount = sumPrintTotalAmount + pritngstAmount + blityCharge + totaltransportcharge + totalDemurrageCharges;

        // Calculate actual balance amount
        const actualPaidAmount = parseFloat(parcelData.actual_paid_amount) || 0;
        const actualbalamount = actualPayableAmount - actualPaidAmount;

        const actualPrintPaidAmount = parseFloat(parcelData.print_paid_amount) || 0;
        const actualprintbalamount = actualPrintPaybleamount - actualPrintPaidAmount;

        // Step 3: Update state with recalculated values
        setparcelDetail(recalculatedFields);
        setParcelData((prevState: any) => ({
            ...prevState,
            actual_total: formattedSumAmount,
            print_total: formattedPrintSumAmount,
            gst_amount: formattedGstAmount,
            print_gst_amount: printformattedGstAmount,
            actual_payable_amount: actualPayableAmount,
            print_payable_amount: actualPrintPaybleamount,
            total_demurrage_charges: totalDemurrageCharges,
            transport_charge: totaltransportcharge,
            actual_bal_amount: actualbalamount.toFixed(2),
            print_bal_amount: actualprintbalamount.toFixed(2)
        }));

        // Update form values for react-hook-form if needed
        setValue('parcel_detail', recalculatedFields);
    };


    const addParcelField = () => {
        const newId = parcelDetail.length > 0 ? parcelDetail[parcelDetail.length - 1].id + 1 : 1;
        setparcelDetail([
            ...parcelDetail,
            {
                id: newId,
                parcel_type: '',
                weight: 0,
                qty: 0,
                rate: 0,
                print_rate: 0,
                total_amount: 0,
                total_print_rate: 0,
                QTYtotal: 0
            }
        ]);
    };

















    //-------------------------------------------------------Api fetch---------------------------------------------------------------------

    const currentDate = new Date().toISOString().split('T')[0]; // Get current date in YYYY-MM-DD format



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
        console.log("datadddd", formData);

        try {
            // State variables (you need to define these based on your component or context)
            let fromStateName = '';
            let toStateName = '';
            let fromCityName = '';
            let toCityName = '';

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

            formData.from_state = selectedFromStateIdStr;
            formData.to_state = selectedToStateIdStr;
            formData.from_state_name = fromStateName;
            formData.to_state_name = toStateName;
            formData.from_city_name = fromCityName;
            formData.to_city_name = toCityName;

            // Handle custom city input if needed
            if (showCustomCityInput && customCity) {
                const response = await axios.post('http://192.168.0.106:3001/ticket/add_new_city_from_state', {
                    city_name: customCity,
                    state_id: selectedFromStateId,
                });
                formData.book_from = response.data.city_id;
            }

            if (showCustomToCityInput && customToCity) {
                const response = await axios.post('http://192.168.0.106:3001/ticket/add_new_city_from_state', {
                    city_name: customToCity,
                    state_id: selectedToStateId,
                });
                formData.book_to = response.data.city_id;
            }


            formData.from_state = selectedFromStateIdStr;
            formData.to_state = selectedToStateIdStr;

            formData.remove_files = removedFileNames;

            const response = await axios.post('http://192.168.0.106:3001/parcel/update_parcel_detail_data', formData);

            console.log('Form submitted successfully:', response.data);

            if (response.data.status == 1) {
                console.log("formData0", formData);

                if (formData.parcel_imgs && formData.parcel_imgs.length > 0) {
                    const formDataImages = new FormData();
                    formDataImages.append("parcel_token", response.data.parcel_token);

                    for (const file of formData.parcel_imgs) {
                        formDataImages.append("parcel_imgs", file);
                    }

                    console.log('FormData prepared for images:', formDataImages);

                    try {
                        const uploadResponse = await axios.post("http://192.168.0.106:3001/parcel/upload_parcel_image", formDataImages, {
                            headers: {
                                'Content-Type': 'multipart/form-data'
                            }
                        });

                        const uploadResult = uploadResponse.data;
                        console.log('Image upload response:', uploadResult);

                        if (uploadResult.status === "1") {
                            console.log("Images added successfully");
                        } else {
                            console.log("Failed to upload images");
                        }
                    } catch (uploadError) {
                        console.error("Error uploading images:", uploadError);
                        alert("Failed to upload images");
                    }
                } else {
                    console.log("No images to upload");
                }

                if (response.data.parcel_token) {
                    try {
                        const parcelDetailResponse = await EditParcelDataList.getEditParcelData(response.data.parcel_token);
                        console.log("Parcel data:", parcelDetailResponse.data[0]);
                        handleParcelPrint(parcelDetailResponse.data[0]);
                        router.push("/parcel_list");
                    } catch (fetchError) {
                        console.error('Error fetching parcel data:', fetchError);
                    }
                }

            } else {
                console.log("Failed to update parcel details");
            }
            // UpdateParcelPrint(formData);

            // router.push('/parcel_list');
        } catch (error) {
            console.error('Error submitting form:', error);

        }
    };


    // const onSubmit = async (data: any) => {


    //     console.log('Submitting form with removed file names:', removedFileNames);



    //     };


    const handleShowCustomCityInput = () => {
        setShowCustomCityInput(true);
    };

    const handleShowCustomToCityInput = () => {
        setShowCustomToCityInput(true);
    };



    //*************************************************************************************************************************** */




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

    const handlePhoneChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value.replace(/\D/g, '').slice(0, 10);
        setParcelData({ ...parcelData, rec_mob: value });


    };

    const handleCmpPhoneChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value.replace(/\D/g, '').slice(0, 10);

        setParcelData({ ...parcelData, send_mob: value });
    };



    const handleDriverPhone = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value.replace(/\D/g, '').slice(0, 10);

        setParcelData({ ...parcelData, driver_no: value });
    };



    //----------------------------------------Radio Button---------------------------------------------------------------------






    const aadhaarPattern = /^\d{12}$/;
    const panPattern = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    const gstPattern = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[0-9]{1}[A-Z]{1}[0-9A-Z]{1}$/;


    const radioaadhaarPattern = /^\d{12}$/;
    const radiopanPattern = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    const radiogstPattern = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[0-9]{1}[A-Z]{1}[0-9A-Z]{1}$/;



    const handleIparceltypeChange = (
        e: React.ChangeEvent<HTMLSelectElement>,
        index: number,
        field: keyof ParcelDetail
    ) => {
        const updatedFields = [...parcelDetail];
        updatedFields[index] = {
            ...updatedFields[index],
            [field]: e.target.value,
        };
        setparcelDetail(updatedFields);
    };


    const [removedFileNames, setRemovedFileNames] = useState<string[]>([]);

    const extractFileName = (url: string) => {
        return url.substring(url.lastIndexOf('/') + 1);
    };

    const removeImage = (imageUrl: string) => {
        const fileName = extractFileName(imageUrl);
        setRemovedFileNames((prevRemovedFileNames) => [...prevRemovedFileNames, fileName]);

        setParcelImages((prevImages) => prevImages.filter((url) => url !== imageUrl));
    };





    return (
        <>

            <div className="container-fluid">
                <br />
                <Card>
                    <Card.Header style={{ display: "flex", justifyContent: "space-between" }}><h3>Update Parcel Booking</h3>
                        <div>
                           

                            <Link href="/parcel_list" className="btn btn-sm btn-success" style={{ float: "right", marginRight: "8px" }}>Back</Link>

                        </div>

                    </Card.Header>
                    {error && <p>{error}</p>}
                    {parcelData && (
                        <Card.Body>
                            <form onSubmit={handleSubmit(onSubmit)}>

                                {/* First-Row */}
                                <div className="row mb-3">

                                    <div className="col-lg-3">
                                        <label className="form-label" htmlFor="to">Booking date</label>
                                        <input {...register('booking_date')} className="form-control form-control-sm" value={parcelData.booking_date} onChange={(e) => handleFieldChange('booking_date', e.target.value)} type="date" id="booking_date" placeholder="Booking date" />
                                    </div>
                                    <div className="col-lg-3">
                                        <label className="form-label" htmlFor="to">Disptach date</label>
                                        <input {...register('dispatch_date')} value={parcelData.dispatch_date} onChange={(e) => handleFieldChange('dispatch_date', e.target.value)} className="form-control form-control-sm" type="date" id="dispatch_date" placeholder="Disptach date" />
                                    </div>


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
                                            id="book_from_select"
                                            {...register('book_from')}
                                            value={parcelData?.book_from || ""}
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                if (parcelData) {
                                                    if (value === "tkt_from_other") {
                                                        // Show input field for new city
                                                        setParcelData({ ...parcelData, book_from: '' });
                                                        setShowCustomCityInput(true); // State to toggle input field
                                                    } else {
                                                        setParcelData({ ...parcelData, book_from: value });
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
                                </div>

                                {/* second-Row */}
                                <div className='row mb-3'>


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
                                            id="book_to_select"
                                            {...register('book_to')}
                                            value={parcelData?.book_to || ""}
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                if (parcelData) {
                                                    if (value === "tkt_to_other") {
                                                        // Show input field for new city
                                                        setParcelData({ ...parcelData, book_to: '' });
                                                        setShowCustomToCityInput(true); // State to toggle input field
                                                    } else {
                                                        setParcelData({ ...parcelData, book_to: value });
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
                                    <div className="col-lg-3">
                                        <label className="form-label" htmlFor="sender_name">Sender Name</label>
                                        <input {...register('sender_name', {

                                        })} className="form-control form-control-sm" value={parcelData.sender_name} onChange={(e) => handleFieldChange('sender_name', e.target.value)} type="text" id="sender_name" placeholder="Sender Name" />
                                    </div>
                                    <div className="col-lg-3">
                                        <label className="form-label" htmlFor="rec_name">Receiver Name</label>
                                        <input {...register('rec_name', {

                                        })} className="form-control form-control-sm" value={parcelData.rec_name} onChange={(e) => handleFieldChange('rec_name', e.target.value)} type="text" id="rec_name" placeholder="Rec. Name" />
                                    </div>

                                </div>

                                {/* Fourth-Row */}
                                <div className="row mb-3">
                                    <div className="col-lg-4">
                                        <label className="form-label" htmlFor="send_mob">Sender Mobile No.</label>
                                        <input type="text"
                                            {...register("send_mob", {
                                                minLength: 10,


                                            })} value={parcelData.send_mob} maxLength={10}
                                            onChange={handleCmpPhoneChange} className="form-control form-control-sm" name="send_mob" id="send_mob" placeholder="Enter Company Mobile No" />
                                        {errors.send_mob?.type === "required" && <span id="show_mobile_err" className="error">Enter 10 Digits Mobile Number.</span>}
                                        {errors?.send_mob?.type === "minLength" && <span id="show_mobile_err" className="error">Enter 10 Digits Mobile Number.</span>}

                                    </div>
                                    <div className="col-lg-4">
                                        <label className="form-label" htmlFor="rec_mob">Receiver Mobile No.</label>
                                        <input type="text"
                                            {...register("rec_mob", {
                                                minLength: 10,
                                                pattern: /^[0-9]+$/

                                            })}
                                            className="form-control form-control-sm" value={parcelData.rec_mob} maxLength={10}
                                            onChange={handlePhoneChange} id="rec_mob" placeholder="Enter rec_mob No" />
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
                                            value={parcelData.whatsapp_no}
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


                                {/* Fifth-Row */}
                                <div className="row mb-3">
                                    <div className="col-lg-6">
                                        <label className="form-label" htmlFor="sender_proof_type">Select Sender ID Proof Type</label><br />
                                        <input type="radio"
                                            {...register('sender_proof_type')}
                                            value="Aadhar_no"
                                            checked={parcelData.sender_proof_type === "Aadhar_no"}
                                            onChange={() => {
                                                handleFieldChange('sender_proof_type', "Aadhar_no")

                                            }} /> Aadhar


                                        <input

                                            type="radio"
                                            {...register('sender_proof_type')}
                                            value="Pan_no"
                                            checked={parcelData.sender_proof_type === "Pan_no"}
                                            onChange={() => {
                                                handleFieldChange('sender_proof_type', "Pan_no")

                                            }}


                                        /> PAN

                                        <input type='radio' {...register('sender_proof_type')}
                                            value="Gst_no"
                                            checked={parcelData.sender_proof_type === "Gst_no"}
                                            onChange={() => {
                                                handleFieldChange('sender_proof_type', "Gst_no")

                                            }} /> GST
                                    </div>

                                    <div className="col-lg-6">
                                        <label className="form-label" htmlFor="reciver_proof_type">Select Receiver ID Proof Type</label><br />
                                        <input type="radio"
                                            {...register('reciver_proof_type')}
                                            value="Aadhar_no" // Set the value attribute to "seater"
                                            checked={parcelData.reciver_proof_type === "Aadhar_no"}
                                            onChange={() => {
                                                handleFieldChange('reciver_proof_type', "Aadhar_no")

                                            }} /> Aadhar


                                        <input type="radio"
                                            {...register('reciver_proof_type')}
                                            value="Pan_no" // Set the value attribute to "seater"
                                            checked={parcelData.reciver_proof_type === "Pan_no"}
                                            onChange={() => {
                                                handleFieldChange('reciver_proof_type', "Pan_no")
                                            }} /> PAN


                                        <input type='radio' {...register('reciver_proof_type')}
                                            value="Gst_no" // Set the value attribute to "seater"
                                            checked={parcelData.reciver_proof_type === "Gst_no"}
                                            onChange={() => {
                                                handleFieldChange('reciver_proof_type', "Gst_no")
                                            }} /> GST

                                    </div>
                                </div>

                                {/* -------sixth row-------*/}
                                <div className="row mb-3">
                                    <div className="col-lg-6">
                                        <label className="form-label" htmlFor="send_mob">Sender Adhar No./PAN No./GST No.</label>
                                        <input
                                            {...register('sender_proof_detail', {
                                                required: parcelData.sender_proof_type === 'Aadhar_no' ? 'Invalid Aadhaar number format' : parcelData.sender_proof_type === 'Pan_no' ? 'Invalid PAN number format' : 'Invalid GST number format',
                                                pattern: {
                                                    value: parcelData.sender_proof_type === 'Aadhar_no' ? aadhaarPattern : parcelData.sender_proof_type === 'Pan_no' ? panPattern : gstPattern,
                                                    message: parcelData.sender_proof_type === 'Aadhar_no' ? 'Invalid Aadhaar number format' : parcelData.sender_proof_type === 'Pan_no' ? 'Invalid PAN number format' : 'Invalid GST number format',
                                                }
                                            })}
                                            value={parcelData.sender_proof_detail}
                                            onChange={(e) => handleFieldChange('sender_proof_detail', e.target.value)}
                                            className="form-control form-control-sm"
                                            type="text"
                                            name="sender_proof_detail"
                                            placeholder="Enter Sender ID Proof Detail" />

                                        {errors.sender_proof_detail && <span className='error'>{errors.sender_proof_detail.message}</span>}
                                    </div>
                                    <div className="col-lg-6">
                                        <label className="form-label" htmlFor="rec_mob">Receiver Adhar No./PAN No./GST No.</label>
                                        <input
                                            {...register('reciver_proof_detail', {
                                                required: parcelData.reciver_proof_type === 'Aadhar_no' ? 'Invalid Aadhaar number format' : parcelData.reciver_proof_type === 'Pan_no' ? 'Invalid PAN number format' : 'Invalid GST number format',
                                                pattern: {
                                                    value: parcelData.reciver_proof_type === 'Aadhar_no' ? radioaadhaarPattern : parcelData.reciver_proof_type === 'Pan_no' ? radiopanPattern : radiogstPattern,
                                                    message: parcelData.reciver_proof_type === 'Aadhar_no' ? 'Invalid Aadhaar number format' : parcelData.reciver_proof_type === 'Pan_no' ? 'Invalid PAN number format' : 'Invalid GST number format'
                                                }
                                            })}
                                            value={parcelData.reciver_proof_detail}
                                            onChange={(e) => handleFieldChange('reciver_proof_detail', e.target.value)}
                                            className="form-control form-control-sm"
                                            type="text"
                                            name="reciver_proof_detail"
                                            placeholder="Enter Receiver ID Proof Detail"
                                        />
                                        {errors.reciver_proof_detail && <span className='error'>{errors.reciver_proof_detail.message}</span>}
                                    </div>
                                </div>

                                {/* --------------*/}
                                <div className="row mb-3">
                                    <div className="col-lg-6">
                                        <label className="form-label" htmlFor="send_add">Sender Address</label>
                                        <textarea {...register('send_add')} value={parcelData.send_add} onChange={(e) => handleFieldChange('send_add', e.target.value)} className="form-control form-control-sm" name="send_add" id="send_add" placeholder="Address"></textarea>
                                    </div>
                                    <div className="col-lg-6">
                                        <label className="form-label" htmlFor="ex_rate">Receiver Address</label>
                                        <textarea {...register('rec_add')} value={parcelData.rec_add} onChange={(e) => handleFieldChange('rec_add', e.target.value)} className="form-control form-control-sm" name="rec_add" id="rec_add" placeholder="Address"></textarea>
                                    </div>
                                </div>




                                {/* parcel-data */}
                                {parcelDetail.map((field, index) => (
                                    <div className="row mb-3" key={index} id={`parcel_row_${index}`}>
                                        <div className="col-lg-2">
                                            <label className="form-label" htmlFor={`parcelType_${index}`}>Select Type</label>
                                            <select
                                                className="form-control"
                                                id={`parcelType_${index}`}
                                                {...register(`parcel_detail.${index}.parcel_type`)}

                                                value={field.parcel_type}
                                                onChange={(e) => handleIparceltypeChange(e, index, 'parcel_type')}


                                            >
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
                                            <input
                                                className="form-control form-control-sm"
                                                type="number"
                                                {...register(`parcel_detail.${index}.weight`)}
                                                id={`parcelWeight_${index}`}
                                                defaultValue={field.weight}
                                                placeholder="Weight"
                                                onChange={(e) => handleSelectChange(e, index, 'weight')}
                                            />
                                        </div>
                                        <div className="col-lg-1">
                                            <label className="form-label">Qty</label>
                                            <input
                                                className="form-control form-control-sm qty_cnt"
                                                type="number"
                                                {...register(`parcel_detail.${index}.qty`)}
                                                id={`parcelQty_${index}`}
                                                onChange={(e) => handleSelectChange(e, index, 'qty')}
                                                value={field.qty}
                                                placeholder="Qty"
                                            />
                                        </div>
                                        <div className="col-lg-1">
                                            <label className="form-label">Rate</label>
                                            <input
                                                className="form-control form-control-sm"
                                                type="number"
                                                {...register(`parcel_detail.${index}.rate`)}
                                                value={field.rate}
                                                id={`parcelRate_${index}`}
                                                onChange={(e) => handleSelectChange(e, index, 'rate')}
                                                placeholder="Rate"
                                            />
                                        </div>
                                        <div className="col-lg-2">
                                            <label className="form-label">Total</label>
                                            <input
                                                {...register(`parcel_detail.${index}.total_amount`)}
                                                className="form-control form-control-sm"
                                                readOnly
                                                style={{ backgroundColor: '#f0f0f0', }}
                                                tabIndex={-1} // Optionally disable tabbing into the input
                                                type="number"
                                                id={`parcelTotalAmount_${index}`}
                                                value={field.total_amount}
                                                placeholder="Total Amount"
                                            />
                                        </div>
                                        <div className="col-lg-2" style={{ display: "none" }}>
                                            <label className="form-label">qtyTotal</label>
                                            <input className="form-control form-control-sm" disabled type="hidden" {...register(`parcel_detail.${index}.QTYtotal`)}
                                                onChange={(e) => handleSelectChange(e, index, 'QTYtotal')} />
                                        </div>
                                        <div className="col-lg-2">
                                            <label className="form-label">Print Rate</label>
                                            <input
                                                className="form-control form-control-sm"
                                                type="number"
                                                {...register(`parcel_detail.${index}.print_rate`)}
                                                defaultValue={field.print_rate}
                                                id={`parcelPrintRate_${index}`}
                                                onChange={(e) => handleSelectChange(e, index, 'print_rate')}
                                                placeholder="Print Rate"
                                            />
                                        </div>
                                        <div className="col-lg-2">
                                            <label className="form-label">Print Total</label>
                                            <input
                                                {...register(`parcel_detail.${index}.total_print_rate`)}
                                                className="form-control form-control-sm"
                                                readOnly
                                                style={{ backgroundColor: '#f0f0f0', }}
                                                tabIndex={-1}
                                                type="number"
                                                id={`parcelprintTotalAmount_${index}`}
                                                value={field.total_print_rate}
                                                placeholder="Total Print Amount"
                                            />
                                        </div>
                                        <div className="col-lg-1 new" style={{ padding: '10px', marginTop: "20px" }}>
                                            <button type="button" className="btn btn-danger btn-sm" onClick={() => removeParcelDetail(index)}>
                                                <FontAwesomeIcon icon={faMinusCircle} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                                <div className="col-lg-12 data">
                                    <button type="button" style={{ marginRight: '61px' }} onClick={addParcelField} className="btn btn-primary btn-sm add_more_row">
                                        <FontAwesomeIcon icon={faPlusCircle} />
                                    </button>
                                </div>





                                {/* Bill-details */}
                                {EwayFields.map((field, index) => (
                                    <div key={index} className="row" id={`bill_row_${index}`}>
                                        <div className="col-lg-3">
                                            <label className="form-label" htmlFor={`eWayBill_${index}`}>
                                                E Way Bill No.
                                            </label>
                                            <input
                                                {...register(`bill_detail.${index}.e_way_bill_no`)}
                                                value={field.e_way_bill_no}
                                                onChange={(e) => handleInputChange(e, index, 'e_way_bill_no')}
                                                className="form-control form-control-sm"
                                                type="text"
                                                id={`eWayBill_${index}`}
                                                placeholder="E Way Bill No"
                                            />
                                        </div>
                                        <div className="col-lg-3">
                                            <label className="form-label" htmlFor={`pONo_${index}`}>P.O. No.</label>
                                            <input
                                                {...register(`bill_detail.${index}.p_o_no`)}
                                                value={field.p_o_no}
                                                onChange={(e) => handleInputChange(e, index, 'p_o_no')}
                                                className="form-control form-control-sm"
                                                type="text"
                                                id={`pONo_${index}`}
                                                placeholder="P.O. No."
                                            />
                                        </div>
                                        <div className="col-lg-2">
                                            <label className="form-label" htmlFor={`invoiceNo_${index}`}>Invoice No.</label>
                                            <input
                                                {...register(`bill_detail.${index}.invoice_no`)}
                                                value={field.invoice_no}
                                                onChange={(e) => handleInputChange(e, index, 'invoice_no')}
                                                className="form-control form-control-sm"
                                                type="text"
                                                id={`invoiceNo_${index}`}
                                                placeholder="Invoice No."
                                            />
                                        </div>
                                        <div className="col-lg-2">
                                            <label className="form-label" htmlFor={`invoiceAmount_${index}`}>Invoice Amount</label>
                                            <input
                                                {...register(`bill_detail.${index}.invoice_amount`)}
                                                value={field.invoice_amount}
                                                onChange={(e) => handleInputChange(e, index, 'invoice_amount')}
                                                className="form-control form-control-sm"
                                                type="text"
                                                id={`invoiceAmount_${index}`}
                                                placeholder="Invoice Amount"
                                            />
                                        </div>
                                        <div className="col-lg-1 new" style={{ padding: "10px" }}>
                                            <button type='button' className="btn btn-danger btn-sm" onClick={() => removeEwayAddress(index)}>
                                                <FontAwesomeIcon icon={faMinusCircle} />
                                            </button>
                                        </div>
                                    </div>
                                ))}

                                {/* Add bill details */}
                                <div className="col-lg-12 data">
                                    <button type='button' style={{ marginRight: "13%" }} onClick={addBillField} className="btn btn-primary btn-sm add_more_row">
                                        <FontAwesomeIcon icon={faPlusCircle} />
                                    </button>
                                </div>






                                {/* ---checkbox--- */}
                                <div className="row mb-3">
                                    <div className="col-lg-6">
                                        <label className="form-label" htmlFor="particulars">Particulars</label>
                                        <textarea {...register('particulars')} onChange={(e) => handleFieldChange('particulars', e.target.value)} value={parcelData.particulars} className="form-control form-control-sm" name="particulars" id="particulars" placeholder="Particulars"></textarea>

                                    </div>

                                </div>

                                <div className="col-lg-12">
                                    <label className="set_labelData">Parcel Images:</label>
                                    <div className="image-gallery">
                                        {parcelImages.length > 0 ? (
                                            parcelImages.map((imageUrl, index) => (
                                                <div key={index} className="image-container">
                                                    <img
                                                        src={imageUrl}
                                                        alt={`Parcel ${index}`}
                                                        className="parcel-image"
                                                        style={{ cursor: 'pointer' }}
                                                    />
                                                    <button
                                                        type='button'
                                                        className="remove-button"
                                                        onClick={() => removeImage(imageUrl)}
                                                    >
                                                        ✕
                                                    </button>
                                                </div>
                                            ))
                                        ) : (
                                            <p>No images available.</p>
                                        )}
                                    </div>
                                </div>



                                <div className="row mb-3" style={{ marginTop: "15px" }}>
                                    <div className="col-lg-6">
                                        <label className="form-label" htmlFor="particulars">Add New Images:</label>
                                        <input className="form-control form-control-sm" type="file" {...register("parcel_imgs")} multiple />

                                    </div>

                                </div>




                                {/* ---is_deliverybox visibility--- */}
                                <div id="showDeliveryDetail">
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
                                                value={parcelData.pic_delivery_type}
                                                onChange={(e) => handleFieldChange('pic_delivery_type', e.target.value)}
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
                                                value={parcelData.pic_charge}
                                                onChange={(e) => handleFieldChange('pic_charge', e.target.value)}


                                            />
                                        </div>
                                    </div>
                                    <br />

                                    {parcelData.pic_delivery_type === "2" && (
                                        <div id="pickup_client_detail">
                                            {addressFields.pic_address.map((field, index) => (
                                                <div key={index}>
                                                    <div className="row mt-3">
                                                        <div className="col-md-4">
                                                            <textarea
                                                                className="form-control form-control-sm"
                                                                placeholder="Client Address"
                                                                {...register(`pic_address.${index}.pickup_client_address`)}
                                                                value={field.pickup_client_address}
                                                                onChange={(e) => {
                                                                    const newAddresses = [...addressFields.pic_address];
                                                                    newAddresses[index].pickup_client_address = e.target.value;
                                                                    setAddressFields({ ...addressFields, pic_address: newAddresses });
                                                                }}
                                                            ></textarea>
                                                        </div>
                                                        <div className="col-md-4">
                                                            <textarea
                                                                className="form-control form-control-sm"
                                                                placeholder="Office Address"
                                                                {...register(`pic_address.${index}.pickup_office_address`)}
                                                                value={field.pickup_office_address}
                                                                onChange={(e) => {
                                                                    const newAddresses = [...addressFields.pic_address];
                                                                    newAddresses[index].pickup_office_address = e.target.value;
                                                                    setAddressFields({ ...addressFields, pic_address: newAddresses });
                                                                }}
                                                            ></textarea>
                                                        </div>
                                                        <div className="col-lg-1" style={{ padding: '10px' }}>

                                                            <button type="button"
                                                                className="btn btn-danger remove_pickup_row"
                                                                onClick={() => removePicAddress(index)}>
                                                                <FontAwesomeIcon icon={faMinusCircle} />
                                                            </button>

                                                        </div>
                                                        <div className="col-md" style={{ marginTop: "8px" }}>
                                                            <button
                                                                type="button"
                                                                className="btn btn-primary add_more_pickup_row"
                                                                onClick={appendPicAddress}
                                                            >
                                                                <FontAwesomeIcon icon={faPlusCircle} />
                                                            </button>
                                                        </div>
                                                    </div>


                                                </div>
                                            ))}

                                        </div>
                                    )}


                                    {parcelData.pic_delivery_type === "1" && (
                                        <div id="pickup_office_detail">
                                            <div className="row">
                                                <div className="col-md-4">
                                                    <label className="form-label">Office Detail</label>
                                                    <textarea
                                                        {...register("pic_office_detail")}
                                                        value={parcelData.pic_office_detail}
                                                        onChange={(e) => handleFieldChange('pic_office_detail', e.target.value)}
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
                                                value={parcelData.dis_delivery_type}
                                                onChange={(e) => handleFieldChange('dis_delivery_type', e.target.value)}

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
                                                value={parcelData.dis_charge}
                                                onChange={(e) => handleFieldChange('dis_charge', e.target.value)}


                                            />
                                        </div>
                                    </div>
                                    <br />

                                    {parcelData.dis_delivery_type === "2" && (
                                        <div id="dispatch_client_detail">
                                            {addressFields.dis_address!.map((field, index) => (
                                                <div key={index}>

                                                    <div className="row mt-3">
                                                        <div className="col-md-4">
                                                            <textarea
                                                                className="form-control form-control-sm"
                                                                placeholder="Client Address"
                                                                {...register(`dis_address.${index}.dispatch_client_address`)}
                                                                value={field.dispatch_client_address}
                                                                onChange={(e) => {
                                                                    const newAddresses = [...(addressFields.dis_address || [])];
                                                                    newAddresses[index].dispatch_client_address = e.target.value;
                                                                    setAddressFields({ ...addressFields, dis_address: newAddresses });
                                                                }}
                                                            ></textarea>
                                                        </div>
                                                        <div className="col-md-4">
                                                            <textarea
                                                                className="form-control form-control-sm"
                                                                placeholder="Office Address"
                                                                {...register(`dis_address.${index}.dispatch_office_address`)}
                                                                value={field.dispatch_office_address}
                                                                onChange={(e) => {
                                                                    const newAddresses = [...(addressFields.dis_address || [])];
                                                                    newAddresses[index].dispatch_office_address = e.target.value;
                                                                    setAddressFields({ ...addressFields, dis_address: newAddresses });
                                                                }}
                                                            ></textarea>
                                                        </div>
                                                        <div className="col-lg-1" style={{ padding: '10px' }}>

                                                            <button type="button"
                                                                className="btn btn-danger remove_pickup_row"
                                                                onClick={() => removeDisAddress(index)}>
                                                                <FontAwesomeIcon icon={faMinusCircle} />
                                                            </button>

                                                        </div>
                                                        <div className="col-md" style={{ marginTop: "8px" }}>
                                                            <button
                                                                type="button"
                                                                className="btn btn-primary add_more_pickup_row"
                                                                onClick={appendDisAddress}>
                                                                <FontAwesomeIcon icon={faPlusCircle} />
                                                            </button>
                                                        </div>
                                                    </div>



                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {parcelData.dis_delivery_type === "1" && (
                                        <div id="dispatch_office_detail" >
                                            <div className="row">
                                                <div className="col-md-4">
                                                    <label className="form-label">Office Detail</label>
                                                    <textarea
                                                        {...register("dis_office_detail")}
                                                        onChange={(e) => handleFieldChange('dis_office_detail', e.target.value)}
                                                        value={parcelData.dis_office_detail}
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
                                                value={parcelData.lr_no}
                                                onChange={(e) => handleFieldChange('lr_no', e.target.value)}
                                                type="text" className="form-control form-control-sm" placeholder="LR No." />
                                        </div>
                                        <div className="col-md-3">
                                            <label className="form-label">Bus No.</label>
                                            <input {...register('bus_no')}
                                                value={parcelData.bus_no}
                                                onChange={(e) => handleFieldChange('bus_no', e.target.value)}
                                                type="text" name="bus_no" className="form-control form-control-sm" placeholder="Bus No." />
                                        </div>
                                        <div className="col-md-3">
                                            <label className="form-label">Driver Phone No.</label>
                                            <input type="text"
                                                {...register("driver_no", {
                                                    minLength: 10,


                                                })} value={parcelData.driver_no} maxLength={10}
                                                onChange={handleDriverPhone} className="form-control form-control-sm" name="driver_no" id="driver_no" placeholder="Enter Company Mobile No" />
                                            {errors.driver_no?.type === "required" && <span id="show_mobile_err" className="error">Enter 10 Digits Mobile Number.</span>}
                                            {errors?.driver_no?.type === "minLength" && <span id="show_mobile_err" className="error">Enter 10 Digits Mobile Number.</span>}

                                        </div>
                                        <div className="col-md-3">
                                            <label className="form-label">Transport Charge</label>
                                            <input {...register('transport_charge')}
                                                onChange={(e) => handleFieldChange('transport_charge', e.target.value)}
                                                value={parcelData.transport_charge} type="number" id="transport_charge" className="form-control form-control-sm" placeholder="Transport Charge" />
                                        </div>
                                    </div>


                                </div>


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

                                        <select {...register('payment_method')} value={parcelData.payment_method} onChange={(e) => handleFieldChange('payment_method', e.target.value)} className="form-control" name="payment_method" id="payment_method">
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
                                                    defaultValue={parcelData?.transection_id || ''}
                                                />
                                            </div>
                                        )}
                                    </div>
                                    <div className="col-lg-2">
                                        <label className="form-label" htmlFor="total">Actual Final Total</label>
                                        <input {...register('actual_total')} value={parcelData.actual_total} onChange={(e) => handleFieldChange('actual_total', e.target.value)} className="form-control-plaintext" type="number"
                                            id="final_total_parcel_booking" placeholder="Enter Total" readOnly />
                                    </div>
                                    <div className="col-lg-2" style={{ display: "none" }}>
                                        <label className="form-label" htmlFor="total"> Final Total</label>
                                        <input
                                            {...register('qty_total')}
                                            className="form-control-plaintext"
                                            type="hidden"

                                            readOnly
                                        />
                                    </div>
                                    <div className="col-lg-3">
                                        <label className="form-label" htmlFor="total">Print Final Total</label>
                                        <input {...register('print_total')} value={parcelData.print_total} onChange={(e) => handleFieldChange('print_total', e.target.value)} id="final_print_total_parcel_booking" className="form-control-plaintext" readOnly type="number" placeholder="Enter Print Total" />
                                    </div>
                                    <div className="col-lg-2">
                                        <label className="form-label">Actual GST 5%</label>
                                        <input  {...register('gst_amount')}
                                            value={parcelData.gst_amount}
                                            type="text" id="total_gst_show" className="form-control-plaintext" />
                                        <input type="hidden" name="gst_amount" id="total_gst" className="form-control" />

                                    </div>
                                    <div className="col-lg-2">
                                        <label className="form-label">Print GST 5%</label>
                                        <input {...register('print_gst_amount')}
                                            value={parcelData.print_gst_amount}
                                            type="text" id="print_total_gst_show" className="form-control-plaintext" />
                                        <input type="hidden" name="print_gst_amount" id="print_total_gst" className="form-control" />

                                    </div>
                                </div>
                                <div className="row mb-3">
                                    <div className="col-md-2">
                                        <label className="form-label">Bilty Charges</label>
                                        <input {...register('bilty_charge')}
                                            value={parcelData.bilty_charge}
                                            onChange={(e) => handleFieldChange('bilty_charge', e.target.value)}
                                            defaultValue="20" className="form-control" type="number" id="bilty_charge" placeholder="Blity Charge" />
                                    </div>

                                    <div className="col-md-3">
                                        <label className="form-label">Is Demurrage Charges ?</label><br />
                                        <input {...register('is_demurrage')} type="checkbox" id="is_demurrage"
                                            checked={parcelData.is_demurrage === "1"} // Check if ticketData.is_demurrage is "1"
                                            onChange={(e) => handleFieldChange('is_demurrage', e.target.checked ? "1" : "0")} />
                                    </div>

                                    <div className="col-lg-3">
                                        <label className="form-label" htmlFor="receive">Actual Payable Amount</label>
                                        <input {...register('actual_payable_amount')}
                                            value={parcelData.actual_payable_amount}
                                            className="form-control-plaintext" type="number" id="actual_payable_amount" />
                                        <input className="form-control-plaintext" type="hidden" id="actual_payable_amount   " placeholder="Enter Balance" />

                                    </div>
                                    <div className="col-lg-3">
                                        <label className="form-label" htmlFor="receive">Print Payable Amount</label>
                                        <input {...register('print_payable_amount')}
                                            value={parcelData.print_payable_amount}

                                            className="form-control-plaintext" type="number" id="print_payable_amount" />
                                    </div>

                                </div>

                                {parcelData.is_demurrage === "1" && <div className="row mb-3">

                                    <div className="col-md-3">
                                        <label className="form-label">Demurrage Charges</label>
                                        <input  {...register('demurrage_charges')} value={parcelData.demurrage_charges} onChange={(e) => handleFieldChange('demurrage_charges', e.target.value)} type="number" id="demurrage_charges" className="form-control" defaultValue="10" />
                                    </div>

                                    <div className="col-md-3">
                                        <label className="form-label">Demurrage Days</label>
                                        <input  {...register('demurrage_days')} value={parcelData.demurrage_days} onChange={(e) => handleFieldChange('demurrage_days', e.target.value)} type="number" id="demurrage_days" className="form-control" placeholder="Enter days" />
                                    </div>
                                    <div className="col-md-3">
                                        <label className="form-label">Total Demurrage Charges</label>
                                        <input   {...register('total_demurrage_charges')} value={parcelData.total_demurrage_charges} type="text" id="total_demurrage_charge" className="form-control-plaintext" />
                                    </div>
                                </div>}


                                <div className="row mb-3">
                                    <div className="col-lg-3">
                                        <label className="form-label" htmlFor="receive">Actual Paid Amount</label>
                                        <input  {...register('actual_paid_amount')} value={parcelData.actual_paid_amount} onChange={(e) => handleFieldChange('actual_paid_amount', e.target.value)} className="form-control form-control-sm" type="number" id="parcel_receive" placeholder="Enter Received" />
                                    </div>
                                    <div className="col-lg-3">
                                        <label className="form-label" htmlFor="receive">Print Paid Amount</label>
                                        <input  {...register('print_paid_amount')} value={parcelData.print_paid_amount} onChange={(e) => handleFieldChange('print_paid_amount', e.target.value)} className="form-control form-control-sm" type="number" id="print_parcel_receive" placeholder="Enter Received" />
                                    </div>
                                    <div className="col-lg-3">
                                        <label className="form-label" htmlFor="balance">Actual Balance Amount</label>
                                        <input  {...register('actual_bal_amount')} value={parcelData.actual_bal_amount} className="form-control-plaintext" type="number" id="parcel_balance_show" readOnly placeholder="Enter Balance" />

                                        <input className="form-control-plaintext" type="hidden" id="parcel_balance" placeholder="Enter Balance" />

                                    </div>
                                    <div className="col-lg-3">
                                        <label className="form-label" htmlFor="balance">Print Balance Amount</label>
                                        <input {...register('print_bal_amount')} value={parcelData.print_bal_amount} className="form-control-plaintext" type="number" readOnly id="print_parcel_balance_show" placeholder="Enter Balance" />

                                        <input className="form-control-plaintext" value="20" type="hidden" id="print_parcel_balance" placeholder="Enter Balance" />

                                    </div>
                                </div>

                                <div className="row">
                                    <div className="text-center">
                                        <button className="btn btn-success btn-sm"  type="submit" id="save_ticket" name="save_form" >
                                            Update
                                        </button>
                                    </div>
                                </div>
                            </form>

                        </Card.Body>
                    )}

                </Card>





            </div >
            <br />
            <br />
            <br />
            {/* <YourComponent /> */}


        </>
    )
}

export default EditParcelData