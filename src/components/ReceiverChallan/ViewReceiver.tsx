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
import Link from 'next/link';
import GetChallanList from '@/app/Api/FireApis/ReceiverChallan/GetChallanList';
import Footer from '../Dashboard/Footer';

export interface FormData {
    ferc_id: any;
    ferc_created_by: any;
    q_final_amount: string;
    q_total_amount: string;
    firstName: string;
    address: string;
    client_city: string;
    client_state: string;
    client_pincode: string;
    email: string;
    ferc_date: any;
    gstNo: string;
    mobileNo: string;
    vendorCode: string;
    ferc_dispatch_through: any;
    ferc_driver_name: any;
    ferc_driver_mobile_no: any;
    ferc_vehicle_no: any;
    ferc_driving_license: any;
    client_id: any;
    invNo: string;
    certificateNo: string;
    poNo: string;
    discount: string;
    discount_amount: string;
    ferc_whatsapp_no: string;
    employee: any;
    ferc_order_no: any;
    service_data: {
        fercd_quantity: any;
        fercd_capacity: string;
        feit_id: any;
        feb_name: string;
    }[];
}


interface Product {
    febd_sr_no: any;
    fest_name: string;
    feit_name: any;
    capacity: any;
    feb_name: any;
    qty: any;
    rate: any;
    totalAmount: any;
    febd_sgst: any;
    febd_cgst: any;
    // Add other properties as needed
}


interface ProductData {
    fercd_quantity: any;
    fercd_capacity: string;
    feit_id: any;
    feb_name: string;
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
    client_city: string;
    client_state: string;
    client_pincode: string;
}




interface CapacityData {
    feit_id: number;
    fec_capacity: string;
}

const ViewReceiverChalan = () => {

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
        client_city: "",
        client_state: "",
        client_pincode: "",
    });










    const [fireData, setFireData] = useState<any>("");
    const [error, setError] = useState<string>('');
    const [groupedData, setGroupedData] = useState<{ [key: string]: Product[] }>({});


    useEffect(() => {
        fetchservice();


        const fetchData = async () => {
            try {
                const q_quotation_no = new URLSearchParams(window.location.search).get("id");
                if (q_quotation_no) {
                    const response = await GetChallanList.GetReceiverChallanBookingId(q_quotation_no);
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
                            client_city: response.data[0].client_city,
                            client_state: response.data[0].client_state,
                            client_pincode: response.data[0].client_pincode,
                        });
                        setInputValue(response.data[0].firstName);

                        setValue("ferc_id", response.data[0].ferc_id);
                        setValue("ferc_date", response.data[0].ferc_date);
                        setValue("ferc_order_no", response.data[0].ferc_order_no);
                        setValue("ferc_dispatch_through", response.data[0].ferc_dispatch_through);
                        setValue("ferc_driver_name", response.data[0].ferc_driver_name);
                        setValue("ferc_driver_mobile_no", response.data[0].ferc_driver_mobile_no);
                        setValue("ferc_vehicle_no", response.data[0].ferc_vehicle_no);
                        setValue("ferc_driving_license", response.data[0].ferc_driving_license);
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
                        setValue("ferc_whatsapp_no", response.data[0].ferc_whatsapp_no || '');
                        setWMobileNoValue(response.data[0].ferc_whatsapp_no);
                        setDriMobileNoValue(response.data[0].ferc_driver_mobile_no);


                    }

                    const selectedFestIds: number[] = response.data[0].fest_id || [];
                    const grouped = Object.entries(response.data[0].service_data).reduce((acc, [key, products]) => {
                        (products as Product[]).forEach(product => {
                            const festName = product.fest_name;
                            if (!acc[festName]) acc[festName] = [];
                            acc[festName].push(product);
                        });
                        return acc;
                    }, {} as { [key: string]: Product[] });

                    setGroupedData(grouped);
                    console.log(">>>><", groupedData);







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
            const ferc_id = urlParams.get("id");
            if (ferc_id) {
                getTicketDetail(ferc_id);
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


    const getTicketDetail = async (ferc_id: string) => {
        try {
            const getTDetail = await GetChallanList.GetReceiverChallanBookingId(ferc_id);
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
            ferc_id: fireData.ferc_id || '',
            ferc_created_by: storedData,
            service_data: [],
            client_id: "",
            discount: "",
            discount_amount: "",
            ferc_driving_license: "",
            ferc_date: "",
            ferc_order_no: "",
            ferc_whatsapp_no: "",
            ferc_dispatch_through: "",
            ferc_driver_name: "",
            ferc_driver_mobile_no: "",
            ferc_vehicle_no: "",
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
        if (fireData && fireData.service_data && fireData.service_data.length > 0) {
            const initialProductData = fireData.service_data.map((product: any) => ({
                fercd_quantity: product.fercd_quantity,

                fercd_capacity: product.fercd_capacity,
                feit_id: product.feit_name,

                feb_name: product.feb_name,
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

    const [selectedBrandId, setSelectedBrandId] = useState<string>(''); // State to hold selected brand ID

    useEffect(() => {
        // Fetch brand data and set initial selected brand
        const fetchBrandData = async () => {
            try {
                const response = await GetNewBrand.getAddBrand(); // Replace with your actual API call

                // Assuming you have fireData containing the initial data from API
                if (fireData && fireData.service_data && fireData.service_data.length > 0) {
                    const initialBrandId = fireData.service_data[0].feb_name; // Adjust this according to your data structure
                    setSelectedBrandId(initialBrandId);
                    setValue('service_data.0.feb_name', initialBrandId); // Set initial value to react-hook-form
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
        setValue(`service_data.${index}.feb_name`, selectedBrandId);
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


                    const initialQty = fireData.service_data[0].fercd_quantity;
                    setValue('service_data.0.fercd_quantity', initialQty);

                    const initialCapacity = fireData.service_data[0].fercd_capacity;
                    setValue('service_data.0.fercd_capacity', initialCapacity);

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

            setValue(`service_data.${index}.fercd_quantity`, 1); // Default qty



        } else {
            console.error(`Ingredient with ID ${selectedIngredientId} not found.`);
        }
    };

    //------------------------------------------------------calculation data -----------------------------------------------------------------------------------    













    useEffect(() => {
    }, [watch('service_data'), watch('discount')]);










    const handleQtyChange = (index: number, qty: number) => {
        setValue(`service_data.${index}.fercd_quantity`, qty);


    };




    //----------------------------------  ADD or Remove produtct data ---------------------------------------------------------
    const { fields, append, remove } = useFieldArray({
        control,
        name: 'service_data',
    });




    //-------------------------------------------------------------------------------------------------------------------------













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
            setValue("ferc_whatsapp_no", value); // Update form value
        }
    };





    const [DrimobileNoValue, setDriMobileNoValue] = useState<string>('');

    const handleDriverMobileNoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/[^\d]/g, ''); // Remove non-digit characters
        if (value.length <= 10) { // Restrict to 10 digits
            setDriMobileNoValue(value);
            setValue("ferc_driver_mobile_no", value); // Update form value
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



    const drivingLicenseStatus = fireData.ferc_driving_license === "1" ? 'Yes' : 'No';
















    return (
        <>
        <div className="container" style={{ fontSize: "12px" }}>
            <br />
            <div className="card-header" style={{ display: "flex", justifyContent: "space-between" }}>
                <h3> Receiver Challan Details </h3>
                <div>



                    <Link href="/Receiver/List" className="btn btn-sm btn-primary" style={{ float: "right", marginRight: "8px" }}>Back</Link>

                </div>
            </div>
            <br />
            <div className="card mb-3 cardbox" style={{ width: "auto" }} >



                {fireData && (
                    <div className="card-body">
                        <div className=" d-flex flex-wrap">
                            <div className="col-lg-6">
                                <label className="">Delivery Challan No : </label><span> {fireData.fedc_challan_no}</span>
                            </div>
                        </div>

                        <br />



                        <div className="table-responsive mb-3">
                            <table className="table table-striped">
                                <thead>
                                    <tr>
                                        <th>Item</th>
                                        <th>Capacity</th>
                                        <th>Brand</th>
                                        <th>Qty</th>
                                        <th>Rate</th>
                                        <th>Total</th>

                                    </tr>
                                </thead>
                                <tbody>
                                    {Object.entries(groupedData).map(([groupName, products]) => (
                                        <React.Fragment key={groupName}>
                                            <tr>
                                                <td colSpan={9} className="font-weight-bold">{groupName}</td>
                                            </tr>
                                            {products.map((product, index) => (
                                                <tr key={index}>
                                                    <td>{product.feit_name}</td>
                                                    <td>{product.capacity}</td>
                                                    <td>{product.feb_name}</td>
                                                    <td>{product.qty}</td>
                                                    <td>{product.rate}</td>
                                                    <td>{product.totalAmount}</td>

                                                </tr>
                                            ))}
                                        </React.Fragment>
                                    ))}
                                </tbody>

                            </table>
                        </div>






















                        <div className="  d-flex flex-wrap">
                            <div className="col-lg-6">
                                <label className="set_label">Whatsapp No : </label><span> {fireData.ferc_whatsapp_no}</span>
                            </div>
                        </div>









                        <div className="row mt-4">
                            <div className="col-md-12">
                                <h4>Client Details:</h4>
                            </div>
                            <hr />
                        </div>




                        <div className="row mb-3">
                            <div className="col-lg-4 col-sm-4">
                                <label className="form-label" htmlFor="clientId">Client Name: </label>
                                <span> {formData.firstName}</span>

                            </div>

                            <div className="col-lg-4">
                                <label className="form-label" htmlFor="address">Address:</label>
                                <span> {formData.address}</span>
                            </div>
                            <div className="col-lg-4">
                                <label className="form-label" htmlFor="address">City:</label>
                                <span> {formData.client_city}</span>
                            </div>
                            <div className="col-lg-4">
                                <label className="form-label" htmlFor="address">State:</label>
                                <span> {formData.client_state}</span>
                            </div>
                            <div className="col-lg-4">
                                <label className="form-label" htmlFor="address">Pin-code:</label>
                                <span> {formData.client_pincode}</span>
                            </div>

                            <div className="col-lg-4">
                                <label className="form-label" htmlFor="email">Email-id:</label>
                                <span> {formData.email}</span>
                            </div>

                            <div className="col-lg-4">
                                <label className="form-label" htmlFor="gstNo">Gst-no:</label>
                                <span> {formData.gstNo}</span>
                            </div>

                            <div className="col-lg-4">
                                <label className="form-label" htmlFor="vendorCode">Vendor code:</label>
                                <span> {formData.vendorCode}</span>
                            </div>

                            <div className="col-lg-4">
                                <label className="form-label" htmlFor="poNo">P.o.No.:</label>
                                <span> {formData.poNo}</span>
                            </div>

                            <div className="col-lg-4">
                                <label className="form-label" htmlFor="mobileNo">Mobile No:</label>

                                <span> {formData.mobileNo}</span>
                            </div>
                        </div>


                        <div className="row mt-4">
                            <div className="col-md-12">
                                <h4>Received Details:</h4>
                            </div>
                            <hr />
                        </div>

                        <div className="row mb-3">
                            <div className="col-lg-4 col-sm-4">
                                <label className="form-label" htmlFor="clientId">Received Through: </label>
                                <span> {fireData.ferc_dispatch_through}</span>

                            </div>

                            <div className="col-lg-4">
                                <label className="form-label" htmlFor="address">Driver Name:</label>
                                <span> {fireData.ferc_driver_name}</span>
                            </div>
                            <div className="col-lg-4">
                                <label className="form-label" htmlFor="address">Driver Mobile No:</label>
                                <span> {fireData.ferc_driver_mobile_no}</span>
                            </div>
                            <div className="col-lg-4">
                                <label className="form-label" htmlFor="address">Vehicle No:</label>
                                <span> {fireData.ferc_vehicle_no}</span>
                            </div>
                            


                        </div>




                    </div>
                )}
            </div>



        </div>
        <Footer/>
        </>

    );
};

export default ViewReceiverChalan;

