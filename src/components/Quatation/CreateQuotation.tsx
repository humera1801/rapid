import React, { useEffect, useState } from 'react';
import { useForm, useFieldArray, SubmitHandler } from 'react-hook-form';
import { Card } from 'react-bootstrap';
import GetNewBrand from '@/app/Api/FireApis/BrandApi/GetNewBrand';
import GetIngredientList from '@/app/Api/FireApis/IngredientApi/GetIngredientList';
import { faMinusCircle, faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import GetServiceList from '@/app/Api/FireApis/ServiceApi/GetServiceList';
import Select from 'react-select';
import "../Quatation/Quatation.css"
import axios from 'axios';
import { generateQuotationPDF } from "../Quatation/QuatationPdf/CreateForm.js"
import GetClientList from '@/app/Api/FireApis/FireExtinghsherList/GetClientList';
import { debounce } from 'lodash';
import GetEmployeeList from '@/app/Api/FireApis/GetEmployeeList';
import { useRouter } from 'next/navigation';
import Footer from '../Dashboard/Footer';

interface Service {
    fest_id: any;
    fest_name: string;
}
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
    client_id_proof: any;
}



interface employee {
    e_id: string,
    e_name: string
}

interface Ingredient {
    feit_id: any;
    feit_name: string;
    feit_hsn_code: string;
    feit_rate: string;
    capacity: string[];
    feit_sgst: any;
    feit_cgst: any;
}

interface Brand {
    feb_id: number;
    feb_name: string;
}

interface ProductData {

    qty: any;
    rate: any;
    totalAmount: any;
    hsnCode: string;
    capacity: string;
    feit_id: any;
    feqd_sgst: any;
    feqd_cgst: any;
    feqd_sgst_amount: any;
    feqd_cgst_amount: any;
    feb_id: string;
}

export interface FormData {
    q_total_sgst: string;
    q_total_cgst: string;
    q_entry_type: number;
    q_created_by: any;
    q_final_amount: string;
    q_total_amount: string;
    firstName: string;
    address: string;
    client_city: string;
    client_state: string;
    client_pincode: string;
    client_id_proof: any;
    email: string;

    gstNo: string;
    mobileNo: string;
    vendorCode: string;
    client_id: any;
    invNo: string;
    certificateNo: string;
    poNo: string;
    discount: string;
    discount_amount: string;
    whatsup_no: string;
    employee: any;
    service_data: Record<any, ProductData[]>;
}

const CreateQuotation = () => {
    const storedData = localStorage.getItem('userData');

    const { register, control, handleSubmit, formState: { errors }, watch, clearErrors, setValue, getValues } = useForm<FormData>({
        defaultValues: {
            q_created_by: storedData,
            client_id: "",
            q_entry_type: 1,
            service_data: {}
        }
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'service_data'
    });
    //-----------------------------------------------get Client list -----------------------------------------------------------------
    // const [records, setRecords] = useState<ClientData[]>([]);

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
            const res = await GetClientList.getclientListData(value); // Assuming this is an async function
            console.log('GetClientList.getclientListData', res);
            setClientData(res);
            setFilteredClients(res);
        } catch (error) {
            console.error('Error fetching client data:', error);
            // Handle error state if needed
        }
    };

    const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.toLowerCase();
        setInputValue(value);

        if (value.trim() === '') {
            setFilteredClients([]);
            return;
        }

        // Fetch data if clientData is empty
        if (clientData.length === 0) {
            await fetchclientData(value);
        }

        // Filter the clientData based on client_firstName containing the inputValue
        const filtered = clientData.filter(client =>
            client.client_firstName.toLowerCase().includes(value)
        );

        setFilteredClients(filtered);
        debounceApiCall(value);
        // You might want to update other state variables or UI based on filteredClients
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
            setValue("client_city", selectedClient.client_city);
            setValue("client_state", selectedClient.client_state);
            setValue("client_pincode", selectedClient.client_pincode);
            setValue("client_id_proof", selectedClient.client_id_proof);

            setValue("mobileNo", selectedClient.client_mobileNo);
            setMobileNoValue(selectedClient.client_mobileNo); // Update mobileNoValue state

            clearErrors([

                "address",
                "email",
                "gstNo",
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
        setValue("gstNo", '');
        setValue("vendorCode", '');
        setValue("poNo", '');
        setValue("mobileNo", '');
        setValue("client_city", '');
        setValue("client_state", '');
        setValue("client_pincode", '');
        setValue("client_id_proof", '');

        setMobileNoValue('');

    };

    //--------------------------------------------------------------------------------------------------------------------------
    const [services, setServices] = useState<Service[]>([]);
    const [ingredients, setIngredients] = useState<Ingredient[]>([]);
    const [brands, setBrands] = useState<Brand[]>([]);
    const [visibleFields, setVisibleFields] = useState<Set<any>>(new Set());

    useEffect(() => {
        fetchServiceList();
        fetchIngredientList();
        fetchBrandList();
        fetchemployeeData();
    }, []);

    useEffect(() => {
        // Ensure at least one product data field is visible for each selected service
        services.forEach(service => {
            if (visibleFields.has(service.fest_id)) {
                const existingFields = getValues(`service_data.${service.fest_id}`) || [];
                if (existingFields.length === 0) {
                    addProductDataForService(service.fest_id);
                }
            }
        });
    }, [visibleFields, services]);

    const fetchServiceList = async () => {
        try {
            const response = await GetServiceList.getService();
            setServices(response);
        } catch (error) {
            console.error('Error fetching services:', error);
        }
    };

    const fetchIngredientList = async () => {
        try {
            const response = await GetIngredientList.getIngrediant();
            setIngredients(response);
        } catch (error) {
            console.error('Error fetching ingredients:', error);
        }
    };

    const fetchBrandList = async () => {
        try {
            const response = await GetNewBrand.getAddBrand();
            setBrands(response);
        } catch (error) {
            console.error('Error fetching brands:', error);
        }
    };

    const [employee, setemployee] = useState<employee[]>([]);

    const fetchemployeeData = async () => {
        try {
            const response = await GetEmployeeList.getemployee();
            setemployee(response);
            console.log("service", response)
        } catch (error) {
            console.error('Error fetching ingredients:', error);
        }
    };


    const handleIngredientChange = (serviceId: any, index: number) => (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedIngredientId = e.target.value;
        setValue(`service_data.${serviceId}.${index}.feit_id`, selectedIngredientId);

        const ingredient = ingredients.find((ing) => ing.feit_id === parseInt(selectedIngredientId));

        if (ingredient) {
            setValue(`service_data.${serviceId}.${index}.capacity`, ingredient.capacity[0]);
            setValue(`service_data.${serviceId}.${index}.hsnCode`, ingredient.feit_hsn_code); // Update this line
            setValue(`service_data.${serviceId}.${index}.qty`, 1); // Default qty
            setValue(`service_data.${serviceId}.${index}.rate`, parseFloat(ingredient.feit_rate));
            setValue(`service_data.${serviceId}.${index}.feqd_sgst`, ingredient.feit_sgst);
            setValue(`service_data.${serviceId}.${index}.feqd_cgst`, ingredient.feit_cgst);




            const totalAmount = parseFloat(ingredient.feit_rate) * 1;
            setValue(`service_data.${serviceId}.${index}.totalAmount`, totalAmount);

            const sgstAmount = (totalAmount * parseFloat(ingredient.feit_sgst)) / 100;
            setValue(`service_data.${serviceId}.${index}.feqd_sgst_amount`, sgstAmount.toFixed(2));
            console.log("sgstAmount", sgstAmount);

            const cgstAmount = (totalAmount * parseFloat(ingredient.feit_cgst)) / 100;
            setValue(`service_data.${serviceId}.${index}.feqd_cgst_amount`, cgstAmount.toFixed(2));
            console.log("cgstAmount", cgstAmount);

            calculateActualTotal();
        }
    };

    const handleQtyChange = (serviceId: any, index: number, qty: number) => {
        const rate = parseFloat(watch(`service_data.${serviceId}.${index}.rate`)) || 0;
        setValue(`service_data.${serviceId}.${index}.qty`, qty);
        const totalAmount = qty * rate;
        setValue(`service_data.${serviceId}.${index}.totalAmount`, totalAmount);

        const ingredient = ingredients.find((ing) => ing.feit_id === parseInt(watch(`service_data.${serviceId}.${index}.feit_id`)));
        if (ingredient) {
            const sgstAmount = (totalAmount * parseFloat(ingredient.feit_sgst)) / 100;
            setValue(`service_data.${serviceId}.${index}.feqd_sgst_amount`, sgstAmount.toFixed(2));

            const cgstAmount = (totalAmount * parseFloat(ingredient.feit_cgst)) / 100;
            setValue(`service_data.${serviceId}.${index}.feqd_cgst_amount`, cgstAmount.toFixed(2));
        }
        calculateActualTotal();
    };

    const handleRateChange = (serviceId: any, index: number, rate: number) => {
        setValue(`service_data.${serviceId}.${index}.rate`, rate);
        const qty = parseFloat(watch(`service_data.${serviceId}.${index}.qty`)) || 0;
        const totalAmount = qty * rate;
        setValue(`service_data.${serviceId}.${index}.totalAmount`, totalAmount);

        const ingredient = ingredients.find((ing) => ing.feit_id === parseInt(watch(`service_data.${serviceId}.${index}.feit_id`)));
        if (ingredient) {
            const sgstAmount = (totalAmount * parseFloat(ingredient.feit_sgst)) / 100;
            setValue(`service_data.${serviceId}.${index}.feqd_sgst_amount`, sgstAmount.toFixed(2));

            const cgstAmount = (totalAmount * parseFloat(ingredient.feit_cgst)) / 100;
            setValue(`service_data.${serviceId}.${index}.feqd_cgst_amount`, cgstAmount.toFixed(2));
        }
        calculateActualTotal();
    };

    const calculateActualTotal = () => {
        const servicesData = getValues('service_data');
        const discountPercentage = parseFloat(watch('discount')) || 0;

        let newTotalAmount = 0;
        let newTotalSGST = 0;
        let newTotalCGST = 0;


        Object.keys(servicesData).forEach(serviceId => {
            const productData = servicesData[serviceId];

            productData.forEach(parcel => {
                newTotalAmount += parseFloat(parcel.totalAmount) || 0;
                newTotalSGST += parseFloat(parcel.feqd_sgst_amount) || 0;
                newTotalCGST += parseFloat(parcel.feqd_cgst_amount) || 0;
            });
        });



        const discountAmount = (newTotalAmount * discountPercentage) / 100;


        const discountcAmount = (newTotalSGST * discountPercentage) / 100;
        const totalSgst = newTotalSGST - discountcAmount;
        setValue('q_total_sgst', totalSgst.toFixed(2));
        console.log("totalSgst", totalSgst);


        const discountsAmount = (newTotalCGST * discountPercentage) / 100;
        const totalCgst = newTotalCGST - discountsAmount;
        setValue('q_total_cgst', totalCgst.toFixed(2));
        console.log("totalCgst", totalCgst);

        const finalAmount = (newTotalAmount - discountAmount) + totalCgst + totalSgst;

        setValue('q_total_amount', newTotalAmount.toFixed(2));
        // setValue('q_total_sgst', newTotalSGST.toFixed(2));
        // setValue('q_total_cgst', newTotalCGST.toFixed(2));
        setValue('discount_amount', discountAmount.toFixed(2));
        setValue('q_final_amount', finalAmount.toFixed(2));
    };

    useEffect(() => {
        calculateActualTotal();
    }, [watch('service_data'), watch('discount')]);

    const addProductDataForService = (serviceId: any) => {
        const newProductData: ProductData = {
            feit_id: "",
            qty: 1,
            feb_id: '',
            rate: 0,
            hsnCode: '',
            feqd_sgst_amount: "",
            feqd_cgst_amount: "",
            totalAmount: 0,
            capacity: "",
            feqd_sgst: "",
            feqd_cgst: ""
        };
        setValue(`service_data.${serviceId}`, [...(getValues(`service_data.${serviceId}`) || []), newProductData]);
    };




    const [showSrNo, setShowSrNo] = useState(false);

    const handleServiceSelection = (fest_id: number, fest_name: string) => {
        setVisibleFields(prev => {
            const newSet = new Set(prev);
            if (newSet.has(fest_id)) {
                newSet.delete(fest_id);
            } else {
                newSet.add(fest_id);
            }

            const isNewSupplyChecked = Array.from(newSet).some(id =>
                services.find(service => service.fest_id === id)?.fest_name === 'New Supply'
            );

            setShowSrNo(isNewSupplyChecked);
            return newSet;
        });
    };


    const router = useRouter();


    const onSubmit: SubmitHandler<FormData> = async (data) => {

        console.log("fire>>>>>>>>>>>>>>>>>>>", data);

        try {
            const filteredServicesDataArray: { [key: number]: ProductData[] }[] = [];
            for (const [serviceId, productData] of Object.entries(data.service_data)) {
                const id = parseInt(serviceId);
                if (visibleFields.has(id)) {
                    filteredServicesDataArray.push({ [id]: productData });
                }
            }
            console.log("Filtered Services Data (Array Format):", filteredServicesDataArray);
            const employees = selectedEmployees?.map(employee => employee.value).join(',') || '';
            console.log("Filtered employee", employees);
            const finalData: FormData = {
                ...data,
                employee: employees,
                service_data: filteredServicesDataArray as unknown as Record<any, ProductData[]>,
            };
            console.log("Filtered Form Data:", finalData);

            if (isAddingNewClient) {
                await submitNewClientFormData(finalData);
                console.log('Form data submitted successfully for new client.');
                setIsAddingNewClient(false);
            } else if (selectedClientId) {
                finalData.client_id = selectedClientId;
                await submitFormData(finalData, selectedClientId);
                console.log('Form data submitted successfully with selected client id:', selectedClientId);
                router.push('/Quotation/QuotationList')
            }
            else {
                console.log('Please select a client or add a new client before submitting.');
            }
        } catch (error) {
            console.error('Error submitting form data:', error);
        }
    };

    const submitFormData = async (formData: FormData, clientId: number) => {
        try {
            const response = await axios.post('http://192.168.0.106:3001/quotation/add_fire_extingusher_quotation_data', formData).then((res: any) => {
                console.log("form data", res.data);
                generateQuotationPDF(res.data.data);
                // router.push("/Quotation/QuotationList")


            });
        } catch (error) {
            console.error('Error submitting form data:', error);
        }
    };

    const submitNewClientFormData = async (formData: FormData) => {
        try {
            const response = await axios.post('http://192.168.0.106:3001/quotation/add_fire_extingusher_quotation_data', formData);

            console.log('Form data submitted successfully for new client.', response.data.data[0]);
            console.log('Server response:', response.data.data[0]);
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
    };





    //--------------------------------------------------------------------------------------------------------------------






    //--------------------------------------------------------------------------------------------------------------------

    const [WmobileNoValue, setWMobileNoValue] = useState<string>('');

    const handleWMobileNoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/[^\d]/g, ''); // Remove non-digit characters
        if (value.length <= 10) { // Restrict to 10 digits
            setWMobileNoValue(value);
            setValue("whatsup_no", value); // Update form value
        }
    };

    //--------------------------react multiple select-----------------------------------------------
    const [selectedEmployees, setSelectedEmployees] = useState<Array<{ value: string; label: string }>>([]);


    const options = employee.map(employees => ({
        value: employees.e_id,
        label: employees.e_name
    }));


    const handleChange = (selectedOptions: any) => {
        setSelectedEmployees(selectedOptions || []);
    };





    const [newSupplyId, setNewSupplyId] = useState<number | null>(null);










    return (

        <>
            <div className='container' style={{ fontSize: "12px" }}>
                <br />
                <h4>Quotation </h4>

                <br />
                <Card className='cardbox'>
                    <Card.Body>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="row">
                               
                                <div className="col-lg-9 col-md-6">
                                    <div className="d-flex flex-wrap align-items-center mt-3">
                                        {services.map((service) => (
                                            <span key={service.fest_id} className="me-3 mb-2">
                                                <input
                                                    className="form-check-input me-2"
                                                    type="checkbox"
                                                    checked={visibleFields.has(service.fest_id)}
                                                    onChange={() => handleServiceSelection(service.fest_id, service.fest_name)}
                                                />
                                                <label className="form-check-label">{service.fest_name}</label>
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>






                            {services.map((service) => (
                                <div key={service.fest_id} className="mb-2">
                                    {/* Single Row for Checkboxes */}

                                    {/* Conditionally render service details */}
                                    {visibleFields.has(service.fest_id) && (
                                        <div>
                                            <h6 className='text-center'>Product Data for {service.fest_name}:</h6><br />
                                            {(getValues(`service_data.${service.fest_id}`) || []).map((item, index) => (
                                                <div className="row" key={index}>

                                                    <div className="col-lg-2 col-sm-3">
                                                        <label className="form-label" htmlFor={`feit_id-${index}`}>Select Item:</label>
                                                        <select className="form-control form-control-sm"
                                                            {...register(`service_data.${service.fest_id}.${index}.feit_id`)}
                                                            onChange={handleIngredientChange(service.fest_id, index)}
                                                            id={`feit_id-${index}`}
                                                        >
                                                            <option value="">-Select-</option>
                                                            {ingredients.map((ingredient) => (
                                                                <option key={ingredient.feit_id} value={ingredient.feit_id}>
                                                                    {ingredient.feit_name}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </div>

                                                    <div className="col-lg-2 col-sm-3">
                                                        <label className="form-label" htmlFor={`capacity-${index}`}>Capacity:</label>
                                                        <select
                                                            className="form-control form-control-sm"
                                                            {...register(`service_data.${service.fest_id}.${index}.capacity`, { required: true })}
                                                            id={`capacity-${index}`}
                                                            onChange={(e) => {
                                                                setValue(`service_data.${service.fest_id}.${index}.capacity`, e.target.value);
                                                            }}
                                                        >
                                                            <option value="">--Select--</option>
                                                            {ingredients
                                                                .filter((ing) => ing.feit_id === parseInt(watch(`service_data.${service.fest_id}.${index}.feit_id`)))
                                                                .map((ingredient) =>
                                                                    ingredient.capacity.map((cap, capIndex) => (
                                                                        <option key={capIndex} value={cap}>
                                                                            {cap}
                                                                        </option>
                                                                    ))
                                                                )}
                                                        </select>
                                                    </div>
                                                    <div className="col-lg-2 col-sm-4">
                                                        <label className="form-label" htmlFor={`feb_brand-${index}`}>Brand:</label>
                                                        <select className="form-control form-control-sm" {...register(`service_data.${service.fest_id}.${index}.feb_id`, {
                                                            required: true,
                                                        })} id={`feb_brand-${index}`}>
                                                            <option value="">--Select--</option>
                                                            {brands.map((brand) => (
                                                                <option key={brand.feb_id} value={brand.feb_id}>{brand.feb_name}</option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                    <div className="col-lg-1 col-sm-2">
                                                        <label className="form-label" htmlFor={`hsnCode-${index}`}>HSN Code:</label>
                                                        <input className="form-control form-control-sm" {...register(`service_data.${service.fest_id}.${index}.hsnCode`, {
                                                            required: true
                                                        })} type="text" id={`hsnCode-${index}`} placeholder="HSN Code" />
                                                    </div>
                                                    <div className="col-lg-4 col-sm-5 line" style={{ display: "flex", gap: "15px" }}>
                                                        <div>
                                                            <label className="form-label" htmlFor={`qty-${index}`}>Qty:</label>
                                                            <input
                                                                type="number"
                                                                style={{ width: "50px" }}
                                                                className="form-control form-control-sm qty_cnt" placeholder="Quantity"
                                                                {...register(`service_data.${service.fest_id}.${index}.qty`)}
                                                                onChange={(e) => handleQtyChange(service.fest_id, index, parseFloat(e.target.value))}
                                                                id={`qty-${index}`}
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="form-label" htmlFor={`rate-${index}`}>Rate:</label>
                                                            <input
                                                                style={{ width: "70px" }}
                                                                className="form-control form-control-sm qty_cnt"
                                                                type="number"
                                                                placeholder="Rate"
                                                                {...register(`service_data.${service.fest_id}.${index}.rate`)}
                                                                onChange={(e) => handleRateChange(service.fest_id, index, parseFloat(e.target.value))}
                                                                id={`rate-${index}`}
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="form-label">Amount:</label>
                                                            <input
                                                                style={{ width: "90px" }}
                                                                className="form-control form-control-sm qty_cnt"
                                                                type="text"
                                                                placeholder="Total Amount"
                                                                {...register(`service_data.${service.fest_id}.${index}.totalAmount`)}
                                                                readOnly
                                                                disabled
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="form-label" style={{ marginLeft: "30px" }}>SGST:</label>
                                                            <div style={{ display: "flex", alignItems: "center" }}>
                                                                <span style={{ marginRight: "5px" }}>{watch(`service_data.${service.fest_id}.${index}.feqd_sgst`)}</span>
                                                                <input
                                                                    style={{ width: "70px" }}
                                                                    className="form-control form-control-sm"
                                                                    type="text"
                                                                    placeholder="0.00"
                                                                    {...register(`service_data.${service.fest_id}.${index}.feqd_sgst_amount`)}
                                                                    readOnly
                                                                />
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <label className="form-label" style={{ marginLeft: "30px" }}>CGST:</label>
                                                            <div style={{ display: "flex", alignItems: "center" }}>
                                                                <span style={{ marginRight: "5px" }}>{watch(`service_data.${service.fest_id}.${index}.feqd_cgst`)}</span>
                                                                <input
                                                                    style={{ width: "70px" }}
                                                                    className="form-control form-control-sm"
                                                                    type="text"
                                                                    placeholder="0.00"
                                                                    {...register(`service_data.${service.fest_id}.${index}.feqd_cgst_amount`)}
                                                                    readOnly
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="col-lg-1 col-sm-1 new" style={{ marginTop: "20px" }}>
                                                            <button className="btn btn-danger btn-sm" type="button" onClick={() => {
                                                                const updatedData = getValues(`service_data.${service.fest_id}`);
                                                                updatedData.splice(index, 1);
                                                                setValue(`service_data.${service.fest_id}`, updatedData);
                                                                calculateActualTotal();
                                                            }}>
                                                                <FontAwesomeIcon icon={faMinusCircle} />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                            <div className="row">
                                                <div className="col-lg-12 data">
                                                    <button
                                                        type="button"
                                                        onClick={() => addProductDataForService(service.fest_id)}
                                                        style={{ marginTop: "5px", marginRight: '45px' , minWidth:"5px" }}
                                                        className="btn btn-primary btn-sm"
                                                    >
                                                        <FontAwesomeIcon icon={faPlusCircle} />
                                                    </button>
                                                </div>
                                            </div>

                                        </div>
                                    )}
                                </div>
                            ))}





                            <br />

                            <div className="row mb-3">
                                <div className="col-lg-12 d-flex flex-wrap gap-3">
                                    <div className="col-lg-2 col-md-4 col-sm-6">
                                        <label className="form-label">Total Amount</label>
                                        <input
                                            className="form-control form-control-sm qty_cnt"
                                            {...register('q_total_amount')}
                                            type="text"
                                            value={watch('q_total_amount') || '0.00'}
                                            placeholder='Actual Total'
                                            readOnly
                                            disabled
                                        />
                                    </div>
                                    <div className="col-lg-1 col-md-4 col-sm-6">
                                        <label className="form-label">Discount (%)</label>
                                        <input
                                            className="form-control form-control-sm qty_cnt"
                                            {...register('discount')}
                                            type="text"
                                            onChange={(e) => {
                                                setValue('discount', e.target.value); // Update discount percentage
                                                calculateActualTotal(); // Recalculate totals based on new discount
                                            }}
                                            placeholder='Enter Discount'
                                        />
                                    </div>
                                    <div className="col-lg-2 col-md-4 col-sm-6">
                                        <label className="form-label">Discount Amount</label>
                                        <input
                                            className="form-control form-control-sm qty_cnt"
                                            {...register('discount_amount')}
                                            type="text"
                                            placeholder='Enter Discount Amount'
                                        />
                                    </div>
                                    <div className="col-lg-2 col-md-4 col-sm-6">
                                        <label className="form-label">Total SGST</label>
                                        <input
                                            className="form-control form-control-sm qty_cnt"
                                            {...register('q_total_sgst')}
                                            type="text"
                                            value={watch('q_total_sgst') || '0.00'}
                                            placeholder='Total SGST'
                                            readOnly
                                            disabled
                                        />
                                    </div>
                                    <div className="col-lg-2 col-md-4 col-sm-6">
                                        <label className="form-label">Total CGST</label>
                                        <input
                                            className="form-control form-control-sm qty_cnt"
                                            {...register('q_total_cgst')}
                                            type="text"
                                            value={watch('q_total_cgst') || '0.00'}
                                            placeholder='Total CGST'
                                            readOnly
                                            disabled
                                        />
                                    </div>
                                    <div className="col-lg-2 col-md-4 col-sm-6">
                                        <label className="form-label">Final Amount</label>
                                        <input
                                            className="form-control form-control-sm qty_cnt"
                                            {...register('q_final_amount')}
                                            type="text"
                                            value={watch('q_final_amount') || '0.00'}
                                            placeholder='Final Amount'
                                            readOnly
                                            disabled
                                        />
                                    </div>
                                </div>
                            </div>



                            <div className="row mb-3">
                                <div className="col-lg-8 col-sm-8" style={{ display: "flex", gap: "15px" }}>
                                    <div className="col-lg-4">
                                        <label className="form-label" htmlFor="what's_up">Whatsapp No</label>
                                        <input
                                            type="text"
                                            {...register("whatsup_no", {
                                                required: true,
                                                minLength: 10,
                                                maxLength: 10,
                                                pattern: /^[0-9]+$/
                                            })}
                                            onInput={() => {
                                                if (errors.whatsup_no) {
                                                    clearErrors("whatsup_no");
                                                }
                                            }}
                                            value={WmobileNoValue}
                                            onChange={handleWMobileNoChange}
                                            className={`form-control form-control-sm ${errors.whatsup_no ? 'is-invalid' : ''}`}
                                            id="whatsup_no"

                                            placeholder="Enter Mobile No"
                                        />
                                        {errors?.whatsup_no?.type === "required" && <span className="error">Enter 10 Digits Mobile Number.</span>}
                                        {errors?.whatsup_no?.type === "minLength" && <span className="error">Enter 10 Digits Mobile Number.</span>}
                                        {errors?.whatsup_no?.type === "pattern" && <span className="error">Enter numeric characters only.</span>}
                                    </div>

                                </div>
                            </div>


                            <div className="row mt-4">
                                <div className="col-md-12">
                                    <h6>Client Details:</h6>
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
                                                    onChange={handleInputChange}
                                                    onInput={() => {
                                                        if (errors.firstName) {
                                                            clearErrors("firstName");
                                                        }
                                                    }}
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
                            </div>
                            <div className='row mb-3'>
                                <div className="col-lg-3">
                                    <label className="form-label" htmlFor="email">Email-id</label>
                                    <input
                                        {...register("email", { required: true })}
                                        type="email"
                                        className="form-control form-control-sm"
                                        placeholder="Enter your email"
                                    />
                                    {errors?.email?.type === "required" && <span className="error">This field is required</span>}
                                    {/* {errors?.gstNo?.type === "pattern" && <span className="error">Enetr GST valid Number</span>} */}

                                </div>

                                <div className="col-lg-3">
                                    <label className="form-label" htmlFor="gstNo">Gst-no</label>
                                    <input
                                        {...register("gstNo", {
                                            required: true,
                                            pattern: /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[0-9]{1}[A-Z]{1}[0-9A-Z]{1}$/
                                        })}
                                        className="form-control form-control-sm"
                                        type="text"
                                        placeholder="Enter Gst no."
                                    />
                                    {errors?.gstNo?.type === "required" && <span className="error">This field is required</span>}
                                    {errors?.gstNo?.type === "pattern" && <span className="error">Enetr GST valid Number</span>}


                                </div>

                                <div className="col-lg-3">
                                    <label className="form-label" htmlFor="vendorCode">Vendor code</label>
                                    <input
                                        {...register("vendorCode")}
                                        className="form-control form-control-sm"
                                        type="text"
                                        id="vendorCode"
                                        placeholder="Enter Vendor code"
                                    />
                                </div>

                                {/* <div className="col-lg-3">
                                    <label className="form-label" htmlFor="poNo">P.o.No.</label>
                                    <input
                                        {...register("poNo")}
                                        className="form-control form-control-sm"
                                        type="text"
                                        id="poNo"
                                        placeholder="P.o.No."
                                    />
                                </div> */}
                            </div>
                            <div className='row mb-3'>

                                <div className="col-lg-4">
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










                            <div className="row">
                                <div className="text-center">
                                    <input className="btn btn-success" type="submit" id="save_ticket" name="save_form" />
                                </div>
                            </div>
                        </form>
                    </Card.Body>
                </Card>
            </div >
            <Footer />
        </>
    );
};

export default CreateQuotation;
