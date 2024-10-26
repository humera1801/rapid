import React, { useEffect, useState } from 'react';
import { useForm, useFieldArray, SubmitHandler } from 'react-hook-form';
import { Card } from 'react-bootstrap';
import GetNewBrand from '@/app/Api/FireApis/BrandApi/GetNewBrand';
import GetIngredientList from '@/app/Api/FireApis/IngredientApi/GetIngredientList';
import { faMinusCircle, faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import "../DelievryChalan/Chalan.css"
import "../Quatation/Quatation.css"
import axios from 'axios';
import { generateDeliveryChallanPDF } from "../DelievryChalan/DeliveryChallanpdf/Createdelivery.js"
import GetClientList from '@/app/Api/FireApis/FireExtinghsherList/GetClientList';
import { debounce } from 'lodash';
import GetEmployeeList from '@/app/Api/FireApis/GetEmployeeList';
import { useRouter } from 'next/navigation';

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



export interface FormData {

    fedc_created_by: any;

    firstName: string;
    address: string;
    client_city: string;
    client_state: string;
    client_pincode: string;
    email: string;
    fedc_date: any;
    gstNo: string;
    mobileNo: string;
    vendorCode: string;
    fedc_dispatch_through: any;
    fedc_driver_name: any;
    fedc_driver_mobile_no: any;
    fedc_vehicle_no: any;
    fedc_driving_license: any;
    client_id: any;
    invNo: string;
    certificateNo: string;
    poNo: string;
    discount: string;
    discount_amount: string;
    fedc_whatsapp_no: string;
    employee: any;
    fedc_order_no: any;
    service_data: {
        fedcd_quantity: any;
        fedcd_capacity: string;
        feit_id: any;
        feb_id: string;
    }[];
}

const CreateChalan = () => {
    const storedData = localStorage.getItem('userData');

    const { register, control, handleSubmit, formState: { errors }, watch, setValue, getValues } = useForm<FormData>({
        defaultValues: {
            fedc_created_by: storedData,
            client_id: "",
            service_data: [{
                fedcd_quantity: 0,
                fedcd_capacity: '',
                feit_id: '',
                feb_id: '',



            }]
        }
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

    const [DrimobileNoValue, DrisetMobileNoValue] = useState<string>('');

    const handleDriverMobileNoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/[^\d]/g, ''); // Remove non-digit characters
        if (value.length <= 10) { // Restrict to 10 digits
            DrisetMobileNoValue(value);
            setValue("fedc_driver_mobile_no", value); // Update form value
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
        setValue("gstNo", '');
        setValue("vendorCode", '');
        setValue("poNo", '');
        setValue("mobileNo", '');
        setValue("client_city", '');
        setValue("client_state", '');
        setValue("client_pincode", '');
        setMobileNoValue('');

    };

    //--------------------------------------------------------------------------------------------------------------------------
    const [services, setServices] = useState<Service[]>([]);
    const [ingredients, setIngredients] = useState<Ingredient[]>([]);
    const [brands, setBrands] = useState<Brand[]>([]);
    const [visibleFields, setVisibleFields] = useState<Set<any>>(new Set());

    useEffect(() => {
        fetchIngredientList();
        fetchBrandList();
        fetchemployeeData();
    }, []);



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











    const onSubmit: SubmitHandler<FormData> = async (data) => {

        console.log("fire>>>>>>>>>>>>>>>>>>>", data);
        try {





            const finalData: FormData = {
                ...data,
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
            } else {
                console.log('Please select a client or add a new client before submitting.');
            }
        } catch (error) {
            console.error('Error submitting form data:', error);
        }

    };

    const router = useRouter();



    const submitFormData = async (formData: FormData, clientId: number) => {
        try {
            const response = await axios.post('http://192.168.0.105:3001/challan/add_fire_extingusher_delivery_challan_data', formData).then((res: any) => {
                console.log("form data", res.data);
                generateDeliveryChallanPDF(res.data.data);
                router.push("/DeliveryChallan/ListOfChallan")


            });
            // console.log('Form data submitted successfully with client id:', clientId);


        } catch (error) {
            console.error('Error submitting form data:', error);
        }
    };

    const submitNewClientFormData = async (formData: FormData) => {
        try {
            const response = await axios.post('http://192.168.0.105:3001/challan/add_fire_extingusher_delivery_challan_data', formData);

            console.log('Form data submitted successfully for new client.', response.data.data[0]);
            console.log('Server response:', response.data.data[0]);
        } catch (error) {

            console.error('Unexpected Error:', error);

        }
    };




    const currentDate = new Date().toISOString().split('T')[0]; // Get current date in YYYY-MM-DD format



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
    };
    //-----------------------------------------Error handle--------------------------------------------------------------
    const [formError, setFormError] = useState<string>('');

    useEffect(() => {
        if (fields.length === 0) {
            setFormError('At least one product data row is required.');
        } else {
            setFormError('');
        }
    }, [fields]);


    //---------------------------------------------------------------------------------------------------------------------


    const [selectedIngredient, setSelectedIngredient] = useState<string>("");

    const handleIngredientChange = (index: number) => (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedIngredientId = e.target.value; // feit_id as value


        setValue(`service_data.${index}.feit_id`, parseInt(selectedIngredientId));

        const ingredient = ingredients.find((ing) => ing.feit_id === parseInt(selectedIngredientId));

        if (ingredient) {
            setValue(`service_data.${index}.fedcd_capacity`, ingredient.capacity[0]);

            setValue(`service_data.${index}.fedcd_quantity`, 1); // Default qty





        } else {

            console.error(`Ingredient with ID ${selectedIngredientId} not found.`);
        }
    };














    const [WmobileNoValue, setWMobileNoValue] = useState<string>('');



    const handleWMobileNoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/[^\d]/g, ''); // Remove non-digit characters
        if (value.length <= 10) { // Restrict to 10 digits
            setWMobileNoValue(value);
            setValue("fedc_whatsapp_no", value); // Update form value
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

        <div className='container' style={{ fontSize: "12px" }}>
            <br />
            <h4>Delivery Challan </h4>
            <br />
            <Card>
                <Card.Body>
                    <form onSubmit={handleSubmit(onSubmit)}>





                        <div className="row mb-3">
                            <div className="col-lg-10 col-sm-8" style={{ display: "flex", gap: "15px" }}>

                                <div className="col-lg-3">
                                    <label className="form-label" htmlFor="bdate">Challan Date </label>
                                    <input  {...register("fedc_date")} className="form-control form-control-sm" type="date" id="bdate" placeholder="Enter Booking date" defaultValue={currentDate} min={currentDate} />
                                </div>
                                <div className="col-lg-3">
                                    <label className="form-label" htmlFor="Order">Your Order No</label>
                                    <input {...register("fedc_order_no")} className="form-control form-control-sm" type="text" id="Order" placeholder="Enter Order no" />

                                </div>
                                <div className="col-lg-4">
                                    <label className="form-label" htmlFor="what's_up">Whatsapp No</label>
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
                        {formError && <p className="text-danger">{formError}</p>}

                        {fields.map((field, index) => (
                            <div>
                                <div key={field.id} className="row mb-3">

                                    <div className="col-lg-2 col-sm-3">
                                        <label className="form-label" htmlFor="feit_id">Select Item:</label>
                                        <select
                                            className="form-control form-control-sm"
                                            {...register(`service_data.${index}.feit_id`, {
                                                required: true
                                            })}
                                            id={`feit_id-${index}`}
                                            onChange={handleIngredientChange(index)}
                                            value={watch(`service_data.${index}.feit_id`)}
                                        >
                                            <option value="">--Select--</option>
                                            {ingredients.map((ingredient) => (
                                                <option key={ingredient.feit_id} value={ingredient.feit_id}>{ingredient.feit_name}</option>
                                            ))}
                                        </select>
                                    </div>


                                    <div className="col-lg-2 col-sm-3">
                                        <label className="form-label" htmlFor={`capacity-${index}`}>Select Capacity:</label>
                                        <select
                                            className="form-control form-control-sm"
                                            {...register(`service_data.${index}.fedcd_capacity`, { required: true })}
                                            id={`capacity-${index}`}

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



                                    <div className="col-lg-2 col-sm-4">
                                        <label className="form-label" htmlFor="feb_brand">Select Brand:</label>
                                        <select className="form-control form-control-sm" {...register(`service_data.${index}.feb_id`, {
                                            required: true,
                                        })} id="fire_brand">
                                            <option value="">--Select--</option>
                                            {brands.map((brand) => (
                                                <option key={brand.feb_id} value={brand.feb_id}>{brand.feb_name}</option>
                                            ))}
                                        </select>
                                    </div>


                                    <div className="col-lg-5 col-sm-5 line" style={{ display: "flex", gap: "15px" }}>

                                        <div className="col-lg-1 col-sm-4">
                                            <label className="form-label">Qty:</label>
                                            <input

                                                className="form-control form-control-sm qty_cnt"
                                                type='number'
                                                {...register(`service_data.${index}.fedcd_quantity`, {
                                                    required: true
                                                })}
                                                id='qty'
                                                placeholder="Qty"
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




























                        <div className="row mt-4">
                            <div className="col-md-12">
  <h6>Client Details:</h6>                            </div>
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
                        <div className="row mb-3">
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

                            <div className="col-lg-3">
                                <label className="form-label" htmlFor="poNo">P.o.No.</label>
                                <input
                                    {...register("poNo")}
                                    className="form-control form-control-sm"
                                    type="text"
                                    id="poNo"
                                    placeholder="P.o.No."
                                />
                            </div>
                            </div>
                            <div className="row mb-3">
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
                                        className="form-check-input"
                                        id="drivingLicenseYes"
                                    />
                                    <label className="form-check-label" htmlFor="drivingLicenseYes">
                                        Yes
                                    </label>
                                </div>

                            </div>
                        </div>


                        <br />



                        <div className="row">
                            <div className="text-center">
                                <input className="btn btn-success btn-sm"  type="submit" id="save_ticket" name="save_form" />
                            </div>
                        </div>
                    </form>
                </Card.Body>
            </Card>
        </div>

    );
};

export default CreateChalan;
