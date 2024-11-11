"use client";
import GetNewBrand from '@/app/Api/FireApis/BrandApi/GetNewBrand';
import GetClientList from '@/app/Api/FireApis/FireExtinghsherList/GetClientList';
import getFireBookingId from '@/app/Api/FireApis/FireExtinghsherList/getFireBookingId';
import GetIngredientList from '@/app/Api/FireApis/IngredientApi/GetIngredientList';
import GetServiceList from '@/app/Api/FireApis/ServiceApi/GetServiceList';
import { faMinusCircle, faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import { debounce } from 'lodash';
import React, { useEffect, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import Select from 'react-select';
import { generateEditQuotationPDF } from '../Quatation/QuatationPdf/EditForm.js'
import GetEmployeeList from '@/app/Api/FireApis/GetEmployeeList';
import Link from 'next/link.js';
import QuotationFilterList from '@/app/Api/FireApis/Quotation/QuotationFilterList';

export interface FormData {
    q_id: any;
    q_total_sgst: any;
    q_total_cgst: any;
    febking_entry_type: 1;
    q_created_by: any;
    q_final_amount: any;
    fest_id: any;
    q_total_amount: string;
    firstName: string;
    address: string;
    email: string;
    gstNo: string;
    mobileNo: string;
    client_city: string;
    client_state: string;
    client_pincode: string;
    vendorCode: string;
    client_id: any,
    city: string;
    state: string;
    pincode: string;
    invNo: string;
    discount: any;
    discount_amount: any;
    whatsup_no: any;
    certificateNo: string;
    poNo: string;
    service_data: Record<any, ProductData[]>;
    employee: any;
}

interface ProductData {

    qty: any;
    rate: any;
    totalAmount: any;
    hsnCode: string;
    feit_hsn_code: string;
    capacity: string;
    feit_id: any;
    feqd_cgst: any;
    feqd_sgst: any;
    feqd_sgst_amount: any;
    feqd_cgst_amount: any;
    feb_id: string;


}

interface ingredient {
    feit_id: any;
    feit_name: string;
    feit_hsn_code: string;
    feit_rate: string;
    capacity: string[];
    feit_sgst: any;
    feit_cgst: any;
    feit_created_by: any;
}

interface Brand {
    feb_id: number;
    feb_name: string;
}


interface Service {
    selected: boolean | undefined;
    fest_id: any,
    fest_name: string,
    fest_created_by: any

}

interface ClientData {
    client_id: number;
    client_firstName: string;
    client_address: string;
    client_email: string;
    client_gstNo: string;
    client_mobileNo: string;
    client_city: string;
    client_state: string;
    client_pincode: string;
    poNo: string;
    vendorCode: string;
}

interface Client {
    client_id: any,
    firstName: string;
    address: string;
    email: string;
    gstNo: string;
    mobileNo: string;
    vendorCode: string;
    poNo: string;
    city: string;
    state: string;
    pincode: string;
}

// interface Employee {
//     value: string;
//     label: string;
// }


interface employee {
    e_id: string,
    e_name: string
}

interface CapacityData {
    feit_id: number;
    fec_capacity: string;
}

const EditQuotation = () => {

    //-------------------------------------------------------------------------------------------------------------------------------------

    //---------------------------------------get id data --------------------------------------------------------------------------


    const [formData, setFormData] = useState<Client>({
        client_id: "",
        firstName: '',
        address: '',
        email: '',
        gstNo: '',
        vendorCode: '',
        poNo: '',
        mobileNo: '',
        city: "",
        state: "",
        pincode: "",
    });









    const [showSrNo, setShowSrNo] = useState<boolean>(false);

    const [fireData, setFireData] = useState<any>("");
    const [error, setError] = useState<string>('');
    // const [employeeNames, setEmployeeNames] = useState<Employee[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const q_id = new URLSearchParams(window.location.search).get("id");
                if (q_id) {
                    const response = await QuotationFilterList.GetQuotationBookingId(q_id);
                    setFireData(response.data[0]);
                    console.log("discount", response.data[0].discount);

                    if (response.data && response.data.length > 0) {
                        const client_id = response.data[0].client_id;
                        setSelectedClientId(client_id);
                        // Set form data based on fetched client details
                        setFormData({
                            client_id: response.data[0].client_id,
                            firstName: response.data[0].firstName,
                            address: response.data[0].address,
                            email: response.data[0].email,
                            gstNo: response.data[0].gstNo,
                            vendorCode: response.data[0].vendorCode,
                            poNo: response.data[0].poNo,
                            mobileNo: response.data[0].mobileNo,
                            city: response.data[0].client_city,
                            state: response.data[0].client_state,
                            pincode: response.data[0].client_pincode,
                        });
                        setInputValue(response.data[0].firstName);

                        setValue("q_id", response.data[0].q_id);
                        setValue("client_id", response.data[0].client_id)
                        setValue("firstName", response.data[0].firstName);
                        setValue("address", response.data[0].address);
                        setValue("email", response.data[0].email);
                        setValue("gstNo", response.data[0].gstNo);
                        setValue("vendorCode", response.data[0].vendorCode);
                        setValue("poNo", response.data[0].poNo);
                        setValue("mobileNo", response.data[0].mobileNo);
                        setValue("discount", response.data[0].q_discount);
                        setValue("discount_amount", response.data[0].q_discount_amount || '');
                        setValue("client_city", response.data[0].client_city);
                        setValue("client_state", response.data[0].client_state);
                        setValue("client_pincode", response.data[0].client_pincode);
                        setMobileNoValue(response.data[0].mobileNo);
                        setValue("whatsup_no", response.data[0].whatsup_no || '');
                        setWMobileNoValue(response.data[0].whatsup_no);


                    }



                    // Set service data for checkboxes
                    Object.entries(response.data[0].service_data).forEach(([fest_id, items]) => {
                        setValue(`service_data.${fest_id}`, items as ProductData[]);
                    });

                    const fetchedVisibleFields = new Set(Object.keys(response.data[0].service_data).map(id => parseInt(id)));
                    setVisibleFields(fetchedVisibleFields);


                    const isNewSupplyChecked = Array.from(fetchedVisibleFields).some(id =>
                        services.find(service => service.fest_id === id)?.fest_name === 'New Supply'
                    );
                    setShowSrNo(isNewSupplyChecked);


                    const employeeIds = response.data[0].employee_names.split(',').map((id: any) => ({ value: response.data[0].employee_id, label: `${id}` }));
                    setSelectedEmployees(employeeIds);


                    setError('');
                } else {
                    setError('Id not found.');
                }
            }
            catch (error) {

                console.error('Error fetching fire data:', error);
            }
        };
        const handleURLChange = () => {
            const urlParams = new URLSearchParams(window.location.search);
            const q_id = urlParams.get("id");
            if (q_id) {
                getTicketDetail(q_id);
            } else {
                setFireData(null);
            }
        };
        fetchData();
        window.addEventListener('popstate', handleURLChange);
        handleURLChange();
        return () => {
            window.removeEventListener('popstate', handleURLChange);
        };
    }, []);

    const handleServiceSelection = (fest_id: any) => {
        setVisibleFields(prevVisibleFields => {
            const newVisibleFields = new Set(prevVisibleFields);

            if (newVisibleFields.has(fest_id)) {
                newVisibleFields.delete(fest_id);
                // Optionally, remove the associated service data if necessary
                setValue(`service_data.${fest_id}`, []);
            } else {
                newVisibleFields.add(fest_id);
                // Optionally, set the default service data if necessary
                setValue(`service_data.${fest_id}`, []);
            }

            calculateActualTotal();


            return newVisibleFields;
        });
    };







    const addProductDataForService = (serviceId: any) => {
        const newProductData: ProductData = {
         
            feit_hsn_code: "",
            feit_id: "",
            qty: 1,
            feb_id: '',
            rate: 0,
            hsnCode: '',
            feqd_sgst_amount: "",
            feqd_cgst_amount: "",
            totalAmount: 0,
            capacity: "",
            feqd_cgst: "",
            feqd_sgst: ""
        };
        setValue(`service_data.${serviceId}`, [...(getValues(`service_data.${serviceId}`) || []), newProductData]);
    };

    const getTicketDetail = async (q_id: string) => {
        try {
            const getTDetail = await QuotationFilterList.GetQuotationBookingId(q_id);
            setFireData(getTDetail.data[0]);
            setError("");
            console.log("Fire details", getTDetail.data[0]);


        } catch (error) {
            setError("Error fetching fire data. Please try again later.");
            console.error("Error fetching fire data:", error);
        }
    };

    //-------------------------------------------------------------------------------------------------------------------------------------
    const storedData = localStorage.getItem('userData');


    const { register, control, handleSubmit, formState: { errors }, watch, setValue, getValues } = useForm<FormData>({
        defaultValues: {
            q_id: fireData.q_id || '',
            q_created_by: storedData,
            febking_entry_type: 1,
            fest_id: "",
            service_data: {},
            q_total_amount: '0.00',
            q_total_sgst: '0.00',
            q_total_cgst: '0.00',
            q_final_amount: '0.00',
            client_id: "",
            discount: "",
            discount_amount: "",
            firstName: '',
            address: '',
            email: '',
            gstNo: '',
            vendorCode: '',
            poNo: '',
            mobileNo: '',
            whatsup_no: '',
        }
    });


    //-----------------------------------------get data ----------------------------------------------------------------------------



    //---------------------------------------------fetch servicees-----------------------------------------------------------
    const [services, setServices] = useState<Service[]>([]);
    const [ingredients, setIngredients] = useState<ingredient[]>([]);
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


    const debounceApiCall = debounce((value: string) => {
        if (value.trim() === '') {
            setFilteredClients([]);
            return;
        }
        fetchclientData(value);
    }, 10);

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
    };


    const handleSelectClient = (clientId: number) => {
        setSelectedClientId(null);
        setIsAddingNewClient(true);
        setInputValue('');
        setFilteredClients([]);
        // Clear existing form values
        setValue("client_id", "")
        setValue("firstName", '');
        setValue("address", '');
        setValue("email", '');
        setValue("gstNo", '');
        setValue("vendorCode", '');
        setValue("poNo", '');
        setValue("mobileNo", '');
        setMobileNoValue('');
        setSelectedClientId(clientId);
        setInputValue(clientData.find(client => client.client_id === clientId)?.client_firstName || '');
        setFilteredClients([]);

        const selectedClient = clientData.find(client => client.client_id === clientId);
        if (selectedClient) {
            setValue("client_id", clientId);
            setValue("firstName", selectedClient.client_firstName);
            setValue("address", selectedClient.client_address);
            setValue("email", selectedClient.client_email);
            setValue("gstNo", selectedClient.client_gstNo);
            setValue("vendorCode", selectedClient.vendorCode);
            setValue("poNo", selectedClient.poNo);
            setValue("mobileNo", selectedClient.client_mobileNo);
            setValue("client_city", selectedClient.client_city);
            setValue("client_state", selectedClient.client_state);
            setValue("client_pincode", selectedClient.client_pincode);
            setMobileNoValue(selectedClient.client_mobileNo); // Update mobileNoValue state
        }
    };

    const handleAddNewClient = () => {
        setSelectedClientId(null);
        setIsAddingNewClient(true);
        setInputValue('');
        setFilteredClients([]);
        // Clear existing form values
        setValue("client_id", "")
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
        setMobileNoValue('');
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
            setValue(`service_data.${serviceId}.${index}.feqd_cgst`, ingredient.feit_sgst);
            setValue(`service_data.${serviceId}.${index}.feqd_sgst`, ingredient.feit_cgst);

            const totalAmount = parseFloat(ingredient.feit_rate) * 1;
            setValue(`service_data.${serviceId}.${index}.totalAmount`, totalAmount);

            const sgstAmount = (totalAmount * parseFloat(ingredient.feit_sgst)) / 100;
            setValue(`service_data.${serviceId}.${index}.feqd_sgst_amount`, sgstAmount.toFixed(2));

            const cgstAmount = (totalAmount * parseFloat(ingredient.feit_cgst)) / 100;
            setValue(`service_data.${serviceId}.${index}.feqd_cgst_amount`, cgstAmount.toFixed(2));

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
        const finalAmount = newTotalAmount - discountAmount;

        setValue('q_total_amount', newTotalAmount.toFixed(2));
        setValue('q_total_sgst', newTotalSGST.toFixed(2));
        setValue('q_total_cgst', newTotalCGST.toFixed(2));
        setValue('discount_amount', discountAmount.toFixed(2));
        setValue('q_final_amount', finalAmount.toFixed(2));
    };

    useEffect(() => {
        calculateActualTotal();
    }, [watch('service_data'), watch('discount')]);









    //-----------------------------------------------get Client list -----------------------------------------------------------------
    const [mobileNoValue, setMobileNoValue] = useState<string>('');
    const [clientData, setClientData] = useState<ClientData[]>([]);
    const [selectedClientId, setSelectedClientId] = useState<number | null>(null);
    const [inputValue, setInputValue] = useState<string>('');
    const [filteredClients, setFilteredClients] = useState<ClientData[]>([]);
    const [isAddingNewClient, setIsAddingNewClient] = useState<boolean>(false);



    const handleMobileNoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/[^\d]/g, ''); // Remove non-digit characters
        if (value.length <= 10) { // Restrict to 10 digits
            setMobileNoValue(value);
            setValue("mobileNo", value);
        }
    };



    const [WmobileNoValue, setWMobileNoValue] = useState<string>('');



    const handleWMobileNoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/[^\d]/g, ''); // Remove non-digit characters
        if (value.length <= 10) { // Restrict to 10 digits
            setWMobileNoValue(value);
            setValue("whatsup_no", value); // Update form value
        }
    };



















    const router = useRouter();


    // const onSubmit = async (formData: any) => {
    //     const transformedServiceData = Object.entries(fireData.service_data).map(([serviceId, productData]) => ({
    //         [serviceId]: productData
    //     }));

    //     const finalData = { ...formData, service_data: transformedServiceData };

    //     console.log("Filtered Form Data:", finalData);


    // };


    const onSubmit = async (formData: any) => {
        const updatedServiceData = Object.entries(getValues('service_data')).reduce<{ [key: string]: ProductData[] }[]>((acc, [serviceId, productData]) => {
            const serviceIdNum = parseInt(serviceId);
            if (visibleFields.has(serviceIdNum)) {
                acc.push({ [serviceId]: productData });
            }
            return acc;
        }, []);

        const employees = Array.from(new Set(selectedEmployees?.map(employee => employee.value))).join(',') || '';

        const finalData = {
            ...formData,
            employee: employees,
            service_data: updatedServiceData
        };

        console.log("Filtered Form Data:", finalData);

        try {
            const response = await axios.post('http://192.168.0.106:3001/quotation/edit_fire_extingusher_quotation_detail', finalData);
            console.log('Data submitted successfully:', response.data);
            console.log(fireData.q_id);


            if (fireData?.q_id) {
                const q_id = fireData.q_id;

                try {
                    const getTDetail = await QuotationFilterList.GetQuotationBookingId(q_id);
                    console.log("Fetched details:", getTDetail.data[0]);
                    generateEditQuotationPDF(getTDetail.data[0])
                    router.push("/Quotation/QuotationList")

                } catch (error) {
                    console.error('Error fetching ticket data:', error);
                }
            }
        } catch (error) {
            console.error('Error updating data:', error);
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


    const [selectedEmployees, setSelectedEmployees] = useState<Array<{ value: string; label: string }>>([]);


    const options = employee.map(employees => ({
        value: employees.e_id,
        label: employees.e_name
    }));


    const handleChange = (selectedOptions: any) => {
        setSelectedEmployees(selectedOptions || []);
    };






    return (
        <div className="container" style={{ fontSize: "12px" }}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <br />
                <div className="d-flex justify-content-between align-items-center">
                    <h4>Update Quotation  </h4>

                    <div>


                        <Link href="/Quotation/QuotationList" className="btn btn-sm btn-primary">
                            Back
                        </Link>
                    </div>
                </div>
                <br />
                <div className="card cardbox">

                    {fireData && (
                        <div className="card-body">




                            <div className="row">

                                {/* <div className="col-lg-3 col-md-6">
                                    <label className="form-label" htmlFor="employee">Select Employees:</label>
                                    <Select
                                        className="form-control-sm"
                                        id="employee"
                                        {...register("employee")}
                                        isMulti
                                        options={options}
                                        value={selectedEmployees}
                                        onChange={handleChange}
                                        placeholder="--Select--"

                                    />
                                </div> */}



                                <div className="col-lg-9 col-md-6" style={{ marginTop: '35px' }}>
                                    {services.map(service => (
                                        <span key={service.fest_id} style={{ marginRight: '50px' }}>
                                            <input
                                                className="form-check-input me-2 checkbox-spacing"
                                                type="checkbox"
                                                checked={visibleFields.has(service.fest_id)}
                                                onChange={() => handleServiceSelection(service.fest_id)}
                                            />
                                            <label className="form-check-label">{service.fest_name}</label>
                                        </span>
                                    ))}

                                </div>

                            </div>
                            <br />

                            {services.map(service => (
                                <div key={service.fest_id} className="mb-3">
                                    {visibleFields.has(service.fest_id) && (
                                        <div>
                                            <h6 className='text-center'>Product Data for {service.fest_name}:</h6><br />
                                            {(getValues(`service_data.${service.fest_id}`) || []).map((item, index) => (
                                                <div className="row mb-4" key={index}>
                                                    {/* {service.fest_name === 'New Supply' && (
                                                        <div className='row mb-3'>
                                                            <div className="col-lg-1">
                                                                <label className="form-label" htmlFor={`sr_no-${service.fest_id}`}>Sr No:</label>
                                                                <input
                                                                    className="form-control form-control-sm"
                                                                    {...register(`service_data.${service.fest_id}.${index}.febd_sr_no`)}
                                                                    type="text"

                                                                    id={`sr_no-${service.fest_id}`}
                                                                    placeholder="Enter Sr No"
                                                                />
                                                            </div>
                                                        </div>
                                                    )} */}
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
                                                        <label className="form-label" htmlFor={`capacity-${index}`}>Select Capacity:</label>
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
                                                        <label className="form-label" htmlFor={`feb_brand-${index}`}>Select Brand:</label>
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

                                                        })} type="text" id={`hsnCode-${index}`} defaultValue={item.feit_hsn_code}
                                                            placeholder="HSN Code" />
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
                                                                <span style={{ marginRight: "5px" }}>{watch(`service_data.${service.fest_id}.${index}.feqd_cgst`)}</span>
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
                                                                <span style={{ marginRight: "5px" }}>{watch(`service_data.${service.fest_id}.${index}.feqd_sgst`)}</span>
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
                                                        <div className="col-lg-1 col-sm-1 new" style={{ marginTop: "30px" }}>
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
                                                        style={{ marginTop: "5px", marginRight: '15px' }}
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



                            <div className="row">
                                <div className="col-lg-12 d-flex flex-wrap gap-3">
                                    <div className="col-lg-2  col-md-4 col-sm-6">
                                        <label className="form-label">Total Amount</label>
                                        <input
                                            className="form-control form-control-sm qty_cnt"
                                            {...register('q_total_amount')}
                                            type="text"
                                            value={watch('q_total_amount') || '0.00'}
                                            placeholder='actual total'
                                            readOnly
                                            disabled
                                        />
                                    </div>

                                    <div className="col-lg-1 col-md-4 col-sm-6">
                                        <label className="form-label">Discount(%)</label>
                                        <input
                                            className="form-control form-control-sm qty_cnt"
                                            {...register('discount')}
                                            type="text"
                                            placeholder='Enter Discount'
                                        />
                                    </div>

                                    <div className="col-lg-2 col-sm-4">
                                        <label className="form-label">Discount Amount</label>
                                        <input
                                            className="form-control form-control-sm qty_cnt"
                                            {...register('discount_amount')}
                                            type="text"
                                            placeholder='Enter Discount'
                                        />
                                    </div>

                                    <div className="col-lg-2 col-sm-4">
                                        <label className="form-label">Total SGST</label>
                                        <input
                                            className="form-control form-control-sm qty_cnt"
                                            {...register('q_total_sgst')}
                                            type="text"
                                            value={watch('q_total_sgst') || '0.00'}
                                            placeholder='actual gst'
                                            readOnly
                                            disabled
                                        />
                                    </div>

                                    <div className="col-lg-2 col-sm-4">
                                        <label className="form-label">Total CGST</label>
                                        <input
                                            className="form-control form-control-sm qty_cnt"
                                            {...register('q_total_cgst')}
                                            type="text"
                                            value={watch('q_total_cgst') || '0.00'}
                                            placeholder='actual gst'
                                            readOnly
                                            disabled
                                        />
                                    </div>

                                    <div className="col-lg-2 col-sm-4">
                                        <label className="form-label">Final Amount</label>
                                        <input
                                            className="form-control form-control-sm qty_cnt"
                                            {...register('q_final_amount')}
                                            type="text"
                                            value={watch('q_final_amount') || '0.00'}
                                            placeholder='actual gst'
                                            readOnly
                                            disabled
                                        />
                                    </div>
                                </div>
                            </div>



                            <br />



                            <div className="row mb-3">
                                <div className="col-lg-8 col-sm-8" style={{ display: "flex", gap: "15px" }}>
                                    <div className="col-lg-4">
                                        <label className="form-label" htmlFor="what's_up">What'up No</label>
                                        <input
                                            type="text"
                                            {...register("whatsup_no", {
                                                required: true,
                                                minLength: 10,
                                                maxLength: 10,
                                                pattern: /^[0-9]+$/
                                            })}
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
      <h6>Client Details:</h6>                                </div>
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
                                </div>

                                <div className="col-lg-3">
                                    <label className="form-label" htmlFor="gstNo">Gst-no</label>
                                    <input
                                        {...register("gstNo", { required: true })}
                                        className="form-control form-control-sm"
                                        type="text"
                                        placeholder="Enter Gst no."
                                    />
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
                            <div className="row mb-3">
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
                                    {errors?.mobileNo?.type === "pattern" && <span className="error">Enter numeric characters only.</span>}
                                </div>
                            </div>





                            <div className="row mb-3">
                                <div className="text-center">
                                    <button type="submit" className="btn btn-success btn-sm" >
                                        Update
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>


            </form >
        </div>
    );
};

export default EditQuotation;

