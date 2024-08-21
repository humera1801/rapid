"use client";
import GetNewBrand from '@/app/Api/FireApis/BrandApi/GetNewBrand';
import GetClientList from '@/app/Api/FireApis/FireExtinghsherList/GetClientList';
import getFireBookingId from '@/app/Api/FireApis/FireExtinghsherList/getFireBookingId';
import GetIngredientList from '@/app/Api/FireApis/IngredientApi/GetIngredientList';
import GetServiceList from '@/app/Api/FireApis/ServiceApi/GetServiceList';
import { faMinusCircle, faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import Select from 'react-select';

import { debounce } from 'lodash';
import React, { useEffect, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import GetCertificateData from '@/app/Api/FireApis/GetCertificateData';
import { generateclientPDF } from './certificate/genrate-pdf';
import handleclientPrint from './certificate/certificate';


export interface FormData {
    febking_id: any;
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
    invNo: string;
    certificateNo: string;
    poNo: string;
    product_data: ProductData[];
    discount: any;
    discount_amount: any;
    whatsup_no: any;
}

interface ProductData {
    id: any;
    qty: any;
    rate: any;
    totalAmount: any;
    hsnCode: string;
    capacity: string;
    feit_id: any;
    feit_name: any;
    feb_name: any
    febd_sgst: any;
    febd_cgst: any;
    febd_sgst_amount: any;
    febd_cgst_amount: any;
    feb_id: string;
    febd_sr_no: any;
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



interface employee {
    e_id: string,
    e_name: string
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

interface ServiceData {
    [key: string]: Product[];
}

interface ResponseData {
    service_data: ServiceData;
}

// Define the type for the response
interface ApiResponse {
    data: ResponseData[];
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

const ViewFire = () => {

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
                            client_city: response.data[0].client_city,
                            client_state: response.data[0].client_state,
                            client_pincode: response.data[0].client_pincode,



                        });
                        setInputValue(response.data[0].firstName);

                        setValue("febking_id", response.data[0].febking_id);
                        setValue("firstName", response.data[0].firstName);
                        setValue("address", response.data[0].address);
                        setValue("email", response.data[0].email);
                        setValue("gstNo", response.data[0].gstNo);
                        setValue("discount", response.data[0].discount);
                        setValue("discount_amount", response.data[0].discount_amount || '');
                        setValue("vendorCode", response.data[0].vendorCode);
                        setValue("poNo", response.data[0].poNo);
                        setValue("mobileNo", response.data[0].mobileNo);
                        setMobileNoValue(response.data[0].mobileNo);
                        setValue("whatsup_no", response.data[0].whatsup_no || ''); // Set whatsup_no in form

                    }


                    // Assuming you get an array of selected fest_ids
                    const selectedFestIds: number[] = response.data[0].fest_id || []; // Modify based on your actual response
                    console.log("dfsadf", response.data[0].fest_id);

                    // Set services with proper selected state
                    // setServices((prevServices) =>
                    //     prevServices.map(service =>
                    //         selectedFestIds.includes(service.fest_id)
                    //             ? { ...service, selected: true }
                    //             : service
                    //     )
                    // );
                    console.log(">>>>", response.data[0].service_data);





                    // if (typeof response.data[0].service_data !== 'object' || response.data[0].service_data === null) {
                    //     throw new Error('formData.service_data is not an object');
                    // }

                    // // Group data by fest_name
                    // const groupedData = Object.entries(response.data[0].service_data).reduce((acc, [key, products]) => {
                    //     products.forEach(product => {
                    //         const festName = product.fest_name; // Extract fest_name
                    //         if (!acc[festName]) acc[festName] = [];
                    //         acc[festName].push(product);
                    //     });
                    //     return acc;
                    // }, {});


                    // Group data by fest_name
                    const grouped = Object.entries(response.data[0].service_data).reduce((acc, [key, products]) => {
                        (products as Product[]).forEach(product => {
                            const festName = product.fest_name; // Extract fest_name
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
            febking_id: fireData.febking_id || '',
            febking_created_by: storedData,
            febking_entry_type: 1,
            fest_id: "",
            product_data: [],
            febking_total_amount: '0.00',
            febking_total_sgst: '0.00',
            febking_total_cgst: '0.00',
            febking_final_amount: '0.00',
            client_id: "",
            firstName: '',
            discount: "",
            discount_amount: "",
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
        if (fireData && fireData.product_data && fireData.product_data.length > 0) {
            const initialProductData = fireData.product_data.map((product: any) => ({
                id: product.id,
                qty: product.qty,
                rate: product.rate,
                totalAmount: product.totalAmount,
                hsnCode: product.feit_hsn_code,
                capacity: product.capacity,
                feit_id: product.feit_id,
                feb_name: product.feb_name,
                feit_name: product.feit_name,
                febd_sgst: product.febd_sgst,
                febd_cgst: product.febd_cgst,
                febd_sgst_amount: product.febd_sgst_amount,
                febd_cgst_amount: product.febd_cgst_amount,
                feb_id: product.feb_id,
                febd_sr_no: product.febd_sr_no,
            }));



            setValue('product_data', initialProductData);

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







    //----------------------------------  ADD or Remove produtct data ---------------------------------------------------------
    const { fields, append, remove } = useFieldArray({
        control,
        name: 'product_data',
    });







    //-------------------------------------------------------------------------------------------------------------------------



    //-----------------------------------------------get Client list -----------------------------------------------------------------
    const [mobileNoValue, setMobileNoValue] = useState<string>('');
    const [clientData, setClientData] = useState<ClientData[]>([]);
    const [selectedClientId, setSelectedClientId] = useState<number | null>(null);
    const [inputValue, setInputValue] = useState<string>('');
    const [filteredClients, setFilteredClients] = useState<ClientData[]>([]);
    const [isAddingNewClient, setIsAddingNewClient] = useState<boolean>(false);



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

    //--------------------------------------------------------------------------------------------------------------------------------------- 
    // const [certificate, setcertificate] = useState<FormData[]>([]);
    const router = useRouter();
    const handlecertificate = async (id: number) => {

        try {
            const response = await GetCertificateData.GetCertificateId(id.toString());

            // generateclientPDF(response.data[0]);
            console.log("data", response.data[0]);
            // handleclientPrint(response.data[0]);


        } catch (error) {
            console.error('Error fetching here:', error);
        }
    };















    return (
        <div className="container-fluid">
            <div className="card mb-3">
                <div className="card-header d-flex justify-content-between align-items-center">
                    <h3>Update Fire Extinguisher</h3>
                    <div>
                        <Link href={`../Certificte?id=${fireData.febking_id}`} className="btn btn-sm btn-primary me-2">
                            Create Certificate
                        </Link>
                        <Link href="/Fire/Fire-List" className="btn btn-sm btn-success">
                            Back
                        </Link>
                    </div>
                </div>

                {fireData && (
                    <div className="card-body">
                        <div className="row mb-3">
                            <div className="col-lg-6 col-md-12">
                                <label>Invoice No:</label> <span>{fireData.febking_invoice_no}</span>
                            </div>
                        </div>

                        <div className="row mb-3">
                            <div className="col-lg-6 col-md-12">
                                <label className="form-label">Select Employees:</label> <span>{fireData.employee_names}</span>
                            </div>
                        </div>

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
                                        <th>SGST</th>
                                        <th>CGST</th>
                                        <th>Febd SR No</th>
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
                                                    <td>{product.febd_sgst}</td>
                                                    <td>{product.febd_cgst}</td>
                                                    <td>{product.febd_sr_no}</td>
                                                </tr>
                                            ))}
                                        </React.Fragment>
                                    ))}
                                </tbody>
                                <tfoot>
                                    <tr>
                                        <td colSpan={5}></td>
                                        <td>{fireData.febking_total_amount}</td>
                                        <td>{fireData.febking_total_sgst}</td>
                                        <td>{fireData.febking_total_cgst}</td>
                                        <td></td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>

                        <div className="text-end mb-3">
                            <h5>Final Amount: {fireData.febking_final_amount}</h5>
                        </div>

                        <div className="row mb-3">
                            <div className="col-lg-6 col-md-12">
                                <label className="set_label">Discount:</label> <span>{fireData.febking_discount}</span>
                            </div>
                            <div className="col-lg-6 col-md-12">
                                <label className="set_label">Discount Amount:</label> <span>{fireData.febking_discount_amount}</span>
                            </div>
                        </div>

                        <div className="row mb-3">
                            <div className="col-lg-6 col-md-12">
                                <label className="set_label">What's-up No:</label> <span>{fireData.whatsup_no}</span>
                            </div>
                        </div>

                        <div className="row mb-4">
                            <div className="col-md-12">
                                <h4>Client Details:</h4>
                                <hr />
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-lg-4 col-md-6 mb-3">
                                <label className="form-label">Client Name:</label> <span>{formData.firstName}</span>
                            </div>
                            <div className="col-lg-4 col-md-6 mb-3">
                                <label className="form-label">Address:</label> <span>{formData.address}</span>
                            </div>
                            <div className="col-lg-4 col-md-6 mb-3">
                                <label className="form-label">City:</label> <span>{formData.client_city}</span>
                            </div>
                            <div className="col-lg-4 col-md-6 mb-3">
                                <label className="form-label">State:</label> <span>{formData.client_state}</span>
                            </div>
                            <div className="col-lg-4 col-md-6 mb-3">
                                <label className="form-label">Pin-code:</label> <span>{formData.client_pincode}</span>
                            </div>
                            <div className="col-lg-4 col-md-6 mb-3">
                                <label className="form-label">Email-id:</label> <span>{formData.email}</span>
                            </div>
                            <div className="col-lg-4 col-md-6 mb-3">
                                <label className="form-label">Gst-no:</label> <span>{formData.gstNo}</span>
                            </div>
                            <div className="col-lg-4 col-md-6 mb-3">
                                <label className="form-label">Vendor code:</label> <span>{formData.vendorCode}</span>
                            </div>
                            <div className="col-lg-4 col-md-6 mb-3">
                                <label className="form-label">P.o.No.:</label> <span>{formData.poNo}</span>
                            </div>
                            <div className="col-lg-4 col-md-6 mb-3">
                                <label className="form-label">Mobile No:</label> <span>{formData.mobileNo}</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>

    );
};

export default ViewFire;

