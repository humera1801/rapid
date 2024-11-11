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
import { useFieldArray, useForm, SubmitHandler } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import Select from 'react-select';
import GetListData from '@/app/Api/FireApis/DeliveryChallan/GetListData';
import { generateEditDeliveryChallanPDF } from "../DelievryChalan/DeliveryChallanpdf/Updatedelivery.js"
import Link from 'next/link.js';

export interface FormData {
    fedc_id: any;
    fedc_whatsapp_no: any;
    fedc_date: any;
    fedc_order_no: any;
    febking_total_sgst: any;
    febking_total_cgst: any;
    febking_entry_type: 1;
    fedc_created_by: any;
    febking_final_amount: any;
    fest_id: any;
    febking_total_amount: string;
    firstName: string;
    address: string;
    email: string;
    gstNo: string;
    mobileNo: string;
    client_city: string;
    client_email: any;
    client_state: string;
    client_pincode: string;
    vendorCode: string;
    client_id: any,
    city: string;
    state: string;
    pincode: string;
    fedc_dispatch_through: any;
    fedc_driver_name: any;
    fedc_driver_mobile_no: any;
    fedc_vehicle_no: any;
    fedc_driving_license: any;
    invNo: string;
    discount: any;
    discount_amount: any;
    whatsup_no: any;
    certificateNo: string;
    poNo: string;
    service_data: ProductData[];
}

interface ProductData {
    fedcd_quantity: any;
    fedcd_capacity: string;
    feit_id: any;
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




interface CapacityData {
    feit_id: number;
    fec_capacity: string;
}

const EditChallan = () => {

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










    const [fireData, setFireData] = useState<any>("");
    const [error, setError] = useState<string>('');


    useEffect(() => {
        fetchservice();


        const fetchData = async () => {
            try {
                const fedc_id = new URLSearchParams(window.location.search).get("id");
                if (fedc_id) {
                    const response = await GetListData.GetChallanBookingId(fedc_id);
                    setFireData(response.data[0]);
                    console.log("discount", response.data[0].discount);

                    if (response.data && response.data.length > 0) {
                        const client_id = response.data[0].client_id;
                        setSelectedClientId(client_id);
                        // Set form data based on fetched client details
                        setFormData({
                            client_id: response.data[0].client_id,
                            firstName: response.data[0].firstName,
                            address: response.data[0].client_address,
                            email: response.data[0].client_email,
                            gstNo: response.data[0].gstNo,
                            vendorCode: response.data[0].vendorCode,
                            poNo: response.data[0].poNo,
                            mobileNo: response.data[0].mobileNo,
                            city: response.data[0].client_city,
                            state: response.data[0].client_state,
                            pincode: response.data[0].client_pincode,
                        });
                        setInputValue(response.data[0].firstName);

                        setValue("fedc_id", response.data[0].fedc_id);
                        setValue("fedc_date", response.data[0].fedc_date);
                        setValue("fedc_order_no", response.data[0].fedc_order_no);
                        setValue("fedc_dispatch_through", response.data[0].fedc_dispatch_through);
                        setValue("fedc_driver_name", response.data[0].fedc_driver_name);
                        setValue("fedc_driver_mobile_no", response.data[0].fedc_driver_mobile_no);
                        setValue("fedc_vehicle_no", response.data[0].fedc_vehicle_no);
                        setValue("fedc_driving_license", response.data[0].fedc_driving_license);
                        setValue("email", response.data[0].client_email)
                        setValue("client_id", response.data[0].client_id)
                        setValue("firstName", response.data[0].firstName);
                        setValue("address", response.data[0].client_address);
                        setValue("gstNo", response.data[0].gstNo);
                        setValue("vendorCode", response.data[0].vendorCode);
                        setValue("poNo", response.data[0].poNo);
                        setValue("mobileNo", response.data[0].mobileNo);
                        setValue("discount", response.data[0].discount);
                        setValue("discount_amount", response.data[0].discount_amount || '');
                        setValue("client_city", response.data[0].client_city);
                        setValue("client_state", response.data[0].client_state);
                        setValue("client_pincode", response.data[0].client_pincode);
                        setMobileNoValue(response.data[0].mobileNo);
                        setValue("fedc_whatsapp_no", response.data[0].fedc_whatsapp_no || '');
                        setWMobileNoValue(response.data[0].whatsup_no);
                        setDriMobileNoValue(response.data[0].fedc_driver_mobile_no);


                    }







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
            const fedc_id = urlParams.get("id");
            if (fedc_id) {
                getTicketDetail(fedc_id);
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


    const getTicketDetail = async (fedc_id: string) => {
        try {
            const getTDetail = await GetListData.GetChallanBookingId(fedc_id);
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
            fedc_id: fireData.fedc_id || '',
            fedc_created_by: storedData,
            fest_id: "",
            service_data: [],
            febking_total_amount: '0.00',
            febking_total_sgst: '0.00',
            febking_total_cgst: '0.00',
            febking_final_amount: '0.00',
            client_id: "",
            discount: "",
            discount_amount: "",
            fedc_driving_license: "",
            fedc_date: "",
            fedc_order_no: "",
            fedc_whatsapp_no: "",
            fedc_dispatch_through: "",
            fedc_driver_name: "",
            fedc_driver_mobile_no: "",
            fedc_vehicle_no: "",
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
    useEffect(() => {
        // Populate form fields when fireData changes
        if (fireData && fireData.service_data && fireData.service_data.length > 0) {
            const initialProductData = fireData.service_data.map((product: any) => ({
                fedcd_quantity: product.fedcd_quantity,

                fedcd_capacity: product.fedcd_capacity,
                feit_id: product.feit_id,

                feb_id: product.feb_id,
            }));



            setValue('service_data', initialProductData);
        }
    }, [fireData, setValue]);



    //---------------------------------------------fetch servicees-----------------------------------------------------------
    const [services, setServices] = useState<Service[]>([]);

    const fetchservice = async () => {
        try {
            const response = await GetServiceList.getService();
            setServices(response);
            // console.log("service",response);

        } catch (error) {
            console.error('Error fetching brands:', error);
        }

    };
    //-----------------------------------------------fetch Brand ------------------------------------------------------------------

    const [brands, setBrands] = useState<Brand[]>([]);
    const [selectedBrandId, setSelectedBrandId] = useState<string>(''); // State to hold selected brand ID

    useEffect(() => {
        // Fetch brand data and set initial selected brand
        const fetchBrandData = async () => {
            try {
                const response = await GetNewBrand.getAddBrand(); // Replace with your actual API call
                setBrands(response);

                // Assuming you have fireData containing the initial data from API
                if (fireData && fireData.service_data && fireData.service_data.length > 0) {
                    const initialBrandId = fireData.service_data[0].feb_id; // Adjust this according to your data structure
                    setSelectedBrandId(initialBrandId);
                    setValue('service_data.0.feb_id', initialBrandId); // Set initial value to react-hook-form
                }
            } catch (error) {
                console.error('Error fetching brands:', error);
            }
        };

        fetchBrandData();
        return () => {

        };
    }, [fireData, setValue]);


    const handleChangeBrand = (index: number) => (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedBrandId = e.target.value;
        setValue(`service_data.${index}.feb_id`, selectedBrandId);
    };

    //---------------------------------------------------get ingredient data---------------------------------------------------------------
    const [ingredients, setIngredients] = useState<ingredient[]>([]);
    const [capacity, setCapacity] = useState(null);

    const [selectedIngredientId, setSelectedIngredientId] = useState<string>(''); // State to hold selected ingredient ID

    useEffect(() => {
        const fetchIngredientData = async () => {
            try {
                const response = await GetIngredientList.getIngrediant();
                setIngredients(response);

                // Check if fireData has service_data and set initial HSN Code
                if (fireData && fireData.service_data && fireData.service_data.length > 0) {
                    const initialIngredientId = fireData.service_data[0].feit_id;
                    setSelectedIngredientId(initialIngredientId);
                    setValue('service_data.0.feit_id', initialIngredientId);


                    const initialQty = fireData.service_data[0].fedcd_quantity;
                    setValue('service_data.0.fedcd_quantity', initialQty);

                    const initialCapacity = fireData.service_data[0].fedcd_capacity;
                    setValue('service_data.0.fedcd_capacity', initialCapacity);

                }
            } catch (error) {
                console.error('Error fetching ingredients:', error);
            }
        };

        fetchIngredientData();

        return () => {
            // Clean-up if needed
        };
    }, [fireData, setValue]);



    //-----------------------------------------------------------------------------------------------------------------------------------
    const [selectedIngredient, setSelectedIngredient] = useState<string>("");

    const handleIngredientChange = (index: number) => (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedIngredientId = e.target.value;
        setValue(`service_data.${index}.feit_id`, selectedIngredientId);

        const selectedIngredient = ingredients.find(ing => ing.feit_id === parseInt(selectedIngredientId));

        if (selectedIngredient) {

            setValue(`service_data.${index}.fedcd_quantity`, 1); // Default qty



        } else {
            console.error(`Ingredient with ID ${selectedIngredientId} not found.`);
        }
    };

    //------------------------------------------------------calculation data -----------------------------------------------------------------------------------    













    useEffect(() => {
    }, [watch('service_data'), watch('discount')]);










    const handleQtyChange = (index: number, qty: number) => {
        setValue(`service_data.${index}.fedcd_quantity`, qty);


    };




    //----------------------------------  ADD or Remove produtct data ---------------------------------------------------------
    const { fields, append, remove } = useFieldArray({
        control,
        name: 'service_data',
    });




    const addRow = () => {
        append({
            fedcd_quantity: 0, fedcd_capacity: '', feit_id: '', feb_id: '',

        });
    };

    const handleRemove = (index: number) => {
        remove(index);
    }

    //-------------------------------------------------------------------------------------------------------------------------




    const handleServiceSelection = (serviceId: number) => {
        setServices((prevServices) =>
            prevServices.map(service =>
                service.fest_id === serviceId
                    ? { ...service, selected: !service.selected }
                    : service
            )
        );
    };









    const handleChange = (e: { target: { name: any; value: any; }; }) => {
        setFireData({ ...fireData, [e.target.name]: e.target.value });
    };


    function handleIngredientSelect(index: number): React.ChangeEventHandler<HTMLSelectElement> | undefined {
        throw new Error('Function not implemented.');
    }

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





    const [DrimobileNoValue, setDriMobileNoValue] = useState<string>('');

    const handleDriverMobileNoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/[^\d]/g, ''); // Remove non-digit characters
        if (value.length <= 10) { // Restrict to 10 digits
            setDriMobileNoValue(value);
            setValue("fedc_driver_mobile_no", value); // Update form value
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



    const router = useRouter();

    const handleFieldChange = (fieldName: string, value: string) => {
        // Update ticketData state with the new value for the specified field
        const updatedTicketData = { ...fireData, [fieldName]: value };



        setFireData(updatedTicketData);
    };

    const onSubmit = async (formData: any) => {


        const finalData = {
            ...formData,

        };

        console.log("Filtered Form Data:", finalData);

        try {
            const response = await axios.post('http://192.168.0.106:3001/challan/edit_fire_extingusher_delivery_challan_data', finalData);
            console.log('Data submitted successfully:', response.data);
            console.log(fireData.fedc_id);


            if (fireData?.fedc_id) {
                const fedc_id = fireData.fedc_id;

                try {
                    const getTDetail = await GetListData.GetChallanBookingId(fedc_id);
                    console.log("Fetched details:", getTDetail.data[0]);
                    generateEditDeliveryChallanPDF(getTDetail.data[0])

                } catch (error) {
                    console.error('Error fetching ticket data:', error);
                }
            }
        } catch (error) {
            console.error('Error updating data:', error);
        }
    };








    return (
        <div className="container" style={{ fontSize: "12px" }}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <br />


                <div className="d-flex justify-content-between align-items-center">
                    <h4>Update Delivery Challan </h4>

                    <div>


                        <Link href="/DeliveryChallan/ListOfChallan" className="btn btn-sm btn-primary">
                            Back
                        </Link>
                    </div>
                </div>
                <br />
                <div className="card cardbox">

                    {fireData && (
                        <div className="card-body">

                            <div className="row mb-3">
                                <div className="col-lg-10 col-sm-8" style={{ display: "flex", gap: "15px" }}>

                                    <div className="col-lg-3">
                                        <label className="form-label" htmlFor="bdate">Challan Date </label>
                                        <input  {...register("fedc_date")} className="form-control form-control-sm" type="date" id="bdate" placeholder="Enter Booking date" />
                                    </div>
                                    <div className="col-lg-3">
                                        <label className="form-label" htmlFor="Order">Your Order No</label>
                                        <input {...register("fedc_order_no")} className="form-control form-control-sm" type="text" id="Order" placeholder="Enter Order no" />

                                    </div>
                                    <div className="col-lg-4">
                                        <label className="form-label" htmlFor="what's_up">What'up No</label>
                                        <input
                                            type="text"
                                            {...register("fedc_whatsapp_no", {
                                                required: true,
                                                minLength: 10,
                                                maxLength: 10,
                                                pattern: /^[0-9]+$/
                                            })}
                                            value={WmobileNoValue}
                                            onChange={handleWMobileNoChange}
                                            className={`form-control form-control-sm ${errors.fedc_whatsapp_no ? 'is-invalid' : ''}`}
                                            id="fedc_whatsapp_no"

                                            placeholder="Enter Mobile No"
                                        />
                                        {errors?.fedc_whatsapp_no?.type === "required" && <span className="error">Enter 10 Digits Mobile Number.</span>}
                                        {errors?.fedc_whatsapp_no?.type === "minLength" && <span className="error">Enter 10 Digits Mobile Number.</span>}
                                        {errors?.fedc_whatsapp_no?.type === "pattern" && <span className="error">Enter numeric characters only.</span>}
                                    </div>
                                </div>
                            </div>

                            <div className="row mt-4">
                                <div className="col-md-12">
                                    <h5>Product Details:</h5>
                                </div>
                                <hr />
                            </div>
                            {fields.map((field, index) => (
                                <div>
                                    <div key={field.id} className="row mb-3">





                                        <div className="col-lg-2 col-sm-3">
                                            <label className="form-label" htmlFor="feit_id">Select Item:</label>
                                            <select
                                                className="form-control form-control-sm"
                                                {...register(`service_data.${index}.feit_id`, { required: true })}
                                                id={`feit_id-${index}`}
                                                onChange={handleIngredientChange(index)}
                                            // value={watch(`service_data.${index}.feit_id`)}
                                            >
                                                <option value="">--Select--</option>
                                                {ingredients.map((ingredient) => (
                                                    <option key={ingredient.feit_id} value={ingredient.feit_id}>{ingredient.feit_name}</option>
                                                ))}
                                            </select>
                                        </div>


                                        <div className="col-lg-2 col-sm-3">
                                            <label className="form-label" htmlFor={`fedcd_capacity-${index}`}>Select Capacity:</label>
                                            <select
                                                className="form-control form-control-sm"
                                                {...register(`service_data.${index}.fedcd_capacity`, { required: true })}
                                                id={`fedcd_capacity-${index}`}
                                                value={watch(`service_data.${index}.fedcd_capacity`)}
                                                onChange={(e) => {
                                                    setValue(`service_data.${index}.fedcd_capacity`, e.target.value);
                                                }}
                                            >
                                                <option value="">--Select--</option>
                                                {ingredients
                                                    .filter((ing) => ing.feit_id === parseInt(watch(`service_data.${index}.feit_id`)))
                                                    .map((ingredient) =>
                                                        ingredient.capacity.map((cap, capIndex) => (
                                                            <option key={capIndex} value={cap}>
                                                                {cap}
                                                            </option>
                                                        ))
                                                    )}
                                            </select>

                                        </div>



                                        <div className="col-lg-2 col-md-3 col-sm-4">
                                            <label className="form-label" htmlFor="feb_brand">Select Brand:</label>
                                            <select
                                                className="form-control form-control-sm"
                                                {...register(`service_data.${index}.feb_id`, { required: true })}
                                                id={`fire_brand-${index}`}
                                                name={`service_data.${index}.feb_id`}
                                                // value={watch(`service_data.${index}.feb_id`)}
                                                onChange={handleChangeBrand(index)}
                                            >
                                                <option value="">--Select--</option>
                                                {brands.map((brand) => (
                                                    <option key={brand.feb_id} value={brand.feb_id}>
                                                        {brand.feb_name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>



                                        <div className="col-lg-5 line" style={{ display: "flex", gap: "15px" }}>

                                            <div >
                                                <label className="form-label">Qty:</label>
                                                <input
                                                    style={{ width: "50PX" }}
                                                    className="form-control form-control-sm qty_cnt"
                                                    type='number'
                                                    {...register(`service_data.${index}.fedcd_quantity`, {
                                                        required: true
                                                    })}
                                                    onChange={(e) => handleQtyChange(index, parseInt(e.target.value))}
                                                    id='qty'
                                                    placeholder="Qty"
                                                // value={watch(`service_data.${index}.qty`)}
                                                // onChange={(e) => {
                                                //     setValue(`service_data.${index}.qty`, e.target.value);
                                                // }}
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





                            <br />











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

                                <div className="col-lg-4">
                                    <label className="form-label" htmlFor="email">Email-id</label>
                                    <input
                                        {...register("email", { required: true })}
                                        type="email"
                                        className="form-control form-control-sm"
                                        placeholder="Enter your email"
                                    />
                                </div>

                                <div className="col-lg-4">
                                    <label className="form-label" htmlFor="gstNo">Gst-no</label>
                                    <input
                                        {...register("gstNo", { required: true })}
                                        className="form-control form-control-sm"
                                        type="text"
                                        placeholder="Enter Gst no."
                                    />
                                </div>

                                <div className="col-lg-4">
                                    <label className="form-label" htmlFor="vendorCode">Vendor code</label>
                                    <input
                                        {...register("vendorCode")}
                                        className="form-control form-control-sm"
                                        type="text"
                                        id="vendorCode"
                                        placeholder="Enter Vendor code"
                                    />
                                </div>

                                <div className="col-lg-4">
                                    <label className="form-label" htmlFor="poNo">P.o.No.</label>
                                    <input
                                        {...register("poNo")}
                                        className="form-control form-control-sm"
                                        type="text"
                                        id="poNo"
                                        placeholder="P.o.No."
                                    />
                                </div>

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


                            <div className="row mt-4">
                                <div className="col-md-12">
                                    <h5>Dispatch Details:</h5>
                                </div>
                                <hr />
                            </div>

                            <div className="row mb-3">

                            </div>

                            <div className="row mb-3">
                                <div className="col-lg-3 col-sm-6">
                                    <label className="form-label" htmlFor="dispatchThrough">Dispatch Through</label>
                                    <input
                                        {...register("fedc_dispatch_through")}
                                        type="text"
                                        className="form-control form-control-sm"
                                        id="dispatchThrough"


                                        placeholder="Enter Dispatch Through"
                                    />
                                </div>

                                <div className="col-lg-2 col-sm-6">
                                    <label className="form-label" htmlFor="driverName">Driver Name</label>
                                    <input
                                        {...register("fedc_driver_name")}
                                        type="text"
                                        className="form-control form-control-sm"
                                        id="driverName"

                                        placeholder="Enter Driver Name"
                                    />
                                </div>

                                <div className="col-lg-3 col-sm-6">
                                    <label className="form-label" htmlFor="driverMobileNo">Driver Mobile No</label>
                                    <input
                                        {...register("fedc_driver_mobile_no", {
                                            required: true,
                                            minLength: 10,
                                            maxLength: 10,
                                            pattern: /^[0-9]+$/
                                        })}
                                        type="text"
                                        value={DrimobileNoValue}
                                        onChange={handleDriverMobileNoChange}
                                        className="form-control form-control-sm"
                                        id="driverMobileNo"

                                        placeholder="Enter Mobile No"
                                    />
                                    {errors?.fedc_driver_mobile_no?.type === "required" && <span className="error">Enter 10 Digits Mobile Number.</span>}
                                    {errors?.fedc_driver_mobile_no?.type === "minLength" && <span className="error">Enter 10 Digits Mobile Number.</span>}
                                    {errors?.fedc_driver_mobile_no?.type === "pattern" && <span className="error">Enter numeric characters only.</span>}
                                </div>

                                <div className="col-lg-2 col-sm-6">
                                    <label className="form-label" htmlFor="vehicleNo">Vehicle No</label>
                                    <input
                                        {...register("fedc_vehicle_no")}
                                        type="text"
                                        className="form-control form-control-sm"
                                        id="vehicleNo"

                                        placeholder="Enter Vehicle No"
                                    />
                                </div>

                                <div className="col-lg-2 col-sm-12">
                                    <label className="form-label">Driving License</label>
                                    <div className="form-check">
                                        <input
                                            {...register("fedc_driving_license")}
                                            type="checkbox"
                                            checked={fireData.fedc_driving_license === "1"}
                                            onChange={(e) => handleFieldChange('fedc_driving_license', e.target.checked ? "1" : "0")}
                                            className="form-check-input"
                                            id="drivingLicenseYes"
                                        />
                                        <label className="form-check-label" htmlFor="drivingLicenseYes">
                                            Yes
                                        </label>
                                    </div>

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

export default EditChallan;


