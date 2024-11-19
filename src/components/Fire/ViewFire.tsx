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
import CabbookingList from '@/app/Api/CabBooking/CabbookingList';
import { Button } from 'react-bootstrap';
import FirePaymentModel from './FirePaymentModel';
import FireVendorPayment from './VendorPayment/FireVendorpay';
import FireVendorPayModel from './VendorPayment/FireVendorpayModel';


export interface FormData {
    febking_id: any;
    febking_total_sgst: any;
    febking_total_cgst: any;
    febking_entry_type: 1;
    febking_created_by: any;
    febking_final_amount: any;
    fest_id: any;
    febking_total_amount: string;
    client_firstName: string;
    client_address: string;
    client_email: string;
    client_gstNo: string;
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
    client_mobileNo: any
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
    gstNo: string;
    client_mobileNo: string;
    client_city: string;
    client_state: string;
    client_pincode: string;
    poNo: string;
    vendorCode: string;
}

interface Client {
    client_id: any,
    client_firstName: string;
    client_address: string;
    client_email: string;
    client_gstNo: string;
    client_mobileNo: string;
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
        client_firstName: '',
        client_address: '',
        client_email: '',
        client_gstNo: '',
        vendorCode: '',
        poNo: '',
        client_mobileNo: '',
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
                    const response = await getFireBookingId.GetFireBookingId(q_quotation_no);
                    setFireData(response.data[0]);
                    console.log(response.data);
                    
                    if (response.data && response.data.length > 0) {
                        const client_id = response.data[0].client_id;
                        setSelectedClientId(client_id);
                        // Set form data based on fetched client details
                        setFormData({
                            client_id: response.data[0].client_id,
                            client_firstName: response.data[0].client_firstName,
                            client_address: response.data[0].client_address,
                            client_email: response.data[0].client_email,
                            client_gstNo: response.data[0].client_gstNo,
                            vendorCode: response.data[0].vendorCode,
                            poNo: response.data[0].poNo,
                            client_mobileNo: response.data[0].client_mobileNo,
                            client_city: response.data[0].client_city,
                            client_state: response.data[0].client_state,
                            client_pincode: response.data[0].client_pincode,



                        });
                        setInputValue(response.data[0].client_firstName);

                        setValue("febking_id", response.data[0].febking_id);
                        setValue("client_id", response.data[0].client_id)
                        setValue("client_firstName", response.data[0].client_firstName);
                        setValue("client_address", response.data[0].client_client_address);

                        setValue("client_email", response.data[0].client_client_email);
                        setValue("client_gstNo", response.data[0].client_gstNo);
                        setValue("vendorCode", response.data[0].vendorCode);

                        setValue("poNo", response.data[0].poNo);
                        setValue("mobileNo", response.data[0].client_mobileNo);
                        setValue("discount", response.data[0].q_discount);
                        setValue("discount_amount", response.data[0].q_discount_amount || '');
                        setValue("client_city", response.data[0].client_city);
                        setValue("client_state", response.data[0].client_state);
                        setValue("client_pincode", response.data[0].client_pincode);
                        setMobileNoValue(response.data[0].client_mobileNo);
                        setValue("whatsup_no", response.data[0].whatsapp_no || '');
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


    const getTicketDetail = async (q_quotation_no: string) => {
        try {
            const getTDetail = await getFireBookingId.GetFireBookingId(q_quotation_no);
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
            client_firstName: '',
            discount: "",
            discount_amount: "",
            client_address: '',
            client_email: '',
            client_gstNo: '',
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


    //----------------------------------  ADD or Remove produtct data ---------------------------------------------------------
    const { fields, append, remove } = useFieldArray({
        control,
        name: 'product_data',
    });

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

    //-------------------------------------------------------------------------------------------------------------------------



    const [paymentModel, setpaymentModel] = useState(false);
    const [PaymentId, setPaymentId] = useState<number | null>(null);
    const [Paymentdata, setPaymentdata] = useState<any[]>([]);


    const handleFirePayment = async (q_quotation_no: number) => {
        try {
            const response = await getFireBookingId.GetFireBookingId(q_quotation_no.toString());


            console.log(">>>>>>", response.data[0].q_quotation_no);

            setPaymentId(response.data[0].q_quotation_no);
            setPaymentdata(response.data[0]);
            setpaymentModel(true);





        } catch (error) {
            console.error('Error handling journey start:', error);
            alert('Error occurred while handling payment journey.');
        }
    };

    //----------------------------------------------------------------------------------------------------------------------
    const [MakepaymentModel, setMakepaymentModel] = useState(false);
    const [MakepaymentId, setMakepaymentId] = useState<number | null>(null);
    const [Makepaymentdata, setMakepaymentdata] = useState<any[]>([]);

    const handleMakePayment = async (q_quotation_no: number) => {
        try {
            const response = await getFireBookingId.GetFireBookingId(q_quotation_no.toString());



            setPaymentId(response.data[0].q_quotation_no);
            setMakepaymentdata(response.data[0]);
            setMakepaymentModel(true);





        } catch (error) {
            console.error('Error handling journey start:', error);
            alert('Error occurred while handling payment journey.');
        }
    };





    return (
        <div className="container" style={{ fontSize: "12px" }}>
            <br />
            <div className=" d-flex justify-content-between align-items-center">
                <h4>View Fire Extinguisher Data</h4>
                <div>


                    <Link href={`../Certificte?id=${fireData.q_quotation_no}`} style={{ float: "right", marginRight: "8px", fontSize: "12px" }} className="btn btn-sm btn-primary me-2">
                        Create Certificate
                    </Link>

                    <Button variant="success" size="sm" className="btn btn-sm btn-success" style={{ float: "right", marginRight: "7px", fontSize: "12px" }} onClick={() => handleFirePayment(fireData.q_quotation_no)}>Payment</Button>

                    <Button variant="success" size="sm" className="btn btn-sm btn-success" style={{ float: "right", marginRight: "10px", fontSize: "12px" }} onClick={() => handleMakePayment(fireData.q_quotation_no)}>Make Payment</Button>

                    <Link href="/Fire/Fire-List" style={{ float: "right", marginRight: "8px", fontSize: "12px" }} className="btn btn-sm btn-primary">
                        Back
                    </Link>

                </div>

                <FirePaymentModel
                    show={paymentModel}
                    handleClose={() => setpaymentModel(false)}
                    paymentinitialData={Paymentdata}
                    PaymentId={PaymentId} />

                <FireVendorPayModel
                    show={MakepaymentModel}
                    handleClose={() => setMakepaymentModel(false)}
                    paymentinitialData={Makepaymentdata}
                    PaymentId={MakepaymentId}
                />
            </div>
            <br />
            <div className="card mb-3 cardbox">


                {fireData && (
                    <div className="card-body" style={{ fontSize: "12px" }}>
                        <div className="row mb-3">
                            <div className="col-lg-6 col-md-12">
                                <label>Invoice No:</label> <span>{fireData.febking_invoice_no}</span>
                            </div>
                        </div>

                        <div className="row mb-3">
                            <div className="col-lg-6 col-md-12">
                                <label className="form-label"> Employees:</label> <span>{fireData.employee_name}</span>
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
                            <h5>Final Amount: {fireData.q_final_amount}</h5>
                        </div>

                        <div className="row mb-3">
                            <div className="col-lg-6 col-md-12">
                                <label className="set_label">Discount:</label> <span>{fireData.q_discount}</span>
                            </div>
                            <div className="col-lg-6 col-md-12">
                                <label className="set_label">Discount Amount:</label> <span>{fireData.q_discount_amount}</span>
                            </div>
                        </div>



                        <div className="row mb-3">
                            <div className="col-md-12">
                                <h4>Client Details:</h4>
                                <hr />
                            </div>
                        </div>

                        <div className="row mb-3">
                            <div className="col-lg-3 col-md-6 mb-3">
                                <label className="form-label">Client Name:</label> <span>{formData.client_firstName}</span>
                            </div>
                            <div className="col-lg-3 col-md-6 mb-3">
                                <label className="form-label">client_address:</label> <span>{formData.client_address}</span>
                            </div>
                            <div className="col-lg-3 col-md-6 mb-3">
                                <label className="form-label">City:</label> <span>{formData.client_city}</span>
                            </div>
                            <div className="col-lg-3 col-md-6 mb-3">
                                <label className="form-label">State:</label> <span>{formData.client_state}</span>
                            </div>
                            <div className="col-lg-3 col-md-6 mb-3">
                                <label className="form-label">Pin-code:</label> <span>{formData.client_pincode}</span>
                            </div>
                            <div className="col-lg-3 col-md-6 mb-3">
                                <label className="form-label">client_email-id:</label> <span>{formData.client_email}</span>
                            </div>
                            <div className="col-lg-3 col-md-6 mb-3">
                                <label className="form-label">Gst-no:</label> <span>{formData.client_gstNo}</span>
                            </div>
                            <div className="col-lg-3 col-md-6 mb-3">
                                <label className="form-label">Vendor code:</label> <span>{formData.vendorCode}</span>
                            </div>

                            <div className="col-lg-3 col-md-6 mb-3">
                                <label className="form-label">Mobile No:</label> <span>{formData.client_mobileNo}</span>
                            </div>
                            <div className="col-lg-6 col-md-12">
                                <label className="set_label">Whatsapp No:</label> <span>{fireData.whatsapp_no}</span>
                            </div>
                        </div>
                        <div className="row mb-3">
                            {fireData.payment_status && (
                                <div className="col-lg-3 col-sm-6">
                                    <label style={{ fontWeight: "bold" }} className="form-label">Payment Status : </label>
                                    <span
                                        style={{
                                            fontWeight: "bold",
                                            color: fireData.payment_status === "paid" ? "green" : "red"
                                        }}
                                    >
                                        {fireData.payment_status}
                                    </span>
                                </div>
                            )}
                        </div>

                        {fireData.payment_details && fireData.payment_details.length > 0 && fireData.payment_details[0].id && (
                            <>
                                <div className="row mt-4">
                                    <div className="col-md-6">
                                        <h5>Payment Details:</h5>
                                    </div>

                                    <hr />
                                </div>



                                {fireData.payment_details.map((paymentDetail: any, index: any) => (
                                    <div className="row mb-3" key={index}>
                                        {paymentDetail.payment_method && (
                                            <div className="col-lg-3 col-sm-6">
                                                <label className="form-label">Payment Method:</label>
                                                <span> {paymentDetail.payment_method}</span>
                                            </div>
                                        )}
                                        {paymentDetail.payment_details && (
                                            <div className="col-lg-3 col-sm-6">
                                                <label className="form-label">Payment Details:</label>
                                                <span> {paymentDetail.payment_details}</span>
                                            </div>
                                        )}
                                        {paymentDetail.total_amount && (
                                            <div className="col-lg-3">
                                                <label className="form-label">Total  Amount:</label>
                                                <span> {paymentDetail.total_amount}</span>
                                            </div>
                                        )}



                                        {paymentDetail.actual_amount && (
                                            <div className="col-lg-3">
                                                <label className="form-label">Actual  Amount:</label>
                                                <span> {paymentDetail.actual_amount}</span>
                                            </div>
                                        )}
                                        {paymentDetail.paid_amount && (
                                            <div className="col-lg-3">
                                                <label className="form-label">Total Paid Amount:</label>
                                                <span> {paymentDetail.paid_amount}</span>
                                            </div>
                                        )}

                                    </div>
                                ))}
                            </>
                        )}

                    </div>
                )}
            </div>
        </div>

    );
};

export default ViewFire;

