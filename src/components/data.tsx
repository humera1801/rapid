"use client";
import GetNewBrand from '@/app/Api/FireApis/BrandApi/GetNewBrand';
import getFireBookingId from '@/app/Api/FireApis/FireExtinghsherList/getFireBookingId';
import GetIngredientList from '@/app/Api/FireApis/IngredientApi/GetIngredientList';
import GetServiceList from '@/app/Api/FireApis/ServiceApi/GetServiceList';
import { faMinusCircle, faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';



export interface FormData {

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
    client_id: any,
    invNo: string;
    certificateNo: string;
    poNo: string;

    product_data: ProductData[];
}

interface ProductData {
    id: any;
    qty: any;
    rate: any;
    totalAmount: any;
    hsnCode: string;
    capacity: string;
    feit_id: any;
    febd_sgst: any;
    febd_cgst: any;
    febd_sgst_amount: any;
    febd_cgst_amount: any;
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

interface CapacityData {
    feit_id: number;
    fec_capacity: string;
}

const EditFormData = () => {
    //---------------------------------------get id data --------------------------------------------------------------------------
    const [fireData, setFireData] = useState<any>("");
    const [error, setError] = useState<string>('');
    const [productdata, setproductdata] = useState<ProductData[]>([]);


    useEffect(() => {
        fetchservice();
        // fetchBrandData();
        // fetchIngredientData();

        const fetchData = async () => {
            try {
                const febking_id = new URLSearchParams(window.location.search).get("id");
                if (febking_id) {
                    const response = await getFireBookingId.GetFireBookingId(febking_id);
                    // const fetchedParcelDetail = response.data[0]?.product_data;
                    // if (fetchedParcelDetail) {
                    //     const transformedParcelDetail: ProductData[] = fetchedParcelDetail.map((item: any, index: number) => ({
                    //         id: index + 1,
                    //         feit_id: item.feit_id || '',
                    //         capacity: Number(item.capacity) || 0,
                    //         feb_id: Number(item.feb_id) || 0,
                    //         hsnCode: Number(item.hsnCode) || 0,
                    //         qty: Number(item.qty) || 0,
                    //         rate: Number(item.rate) || 0,
                    //         totalAmount: Number(item.totalAmount) || 0,
                    //         febd_sgst: Number(item.febd_sgst) || 0,
                    //         febd_cgst: Number(item.febd_cgst) || 0,
                    //         febd_sgst_amount: Number(item.febd_sgst) || 0,
                    //         febd_cgst_amount: Number(item.febd_cgst) || 0,

                    //     }));
                    //     setproductdata(transformedParcelDetail);
                    //     console.log("productdata",transformedParcelDetail);
                        
                    // } else {
                    //     setError('No parcel details found.');
                    // }
                }
                else {


                    // setproductdata([]); // Clear parcel data if no token is present
                    setError('Id not found.');
                }
            }
            catch (error) {

                console.error('Error fetching fire data:', error);
            }
        };
        const handleURLChange = () => {
            const urlParams = new URLSearchParams(window.location.search);
            const febking_id = urlParams.get("id");
            if (febking_id) {
                getTicketDetail(febking_id);
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

    
    const getTicketDetail = async (febking_id: string) => {
        try {
            const getTDetail = await getFireBookingId.GetFireBookingId(febking_id);
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
            febking_created_by: storedData,
            // client_id: "",
            febking_entry_type: 1,
            product_data: [{
                id:"",
                qty: 0,
                rate: 0,
                totalAmount: 0,
                hsnCode: '',
                capacity: '',
                feit_id: '',
                feb_id: '',
                febd_sgst_amount: '',
                febd_cgst_amount: ''
          

            }]
        }
    });
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
                if (fireData && fireData.product_data && fireData.product_data.length > 0) {
                    const initialBrandId = fireData.product_data[0].feb_id; // Adjust this according to your data structure
                    setSelectedBrandId(initialBrandId);
                    setValue('product_data.0.feb_id', initialBrandId); // Set initial value to react-hook-form
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
        setValue(`product_data.${index}.feb_id`, selectedBrandId);
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

                // Check if fireData has product_data and set initial HSN Code
                if (fireData && fireData.product_data && fireData.product_data.length > 0) {
                    const initialIngredientId = fireData.product_data[0].feit_id;
                    setSelectedIngredientId(initialIngredientId);
                    setValue('product_data.0.feit_id', initialIngredientId);

                    // Set initial HSN Code from fireData
                    const initialHSNCode = fireData.product_data[0].feit_hsn_code;
                    setValue('product_data.0.hsnCode', initialHSNCode);

                    const initialQty = fireData.product_data[0].qty;
                    setValue('product_data.0.qty', initialQty);

                    const initialCapacity = fireData.product_data[0].capacity;
                    setValue('product_data.0.capacity', initialCapacity);

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
        setValue(`product_data.${index}.feit_id`, selectedIngredientId);

        const selectedIngredient = ingredients.find(ing => ing.feit_id === parseInt(selectedIngredientId));

        if (selectedIngredient) {
            setValue(`product_data.${index}.hsnCode`, selectedIngredient.feit_hsn_code);
            setValue(`product_data.${index}.rate`, parseFloat(selectedIngredient.feit_rate));
            setValue(`product_data.${index}.febd_sgst_amount`, parseFloat(selectedIngredient.feit_sgst));
            setValue(`product_data.${index}.febd_cgst_amount`, parseFloat(selectedIngredient.feit_cgst));
            setValue(`product_data.${index}.febd_sgst`, parseFloat(selectedIngredient.feit_sgst));
            setValue(`product_data.${index}.febd_cgst`, parseFloat(selectedIngredient.feit_cgst));
            setValue(`product_data.${index}.qty`, 1); // Default qty

            const totalAmount = parseFloat(selectedIngredient.feit_rate) * 1;
            setValue(`product_data.${index}.totalAmount`, totalAmount);

            const sgstAmount = (totalAmount * parseFloat(selectedIngredient.feit_sgst)) / 100;
            setValue(`product_data.${index}.febd_sgst_amount`, sgstAmount.toFixed(2));

            const cgstAmount = (totalAmount * parseFloat(selectedIngredient.feit_cgst)) / 100;
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

    //----------------------------------  ADD or Remove produtct data ---------------------------------------------------------
    const { fields, append, remove } = useFieldArray({
        control,
        name: 'product_data',
    });

    // const addRow = () => {
    //     const newId = productdata.length > 0 ? productdata[productdata.length - 1].id + 1 : 1;
    //     setproductdata([
    //         ...productdata,{
    //         id: newId,
    //         qty: 0,
    //         rate: 0,
    //         totalAmount: 0,
    //         hsnCode: '',
    //         capacity: '',
    //         feit_id: '',
    //         feb_id: '',
    //         febd_sgst_amount: '',
    //         febd_cgst_amount: '',
    //         febd_sgst: "",
    //         febd_cgst: ""
    //         }
    //     ]);
    // };

    const addRow = () => {
        append({
           id:"", qty: 0, rate: 0, totalAmount: 0, hsnCode: '', capacity: '', feit_id: '', feb_id: '',  febd_sgst_amount: '',
            febd_cgst_amount: '', febd_sgst: "", febd_cgst: ""
        });
    };

    const handleRemove = (index: number) => {
        remove(index);
        calculateActualTotal();
    }

    // const handleRemove = (index: number) => {
    //     const updatedFields = [...productdata];
    //     updatedFields.splice(index, 1);
    //     setproductdata(updatedFields);
    //     // Update form values for react-hook-form
    //     setValue('product_data', updatedFields);
    // };

    // Recalculate febking_total_amount after removing a field
    //-------------------------------------------------------------------------------------------------------------------------

    const handleServiceSelection = (index: any) => {
        const updatedServices = services.map((service, idx) => ({
            ...service,
            selected: idx === index
        }));
        setServices(updatedServices);
        setFireData({ fest_id: services[index].fest_id });
    };

    const handleChange = (e: { target: { name: any; value: any; }; }) => {
        setFireData({ ...fireData, [e.target.name]: e.target.value });
    };


    function handleIngredientSelect(index: number): React.ChangeEventHandler<HTMLSelectElement> | undefined {
        throw new Error('Function not implemented.');
    }

    return (
        <div className="container-fluid">
            <form >
                <div className="card">
                    <div className="card-header">
                        <h3>Fire Extinguisher </h3>
                    </div>
                    {fireData && (
                        <div className="card-body">

                            <div className="mb-3 form-check d-flex flex-wrap">
                                {services.map((service, index) => (
                                    <div key={index} className="form-check mb-2" style={{ marginRight: '20px' }}>
                                        <input
                                            type="radio"
                                            name="fest_id"
                                            value={service.fest_id}
                                            checked={fireData.fest_id === service.fest_id}
                                            onChange={() => handleServiceSelection(index)}
                                            className="form-check-input"
                                            id={`service-${index}`}
                                        />
                                        <label htmlFor={`service-${index}`} className="form-check-label ml-2">{service.fest_name}</label>
                                    </div>
                                ))}
                            </div>
                            {fields.map((field, index) => (
                                <div>
                                    <div key={field.id} className="row mb-3">





                                        <div className="col-lg-2 col-sm-3">
                                            <label className="form-label" htmlFor="feit_id">Select Item:</label>
                                            <select
                                                className="form-control form-control-sm"
                                                {...register(`product_data.${index}.feit_id`, { required: true })}
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
                                            <label className="form-label" htmlFor={`capacity-${index}`}>Select Capacity:</label>
                                            <select
                                                className="form-control form-control-sm"
                                                {...register(`product_data.${index}.capacity`, { required: true })}
                                                id={`capacity-${index}`}
                                                value={watch(`product_data.${index}.capacity`)}
                                                onChange={(e) => {
                                                    setValue(`product_data.${index}.capacity`, e.target.value);
                                                }}
                                            >
                                                <option value="">--Select--</option>
                                                {ingredients
                                                    .filter((ing) => ing.feit_id === parseInt(watch(`product_data.${index}.feit_id`)))
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
                                                {...register(`product_data.${index}.feb_id`, { required: true })}
                                                id={`fire_brand-${index}`}
                                                name={`product_data.${index}.feb_id`}
                                                value={watch(`product_data.${index}.feb_id`)}
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
                                        <div className="col-lg-1 col-sm-2">
                                            <label className="form-label" htmlFor={`hsnCode-${index}`}>HSN Code:</label>
                                            <input
                                                className="form-control form-control-sm"
                                                {...register(`product_data.${index}.hsnCode`, { required: true })}
                                                type="text"
                                                id={`hsnCode-${index}`}
                                                placeholder="HSN Code"
                                                value={watch(`product_data.${index}.hsnCode`)}
                                                onChange={(e) => {
                                                    setValue(`product_data.${index}.hsnCode`, e.target.value);
                                                }}
                                            />
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
                                                    value={watch(`product_data.${index}.qty`)}
                                                // onChange={(e) => {
                                                //     setValue(`product_data.${index}.qty`, e.target.value);
                                                // }}
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
                                    <label className="form-label" htmlFor="clientId">
                                        Select Client:
                                    </label>
                                    <div>
                                        <input
                                            className="form-control form-control-sm"
                                            id="clientId"
                                            placeholder="Enter Client Name"
                                            type="text"

                                            name="firstName"

                                        />
                                    </div>
                                </div>
                                <div className="col-lg-4 col-sm-4">
                                    <label className="form-label" htmlFor="address">
                                        Address
                                    </label>
                                    <textarea
                                        name="address"
                                        className="form-control form-control-sm"
                                        id="address"
                                        placeholder="Enter Address"


                                    ></textarea>
                                </div>
                                <div className="col-lg-4 col-sm-4" >
                                    <label className="form-label" htmlFor="email">
                                        Email-id
                                    </label>
                                    <input
                                        className="form-control form-control-sm"
                                        placeholder="Enter your email"
                                        type="email"
                                        name="email"


                                    />
                                </div>
                                <div className="col-lg-4 col-sm-4">
                                    <label className="form-label" htmlFor="gstNo">
                                        Gst-no
                                    </label>
                                    <input
                                        className="form-control form-control-sm"
                                        placeholder="Enter Gst no."
                                        type="text"
                                        name="gstNo"


                                    />
                                </div>
                                <div className="col-lg-4 col-sm-4">
                                    <label className="form-label" htmlFor="vendorCode">
                                        Vendor code
                                    </label>
                                    <input
                                        className="form-control form-control-sm"
                                        id="vendorCode"
                                        placeholder="Enter Vendor code"
                                        type="text"
                                        name="vendorCode"


                                    />
                                </div>
                                <div className="col-lg-4 col-sm-4">
                                    <label className="form-label" htmlFor="poNo">
                                        P.o.No.
                                    </label>
                                    <input
                                        className="form-control form-control-sm"
                                        id="poNo"
                                        placeholder="P.o.No."
                                        type="text"
                                        name="poNo"


                                    />
                                </div>
                                <div className="col-lg-4 col-sm-4">
                                    <label className="form-label" htmlFor="client_mobileNo">
                                        Mobile No
                                    </label>
                                    <input
                                        className="form-control form-control-sm"
                                        id="mobileNo"
                                        placeholder="Enter Mobile No"
                                        type="text"

                                        name="mobileNo"

                                    />
                                </div>
                            </div>
                            <div className="row mb-3">
                                <div className="col-12">
                                    <button type="submit" className="btn btn-primary">
                                        Submit
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

export default EditFormData;
