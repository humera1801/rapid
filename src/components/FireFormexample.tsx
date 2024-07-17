import React, { useEffect, useState } from 'react';
import { Card } from 'react-bootstrap';
import { SubmitHandler, useFieldArray, useForm } from 'react-hook-form';
import GetNewBrand from '@/app/Api/FireApis/BrandApi/GetNewBrand';
import GetIngredientList from '@/app/Api/FireApis/IngredientApi/GetIngredientList';
import IngredientsDataId from '@/app/Api/FireApis/IngredientApi/IngredientsDataId';
import { faMinusCircle, faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import GetServiceList from '@/app/Api/FireApis/ServiceApi/GetServiceList';
import { log } from 'console';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import GetClientList from '@/app/Api/FireApis/FireExtinghsherList/GetClientList';

interface extinguishingAgent {
    value: string;
    label: string;
}

interface FormData {
    febking_total_gst: 500;
    febking_total_sgst: any;
    febking_total_cgst: any;
    febking_entry_type: 1;
    febking_created_by: any;
    febking_final_amount: any;
    fest_id: any;
    febking_total_amount: string;
    firstName: string;
    address: string;
    email: string;
    gstNo: string;
    mobileNo: string;
    vendorCode: string;

    invNo: string;
    certificateNo: string;
    poNo: string;

    product_data: {
        qty: any;
        rate: any;
        totalAmount: any;
        hsnCode: string;
        gst: 4;
        capacity: string;
        feit_id: any;
        febd_sgst: any;
        febd_cgst: any;
        febd_sgst_amount: any;
        febd_cgst_amount: any;
        feb_id: string;
    }[];
}

interface ingredient {
    feit_id: any;
    feit_name: string;
    feit_hsn_code: string;
    feit_rate: string;
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
    fest_id: string,
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
    poNo: string;
    vendorCode: string;
}


const FireData = () => {

    const storedData = localStorage.getItem('userData');


    const { register, control, handleSubmit, formState: { errors }, watch, setValue, getValues } = useForm<FormData>({
        defaultValues: {
            febking_created_by: storedData,
            febking_total_gst: 500,
            febking_entry_type: 1,
            product_data: [{
                qty: 0,
                rate: 0,
                totalAmount: 0,
                hsnCode: '',
                gst: 4,
                capacity: '',
                feit_id: '',
                feb_id: '',
                febd_sgst_amount: '',
                febd_cgst_amount: ''


            }]
        }
    });
    //---------------------------------------------get Service list-------------------------------------------------------------
    const [services, setServices] = useState<Service[]>([]);


    useEffect(() => {
        fetchData();
        fetchIngredientData();
        fetchservice();
    }, []);

    const fetchservice = async () => {
        try {
            const response = await GetServiceList.getService();
            setServices(response);
        } catch (error) {
            console.error('Error fetching brands:', error);
        }
    };

    //----------------------------------------------get brand list-------------------------------------------------------------
    const [brands, setBrands] = useState<Brand[]>([]);



    const fetchData = async () => {
        try {
            const response = await GetNewBrand.getAddBrand();
            setBrands(response);
        } catch (error) {
            console.error('Error fetching brands:', error);
        }
    };

    //---------------------------------------------------get ingredient data---------------------------------------------------------------
    const [ingredients, setIngredients] = useState<ingredient[]>([]);


    const fetchIngredientData = async () => {
        try {
            const response = await GetIngredientList.getIngrediant();
            setIngredients(response);
        } catch (error) {
            console.error('Error fetching ingredients:', error);
        }
    };


    //-----------------------------------------------get Client list -----------------------------------------------------------------
    // const [records, setRecords] = useState<ClientData[]>([]);
    const [clientData, setClientData] = useState<ClientData[]>([]);
    const [selectedClientId, setSelectedClientId] = useState<number | null>(null);

    useEffect(() => {
        const fetchData = async () => {

            try {
                GetClientList.getclientListData().then((res: any) => {
                    console.log(' GetClientList.getclientListData', res);

                    setClientData(res);


                }).catch((e: any) => {
                    console.log('Err', e);

                })
            } catch (error) {

            }

        };
        fetchData();
    }, []);

    //---------------- auto select client ------------------

    const [inputValue, setInputValue] = useState<string>('');
    const [newClientMode, setNewClientMode] = useState(false);
    const [filteredClients, setFilteredClients] = useState<ClientData[]>([]);
    const handleInputChange = (e: { target: { value: string; }; }) => {
        const value = e.target.value.toLowerCase();
        setInputValue(value);

        // Filter clientData based on input value
        const filtered = clientData.filter(client =>
            client.client_firstName.toLowerCase().includes(value)
        );

        setFilteredClients(filtered);
        setNewClientMode(false); // Reset to normal mode when typing
    };

    

    const handleSelectClient = (clientId: number) => {
        setSelectedClientId(clientId);
        setInputValue(clientData.find(client => client.client_id === clientId)?.client_firstName || '');
        setFilteredClients([]); // Clear filtered list
    };

    const handleAddNewClient = () => {
        setNewClientMode(true); // Enter new client mode
        setSelectedClientId(null); // Deselect any selected client
        setInputValue('');
        setPhoneNumber('');

    };




    //---------------------------------------------ingrediant change--------------------------------------------------------------------

    const [selectedIngredient, setSelectedIngredient] = useState<string>("");

    const handleIngredientChange = (index: number) => (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedIngredientId = e.target.value; // feit_id as value


        setValue(`product_data.${index}.feit_id`, parseInt(selectedIngredientId));

        const ingredient = ingredients.find((ing) => ing.feit_id === parseInt(selectedIngredientId));

        if (ingredient) {

            setValue(`product_data.${index}.hsnCode`, ingredient.feit_hsn_code);
            setValue(`product_data.${index}.rate`, parseFloat(ingredient.feit_rate));
            setValue(`product_data.${index}.febd_sgst_amount`, parseFloat(ingredient.feit_sgst));
            setValue(`product_data.${index}.febd_sgst`, parseFloat(ingredient.feit_sgst));
            setValue(`product_data.${index}.febd_cgst`, parseFloat(ingredient.feit_cgst));
            setValue(`product_data.${index}.febd_cgst_amount`, parseFloat(ingredient.feit_cgst));
            setValue(`product_data.${index}.qty`, 1); // Default qty


            const totalAmount = parseFloat(ingredient.feit_rate) * 1;
            setValue(`product_data.${index}.totalAmount`, totalAmount);


            const sgstAmount = (totalAmount * parseFloat(ingredient.feit_sgst)) / 100;
            setValue(`product_data.${index}.febd_sgst_amount`, sgstAmount.toFixed(2));

            const cgstAmount = (totalAmount * parseFloat(ingredient.feit_cgst)) / 100;
            setValue(`product_data.${index}.febd_cgst_amount`, cgstAmount.toFixed(2));


            calculateActualTotal();
        } else {

            console.error(`Ingredient with ID ${selectedIngredientId} not found.`);
        }
    };




    //------------------------------------------------------calculation data -----------------------------------------------------------------------------------    



    const calculateActualTotal = () => {
        const productdata = watch('product_data');

        if (productdata.length > 0) {
            const newTotalAmount = productdata.reduce((sum, parcel) => sum + parseFloat(parcel.totalAmount), 0);
            setValue('febking_total_amount', newTotalAmount.toFixed(2)); // Set febking_total_amount

            const newTotalSGST = productdata.reduce((sum, parcel) => sum + parseFloat(parcel.febd_sgst_amount), 0);
            setValue('febking_total_sgst', newTotalSGST.toFixed(2)); // Set febking_total_sgst

            const newTotalCGST = productdata.reduce((sum, parcel) => sum + parseFloat(parcel.febd_cgst_amount), 0);
            setValue('febking_total_cgst', newTotalCGST.toFixed(2)); // Set febking_total_cgst

            // Calculate febking_final_amount
            const finalAmount = newTotalAmount + newTotalSGST + newTotalCGST;
            setValue('febking_final_amount', finalAmount.toFixed(2)); // Set febking_final_amount
        } else {
            setValue('febking_total_amount', '0.00');
            setValue('febking_total_sgst', '0.00');
            setValue('febking_total_cgst', '0.00');
            setValue('febking_final_amount', '0.00');
        }
    };


    const handleQtyChange = (index: number, qty: number) => {
        const rate = parseFloat(watch(`product_data.${index}.rate`) || '0');
        setValue(`product_data.${index}.qty`, qty);
        const totalAmount = qty * rate;

        setValue(`product_data.${index}.totalAmount`, totalAmount);

        // Calculate SGST and CGST based on new totalAmount
        const ingredient = ingredients.find((ing) => ing.feit_id === parseInt(watch(`product_data.${index}.feit_id`)));

        if (ingredient) {
            const sgstAmount = (totalAmount * parseFloat(ingredient.feit_sgst)) / 100;
            setValue(`product_data.${index}.febd_sgst_amount`, sgstAmount.toFixed(2));

            const cgstAmount = (totalAmount * parseFloat(ingredient.feit_cgst)) / 100;
            setValue(`product_data.${index}.febd_cgst_amount`, cgstAmount.toFixed(2));
        }

        calculateActualTotal();
    };


    const handleRateChange = (index: number, rate: number) => {
        setValue(`product_data.${index}.rate`, rate);

        const qty = parseFloat(watch(`product_data.${index}.qty`));
        const totalAmount = qty * rate;

        setValue(`product_data.${index}.totalAmount`, totalAmount);

        // Calculate SGST and CGST based on new totalAmount
        const ingredient = ingredients.find((ing) => ing.feit_id === parseInt(watch(`product_data.${index}.feit_id`)));

        if (ingredient) {
            const sgstAmount = (totalAmount * parseFloat(ingredient.feit_sgst)) / 100;
            setValue(`product_data.${index}.febd_sgst_amount`, sgstAmount.toFixed(2));

            const cgstAmount = (totalAmount * parseFloat(ingredient.feit_cgst)) / 100;
            setValue(`product_data.${index}.febd_cgst_amount`, cgstAmount.toFixed(2));
        }

        calculateActualTotal();
    };






    //---------------------------------------------------------------------------------------------------------------------------------   
    const [formError, setFormError] = useState<string>('');
    const [fieldsError, setFieldsError] = useState<string>('');


    const router = useRouter();


    //----------------------------------  ADD or Remove produtct data ---------------------------------------------------------
    const { fields, append, remove } = useFieldArray({
        control,
        name: 'product_data',
    });

    const addRow = () => {
        append({
            qty: 0, rate: 0, totalAmount: 0, hsnCode: '', capacity: '', feit_id: '', feb_id: '', gst: 4, febd_sgst_amount: '',
            febd_cgst_amount: '', febd_sgst: "", febd_cgst: ""
        });
    };

    const handleRemove = (index: number) => {
        remove(index);
        calculateActualTotal(); // Recalculate febking_total_amount after removing a field
    };
    //-----------------------------------------Error handle--------------------------------------------------------------
    useEffect(() => {
        if (fields.length === 0) {
            setFormError('At least one product data row is required.');
        } else {
            setFormError('');
        }
    }, [fields]);


    //---------------------------------------------------------------------------------------------------------------------

    // const onSubmit = async (data: FormData) => {





    //     if (fields.length === 0) {
    //         setFormError('At least one product data details is required.');
    //         return;
    //     } else {
    //         setFormError('');
    //     }


    //     const selectedServices = Object.keys(data.fest_id)
    //         .filter(key => data.fest_id[key])
    //         .map(key => data.fest_id[key])
    //         .join(',');


    //     const formData = {
    //         ...data,
    //         fest_id: selectedServices
    //     };
    //     console.log('Formatted Form data:', formData);


    //     try {
    //         // Stringify the data object if necessary
    //         const response = await axios.post('http://192.168.0.111:3001/booking/add_fire_extingusher_booking_data', formData);
    //         console.log("form data", formData);
    //         router.push('/Fire_list');
    //         console.log('Form submitted successfully:', response.data);

    //     } catch (error) {
    //         console.error('Error submitting form:', error);

    //     }
    // };


 const onSubmit: SubmitHandler<FormData> = async (formData: any) => {
        console.log(formData)
}



    //------------------------------------------------------------------------------------------------------------------

    // const onSubmit = async (FormData: any) => {
    //     console.log("form data", FormData);


    // };

    //-------------------------------------------------------validation ------------------------------------------------------------------
    const [phoneNumber, setPhoneNumber] = useState<string>(''); // State for the mobile number input value

    useEffect(() => {
        if (selectedClientId) {
            const client = clientData.find(client => client.client_id === selectedClientId);
            if (client) {
                setPhoneNumber(client.client_mobileNo || '');
                setValue('mobileNo', client.client_mobileNo || ''); // Set value for react-hook-form field
            }
        }
    }, [clientData, selectedClientId, setValue]);

    const handlePhoneChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const input = event.target.value;
        const sanitizedInput = input.replace(/\D/g, '');
        if (sanitizedInput.length <= 10) {
            setPhoneNumber(sanitizedInput);
        }
    };

    const handleServiceSelection = (index: number) => {
        const updatedServices = services.map((service, i) => ({
            ...service,
            selected: i === index // Toggle selected state
        }));
        setServices(updatedServices);
        setValue('fest_id', updatedServices[index].fest_id); // Set selected service ID to form value
    };






    return (
        <>

            <div className='container-fluid'>
                <br />
                <Card>
                    <Card.Header><h3>Fire Extinguisher </h3></Card.Header>
                    <Card.Body>

                        <form onSubmit={handleSubmit(onSubmit)}>



                            <div className="mb-3 form-check d-flex flex-wrap">
                                {services && services.length > 0 && services.map((service, index) => (
                                    <div key={index} className="form-check mb-2" style={{ marginRight: '20px' }}>
                                        <input

                                            type="radio"
                                            {...register("fest_id",
                                                {
                                                    required: "true"
                                                }
                                            )}
                                            value={service.fest_id}
                                            checked={service.selected}
                                            onChange={() => handleServiceSelection(index)}
                                            className="form-check-input"
                                            required
                                        />




                                        <label htmlFor={`service-${index}`} className="form-check-label ml-2">{service.fest_name}</label>
                                    </div>


                                ))}

                            </div>



                            {formError && <p className="text-danger">{formError}</p>}

                            {fields.map((field, index) => (
                                <div>
                                    <div key={field.id} className="row mb-3">


                                        {/* <div className="col-lg-2 col-sm-3">
                                            <label className="form-label" htmlFor="feit_id">Select Ingredient Type:</label>
                                            <select
                                                className="form-control form-control-sm"
                                                {...register(`product_data.${index}.feit_id`, {
                                                    required: true
                                                })}
                                                id={`feit_id-${index}`}
                                                onChange={handleIngredientChange(index)}
                                                value={watch(`product_data.${index}.feit_id`)}
                                            >
                                                <option value="">--Select--</option>
                                                {ingredients.map((ingredient) => (
                                                    <option key={ingredient.feit_id} value={ingredient.feit_id}>{ingredient.feit_name}</option>
                                                ))}
                                            </select>
                                        </div> */}



                                        <div className="col-lg-2 col-sm-3">
                                            <label className="form-label" htmlFor="feit_id">Select Ingredient Type:</label>
                                            <select
                                                className="form-control form-control-sm"
                                                {...register(`product_data.${index}.feit_id`, {
                                                    required: true
                                                })}
                                                id={`feit_id-${index}`}
                                                onChange={handleIngredientChange(index)}
                                                value={watch(`product_data.${index}.feit_id`)}
                                            >
                                                <option value="">--Select--</option>
                                                {ingredients.map((ingredient) => (
                                                    <option key={ingredient.feit_id} value={ingredient.feit_id}>{ingredient.feit_name}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="col-lg-2 col-sm-3">
                                            <label className="form-label" htmlFor="capacity">Select Capacity:</label>
                                            <select className="form-control form-control-sm" {...register(`product_data.${index}.capacity`, {
                                                required: true
                                            })} id="capacity">
                                                <option value="">--Select--</option>
                                                <option value="1kg">1kg</option>
                                                <option value="2kg">2kg</option>
                                                <option value="3.2kg">3.2kg</option>
                                                <option value="4kg">4kg</option>
                                                <option value="4.5kg">4.5kg</option>
                                                <option value="6kg">6kg</option>
                                                <option value="6.8kg">6.8kg</option>
                                                <option value="9kg">9kg</option>
                                            </select>
                                        </div>

                                        <div className="col-lg-2 col-md-3 col-sm-4">
                                            <label className="form-label" htmlFor="feb_brand">Select Brand:</label>
                                            <select className="form-control form-control-sm" {...register(`product_data.${index}.feb_id`, {
                                                required: true,
                                            })} id="fire_brand">
                                                <option value="">--Select--</option>
                                                {brands.map((brand) => (
                                                    <option key={brand.feb_id} value={brand.feb_id}>{brand.feb_name}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="col-lg-1 col-sm-2">
                                            <label className="form-label" htmlFor="hsnCode">HSN Code:</label>
                                            <input className="form-control form-control-sm" {...register(`product_data.${index}.hsnCode`, {
                                                required: true
                                            })} type="text" id="hsnCode" placeholder="HSN Code" />

                                        </div>

                                        <div className="col-lg-5 line" style={{ display: "flex", gap: "15px" }}>

                                            <div >
                                                <label className="form-label">Qty:</label>
                                                <input
                                                    style={{ width: "50PX" }}
                                                    className="form-control form-control-sm qty_cnt"
                                                    type='number'
                                                    {...register(`product_data.${index}.qty`, {
                                                        required: true
                                                    })}
                                                    onChange={(e) => handleQtyChange(index, parseInt(e.target.value))}
                                                    id='qty'
                                                    placeholder="Qty"
                                                />
                                            </div>

                                            <div>
                                                <label className="form-label">Rate:</label>
                                                <input
                                                    style={{ width: "70PX" }}
                                                    className="form-control form-control-sm qty_cnt"
                                                    type='number'
                                                    {...register(`product_data.${index}.rate`, {
                                                        required: true
                                                    })}
                                                    onChange={(e) => handleRateChange(index, parseFloat(e.target.value))}
                                                    id='rate'
                                                    placeholder="Rate"
                                                />
                                            </div>

                                            <div>
                                                <label className="form-label">Amount:</label>
                                                <input
                                                    className="form-control form-control-sm qty_cnt"
                                                    {...register(`product_data.${index}.totalAmount`)}
                                                    value={watch(`product_data.${index}.totalAmount`) > 0 ? watch(`product_data.${index}.totalAmount`) : ''}
                                                    readOnly
                                                    disabled
                                                    placeholder='0.00'
                                                />
                                            </div>


                                            {/* Additional fields added */}

                                            <div >
                                                <label className="form-label" style={{ marginLeft: "30px" }}>SGST:</label>
                                                <div style={{ display: "flex", alignItems: "center" }}>
                                                    <span style={{ marginRight: "5px" }}>{watch(`product_data.${index}.febd_sgst`)}%</span>
                                                    <input
                                                        style={{ width: "70px" }}
                                                        className="form-control form-control-sm"
                                                        {...register(`product_data.${index}.febd_sgst_amount`, {
                                                            required: true
                                                        })}
                                                        type="text"
                                                        readOnly={false} // Make it editable for calculations or user input
                                                        disabled={false} // Enable it for calculations or user input
                                                        value={watch(`product_data.${index}.febd_sgst_amount`)} // Bind to form state
                                                        onChange={(e) => {
                                                            // Optionally handle onChange if necessary
                                                            // This allows user input or calculations to update the value
                                                        }}
                                                    />
                                                </div>
                                            </div>

                                            <div >
                                                <label className="form-label" style={{ marginLeft: "30px" }}>CGST:</label>
                                                <div style={{ display: "flex", alignItems: "center" }}>
                                                    <span style={{ marginRight: "5px" }}>{watch(`product_data.${index}.febd_cgst`)}%</span>

                                                    <input
                                                        style={{ width: "70px" }}
                                                        className="form-control form-control-sm"
                                                        {...register(`product_data.${index}.febd_cgst_amount`, {
                                                            required: true
                                                        })}
                                                        value={watch(`product_data.${index}.febd_cgst_amount`)} // Bind to form state
                                                        readOnly
                                                        disabled
                                                        type="text"
                                                    // Add any other necessary attributes
                                                    />
                                                </div>
                                            </div>



                                            <div className="col-lg-1 new" style={{ marginTop: "30px" }}>
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

                            <div className="row">
                                <div className="col-lg-8" style={{ display: "flex", gap: "15px" }}>
                                    <div className="col-lg-2 col-sm-4 ">
                                        <label className="form-label">Total Amount</label>
                                        <input
                                            className="form-control form-control-sm qty_cnt"
                                            {...register('febking_total_amount')}
                                            type="text"
                                            value={watch('febking_total_amount') || '0.00'}
                                            placeholder='actual total'
                                            readOnly
                                            disabled
                                        />

                                    </div>
                                    <div className="col-lg-2 col-sm-4 ">
                                        <label className="form-label">Total SGST</label>
                                        <input
                                            className="form-control form-control-sm qty_cnt"
                                            {...register('febking_total_sgst')}
                                            type="text"
                                            value={watch('febking_total_sgst') || '0.00'}
                                            placeholder='actual gst'
                                            readOnly
                                            disabled
                                        />

                                    </div>
                                    <div className="col-lg-2 col-sm-4 ">
                                        <label className="form-label">Total CGST</label>
                                        <input
                                            className="form-control form-control-sm qty_cnt"
                                            {...register('febking_total_cgst')}
                                            type="text"
                                            value={watch('febking_total_cgst') || '0.00'}
                                            placeholder='actual gst'
                                            readOnly
                                            disabled
                                        />

                                    </div>
                                    <div className="col-lg-2 col-sm-4 ">
                                        <label className="form-label">Final Amount</label>
                                        <input
                                            className="form-control form-control-sm qty_cnt"
                                            {...register('febking_final_amount')}

                                            type="text"
                                            value={watch('febking_final_amount') || '0.00'}
                                            placeholder='actual gst'
                                            readOnly
                                            disabled
                                        />

                                    </div>
                                </div>
                            </div>


                            <div className="row mt-4">
                                <div className="col-md-12">
                                    <h5>Client Details:</h5>
                                </div>
                                <hr />
                            </div>
                            <div className="row mb-3">
                                <div className="col-lg-4 col-sm-4">
                                    <label className="form-label" htmlFor="clientId">Select Client:</label>
                                    <div className="">
                                        <input
                                            type="text"
                                            className="form-control form-control-sm"
                                            id="clientId"
                                            {...register("firstName", {
                                                required: true,
                                             
                                            })}
                                            value={inputValue}
                                            onChange={handleInputChange}
                                            placeholder="Enter Client Name"
                                        />
                                        {(inputValue.length > 0 || newClientMode) && (
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
                                    </div>
                                </div>

                                {selectedClientId !== null || newClientMode ? (
                                    <div>
                                        <div className='row mb-3'>
                                            <div className="col-lg-4">
                                                <label className="form-label" htmlFor="address">Address</label>
                                                <textarea
                                                    {...register("address", {
                                                        required: true,
                                                    })}
                                                   
                                                    className="form-control form-control-sm"
                                                    id="address"
                                                    placeholder="Enter Address"
                                                    value={clientData.find(client => client.client_id === selectedClientId)?.client_address || ''}
                                                    onChange={(e) => {
                                                        const updatedClientData = clientData.map(client => {
                                                            if (client.client_id === selectedClientId) {
                                                                return {
                                                                    ...client,
                                                                    client_address: e.target.value 
                                                                };
                                                            }
                                                            return client;
                                                        });
                                                        setClientData(updatedClientData);
                                                    }}
                                                />
                                            </div>

                                            <div className="col-lg-4">
                                                <label className="form-label" htmlFor="email">Email-id</label>
                                                <input
                                                    {...register("email", {
                                                        required: true,
                                                        pattern: /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
                                                    })}
                                                    name="email"
                                                    value={clientData.find(client => client.client_id === selectedClientId)?.client_email || ''}
                                                    type="email"
                                                    className="form-control form-control-sm"
                                                    placeholder="Enter your email"
                                                    id="email"
                                                    onChange={(e) => {
                                                        const updatedClientData = clientData.map(client => {
                                                            if (client.client_id === selectedClientId) {
                                                                return {
                                                                    ...client,
                                                                    client_email: e.target.value 
                                                                };
                                                            }
                                                            return client;
                                                        });
                                                        setClientData(updatedClientData);
                                                    }}
                                                />

                                                {errors?.email?.type === "required" && <span className="error" id="error_name">This field is required</span>}
                                                {errors?.email?.type === "pattern" && (
                                                    <span className="error" id="error_name">Please Enter Valid data</span>
                                                )}
                                            </div>

                                            <div className="col-lg-4">
                                                <label className="form-label" htmlFor="gstNo">Gst-no</label>
                                                <input
                                                    className="form-control form-control-sm"
                                                    {...register("gstNo", {
                                                        required: "GST number is required",
                                                        pattern: {
                                                            value: /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[0-9]{1}[A-Z]{1}[0-9A-Z]{1}$/,
                                                            message: "Invalid GST number"
                                                        }
                                                    })}
                                                    type="text"
                                                    value={clientData.find(client => client.client_id === selectedClientId)?.client_gstNo || ''}
                                                    onChange={(e) => {
                                                        const updatedClientData = clientData.map(client => {
                                                            if (client.client_id === selectedClientId) {
                                                                return {
                                                                    ...client,
                                                                    client_gstNo: e.target.value 
                                                                };
                                                            }
                                                            return client;
                                                        });
                                                        setClientData(updatedClientData);
                                                    }}
                                                    id="gstNo"
                                                    placeholder="Enter Gst no."
                                                />
                                                {errors.gstNo && <span className="error">{errors.gstNo.message}</span>}
                                            </div>
                                        </div>

                                        <div className='row mb-3'>
                                            <div className="col-lg-4">
                                                <label className="form-label" htmlFor="mobileNo">Mobile No</label>
                                                <input
                                                    type="text"
                                                    {...register("mobileNo", {
                                                        required: true,
                                                        minLength: 10,
                                                        pattern: /^[0-9]+$/
                                                    })}
                                                    className={`form-control form-control-sm ${errors.mobileNo ? 'is-invalid' : ''}`}
                                                    value={phoneNumber}
                                                    
                                                    onChange={handlePhoneChange}
                                                    id="mobileNo"
                                                    placeholder="Enter Mobile No"
                                                />
                                                {errors?.mobileNo?.type === "required" && <span className="error">Enter 10 Digits Mobile Number.</span>}
                                                {errors?.mobileNo?.type === "minLength" && <span className="error">Enter 10 Digits Mobile Number.</span>}
                                            </div>


                                            <div className="col-lg-4">
                                                <label className="form-label" htmlFor="vendorCode">Vendor code</label>
                                                <input
                                                    {...register("vendorCode")}
                                                    className="form-control form-control-sm"
                                                    type="text"
                                                    id="vendorCode"
                                                    placeholder="Enter Vendor code"
                                                    value={clientData.find(client => client.client_id === selectedClientId)?.vendorCode || ''}
                                                    onChange={(e) => {
                                                        const updatedClientData = clientData.map(client => {
                                                            if (client.client_id === selectedClientId) {
                                                                return {
                                                                    ...client,
                                                                    vendorCode: e.target.value 
                                                                };
                                                            }
                                                            return client;
                                                        });
                                                        setClientData(updatedClientData);
                                                    }}
                                                // Implement value and onChange for vendorCode input
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
                                                    value={clientData.find(client => client.client_id === selectedClientId)?.poNo || ''}
                                                    onChange={(e) => {
                                                        const updatedClientData = clientData.map(client => {
                                                            if (client.client_id === selectedClientId) {
                                                                return {
                                                                    ...client,
                                                                    poNo: e.target.value 
                                                                };
                                                            }
                                                            return client;
                                                        });
                                                        setClientData(updatedClientData);
                                                    }}
                                                // Implement value and onChange for poNo input
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ) : null}


                            </div>


                            <div className="row mb-3">
                                <div className="col-12">
                                    <button type="submit" className="btn btn-primary">Submit</button>
                                </div>
                            </div>
                        </form>
                    </Card.Body>
                </Card>
            </div >
        </>
    );
};

export default FireData;
