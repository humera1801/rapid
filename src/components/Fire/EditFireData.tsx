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


export interface FormData {
    febking_id:any;
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
    client_city: string;
    client_state: string;
    client_pincode: string;
    vendorCode: string;
    client_id: any,
    city:string;
    state:string;
    pincode:string;
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
    client_city:string;
    client_state:string;
    client_pincode:string;
    poNo: string;
    vendorCode: string;
}

interface Client{
    client_id: any,
    firstName: string;
    address: string;
    email: string;
    gstNo: string;
    mobileNo: string;
    vendorCode: string;
    poNo: string;
    city:string;
    state:string;
    pincode:string;
}




interface CapacityData {
    feit_id: number;
    fec_capacity: string;
}

const EditFormData = () => {

    //-------------------------------------------------------------------------------------------------------------------------------------
   
    //---------------------------------------get id data --------------------------------------------------------------------------
  
  
    const [formData, setFormData] = useState<Client>({
        client_id:"",
        firstName: '',
        address: '',
        email: '',
        gstNo: '',
        vendorCode: '',
        poNo: '',
        mobileNo: '',
        city:"",
        state:"",
        pincode:"",
    });
  
  
  
  
  
  
  
  
  
  
    const [fireData, setFireData] = useState<any>("");
    const [error, setError] = useState<string>('');


    useEffect(() => {
        fetchservice();
       

        const fetchData = async () => {
            try {
                const febking_id = new URLSearchParams(window.location.search).get("id");
                if (febking_id) {
                    const response = await getFireBookingId.GetFireBookingId(febking_id);
                    setFireData(response.data[0]);

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

                        setValue("febking_id", response.data[0].febking_id);
                        setValue("client_id",response.data[0].client_id)
                        setValue("firstName", response.data[0].firstName);
                        setValue("address", response.data[0].address);
                        setValue("email", response.data[0].email);
                        setValue("gstNo", response.data[0].gstNo);
                        setValue("vendorCode", response.data[0].vendorCode);
                        setValue("poNo", response.data[0].poNo);
                        setValue("mobileNo",response.data[0].mobileNo);
                        setValue("client_city", response.data[0].client_city);
                        setValue("client_state", response.data[0].client_state);
                        setValue("client_pincode",response.data[0].client_pincode);
                        setMobileNoValue( response.data[0].mobileNo);
                   

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
            febking_id:fireData.febking_id || '',
            febking_created_by: storedData,
            febking_entry_type: 1,
            fest_id:"",
            product_data: [],
            febking_total_amount: '0.00',
            febking_total_sgst: '0.00',
            febking_total_cgst: '0.00',
            febking_final_amount: '0.00',
            client_id:"",
            firstName: '',
            address: '',
            email: '',
            gstNo: '',
            vendorCode: '',
            poNo: '',
            mobileNo: '',
        }
    });


    //-----------------------------------------get data ----------------------------------------------------------------------------
    useEffect(() => {
        // Populate form fields when fireData changes
        if (fireData && fireData.product_data && fireData.product_data.length > 0) {
            const initialProductData = fireData.product_data.map((product: any) => ({
                id: product.id,
                qty: product.qty,
                rate: product.rate,
                totalAmount: product.totalAmount,
                hsnCode: product.feit_hsn_code,
                capacity: product.capacity,
                feit_id: product.feit_id,
                febd_sgst: product.febd_sgst,
                febd_cgst: product.febd_cgst,
                febd_sgst_amount: product.febd_sgst_amount,
                febd_cgst_amount: product.febd_cgst_amount,
                feb_id: product.feb_id,
            }));



            setValue('product_data', initialProductData);
            calculateActualTotal();
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
            id: "", qty: 0, rate: 0, totalAmount: 0, hsnCode: '', capacity: '', feit_id: '', feb_id: '', febd_sgst_amount: '',
            febd_cgst_amount: '', febd_sgst: "", febd_cgst: ""
        });
    };

    const handleRemove = (index: number) => {
        remove(index);
        calculateActualTotal();
    }

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
        setValue("client_id","")
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
        setValue("client_id","")
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


    const onSubmit = async (FormData: any) => {

        console.log("form submit",FormData);
        console.log("form submit",mobileNoValue);
        

        try {
 
            const response = await axios.post('http://192.168.0.105:3001/booking/edit_fire_extingusher_booking_detail',FormData);
            router.push('/Fire/Fire-List');
            console.log('Ingredient updated successfully:', response.data);
       
          
        } catch (error) {
            console.error('Error updating ingredient:', error);
        }
    };











    return (
        <div className="container-fluid">
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="card">
                    <div className="card-header">
                        <h3>Update Fire Extinguisher </h3>
                    </div>
                    {fireData && (
                        <div className="card-body">

                            <div className="mb-3 form-check d-flex flex-wrap">
                                {services.map((service, index) => (
                                    <div key={index} className="form-check mb-2" style={{ marginRight: '20px' }}>
                                        <input
                                            type="radio"
                                          
                                            {...register("fest_id", { required: true })}
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
                                            // value={watch(`product_data.${index}.feit_id`)}
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
                                                // value={watch(`product_data.${index}.feb_id`)}
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
                                                // value={watch(`product_data.${index}.hsnCode`)}
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
                                                // value={watch(`product_data.${index}.qty`)}
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




                            <div className="row mb-3">
                                <div className="col-12">
                                    <button type="submit" className="btn btn-primary">
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

export default EditFormData;
