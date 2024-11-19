"use client"

import { Card } from 'react-bootstrap'
import { useForm, useFieldArray, SubmitHandler } from 'react-hook-form';
import axios from 'axios';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { faMinusCircle } from '@fortawesome/free-solid-svg-icons';
import StateList from '@/app/Api/StateList';
import CityList from '@/app/Api/CityList';
import { useEffect, useState } from 'react';
import EditParcelDataList from '@/app/Api/EditParcelDataList';

import { useRouter } from 'next/navigation';
import handleParcelPrint from '@/app/parcel_list/parcel_data/printpparcelUtils';
import UpdateParcelPrint from '@/app/parcel_list/parcel_data/EditParcelprint';
import Link from 'next/link';
import { debounce } from 'lodash';
import GetClientList from '@/app/Api/FireApis/FireExtinghsherList/GetClientList';

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
    pic_office_charge: number;
    is_client_send_or_rec: any;
    pic_office_detail: string;
    actual_paid_amount: number;
    dis_delivery_type: string;
    dis_office_charge: number;
    bus_no: string;
    driver_no: string;
    transport_charge: string;
    dis_office_detail: string;
    from_state: string,
    to_state: string,
    book_to: string,
    last_updated_by: any;
    user_id: any;
    sender_whatsapp_no: any;
    receiver_whatsapp_no: any;
    pic_address: { pickup_client_address: string; pickup_office_address: string; pickup_charge: any; pic_hamali_charge: any, pic_other_charge: any }[];
    dis_address: { dispatch_client_address: string; dispatch_office_address: string; dispatch_charge: any, dis_hamali_charge: any, dis_other_charge: any }[];
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
    firstName: string;
    client_city: string;
    client_state: string;
    client_pincode: string;
    email: string;
    client_id: any
    total_pickup_charge: any;
    total_dispatch_charge: any;
    delivery: Delivery[];
    mobileNo: string;
    address: any;
    client_id_proof: any;
    sender_id_proof: any;
    receiver_id_proof: any
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

interface Delivery {
    id: any;
    lr_no: any; bus_no: any; driver_no: any;
    other_charge: any;
}

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
    id_proof_urls: any;

}


interface SenderDetails {
    sender_name: string;
    send_mob: string;
    send_add: any
}

interface ReceiverDetails {
    rec_name: string;
    rec_mob: string;
    rec_add: any;
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
    const [delievery, setdelivery] = useState<Delivery[]>([]);
    const [error, setError] = useState<string>('');
    const [EwayFields, setEwayFields] = useState<ParcelBillDetail[]>([]);
    const [addressFields, setAddressFields] = useState<{
        pic_address: {
            pickup_client_address: string;
            pickup_office_address: string;
            pickup_charge: any; pic_hamali_charge: any, pic_other_charge: any
        }[];
        dis_address: {
            dispatch_client_address: string;
            dispatch_office_address: string;
            dispatch_charge: any, dis_hamali_charge: any, dis_other_charge: any
        }[];
    }>({
        pic_address: [],
        dis_address: [],
    });

    useEffect(() => {
        const handleURLChange = () => {
            const urlParams = new URLSearchParams(window.location.search);
            const ticketToken = urlParams.get('token');
            if (ticketToken) {
                localStorage.setItem('ticketToken', ticketToken);
                console.log('Stored ticketToken:', localStorage.getItem('ticketToken'));

                getTicketDetail(ticketToken);

                urlParams.delete('token');
                window.history.replaceState({}, document.title, window.location.pathname + '?' + urlParams.toString());


            } else {
                const storedToken = localStorage.getItem('ticketToken');
                if (storedToken) {
                    console.log('Retrieved ticketToken from localStorage:', storedToken);
                    getTicketDetail(storedToken);
                }
            }
        };
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
                            setEwayFields([...fetchedBillDetail]);
                        } else {
                            setError('No parcel bill details found.');
                        }
                        const picAddresses = response.data[0].delivery_detail
                            .filter((detail: any) => detail.del_type === 1)
                            .map((detail: any) => ({
                                parcel_id: detail.parcel_id || '',
                                pickup_client_address: detail.pic_start_point || '',
                                pickup_office_address: detail.pic_end_point || '',
                                pickup_charge: detail.pickup_charge || '',
                                pic_hamali_charge: detail.pic_hamali_charge || '',
                                pic_other_charge: detail.pic_other_charge || '',
                            }));
                        const disAddresses = response.data[0].delivery_detail
                            .filter((detail: any) => detail.del_type === 2)
                            .map((detail: any) => ({
                                parcel_id: detail.parcel_id || '',
                                dispatch_client_address: detail.dis_start_point || '',
                                dispatch_office_address: detail.dis_end_point || '',
                                dispatch_charge: detail.dispatch_charge || '',
                                dis_hamali_charge: detail.dis_hamali_charge || '',
                                dis_other_charge: detail.dis_other_charge || ''
                            }));

                        setAddressFields({
                            pic_address: picAddresses,
                            dis_address: disAddresses,

                        });

                        const fetchedParcelImages = response.data[0]?.parcel_imgs || [];
                        setParcelImages(fetchedParcelImages);

                        const fetchdeliverydata = response.data[0]?.delivery || []
                        if (fetchdeliverydata) {
                            const transformedDeliveryDetail: Delivery[] = fetchdeliverydata.map((item: any, index: number) => ({
                                id: index + 1,
                                lr_no: item.lr_no || '',
                                bus_no: (item.bus_no) || '',
                                driver_no: Number(item.driver_no) || '',

                            }));
                            setdelivery(transformedDeliveryDetail);
                            console.log("delivery", transformedDeliveryDetail);

                        } else {
                            setError('No delivery details found.');
                        }

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


                        setError('');
                    }





                    else {
                        setError('No data found for this ticket token.');
                    }





                }

                else {

                    setdelivery([]);
                    setparcelDetail([]);
                    setError('Ticket token not found.');
                }
            } catch (error) {
                setError('Error fetching ticket data. Please try again later.');
                console.error('Error fetching ticket data:', error);
            }
        };

        fetchData();
        window.addEventListener('popstate', handleURLChange);
        handleURLChange();

        return () => {
            window.removeEventListener('popstate', handleURLChange);
        };
    }, []);




    const getTicketDetail = async (ticketToken: string) => {
        try {
            const getTDetail = await EditParcelDataList.getEditParcelData(ticketToken);
            console.log("data", getTDetail.data[0]);

            const { from_state, book_from, to_state, book_to } = getTDetail.data[0];
            setSelectedFromStateId(from_state);
            setSelectedToStateId(to_state);
            fetchCities(from_state, true);
            fetchCities(to_state, false);
            setParcelData(getTDetail.data[0]);
            setValue("firstName", getTDetail.data[0].client_firstName);
            setInputValue(getTDetail.data[0].client_firstName);
            setValue("email", getTDetail.data[0].client_email)
            setValue("client_id", getTDetail.data[0].client_id)
            setSelectedClientId(getTDetail.data[0].client_id);
            setValue("address", getTDetail.data[0].client_address);
            setValue("mobileNo", getTDetail.data[0].client_mobileNo);
            setMobileNoValue(getTDetail.data[0].mobileNo);
            setValue("sender_whatsapp_no", getTDetail.data[0].sender_whatsapp_no);
            setSenderMobileValue(getTDetail.data[0].sender_whatsapp_no);
            setValue("receiver_whatsapp_no", getTDetail.data[0].receiver_whatsapp_no);
            setWMobileNoValue(getTDetail.data[0].receiver_whatsapp_no);
            setValue("client_city", getTDetail.data[0].client_city);
            setValue("client_state", getTDetail.data[0].client_state);
            setValue("client_pincode", getTDetail.data[0].client_pincode);
            setValue("sender_name", getTDetail.data[0].sender_name);
            setValue("send_mob", getTDetail.data[0].send_mob);
            setValue("send_add", getTDetail.data[0].send_add);
            setSenderDetails(getTDetail.data[0].send_mob)
            setSenderDetails(getTDetail.data[0].send_add)
            setSenderDetails(getTDetail.data[0].sender_name)
            setValue("rec_name", getTDetail.data[0].rec_name);
            setValue("rec_mob", getTDetail.data[0].rec_mob);
            setValue("rec_add", getTDetail.data[0].rec_add);
            setValue("is_client_send_or_rec", getTDetail.data[0].is_client_send_or_rec);
            setSenderOption(getTDetail.data[0].is_client_send_or_rec)
            setReceiverDetails(getTDetail.data[0].rec_mob)
            setReceiverDetails(getTDetail.data[0].rec_add)
            setReceiverDetails(getTDetail.data[0].rec_name)
            setClientDetails(getTDetail.data[0].client_id)
            setError("");
            console.log("fgdjg", senderDetails);
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
                sender_proof_type: '',
                reciver_proof_type: '',
                pic_office_charge: 0,
                qty_total: 0,
                print_total: 0,
                print_payable_amount: 0,
                print_gst_amount: 0,
                print_bal_amount: 0,
                print_paid_amount: 0,
                dis_office_charge: 0,
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
                bilty_charge: 20,
                actual_payable_amount: 0,
                user_id: storedData,
                last_updated_by: storedData,
                pic_address: [{ pickup_client_address: '', pickup_office_address: '', pickup_charge: '', pic_hamali_charge: "", pic_other_charge: '' }],
                dis_address: [{ dispatch_client_address: '', dispatch_office_address: '', dispatch_charge: '', dis_hamali_charge: '', dis_other_charge: '' }],





            }
        }
    );
    setValue("parcel_id", parcelData.id)
    setValue("booking_date", parcelData.booking_date)
    setValue("actual_bal_amount", parcelData.actual_bal_amount)
    setValue("book_from", parcelData.book_from)
    setValue("book_to", parcelData.book_to)
    setValue("particulars", parcelData.particulars)
    setValue("rec_name", parcelData.rec_name)
    setValue("sender_proof_type", parcelData.sender_proof_type)
    setValue("pic_delivery_type", parcelData.pic_delivery_type)
    setValue("pic_office_charge", parcelData.pic_office_charge)
    setValue("dis_delivery_type", parcelData.dis_delivery_type)
    setValue("transport_charge", parcelData.transport_charge)
    setValue("from_state", parcelData.from_state)
    setValue("to_state", parcelData.to_state)
    setValue("dispatch_date", parcelData.dispatch_date)
    setValue("reciver_proof_detail", parcelData.reciver_proof_detail)
    setValue("dis_office_detail", parcelData.dis_office_detail)
    setValue("pic_office_detail", parcelData.pic_office_detail)
    setValue("total_dispatch_charge", parcelData.total_dispatch_charge)
    setValue("total_pickup_charge", parcelData.total_pickup_charge)
    setValue("actual_total", parcelData.actual_total)
    setValue("print_total", parcelData.print_total)
    setValue("print_payable_amount", parcelData.print_payable_amount)
    setValue("print_gst_amount", parcelData.print_gst_amount)
    setValue("print_bal_amount", parcelData.print_bal_amount)
    setValue("actual_payable_amount", parcelData.actual_payable_amount)
    setValue("dis_office_charge", parcelData.dis_office_charge)
    setValue("sender_proof_detail", parcelData.sender_proof_detail)
    setValue("reciver_proof_type", parcelData.reciver_proof_type)
    setValue("demurrage_charges", parcelData.demurrage_charges)
    setValue("demurrage_days", parcelData.demurrage_days)
    setValue("total_demurrage_charges", parcelData.total_demurrage_charges)
    setValue("is_demurrage", parcelData.is_demurrage)

    //=========================================================================================================================   

    const appendPicAddress = () => {

        setAddressFields({
            ...addressFields,
            pic_address: [...addressFields.pic_address, { pickup_client_address: '', pickup_office_address: '', pickup_charge: '', pic_hamali_charge: ' ', pic_other_charge: '' }],
        });
    };

    const removePicAddress = (index: number) => {
        const newAddresses = [...addressFields.pic_address];
        newAddresses.splice(index, 1);

        const newTotalPickupCharge = calculateTotalPickupCharge(newAddresses, 0);

        const totalDispatchCharge = calculateTotalDispatchCharge(addressFields.dis_address, parcelData.dis_office_charge);

        const totalTransportCharge = totalDispatchCharge + newTotalPickupCharge;

        const sumTotalAmount = parcelDetail.reduce((acc, item) => acc + (item.total_amount || 0), 0);
        const formattedSumAmount = sumTotalAmount.toFixed(2);

        const sumPrintTotalAmount = parcelDetail.reduce((acc, item) => acc + (item.total_print_rate || 0), 0);
        const formattedPrintSumAmount = sumPrintTotalAmount.toFixed(2);
        const totalAmountWithTransport = sumTotalAmount + totalTransportCharge;
        const gstAmount = totalAmountWithTransport * 0.05;
        const formattedGstAmount = gstAmount.toFixed(2);

        const printTotalAmountWithTransport = sumPrintTotalAmount + totalTransportCharge;
        const printGstAmount = printTotalAmountWithTransport * 0.05;
        const printFormattedGstAmount = printGstAmount.toFixed(2);

        let runningQtyTotal = 0;
        const recalculatedFields = parcelDetail.map(item => {
            runningQtyTotal += Number(item.qty || 0);
            return {
                ...item,
                QTYtotal: runningQtyTotal
            };
        });

        const blityCharge = Number(parcelData.bilty_charge);
        const demurragedays = Number(parcelData.demurrage_days);
        const demurrageCharges = Number(parcelData.demurrage_charges);

        const totalDemurrageCharges = demurragedays * demurrageCharges * runningQtyTotal;

        const actualPayableAmount = sumTotalAmount + gstAmount + blityCharge + totalTransportCharge + totalDemurrageCharges;
        const actualPrintPayableAmount = sumPrintTotalAmount + printGstAmount + blityCharge + totalTransportCharge + totalDemurrageCharges;

        setAddressFields({
            ...addressFields,
            pic_address: newAddresses,
        });

        setParcelData((prevState: any) => ({
            ...prevState,
            total_pickup_charge: newTotalPickupCharge,
            transport_charge: totalTransportCharge.toString(),
            actual_total: formattedSumAmount,
            print_total: formattedPrintSumAmount,
            gst_amount: formattedGstAmount,
            print_gst_amount: printFormattedGstAmount,
            actual_payable_amount: actualPayableAmount,
            print_payable_amount: actualPrintPayableAmount,
            total_demurrage_charges: totalDemurrageCharges,
            actual_bal_amount: (actualPayableAmount - (parseFloat(prevState.actual_paid_amount) || 0)).toFixed(2),
            print_bal_amount: (actualPrintPayableAmount - (parseFloat(prevState.print_paid_amount) || 0)).toFixed(2),
        }));

        setValue('pic_address', newAddresses);
        setValue('total_pickup_charge', newTotalPickupCharge);
        console.log('New Total Transport Charge:', totalTransportCharge);
    };


    const appendDisAddress = () => {
        setAddressFields({
            ...addressFields,
            dis_address: [...addressFields.dis_address, { dispatch_client_address: '', dispatch_office_address: '', dispatch_charge: '', dis_hamali_charge: '', dis_other_charge: '' }],
        });
    };

    const removeDisAddress = (index: number) => {
        const newAddresses = [...addressFields.dis_address];
        newAddresses.splice(index, 1);

        const newTotalDispatchCharge = calculateTotalDispatchCharge(newAddresses, 0);
        const newTotalPickupCharge = calculateTotalPickupCharge(addressFields.pic_address, parcelData.pic_office_charge);

        const totalTransportCharge = newTotalDispatchCharge + newTotalPickupCharge;

        const sumTotalAmount = parcelDetail.reduce((acc, item) => acc + (item.total_amount || 0), 0);
        const formattedSumAmount = sumTotalAmount.toFixed(2);

        const sumPrintTotalAmount = parcelDetail.reduce((acc, item) => acc + (item.total_print_rate || 0), 0);
        const formattedPrintSumAmount = sumPrintTotalAmount.toFixed(2);

        const totalAmountWithTransport = sumTotalAmount + totalTransportCharge;
        const gstAmount = totalAmountWithTransport * 0.05;
        const formattedGstAmount = gstAmount.toFixed(2);

        const printTotalAmountWithTransport = sumPrintTotalAmount + totalTransportCharge;
        const printGstAmount = printTotalAmountWithTransport * 0.05;
        const printFormattedGstAmount = printGstAmount.toFixed(2);

        let runningQtyTotal = 0;
        const recalculatedFields = parcelDetail.map(item => {
            runningQtyTotal += Number(item.qty || 0);
            return {
                ...item,
                QTYtotal: runningQtyTotal
            };
        });
        const blityCharge = Number(parcelData.bilty_charge);
        const demurragedays = Number(parcelData.demurrage_days);
        const demurrageCharges = Number(parcelData.demurrage_charges);
        const totalDemurrageCharges = demurragedays * demurrageCharges * runningQtyTotal;
        const actualPayableAmount = sumTotalAmount + gstAmount + blityCharge + totalTransportCharge + totalDemurrageCharges;
        const actualPrintPayableAmount = sumPrintTotalAmount + printGstAmount + blityCharge + totalTransportCharge + totalDemurrageCharges;


        setAddressFields({
            ...addressFields,
            dis_address: newAddresses,
        });

        setParcelData((prevState: any) => ({
            ...prevState,
            total_dispatch_charge: newTotalDispatchCharge,
            transport_charge: totalTransportCharge.toString(),
            actual_total: formattedSumAmount,
            print_total: formattedPrintSumAmount,
            gst_amount: formattedGstAmount,
            print_gst_amount: printFormattedGstAmount,
            actual_payable_amount: actualPayableAmount,
            print_payable_amount: actualPrintPayableAmount,
            total_demurrage_charges: totalDemurrageCharges,
            actual_bal_amount: (actualPayableAmount - (parseFloat(prevState.actual_paid_amount) || 0)).toFixed(2),
            print_bal_amount: (actualPrintPayableAmount - (parseFloat(prevState.print_paid_amount) || 0)).toFixed(2),
        }));

        setValue('dis_address', newAddresses);
        setValue('total_dispatch_charge', newTotalDispatchCharge);
        console.log('New Total Dispatch Charge:', newTotalDispatchCharge);
        console.log('New Total Transport Charge:', (newTotalDispatchCharge + newTotalPickupCharge).toString());
    };

    /********************************************parcel_bill_details*******************************************************/
    const handleEwayChange = (e: React.ChangeEvent<HTMLInputElement>, index: number, field: keyof ParcelBillDetail) => {
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


        const newTotalDispatchCharge = calculateTotalDispatchCharge(addressFields.dis_address, parcelData.dis_office_charge);
        const newTotalPickupCharge = calculateTotalPickupCharge(addressFields.pic_address, parcelData.pic_office_charge);
        const totalTransportCharge = newTotalDispatchCharge + newTotalPickupCharge


        // Update actual_total and print_total
        const sumTotalAmount = updatedFields.reduce((acc, item) => acc + (item.total_amount || 0), 0);
        const formattedSumAmount = sumTotalAmount.toFixed(2);


        console.log("total_amount", formattedSumAmount);


        const sumPrintTotalAmount = updatedFields.reduce((acc, item) => acc + (item.total_print_rate || 0), 0);
        const formattedPrintSumAmount = sumPrintTotalAmount.toFixed(2);

        console.log("print_total", formattedPrintSumAmount);


        const totaltransportcharge = totalTransportCharge





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

    //------------------------------------------------------------------------------------------------------------------------------
    const calculateTotalDispatchCharge = (addresses: any, officeCharge: any) => {
        const addressTotal = addresses.reduce((total: any, field: any) => {
            return total + (parseFloat(field.dispatch_charge) || 0) +
                (parseFloat(field.dis_hamali_charge) || 0) +
                (parseFloat(field.dis_other_charge) || 0);
        }, 0);

        return parcelData.dis_delivery_type === "1" ? addressTotal + (parseFloat(officeCharge) || 0) : addressTotal;
    };

    const calculateTotalPickupCharge = (addresses: any, officeCharge: any) => {
        const addresspictotal = addresses.reduce((total: any, field: any) => {
            return total + (parseFloat(field.pickup_charge) || 0) +
                (parseFloat(field.pic_hamali_charge) || 0) +
                (parseFloat(field.pic_other_charge) || 0);
        }, 0);

        return parcelData.pic_delivery_type === "1" ? addresspictotal + (parseFloat(officeCharge) || 0) : addresspictotal;
    };
    //---------------------------------------------------------------------------------------------------------------------------------------

    const handleFieldChange = (fieldName: string, value: string) => {
        const updatedParcelData = { ...parcelData, [fieldName]: value };

        if (fieldName === 'pic_charge' || fieldName === 'dis_charge') {
            const picCharge = parseFloat(updatedParcelData.pic_charge) || 0;
            const disCharge = parseFloat(updatedParcelData.dis_charge) || 0;
            updatedParcelData.transport_charge = (picCharge + disCharge).toString();
        }

        // if (fieldName === 'pic_delivery_type') {
        //     if (value === "1") {
        //         // Clear pic_address but keep the structure, adding back an empty object
        //         setAddressFields({
        //             pic_address: [{
        //                 pickup_client_address: '',
        //                 pickup_office_address: '',
        //                 pickup_charge: '',
        //                 pic_hamali_charge: '',
        //                 pic_other_charge: ''
        //             }],
        //             dis_address: addressFields.dis_address // Keep dis_address intact
        //         });
        //     }
        //     // You can handle the case for value "2" if needed
        // }

        // console.log(">>>>>", addressFields.pic_address);

















        const totalDispatchCharge = calculateTotalDispatchCharge(addressFields.dis_address, updatedParcelData.dis_office_charge);
        const totalPickupCharge = calculateTotalPickupCharge(addressFields.pic_address, updatedParcelData.pic_office_charge);

        updatedParcelData.transport_charge = totalDispatchCharge + totalPickupCharge;

        const sumTotalAmount = parcelDetail.reduce((acc, item) => acc + (item.total_amount || 0), 0);
        const formattedSumAmount = sumTotalAmount.toFixed(2);

        const sumPrintTotalAmount = parcelDetail.reduce((acc, item) => acc + (item.total_print_rate || 0), 0);
        const formattedPrintSumAmount = sumPrintTotalAmount.toFixed(2);

        const totaltransportcharge = updatedParcelData.transport_charge;

        const totalAmountWithTransport = sumTotalAmount + totaltransportcharge;
        const gstAmount = totalAmountWithTransport * 0.05;
        const formattedGstAmount = gstAmount.toFixed(2);

        const printtotalAmountWithTransport = sumPrintTotalAmount + totaltransportcharge;
        const pritngstAmount = printtotalAmountWithTransport * 0.05;
        const printformattedGstAmount = pritngstAmount.toFixed(2);

        const blityCharge = Number(updatedParcelData.bilty_charge);
        const demurragedays = Number(updatedParcelData.demurrage_days);
        const demurrageCharges = Number(updatedParcelData.demurrage_charges);

        let runningQtyTotal = 0;
        const updatedFields = parcelDetail.map(item => {
            runningQtyTotal += Number(item.qty || 0);
            return {
                ...item,
                QTYtotal: runningQtyTotal
            };
        });

        const totalDemurrageCharges = demurragedays * demurrageCharges * runningQtyTotal;

        const actualPayableAmount = sumTotalAmount + gstAmount + blityCharge + totaltransportcharge + totalDemurrageCharges;
        const actualPrintPaybleamount = sumPrintTotalAmount + pritngstAmount + blityCharge + totaltransportcharge + totalDemurrageCharges;
        const actualPaidAmount = parseFloat(updatedParcelData.actual_paid_amount) || 0;
        const actualbalamount = actualPayableAmount - actualPaidAmount;

        const actualPrintPaidAmount = parseFloat(updatedParcelData.print_paid_amount) || 0;
        const actualprintbalamount = actualPrintPaybleamount - actualPrintPaidAmount;


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
            actual_bal_amount: actualbalamount.toFixed(2),
            print_bal_amount: actualprintbalamount.toFixed(2),
            total_pickup_charge: totalPickupCharge,
            total_dispatch_charge: totalDispatchCharge
        }));

        setparcelDetail(updatedFields);


    };




    const removeParcelDetail = (index: number) => {
        const updatedFields = [...parcelDetail];
        updatedFields.splice(index, 1);

        const sumTotalAmount = updatedFields.reduce((acc, item) => acc + (item.total_amount || 0), 0);
        const formattedSumAmount = sumTotalAmount.toFixed(2);

        const sumPrintTotalAmount = updatedFields.reduce((acc, item) => acc + (item.total_print_rate || 0), 0);
        const formattedPrintSumAmount = sumPrintTotalAmount.toFixed(2);

        const newTotalDispatchCharge = calculateTotalDispatchCharge(addressFields.dis_address, parcelData.dis_office_charge);
        const newTotalPickupCharge = calculateTotalPickupCharge(addressFields.pic_address, parcelData.pic_office_charge);
        const totalTransportCharge = newTotalDispatchCharge + newTotalPickupCharge

        const totaltransportcharge = totalTransportCharge;

        const totalAmountWithTransport = sumTotalAmount + totaltransportcharge;
        const gstAmount = totalAmountWithTransport * 0.05;
        const formattedGstAmount = gstAmount.toFixed(2);

        const printtotalAmountWithTransport = sumPrintTotalAmount + totaltransportcharge;
        const pritngstAmount = printtotalAmountWithTransport * 0.05;
        const printformattedGstAmount = pritngstAmount.toFixed(2);

        let runningQtyTotal = 0;
        const recalculatedFields = updatedFields.map(item => {
            runningQtyTotal += Number(item.qty || 0);
            return {
                ...item,
                QTYtotal: runningQtyTotal
            };
        });

        const blityCharge = Number(parcelData.bilty_charge);
        const demurragedays = Number(parcelData.demurrage_days);
        const demurrageCharges = Number(parcelData.demurrage_charges);

        const totalDemurrageCharges = demurragedays * demurrageCharges * runningQtyTotal;

        const actualPayableAmount = sumTotalAmount + gstAmount + blityCharge + totaltransportcharge + totalDemurrageCharges;
        const actualPrintPaybleamount = sumPrintTotalAmount + pritngstAmount + blityCharge + totaltransportcharge + totalDemurrageCharges;

        const actualPaidAmount = parseFloat(parcelData.actual_paid_amount) || 0;
        const actualbalamount = actualPayableAmount - actualPaidAmount;

        const actualPrintPaidAmount = parseFloat(parcelData.print_paid_amount) || 0;
        const actualprintbalamount = actualPrintPaybleamount - actualPrintPaidAmount;
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

    const adddeliveryField = () => {
        const newId = delievery.length > 0 ? delievery[delievery.length - 1].id + 1 : 1;
        setdelivery([
            ...delievery,
            {
                id: newId,
                lr_no: '',
                bus_no: '',
                driver_no: '',
                other_charge: ''
            }
        ]);
    };


    const removerDelivery = (index: number) => {
        const updatedFields = [...delievery];
        updatedFields.splice(index, 1);
        setdelivery(updatedFields);

        setValue('delivery', updatedFields);
    };


    const handledeliberyChange = (e: React.ChangeEvent<HTMLInputElement>, index: number, field: keyof Delivery) => {
        const updatedFields = [...delievery];
        updatedFields[index] = {
            ...updatedFields[index],
            [field]: e.target.value
        };
        setdelivery(updatedFields);
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


    //------------------------------------------------------------------------------------------------------------------------
    const [senderOption, setSenderOption] = useState<string>('');
    const [clientDetails, setClientDetails] = useState<ClientData | null>(null);
    const [senderDetails, setSenderDetails] = useState<SenderDetails>({
        sender_name: '',
        send_mob: '',
        send_add: "",
    });
    const [receiverDetails, setReceiverDetails] = useState<ReceiverDetails>({
        rec_name: '',
        rec_mob: '',
        rec_add: "",
    });


    const handlesenderOptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedOption = e.target.value;
        setSenderOption(selectedOption);

        if (selectedOption === 'sender' && clientDetails) {
            setSenderDetails({
                sender_name: parcelData.client_firstName,
                send_mob: parcelData.client_mobileNo,
                send_add: parcelData.client_address,
            });
            setReceiverDetails({
                rec_name: '',
                rec_mob: '',
                rec_add: "",
            });
        } else if (selectedOption === 'receiver' && clientDetails) {
            setReceiverDetails({
                rec_name: parcelData.client_firstName,
                rec_mob: parcelData.client_mobileNo,
                rec_add: parcelData.client_address,
            });
            setSenderDetails({
                sender_name: '',
                send_mob: '',
                send_add: "",
            });
        }
        else if (selectedOption === 'other_data') {
            setSenderDetails({
                sender_name: '',
                send_mob: '',
                send_add: "",
            });
            setReceiverDetails({
                rec_name: '',
                rec_mob: '',
                rec_add: "",
            });
        };

    }

    //-------------------------------------Client data------------------------------------------------------------------------------------------
    const [mobileNoValue, setMobileNoValue] = useState<string>('');

    const handleMobileNoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/[^\d]/g, ''); // Remove non-digit characters
        if (value.length <= 10) { // Restrict to 10 digits
            setMobileNoValue(value);
            setValue("mobileNo", value); // Update form value
        }
    };

    const [SenderMobileValue, setSenderMobileValue] = useState<string>('');

    const handleSenderMobileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/[^\d]/g, ''); // Remove non-digit characters
        if (value.length <= 10) { // Restrict to 10 digits
            setSenderMobileValue(value);
            setValue("sender_whatsapp_no", value); // Update form value
        }
    };

    const [WmobileNoValue, setWMobileNoValue] = useState<string>('');

    const handleWMobileNoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/[^\d]/g, ''); // Remove non-digit characters
        if (value.length <= 10) { // Restrict to 10 digits
            setWMobileNoValue(value);

            setValue("receiver_whatsapp_no", value); // Update form value
        }
    };

    //------------------------------------------------------------------------------------------------------------------
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

            const fileProof = selectedClient.id_proof_urls;
            setImageName(fileProof)

            console.log(fileProof);
            if (selectedClient) {
                setClientDetails(selectedClient);
            }

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
        setValue("mobileNo", '');
        setValue("client_city", '');
        setValue("client_state", '');
        setValue("client_pincode", '');
        setValue("client_id_proof", '');

        setMobileNoValue('');

    };


    //------------------------------------------------------------------------------------------------------------------------
    const onSubmit: SubmitHandler<FormData> = async (formData: any) => {
        if (senderOption === 'sender') {
            parcelData.sender_name = senderDetails.sender_name;
            parcelData.send_mob = senderDetails.send_mob;
            parcelData.send_add = senderDetails.send_add;
        } else if (senderOption === 'receiver') {
            parcelData.rec_name = receiverDetails.rec_name;
            parcelData.rec_mob = receiverDetails.rec_mob;
            parcelData.rec_add = receiverDetails.rec_add;
        }

        console.log('Submitting:', senderOption);
        console.log(">>>>>>>>>>>>>>>>", formData);

        try {
            let fromStateName = '';
            let toStateName = '';
            let fromCityName = '';
            let toCityName = '';

            const selectedFromStateIdStr = String(selectedFromStateId);
            const selectedToStateIdStr = String(selectedToStateId);

            const fromState = fromStates.find(state => String(state.id) === selectedFromStateIdStr);
            const toState = toStates.find(state => String(state.id) === selectedToStateIdStr);

            if (fromState) {
                fromStateName = fromState.name;
            }
            if (toState) {
                toStateName = toState.name;
            }

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

            // Handle custom cities if needed
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

            formData.remove_files = removedFileNames;

            const finalData: FormData = {
                ...formData,
            };

            let clientId: number | undefined;

            if (isAddingNewClient) {
                finalData.client_id = "";
                console.log(finalData, "finalData");

                const response = await submitNewClientFormData(finalData);
                console.log('Form data submitted successfully for new client.', finalData);
                clientId = response.client_id;
                console.log(clientId);

                setIsAddingNewClient(false);
            } else if (selectedClientId) {
                finalData.client_id = selectedClientId;
                clientId = selectedClientId;
                const parcelDataResponse = await submitFormData(finalData, clientId);
                console.log('Form data submitted successfully with selected client id:', finalData);

                if (!parcelDataResponse.ok) {
                    throw new Error('Failed to create parcel data');
                }
                const parcelData = await parcelDataResponse.json();
                console.log("images", parcelData.parcel_token);

                if (parcelData.status == 1) {
                    console.log("formData", formData);

                    // if (parcelData.status == 1) {
                    //     console.log("formData0", formData);

                    //     if (formData.parcel_imgs && formData.parcel_imgs.length > 0) {
                    //         const formDataImages = new FormData();
                    //         formDataImages.append("parcel_token", parcelData.parcel_token);

                    //         for (const file of formData.parcel_imgs) {
                    //             formDataImages.append("parcel_imgs", file);
                    //         }

                    //         console.log('FormData prepared for images:', formDataImages);

                    //         try {
                    //             const uploadResponse = await axios.post("http://192.168.0.106:3001/parcel/upload_parcel_image", formDataImages, {
                    //                 headers: {
                    //                     'Content-Type': 'multipart/form-data'
                    //                 }
                    //             });

                    //             const uploadResult = uploadResponse.data;
                    //             console.log('Image upload response:', uploadResult);

                    //             if (uploadResult.status === "1") {
                    //                 console.log("Images added successfully");
                    //             } else {
                    //                 console.log("Failed to upload images");
                    //             }
                    //         } catch (uploadError) {
                    //             console.error("Error uploading images:", uploadError);
                    //             alert("Failed to upload images");
                    //         }
                    //     } else {
                    //         console.log("No images to upload");
                    //     }

                    //     // if (parcelData.parcel_token) {
                    //     //     try {
                    //     //         const parcelDetailResponse = await EditParcelDataList.getEditParcelData(parcelData.data.parcel_token);
                    //     //         console.log("Parcel data:", parcelDetailResponse.data[0]);
                    //     //         handleParcelPrint(parcelDetailResponse.data[0]);
                    //     //         router.push("/parcel_list");
                    //     //     } catch (fetchError) {
                    //     //         console.error('Error fetching parcel data:', fetchError);
                    //     //     }
                    //     // }

                    // } else {
                    //     console.log("Failed to update parcel details");
                    // }

                    if (formData.sender_id_proof || formData.receiver_id_proof) {
                        const idProofData = new FormData();
                        idProofData.append("parcel_token", parcelData.parcel_token);

                        if (formData.sender_id_proof && formData.sender_id_proof.length > 0) {
                            for (const file of formData.sender_id_proof) {
                                idProofData.append("sender_id_proof", file);
                            }
                        }

                        // Check if receiver ID proof exists and append to the FormData
                        if (formData.receiver_id_proof && formData.receiver_id_proof.length > 0) {
                            for (const file of formData.receiver_id_proof) {
                                idProofData.append("receiver_id_proof", file);
                            }
                        }

                        try {
                            const response = await fetch("http://192.168.0.106:3001/parcel/upload_id_proof", {
                                method: "POST",
                                body: idProofData,
                            });
                            const result = await response.json();
                            if (result.status === "1") {
                                console.log("ID proofs uploaded successfully");
                            } else {
                                console.log("Failed to upload ID proofs");
                            }
                        } catch (error) {
                            console.error("Error uploading ID proofs:", error);
                        }
                    } else {
                        console.log("No sender ID proofs to upload");
                    }

                    if (formData.client_id_proof && formData.client_id_proof.length > 0) {
                        const file = formData.client_id_proof[0];

                        // Only upload if a new file is provided
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

                    if (parcelData.parcel_token) {
                        try {
                            const parcelDetailResponse = await EditParcelDataList.getEditParcelData(parcelData.parcel_token);
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

            } else {
                console.log('Please select a client or add a new client before submitting.');
                return;
            }

        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };

    const uploadClientProofId = async (file: File, clientId: number) => {
        const formData = new FormData();
        formData.append("client_id_proof", file);
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

    async function submitFormData(formData: FormData, clientId: number | undefined) {
        const response = await fetch('http://192.168.0.106:3001/parcel/update_parcel_detail_data', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });

        return response;
    }

    async function submitNewClientFormData(formData: FormData) {
        try {
            const response = await axios.post('http://192.168.0.106:3001/parcel/update_parcel_detail_data', formData);
            console.log('Form data submitted successfully for new client.', response.data);
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
    }

    //------------------------------------------------------------------------------------------------------------------------

    const handleShowCustomCityInput = () => {
        setShowCustomCityInput(true);
    };

    const handleShowCustomToCityInput = () => {
        setShowCustomToCityInput(true);
    };

    useEffect(() => {
        // If the delivery type is 'Client Location' (2), initialize pic_address with empty fields
        if (parcelData.pic_delivery_type === "2") {
            setAddressFields({
                ...addressFields,
                pic_address: [{
                    pickup_client_address: '',
                    pickup_office_address: '',
                    pickup_charge: '',
                    pic_hamali_charge: '',
                    pic_other_charge: ''
                }]
            });
        }
        // If the delivery type is 'Office' (1), reset pic_address
        else if (parcelData.pic_delivery_type === "1") {
            setAddressFields({ ...addressFields, pic_address: [] });
        }
    }, [parcelData.pic_delivery_type]);

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

            <div className="container" style={{ fontSize: "12px" }}>
                <br />
                <div style={{ display: "flex", justifyContent: "space-between" }}><h4>Update Parcel Booking</h4>
                    <div>
                        <Link href="/parcel_list" className="btn btn-sm btn-primary" style={{ float: "right", marginRight: "8px" }}>Back</Link>
                    </div>

                </div>
                <br />
                <Card className='cardbox'>
                    {parcelData && (
                        <Card.Body>
                            <form onSubmit={handleSubmit(onSubmit)}>

                                {/* First-Row */}
                                <div className="row mb-3">




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
                                </div>

                                {/* second-Row */}
                                <div className='row mb-3'>

                                    <div className="col-lg-3">
                                        <label className="form-label" htmlFor="to">Booking date</label>
                                        <input {...register('booking_date')} className="form-control form-control-sm" value={parcelData.booking_date} onChange={(e) => handleFieldChange('booking_date', e.target.value)} type="date" id="booking_date" placeholder="Booking date" />
                                    </div>
                                    <div className="col-lg-3">
                                        <label className="form-label" htmlFor="to">Disptach date</label>
                                        <input {...register('dispatch_date')} value={parcelData.dispatch_date} onChange={(e) => handleFieldChange('dispatch_date', e.target.value)} className="form-control form-control-sm" type="date" id="dispatch_date" placeholder="Disptach date" />
                                    </div>

                                </div>





                                <div className="row mb-3">


                                    <div className="col-md-12">
                                        <h6>Client Details:</h6>                                    </div>
                                    <hr />
                                </div>

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


                                <div className="row mb-3">
                                    <div className="col-lg-6">
                                        <label className="form-label" htmlFor="send_mob">Is Sender Or Receiver?</label>&nbsp;
                                        <br />
                                        <div className="d-flex gap-2">
                                            <input
                                                {...register('is_client_send_or_rec')}
                                                type="radio"
                                                checked={senderOption === 'sender'}
                                                onChange={handlesenderOptionChange}
                                                id="sender"
                                                value="sender"
                                            /> Sender
                                            <input
                                                {...register('is_client_send_or_rec')}
                                                type="radio"
                                                checked={senderOption === 'receiver'}
                                                onChange={handlesenderOptionChange}
                                                value="receiver"
                                            /> Receiver
                                            <input
                                                {...register('is_client_send_or_rec')}
                                                type="radio"
                                                checked={senderOption === 'other_data'}
                                                onChange={handlesenderOptionChange}
                                                value="other_data"
                                            /> Other
                                        </div>
                                    </div>
                                </div>


                                <div className="row mt-4">
                                    <div className="col-md-6">
                                        <h5>Sender Details:</h5>
                                    </div>
                                    <div className="col-md-6">
                                        <h5>Reciever Details:</h5>
                                    </div>
                                    <hr />
                                </div>
                                <div className="row mb-3">
                                    <div className="col-lg-3">
                                        <label className="form-label" htmlFor="sender_name">Sender Name</label>
                                        <input
                                            {...register('sender_name')}
                                            className="form-control form-control-sm"
                                            type="text"
                                            id="sender_name"
                                            placeholder="Sender Name"
                                            value={senderDetails.sender_name}
                                            onChange={(e) => setSenderDetails({ ...senderDetails, sender_name: e.target.value })}
                                        />
                                    </div>
                                    <div className="col-lg-3">
                                        <label className="form-label" htmlFor="send_mob">Sender Mobile No.</label>
                                        <input
                                            type="text"
                                            {...register("send_mob", { minLength: 10 })}
                                            className="form-control form-control-sm"
                                            name="send_mob"
                                            id="send_mob"
                                            placeholder="Enter Sender Mobile No"
                                            value={senderDetails.send_mob}
                                            onChange={(e) => setSenderDetails({ ...senderDetails, send_mob: e.target.value })}
                                        />
                                        {errors.send_mob?.type === "required" && <span id="show_mobile_err" className="error">Enter 10 Digits Mobile Number.</span>}
                                        {errors?.send_mob?.type === "minLength" && <span id="show_mobile_err" className="error">Enter 10 Digits Mobile Number.</span>}

                                    </div>
                                    <div className="col-lg-3">
                                        <label className="form-label" htmlFor="rec_name">Receiver Name</label>
                                        <input
                                            {...register('rec_name', {})}
                                            className="form-control form-control-sm"
                                            type="text"
                                            id="rec_name"
                                            placeholder="Receiver Name"
                                            value={receiverDetails.rec_name}
                                            onChange={(e) => setReceiverDetails({ ...receiverDetails, rec_name: e.target.value })}
                                        />
                                    </div>
                                    <div className="col-lg-3">
                                        <label className="form-label" htmlFor="rec_mob">Receiver Mobile No.</label>
                                        <input
                                            type="text"
                                            {...register("rec_mob", { minLength: 10 })}
                                            className="form-control form-control-sm"
                                            name="rec_mob"
                                            id="rec_mob"
                                            placeholder="Enter Receiver Mobile No"
                                            value={receiverDetails.rec_mob}
                                            onChange={(e) => setReceiverDetails({ ...receiverDetails, rec_mob: e.target.value })}
                                        />
                                        {errors.rec_mob?.type === "required" && <span id="show_mobile_err" className="error">Enter 10 Digits Mobile Number.</span>}
                                        {errors?.rec_mob?.type === "minLength" && <span id="show_mobile_err" className="error">Enter 10 Digits Mobile Number.</span>}

                                        <span id="rec_mobile_err" ></span>
                                    </div>
                                </div>

                                {/* --------------*/}
                                <div className="row mb-3">
                                    <div className="col-lg-3">
                                        <label className="form-label" htmlFor="send_add">Sender Address</label>
                                        <textarea
                                            {...register('send_add')}
                                            className="form-control form-control-sm"
                                            id="send_add"
                                            placeholder="Sender address"
                                            value={senderDetails.send_add}
                                            onChange={(e) => setSenderDetails({ ...senderDetails, send_add: e.target.value })}
                                        />
                                    </div>
                                    <div className="col-lg-3">
                                        <label className="form-label" style={{ appearance: "textfield" }} htmlFor="mobile">Sender Whatsapp No</label>
                                        <input
                                            type="text"
                                            {...register("sender_whatsapp_no", {
                                                required: true,
                                                minLength: 10,
                                                maxLength: 10,
                                                pattern: /^[0-9]+$/
                                            })}
                                            value={SenderMobileValue}
                                            onChange={handleSenderMobileChange}
                                            className={`form-control form-control-sm ${errors.sender_whatsapp_no ? 'is-invalid' : ''}`}
                                            id="sender_whatsapp_no"

                                            placeholder="Enter Mobile No"
                                        />
                                        {errors?.sender_whatsapp_no?.type === "required" && <span className="error">Enter 10 Digits Mobile Number.</span>}
                                        {errors?.sender_whatsapp_no?.type === "minLength" && <span className="error">Enter 10 Digits Mobile Number.</span>}
                                        {errors?.sender_whatsapp_no?.type === "pattern" && <span className="error">Enter numeric characters only.</span>}

                                    </div>
                                    <div className="col-lg-3">
                                        <label className="form-label" htmlFor="ex_rate">Receiver Address</label>
                                        <textarea
                                            {...register('rec_add')}
                                            className="form-control form-control-sm"
                                            id="rec_add"
                                            placeholder="receiver address"
                                            value={receiverDetails.rec_add}
                                            onChange={(e) => setReceiverDetails({ ...receiverDetails, rec_add: e.target.value })}
                                        />                                    </div>
                                    <div className="col-lg-3">
                                        <label className="form-label" style={{ appearance: "textfield" }} htmlFor="mobile">Reciver Whatsapp No</label>
                                        <input
                                            type="text"
                                            {...register("receiver_whatsapp_no", {
                                                required: true,
                                                minLength: 10,
                                                maxLength: 10,
                                                pattern: /^[0-9]+$/
                                            })}
                                            value={WmobileNoValue}
                                            onChange={handleWMobileNoChange}
                                            className={`form-control form-control-sm ${errors.receiver_whatsapp_no ? 'is-invalid' : ''}`}
                                            id="receiver_whatsapp_no"

                                            placeholder="Enter Mobile No"
                                        />
                                        {errors?.receiver_whatsapp_no?.type === "required" && <span className="error">Enter 10 Digits Mobile Number.</span>}
                                        {errors?.receiver_whatsapp_no?.type === "minLength" && <span className="error">Enter 10 Digits Mobile Number.</span>}
                                        {errors?.receiver_whatsapp_no?.type === "pattern" && <span className="error">Enter numeric characters only.</span>}

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


                                <div className="row mb-3">
                                    <div className="col-lg-6">
                                        <label className="form-label" htmlFor="particulars">Upload  Sender Id Proof </label>
                                        <input className="form-control form-control-sm" type="file" {...register("sender_id_proof")} />

                                    </div>
                                    <div className="col-lg-6">
                                        <label className="form-label" htmlFor="particulars"> Upload Receiver Id Proof </label>
                                        <input className="form-control form-control-sm" type="file" {...register("receiver_id_proof")} />

                                    </div>


                                </div>

                                <div className="row mt-4">
                                    <div className="col-md-12">
                                        <h5>Parcel Detail</h5>

                                    </div>
                                    <hr />
                                </div>



                                {/* parcel-data */}
                                {parcelDetail.map((field, index) => (
                                    <div className="row mb-3" key={index} id={`parcel_row_${index}`}>
                                        <div className="col-lg-2">
                                            <label className="form-label" htmlFor={`parcelType_${index}`}>Select Type</label>
                                            <select
                                                className="form-control form-control-sm"
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
                                                onChange={(e) => handleEwayChange(e, index, 'e_way_bill_no')}
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
                                                onChange={(e) => handleEwayChange(e, index, 'p_o_no')}
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
                                                onChange={(e) => handleEwayChange(e, index, 'invoice_no')}
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
                                                onChange={(e) => handleEwayChange(e, index, 'invoice_amount')}
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

                                                </div>
                                            ))
                                        ) : (
                                            <p>No images available.</p>
                                        )}
                                    </div>
                                </div>
                                {/* 
                                <div className="row mb-3" style={{ marginTop: "15px" }}>
                                    <div className="col-lg-6">
                                        <label className="form-label" htmlFor="particulars">Add New Images:</label>
                                        <input className="form-control form-control-sm" type="file" {...register("parcel_imgs")} multiple />

                                    </div>

                                </div> */}




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
                                                onChange={(e) => {
                                                    const picselectedvalue = e.target.value;
                                                    handleFieldChange('pic_delivery_type', picselectedvalue);
                                                }}
                                            >
                                                <option value="">--Select--</option>
                                                <option value="1">Office</option>
                                                <option value="2">Client Location</option>
                                            </select>
                                        </div>

                                    </div>
                                    <br />

                                    {parcelData.pic_delivery_type === "2" && (
                                        <div id="pickup_client_detail">
                                            {addressFields.pic_address.map((field, index) => (
                                                <div key={index}>
                                                    <div className="row mt-3">
                                                        <div className="col-md-2">
                                                            <label className="form-label">Client Address</label>

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
                                                        <div className="col-md-2">
                                                            <label className="form-label">Office Address</label>

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
                                                        <div className="col-md-2">
                                                            <label className="form-label">Pickup Charge</label>
                                                            <input
                                                                type="number"
                                                                className="form-control form-control-sm"
                                                                placeholder="Enter Pickup Charge"
                                                                {...register(`pic_address.${index}.pickup_charge`)}

                                                                value={field.pickup_charge}


                                                                onChange={(e) => {
                                                                    const newAddresses = [...addressFields.pic_address];
                                                                    newAddresses[index].pickup_charge = e.target.value;
                                                                    setAddressFields({ ...addressFields, pic_address: newAddresses });
                                                                    handleFieldChange('pickup_charge', e.target.value);
                                                                }}
                                                            />
                                                        </div>
                                                        <div className="col-md-2">
                                                            <label className="form-label">Hamali Charge</label>

                                                            <input
                                                                className="form-control form-control-sm"
                                                                placeholder="Hamali Charges"
                                                                {...register(`pic_address.${index}.pic_hamali_charge`)}
                                                                value={field.pic_hamali_charge}
                                                                onChange={(e) => {
                                                                    const newAddresses = [...addressFields.pic_address];
                                                                    newAddresses[index].pic_hamali_charge = e.target.value;
                                                                    setAddressFields({ ...addressFields, pic_address: newAddresses });
                                                                    handleFieldChange('pic_hamali_charge', e.target.value);
                                                                }}
                                                            ></input>
                                                        </div>
                                                        <div className="col-md-2">
                                                            <label className="form-label">Other Charge</label>

                                                            <input
                                                                className="form-control form-control-sm"
                                                                placeholder="Other Charges"
                                                                {...register(`pic_address.${index}.pic_other_charge`)}
                                                                value={field.pic_other_charge}
                                                                onChange={(e) => {
                                                                    const newAddresses = [...addressFields.pic_address];
                                                                    newAddresses[index].pic_other_charge = e.target.value;
                                                                    setAddressFields({ ...addressFields, pic_address: newAddresses });
                                                                    handleFieldChange('pic_other_charge', e.target.value);
                                                                }}
                                                            ></input>
                                                        </div>
                                                        <div className="col-lg-1 " style={{ padding: '10px', marginTop: "8px" }}>

                                                            <button type="button"
                                                                className="btn btn-danger btn-sm remove_pickup_row"
                                                                onClick={() => removePicAddress(index)}>
                                                                <FontAwesomeIcon icon={faMinusCircle} />
                                                            </button>

                                                        </div>

                                                    </div>

                                                </div>
                                            ))}
                                            <div className="col-md data" style={{ marginTop: "8px" }}>
                                                <button
                                                    type="button"
                                                    className="btn btn-primary btn-sm add_more_pickup_row"
                                                    onClick={appendPicAddress}
                                                >
                                                    <FontAwesomeIcon icon={faPlusCircle} />
                                                </button>
                                            </div>

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
                                                <div className="col-md-3">
                                                    <label className="form-label">Pickup Charge</label>
                                                    <input
                                                        type="number"
                                                        id="pic_office_charge"
                                                        className="form-control form-control-sm"
                                                        placeholder="Enter Pickup Charge"
                                                        {...register("pic_office_charge")}
                                                        value={parcelData.pic_office_charge}
                                                        onChange={(e) => handleFieldChange('pic_office_charge', e.target.value)}

                                                    />
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

                                    {delievery.map((field, index) => (
                                        <div key={field.id} className="row mt-3">
                                            <div className="col-md-3">
                                                <label className="form-label">LR No.</label>
                                                <input
                                                    {...register(`delivery.${index}.lr_no`)}
                                                    type="text"
                                                    value={field.lr_no}
                                                    onChange={(e) => handledeliberyChange(e, index, 'lr_no')}
                                                    className="form-control form-control-sm"
                                                    placeholder="LR No."
                                                />
                                            </div>
                                            <div className="col-md-3">
                                                <label className="form-label">Bus No.</label>
                                                <input
                                                    {...register(`delivery.${index}.bus_no`)}
                                                    type="text"
                                                    value={field.bus_no}
                                                    onChange={(e) => handledeliberyChange(e, index, 'bus_no')}
                                                    className="form-control form-control-sm"
                                                    placeholder="Bus No."
                                                />
                                            </div>
                                            <div className="col-md-3">
                                                <label className="form-label">Driver Phone No.</label>
                                                <input
                                                    {...register(`delivery.${index}.driver_no`, { required: true, minLength: 10 })}
                                                    type="number"
                                                    value={field.driver_no}
                                                    onChange={(e) => handledeliberyChange(e, index, 'driver_no')}
                                                    className="form-control form-control-sm"
                                                    placeholder="Phone No."
                                                />
                                            </div>
                                            <div className="col-md-2">
                                                <label className="form-label">Other Charges.</label>
                                                <input
                                                    {...register(`delivery.${index}.other_charge`, { required: true, minLength: 10 })}
                                                    type="number"
                                                    value={field.driver_no}
                                                    onChange={(e) => handledeliberyChange(e, index, 'other_charge')}
                                                    className="form-control form-control-sm"
                                                    placeholder='charges'
                                                />
                                            </div>
                                            <div className="col-lg-1" style={{ padding: '10px', marginTop: "10px" }}>
                                                {index > 0 && (
                                                    <button
                                                        type="button"
                                                        className="btn btn-danger btn-sm remove_pickup_row"
                                                        onClick={() => removerDelivery(index)}
                                                    >
                                                        <FontAwesomeIcon icon={faMinusCircle} />
                                                    </button>
                                                )}
                                            </div>

                                        </div>
                                    ))}
                                    <div className="col-lg-12 data" style={{ marginTop: "12px" }}>
                                        <button
                                            type="button"
                                            style={{ marginRight: '4.4%', float: "right" }}
                                            className="btn btn-primary btn-sm add_more_pickup_row "
                                            onClick={adddeliveryField}
                                        >
                                            <FontAwesomeIcon icon={faPlusCircle} />
                                        </button>
                                    </div>



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

                                    </div>
                                    <br />

                                    {parcelData.dis_delivery_type === "2" && (
                                        <div id="dispatch_client_detail">
                                            {addressFields.dis_address!.map((field, index) => (
                                                <div key={index}>

                                                    <div className="row mt-3">
                                                        <div className="col-md-2">
                                                            <label className="form-label">Client Address</label>

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
                                                        <div className="col-md-2">
                                                            <label className="form-label">Office Address</label>

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
                                                        <div className="col-md-2">
                                                            <label className="form-label">Dispatch Charge</label>
                                                            <input
                                                                type="number"
                                                                className="form-control form-control-sm"
                                                                placeholder="Enter dispatch Charge"
                                                                {...register(`dis_address.${index}.dispatch_charge`)}
                                                                value={field.dispatch_charge}

                                                                onChange={(e) => {
                                                                    const newAddresses = [...(addressFields.dis_address || [])];
                                                                    newAddresses[index].dispatch_charge = e.target.value;
                                                                    setAddressFields({ ...addressFields, dis_address: newAddresses })
                                                                    handleFieldChange('dispatch_charge', e.target.value);
                                                                }}

                                                            />
                                                        </div>
                                                        <div className="col-md-2">
                                                            <label className="form-label">Hamali Charges</label>
                                                            <input
                                                                type="number"
                                                                className="form-control form-control-sm"
                                                                placeholder="Enter Hamali Charge"
                                                                {...register(`dis_address.${index}.dis_hamali_charge`)}
                                                                value={field.dis_hamali_charge}

                                                                onChange={(e) => {
                                                                    const newAddresses = [...(addressFields.dis_address || [])];
                                                                    newAddresses[index].dis_hamali_charge = e.target.value;
                                                                    setAddressFields({ ...addressFields, dis_address: newAddresses });
                                                                    handleFieldChange('dis_hamali_charge', e.target.value);


                                                                }}

                                                            />
                                                        </div>
                                                        <div className="col-md-2">
                                                            <label className="form-label">Other Charges</label>
                                                            <input
                                                                type="number"
                                                                className="form-control form-control-sm"
                                                                placeholder="Enter Other Charge"
                                                                {...register(`dis_address.${index}.dis_other_charge`)}
                                                                value={field.dis_other_charge}

                                                                onChange={(e) => {
                                                                    const newAddresses = [...(addressFields.dis_address || [])];
                                                                    newAddresses[index].dis_other_charge = e.target.value;
                                                                    setAddressFields({ ...addressFields, dis_address: newAddresses });
                                                                    handleFieldChange('dis_other_charge', e.target.value);

                                                                }}

                                                            />
                                                        </div>
                                                        <div className="col-lg-1" style={{ padding: '10px', marginTop: "8px" }}>

                                                            <button type="button"
                                                                className="btn btn-danger btn-sm remove_pickup_row"
                                                                onClick={() => removeDisAddress(index)}>
                                                                <FontAwesomeIcon icon={faMinusCircle} />
                                                            </button>

                                                        </div>

                                                    </div>


                                                </div>

                                            ))}
                                            <div className="col-lg-12 data" style={{ marginTop: "8px" }}>
                                                <button
                                                    type="button"
                                                    style={{ marginRight: '9.20%', float: "right" }}
                                                    className="btn btn-primary btn-sm add_more_pickup_row"
                                                    onClick={appendDisAddress}>
                                                    <FontAwesomeIcon icon={faPlusCircle} />
                                                </button>
                                            </div>

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
                                                <div className="col-md-4">
                                                    <label className="form-label">Dispatch Charge</label>
                                                    <input
                                                        type="number"

                                                        className="form-control form-control-sm"
                                                        placeholder="Enter dispatch Charge"
                                                        {...register("dis_office_charge")}
                                                        value={parcelData.dis_office_charge}
                                                        onChange={(e) => handleFieldChange('dis_office_charge', e.target.value)}
                                                    />

                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    <br />




                                </div>

                                <div className="row mt-4">
                                    <div className="col-md-12">
                                        <h5>Transport Detail</h5>

                                    </div>
                                    <hr />
                                </div>
                                <div className="row mb-3">

                                    <div className="col-md-2">
                                        <label className="form-label">Total Pickup Charge</label>
                                        <input {...register('total_pickup_charge')}
                                            value={parcelData.total_pickup_charge} type="number" disabled readOnly className="form-control form-control-sm" placeholder="Transport Charge" />
                                    </div>


                                    <div className="col-md-2">
                                        <label className="form-label">Total dispatch Charge</label>
                                        <input {...register('total_dispatch_charge')}
                                            value={parcelData.total_dispatch_charge} type="number" disabled readOnly className="form-control form-control-sm" placeholder="Transport Charge" />
                                    </div>

                                    <div className="col-md-3">
                                        <label className="form-label">Transport Charge</label>
                                        <input {...register('transport_charge')}
                                            onChange={(e) => handleFieldChange('transport_charge', e.target.value)}
                                            value={parcelData.transport_charge} type="number" id="transport_charge" className="form-control form-control-sm" placeholder="Transport Charge" />
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
                                            defaultValue="20" className="form-control form-control-sm" type="number" id="bilty_charge" placeholder="Blity Charge" />
                                    </div>

                                    <div className="col-md-3">
                                        <label className="form-label">Is Demurrage Charges ?</label><br />
                                        <input {...register('is_demurrage')} type="checkbox" id="is_demurrage"
                                            checked={parcelData.is_demurrage === "1"} // Check if ticketData.is_demurrage is "1"
                                            onChange={(e) => handleFieldChange('is_demurrage', e.target.checked ? "1" : "0")} />
                                    </div>
                                    <div className="col-md-7">
                                        {parcelData.is_demurrage === "1" && <div className="row mb-3">

                                            <div className="col-md-3">
                                                <label className="form-label">Demurrage Charges</label>
                                                <input  {...register('demurrage_charges')} value={parcelData.demurrage_charges} onChange={(e) => handleFieldChange('demurrage_charges', e.target.value)} type="number" id="demurrage_charges" className="form-control form-control-sm" defaultValue="10" />
                                            </div>

                                            <div className="col-md-3">
                                                <label className="form-label">Demurrage Days</label>
                                                <input  {...register('demurrage_days')} value={parcelData.demurrage_days} onChange={(e) => handleFieldChange('demurrage_days', e.target.value)} type="number" id="demurrage_days" className="form-control form-control-sm" placeholder="Enter days" />
                                            </div>
                                            <div className="col-md-3">
                                                <label className="form-label">Total Demurrage Charges</label>
                                                <input   {...register('total_demurrage_charges')} value={parcelData.total_demurrage_charges} type="text" id="total_demurrage_charge" className="form-control-plaintext" />
                                            </div>
                                        </div>}
                                    </div>


                                </div>




                                <div className="row mb-3">
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

                                <div className="row">
                                    <div className="text-center">
                                        <button className="btn btn-success btn-sm" type="submit" id="save_ticket" name="save_form" >
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