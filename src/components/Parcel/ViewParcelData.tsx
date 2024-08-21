import EditParcelDataList from '@/app/Api/EditParcelDataList';
import EditTicketData from '@/app/Api/EditTicketData';
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import "../../../public/css/ticketview.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinusCircle } from '@fortawesome/free-solid-svg-icons';
import handleParcelPrint from '@/app/parcel_list/parcel_data/printpparcelUtils';
import { Modal } from 'react-bootstrap';
import Link from 'next/link';

type FormData = {
    parcel_id: string;
    is_delivery: boolean;
    particulars: string;
    qty_total: number;
    receipt_no: string;
    booking_date: string;
    dispatch_date: string;
    book_from: string,
    sender_name: string;
    rec_name: string;
    send_mob: string;
    rec_mob: string;
    send_add: string;
    rec_add: string;
    sender_proof_type: string;
    reciver_proof_type: string;
    sender_proof_detail: string;
    reciver_proof_detail: string
    pic_delivery_type: string;
    pic_charge: number;

    pic_office_detail: string;
    actual_paid_amount: number;
    dis_delivery_type: string;
    dis_charge: number;
    bus_no: string;
    driver_no: string;
    transport_charge: string;
    dis_office_detail: string;
    from_state: string,
    to_state: string,
    book_to: string,
    added_by: string;
    user_id: 14;

    pic_address: {
        pickup_client_address: string;
        pickup_office_address: string;
    }[];
    dis_address: {
        dispatch_client_address: string;
        dispatch_office_address: string;
    }[];
    payment_method: string;
    actual_total: number;
    print_total: number;
    gst_amount: number;
    print_gst_amount: number;
    bilty_charge: number;
    is_demurrage: boolean;
    actual_payable_amount: number;
    print_payable_amount: number;
    lr_no: number
    print_paid_amount: number;
    actual_bal_amount: number;
    print_bal_amount: number;
    total_demurrage_charges: number;
    demurrage_days: number;
    demurrage_charges: number;
    parcel_detail: ParcelDetail[];
    bill_detail: ParcelBillDetail[];
    transection_id: any;


};

interface ParcelBillDetail {
    id: number;
    e_way_bill_no: string;
    p_o_no: string;
    invoice_no: string;
    invoice_amount: string;
}

interface ParcelDetail {
    id: number;
    parcel_type: string;
    weight: number;
    qty: number;
    rate: number;
    total_amount: number;
    print_rate: number;
    total_print_rate: number;
    QTYtotal: number;
}





const ViewParcelData = () => {





    const [parcelImages, setParcelImages] = useState<string[]>([]);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);



    const [parcelData, setParcelData] = useState<any>("");
    const [parcelDetail, setparcelDetail] = useState<ParcelDetail[]>([]);
    const [error, setError] = useState<string>('');
    const [EwayFields, setEwayFields] = useState<ParcelBillDetail[]>([]);
    const [addressFields, setAddressFields] = useState<{
        pic_address: {
            pickup_client_address: string;
            pickup_office_address: string;
        }[];
        dis_address: {
            dispatch_client_address: string;
            dispatch_office_address: string;
        }[];
    }>({
        pic_address: [],
        dis_address: [],
    });

    useEffect(() => {

        const fetchData = async () => {

            try {
                const ticketToken = new URLSearchParams(window.location.search).get("token");
                if (ticketToken) {

                    const response = await EditParcelDataList.getEditParcelData(ticketToken);
                    if (response.data && response.data.length > 0) {


                        const fetchedBillDetail = response.data[0].parcel_bill_detail;
                        console.log("BILLDetail", response.data[0].parcel_bill_detail);

                        if (fetchedBillDetail) {
                            setEwayFields([...fetchedBillDetail]); // Populate EwayFields with fetched data
                        } else {
                            setError('No parcel bill details found.');
                        }
                        // Filter delivery details based on del_type
                        const picAddresses = response.data[0].delivery_detail
                            .filter((detail: any) => detail.del_type === 1)
                            .map((detail: any) => ({
                                parcel_id: detail.parcel_id || '',
                                pickup_client_address: detail.pic_start_point || '',
                                pickup_office_address: detail.pic_end_point || '',
                            }));
                        const disAddresses = response.data[0].delivery_detail
                            .filter((detail: any) => detail.del_type === 2)
                            .map((detail: any) => ({
                                parcel_id: detail.parcel_id || '',
                                dispatch_client_address: detail.dis_start_point || '',
                                dispatch_office_address: detail.dis_end_point || '',
                            }));

                        setAddressFields({
                            pic_address: picAddresses,
                            dis_address: disAddresses,

                        });

                        const fetchedParcelImages = response.data[0]?.parcel_imgs || [];
                        setParcelImages(fetchedParcelImages);

                        const fetchedParcelDetail = response.data[0]?.parcel_detail;
                        if (fetchedParcelDetail) {
                            const transformedParcelDetail: ParcelDetail[] = fetchedParcelDetail.map((item: any, index: number) => ({
                                id: index + 1,
                                parcel_type: item.parcel_type || '',
                                weight: Number(item.weight) || 0,
                                qty: Number(item.qty) || 0,
                                rate: Number(item.rate) || 0,
                                print_rate: Number(item.print_rate) || 0,
                                total_amount: Number(item.total_rate) || 0,
                                total_print_rate: Number(item.total_print_rate) || 0
                            }));
                            setparcelDetail(transformedParcelDetail);
                        } else {
                            setError('No parcel details found.');
                        }
                        // Assuming parcel_bill_detail is an array in your response


                        setError('');
                    }





                    else {
                        setError('No data found for this ticket token.');
                    }





                }

                else {


                    setparcelDetail([]); // Clear parcel data if no token is present
                    setError('Ticket token not found.');
                }
            } catch (error) {
                setError('Error fetching ticket data. Please try again later.');
                console.error('Error fetching ticket data:', error);
            }
        };

        const handleURLChange = () => {
            const urlParams = new URLSearchParams(window.location.search);
            const ticketToken = urlParams.get("token");
            if (ticketToken) {
                getTicketDetail(ticketToken);
            } else {
                setParcelData(null);
            }
        };

        // Initial fetch
        fetchData();

        // Event listener for URL change
        window.addEventListener('popstate', handleURLChange);
        handleURLChange();

        // Clean up event listener
        return () => {
            window.removeEventListener('popstate', handleURLChange);
        };
    }, []);




    const getTicketDetail = async (ticketToken: string) => {
        try {
            const getTDetail = await EditParcelDataList.getEditParcelData(ticketToken);

            setParcelData(getTDetail.data[0]);
            setError("");
            console.log("fgdjg", getTDetail);


        } catch (error) {
            setError("Error fetching ticket data. Please try again later.");
            console.error("Error fetching ticket data:", error);
        }
    };



    console.log("gffgdfhjf", parcelData)


    const handleImageClick = (imageUrl: string) => {
        setSelectedImage(imageUrl);
    };

    const handleCloseModal = () => {
        setSelectedImage(null);
    };

    const { register, handleSubmit, formState: { errors }, watch, setValue, reset } = useForm<FormData>({});
    const paymentMethod = watch('payment_method');


    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');


    useEffect(() => {
        if (parcelData) {
            setSelectedPaymentMethod(parcelData.payment_method);
            setValue('payment_method', parcelData.payment_method);
            setValue('transection_id', parcelData.transection_id || '');
        }
    }, [parcelData, setValue]);










    return (

        <>




            <div className="d-flex justify-content-center">
                <div className="container-fluid mt-3">
                    <div className="card mb-3" style={{ width: "auto" }}>
                        <div className="card-header" style={{ display: "flex", justifyContent: "space-between" }}>
                            <h4>View Parcel Detail</h4>
                            <div>
                                <button onClick={() => handleParcelPrint(parcelData)}
                                    className="btn btn-sm btn-primary" style={{ float: "right" }} >Print</button>

                                <Link href="/parcel_list" className="btn btn-sm btn-success" style={{ float: "right", marginRight: "8px" }}>Back</Link>

                            </div>
                        </div>
                        <div className="card-body">
                            <form method="post" action="">
                                <div className="card mb-3" style={{ width: "auto" }}>
                                    {error && <p>{error}</p>}
                                    {parcelData && (
                                        <div className="card-body">
                                            <div className="row mb-3">
                                                <div className="col-lg-6">
                                                    <label className="set_labelData">Booking date : </label>
                                                    <span>{parcelData.booking_date}</span>
                                                </div>
                                            </div>
                                            <div className="row mb-3">
                                                <div className="col-lg-6 ">
                                                    <label className="set_labelData">From:</label>
                                                    <span>{parcelData.from_state_name} - {parcelData.from_city_name}</span>
                                                </div>
                                                <div className="col-lg-6">
                                                    <label className="set_labelData">To: </label>
                                                    <span>{parcelData.to_state_name} - {parcelData.to_city_name}</span>
                                                </div>


                                            </div>

                                            <div className="row mb-3">
                                                <div className="col-lg-6">
                                                    <label className="set_labelData">Sender Name:</label>
                                                    <span> {parcelData.sender_name}</span>
                                                </div>
                                                <div className="col-lg-6">
                                                    <label className="set_labelData">Reciver Name:</label>
                                                    <span> {parcelData.rec_name}</span>
                                                </div>
                                            </div>
                                            <div className="row mb-3">
                                                <div className="col-lg-6">
                                                    <label className="set_labelData">Sender Mobile No:</label>
                                                    <span>{parcelData.send_mob}</span>
                                                </div>
                                                <div className="col-lg-3">
                                                    <label className="set_labelData">Reciver Mobile No:</label>
                                                    <span>{parcelData.rec_mob}</span>
                                                </div>
                                                <div className="col-lg-3">
                                                    <label className="set_labelData">whatsapp No:</label>
                                                    <span>{parcelData.whatsapp_no}</span>
                                                </div>
                                            </div>
                                            <div className="row mb-3">
                                                <div className="col-lg-6">
                                                    <label className="set_labelData">Select Sender ID Proof Type:</label><br />
                                                    <span>{parcelData.sender_proof_type}</span>
                                                </div>
                                                <div className="col-lg-6">
                                                    <label className="set_labelData">Select Reciver ID Proof Type:</label><br />
                                                    <span>{parcelData.reciver_proof_type}</span>
                                                </div>
                                            </div>
                                            <div className="row mb-3">
                                                <div className="col-lg-6">
                                                    <label className="set_labelData">Sender Adhar No./PAN No./GST No:</label>
                                                    <span>{parcelData.sender_proof_detail}</span>
                                                </div>
                                                <div className="col-lg-6">
                                                    <label className="set_labelData">Reciver Adhar No./PAN No./GST No:</label>
                                                    <span>{parcelData.reciver_proof_detail}</span>
                                                </div>
                                            </div>
                                            <div className="row mb-3">
                                                <div className="col-lg-6">
                                                    <label className="set_labelData">Sender Address</label>
                                                    <span>{parcelData.send_add}</span>
                                                </div>
                                                <div className="col-lg-6">
                                                    <label className="set_labelData">Reciver Address</label>
                                                    <span>{parcelData.rec_add}</span>
                                                </div>
                                            </div>
                                            <div className="row mb-3">
                                                <div className="col-lg-6">
                                                    <label className="set_labelData">Created By</label>
                                                    <span>{parcelData.added_by_name}</span>
                                                </div>
                                                <div className="col-lg-6">
                                                    <label className="set_labelData">Updated By</label>
                                                    <span>{parcelData.updated_by_name}</span>
                                                </div>
                                            </div>
                                            <div className="row mb-3">
                                                <div className="col-lg-6">
                                                    <label className="set_labelData">Created Date</label>
                                                    <span>{parcelData.created_at}</span>
                                                </div>
                                                <div className="col-lg-6">
                                                    <label className="set_labelData">Updated Date</label>
                                                    <span>{parcelData.updated_at}</span>
                                                </div>
                                            </div>
                                            <br />


                                            <div className="row mb-3">

                                                <table id="example" className="table table-striped" style={{ width: "100%" }}>

                                                    <thead>
                                                        <tr>
                                                            <th>Type</th>
                                                            <th>Weight</th>
                                                            <th>Qty</th>
                                                            <th>Rate</th>
                                                            <th>Total</th>
                                                            <th>Print Rate</th>
                                                            <th>Total Print Rate</th>
                                                        </tr>
                                                    </thead>

                                                    {parcelDetail.map((field, index) => (
                                                        <tbody>
                                                            <tr key={index}>
                                                                <td>{field.parcel_type}</td>
                                                                <td>{field.weight}</td>
                                                                <td>{field.qty}</td>
                                                                <td>{field.rate}</td>
                                                                <td>{field.total_amount}</td>
                                                                <td>{field.print_rate}</td>
                                                                <td>{field.total_print_rate}</td>
                                                            </tr>
                                                        </tbody>
                                                    ))}
                                                    <tfoot>

                                                        <tr>
                                                            <td></td>
                                                            <td></td>
                                                            <td></td>
                                                            <td></td>
                                                            <td><b>{parcelData.actual_total}</b></td>
                                                            <td></td>
                                                            <td><b>{parcelData.print_total}</b></td>
                                                        </tr>
                                                    </tfoot>

                                                </table>

                                            </div>





                                            <div className="col-lg-12">
                                                <label className="set_labelData">Parcel Images:</label>
                                                <div className="image-gallery1">
                                                    {parcelImages.length > 0 ? (
                                                        parcelImages.map((imageUrl, index) => (
                                                            <img
                                                                key={index}
                                                                src={imageUrl}
                                                                alt={`Parcel ${index}`}
                                                                className="parcel-image1"
                                                                onClick={() => handleImageClick(imageUrl)}
                                                                style={{ cursor: 'pointer' }}
                                                            />
                                                        ))
                                                    ) : (
                                                        <p>No images available.</p>
                                                    )}
                                                </div>


                                                {selectedImage && (
                                                    <div className="modal-parcel" onClick={handleCloseModal}>
                                                        <span className="close" onClick={handleCloseModal}>&times;</span>
                                                        <img src={selectedImage} alt="Enlarged" className="modal-content-parcel" />

                                                    </div>
                                                )}
                                            </div>
                                            <div className="row mb-3">
                                                <table className="table table-striped" style={{ width: "100%" }}>
                                                    <thead>
                                                        <tr>
                                                            <th>E Way Bill No.</th>
                                                            <th>P.O. No.</th>
                                                            <th>Invoice No.</th>
                                                        </tr>
                                                    </thead>
                                                    {EwayFields.map((field, index) => (
                                                        <tbody>
                                                            <tr>
                                                                <td>E Way Bill No 1</td>
                                                                <td>P O No 1</td>
                                                                <td>IN#001</td>
                                                            </tr>
                                                        </tbody>
                                                    ))}
                                                </table>
                                            </div>


                                            <div className="row">
                                                <div className="col-md-12">
                                                    <h5>Pickup Detail</h5>
                                                </div>

                                            </div>
                                            <hr />
                                            <div className="row mb-3">
                                                <div className="col-md-6">
                                                    <label className="set_labelData">Delivery Type :</label>
                                                    {parcelData.pic_delivery_type === "2" && (
                                                        <span>
                                                            <br />
                                                            {parcelData.pic_delivery_type}


                                                            <div className="col">
                                                                {addressFields.pic_address!.map((field, index) => (
                                                                    <div key={index}>

                                                                        <div className="row mt-2" key={index}>

                                                                            <div className="col-md-4">
                                                                                {field.pickup_client_address}
                                                                            </div>
                                                                            <div className="col-md-4">
                                                                                {field.pickup_office_address}
                                                                            </div>




                                                                        </div>





                                                                    </div>

                                                                ))}
                                                            </div>
                                                        </span>
                                                    )}
                                                    {parcelData.pic_delivery_type === "1" && (
                                                        <span>
                                                            {parcelData.pic_delivery_type}

                                                            <br />
                                                            <div className="col-md-4">
                                                                {parcelData.pic_office_detail}
                                                            </div>
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="col-md-6">
                                                    <label className="set_labelData">Pickup Charge</label>
                                                    <span>{parcelData.pic_charge}</span>
                                                </div>
                                            </div>

                                            <div className="row">
                                                <div className="col-md-12">
                                                    <h5>Dispatch Detail</h5>
                                                </div>

                                            </div>
                                            <hr />
                                            <div className="row mb-3">
                                                <div className="col-md-6">
                                                    <label className="set_labelData">Delivery Type</label>
                                                    {parcelData.dis_delivery_type === "2" && (
                                                        <span>
                                                            <br />
                                                            {parcelData.dis_delivery_type}


                                                            <div className="col">
                                                                {addressFields.dis_address!.map((field, index) => (
                                                                    <div className="row mt-2" key={index}>

                                                                        <div className="col-md-4">
                                                                            {field.dispatch_client_address}
                                                                        </div>
                                                                        <div className="col-md-4">
                                                                            {field.dispatch_office_address}
                                                                        </div>




                                                                    </div>

                                                                ))}
                                                            </div>
                                                        </span>
                                                    )}
                                                    {parcelData.dis_delivery_type === "1" && (
                                                        <span>
                                                            {parcelData.dis_delivery_type}

                                                            <br />
                                                            <div className="col-md-4">
                                                                {parcelData.dis_office_detail}
                                                            </div>
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="col-md-6">
                                                    <label className="set_labelData">Dispatch Charge</label>
                                                    <span>{parcelData.dis_charge}</span>
                                                </div>
                                            </div>

                                            <div className="row">
                                                <div className="col-md-12">
                                                    <h5>Transportation Detail</h5>
                                                </div>

                                            </div>
                                            <hr />
                                            <div className="row mb-3">
                                                <div className="col-md-3">
                                                    <label className="set_labelData">LR No.</label>
                                                    <span>{parcelData.lr_no}</span>
                                                </div>
                                                <div className="col-md-3">
                                                    <label className="set_labelData">Bus No.</label>
                                                    <span>{parcelData.bus_no}</span>
                                                </div>
                                                <div className="col-md-3">
                                                    <label className="set_labelData">Driver Phone No.</label>
                                                    <span>{parcelData.driver_no}</span>
                                                </div>
                                                <div className="col-md-3">
                                                    <label className="set_labelData">Transport Charge</label>
                                                    <span>{parcelData.transport_charge} </span>
                                                </div>
                                            </div>

                                            <br />
                                            <div className="row">
                                                <div className="col-md-12">
                                                    <h5>Payment Detail</h5>
                                                </div>

                                            </div>
                                            <hr />
                                            <div className="row mb-3">
                                                <div className="col-md-3">
                                                    <label className="set_labelData">Actual Final Total</label>
                                                    <span>{parcelData.actual_total}</span>
                                                </div>
                                                <div className="col-md-3">
                                                    <label className="set_labelData">Print Final Total</label>
                                                    <span>{parcelData.print_total}</span>
                                                </div>
                                                <div className="col-md-3">
                                                    <label className="set_labelData">GST Amount</label>
                                                    <span>{parcelData.gst_amount}</span>
                                                </div>
                                                <div className="col-md-3">
                                                    <label className="set_labelData">Bilty Charges</label>
                                                    <span>{parcelData.bilty_charge}</span>
                                                </div>
                                            </div>
                                            <div className="row mb-3">
                                                <div className="col-lg-3">
                                                    <label className="set_labelData">Payment Method</label>

                                                    <span>{parcelData.payment_method}</span>
                                                </div>
                                                {(paymentMethod === 'gpay' || paymentMethod === 'phonepay' || paymentMethod === 'paytm') && (

                                                    <div className="col-lg-3">
                                                        <label className="set_label">Transction Id:</label>
                                                        <span>{parcelData.transection_id}</span>
                                                    </div>
                                                )}

                                                <div className="col-lg-3">
                                                    <label className="set_labelData">Print Payable Amount</label>
                                                    <span>{parcelData.print_payable_amount}</span>
                                                </div>
                                                <div className="col-lg-3">
                                                    <label className="set_labelData">Actual Payable Amount</label>
                                                    <span>{parcelData.actual_payable_amount}</span>
                                                </div>

                                            </div>
                                            <div className="row mb-3">

                                                <div className="col-lg-3">
                                                    <label className="set_labelData">Actual Paid Amount</label>
                                                    <span>{parcelData.actual_paid_amount} </span>
                                                </div>
                                                <div className="col-lg-3">
                                                    <label className="set_labelData">Actual Balance Amount</label>
                                                    <span>{parcelData.actual_bal_amount}</span>
                                                </div>
                                                <div className="col-lg-3">
                                                    <label className="set_labelData">Print Paid Amount</label>
                                                    <span>{parcelData.print_paid_amount}</span>
                                                </div>

                                                <div className="col-lg-3">
                                                    <label className="set_labelData">Print Balance Amount</label>
                                                    <span>{parcelData.print_bal_amount} </span>
                                                </div>
                                            </div>
                                            <div className="row mb-3">
                                                <div className="col-lg-6">
                                                    <label className="set_labelData">Particulars</label>
                                                    <span>{parcelData.particulars} </span>
                                                </div>
                                            </div>


                                        </div>
                                    )}
                                </div>
                            </form>
                        </div >
                    </div >



                </div >

            </div >








        </>
    )
}

export default ViewParcelData