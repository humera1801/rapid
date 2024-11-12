import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Button, Card, Modal } from 'react-bootstrap';
import { useFieldArray, useForm } from 'react-hook-form';
import "../../../public/css/style.css"
import Header from '../Dashboard/Header';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faMinusCircle, faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import CabbookingList from '@/app/Api/CabBooking/CabbookingList';
import Link from 'next/link';
import handlevendorPrint from './VedorVoucher';
import { VendorListPDF } from './VendorPdf/VendorListpdf';


interface FormData {
    id: any;
    gst_no: string;
    bank_name: string;
    ac_no: string;
    ac_type: string;
    ifsc_code: string;
    bank_branch: string;
    transaction_id: { upi_id: string }[];
    created_by: any;
    vendor_name: any;
    vendor_address: any;
    vendor_no: any;
    vendor_type: any;
    created_by_name: any
}



interface User {
    voucher_no: any;
    vp_id: any;
    booking_type: string;
    total_paid_amount: string;
    payment_details: string;
    vendor_no: any;
    created_by_name: string;
    vendor_name: string;
    payment_method: string;
    paid_amount: number;
    advance_paid: any;
    receipt_no: any;
    gst_no: string;
    bank_name: string;
    ac_no: string;
    ac_type: string;
    ifsc_code: string;
    bank_branch: string;
    transaction_id: { upi_id: string }[];
    created_by: any;
    vendor_address: any;
    vendor_type: any;
    id: any;

}


const VendorList = () => {


    const [modalShow, setModalShow] = useState(false);
    const [editModalShow, setEditModalShow] = useState(false);
    const [Vendors, setVendors] = useState<User[]>([]);
    const [editVendor, seteditVenodor] = useState<any>("");
    const storedData = localStorage.getItem('userData');

    const { register, formState: { errors }, setValue, handleSubmit, reset, control } = useForm<FormData>({
        defaultValues: {
            transaction_id: [{ upi_id: '' }],
            created_by: storedData,
        }
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'transaction_id',
    });
    const addRow = () => {
        append({
            upi_id: '',
        });
    };

    const handleRemove = (index: number) => {
        remove(index);
    };



    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await CabbookingList.getvendorList();
            setVendors(response.data);

        } catch (error) {
            console.error('Error fetching Vendors:', error);
        }
    };

    const onSubmit = async (data: FormData) => {
        const transformedTransactionIds = data.transaction_id
            ? data.transaction_id.map((item) => item.upi_id).join(", ")
            : "";
        const formData = {
            ...data,
            transaction_id: transformedTransactionIds,
        };
        console.log(formData);
        try {
            const response = await axios.post('http://192.168.0.106:3001/vendor/add_vendor_details', formData);

            console.log('vehicle rate  added successfully:', response.data);

            // await fetchData();

            reset();
            window.location.reload();
            setModalShow(false);
        } catch (error) {
            console.error('Error adding vehicle rate', error);
        }
    };


    const handleEdit = async (id: number) => {
        try {
            const response = await CabbookingList.getvendorIdData(id.toString());
            seteditVenodor(response.data);
            console.log(response.data);

            const transactionData = response.data.transaction_id || [];
            setEditModalShow(true);
            reset({ transaction_id: [] });
            transactionData.forEach((upiId: string) => {
                const cleanedUpiId = upiId.trim().replace(/\s+/g, '');
                append({ upi_id: cleanedUpiId });
            });
            console.log(transactionData);

        } catch (error) {
            console.error('Error fetching vehicle rate details:', error);
        }
    };



    const handleEditSubmit = async (data: FormData) => {
        console.log(data);

        const transformedTransactionIds = data.transaction_id
            ? data.transaction_id.map((item) => item.upi_id).join(", ")
            : "";
        const vendorId = editVendor.id
        const formData = {
            ...data,
            created_by: editVendor.created_by,
            id: vendorId,
            transaction_id: transformedTransactionIds,
        };
        console.log(">>>>>>>", formData);

        try {

            const response = await axios.post('http://192.168.0.106:3001/vendor/edit_vendor_details', formData);
            console.log('vehicle updated successfully:', response.data);
            await fetchData();
            setEditModalShow(false);
            reset();
            window.location.reload();
        } catch (error) {
            console.error('Error updating vehicle rate:', error);
        }
    };



    const handleDelete = async (id: number) => {
        try {
            const response = await CabbookingList.deleteVendor(id.toString());
            seteditVenodor(response);
            reset();
            window.location.reload();
        } catch (error) {
            console.error('Error deleting vehicle rate:', error);
        }
    };
    const handleDeleteClick = (id: number) => {
        if (window.confirm('Are you sure you want to delete this vehicle rate?')) {
            handleDelete(id);
        }
    };






    const handleVendorTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value, checked } = e.target;

        seteditVenodor((prevState: { vendor_type: any; }) => {
            let newVendorTypes = [...prevState.vendor_type];

            if (checked) {
                newVendorTypes.push(value);
            } else {
                newVendorTypes = newVendorTypes.filter((item) => item !== value);
            }

            return { ...prevState, vendor_type: newVendorTypes };
        });
    };
    return (
        <>
            <Header />
            <div className='container' style={{ fontSize: "12px" }}>
                <br />

                <div className="col-12">
                    <label style={{ fontSize: "25px", fontWeight: "500" }}>Vendor List</label>
                    
                    <button style={{ float: "right", marginTop: "6px" }} onClick={() => { reset(); setModalShow(true) }} className="btn btn-primary btn-sm ms-1">Add New Vendor</button>
                    <button  style={{ float: "right", marginTop: "6px" }} onClick={() => VendorListPDF(Vendors)}
                        className="btn btn-sm btn-info " >PDF</button>
                </div>
                <br />
                <Card className='cardbox'>

                    <Card.Body>
                        {/* Add New User Modal */}
                        <Modal
                            show={modalShow}
                            onHide={() => setModalShow(false)}
                            size="lg"
                            aria-labelledby="contained-modal-title-vcenter"
                            centered
                        >
                            <Modal.Header closeButton>
                                <Modal.Title id="contained-modal-title-vcenter">
                                    Add New Vendor
                                </Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <form onSubmit={handleSubmit(onSubmit)}>
                                    <div className="row mb-1">
                                        <div className="col-md-12">
                                            <h6 style={{ fontSize: "13px" }}>Vendor Detail:</h6>
                                        </div>
                                        <hr />
                                    </div>
                                    <div className="row mb-1">
                                        <div className="col-lg-3">
                                            <label className="form-label " htmlFor="vendor_name">Vendor Name</label>
                                            <input
                                                {...register('vendor_name', { required: true })}
                                                className="form-control form-control-sm"
                                                type='text'
                                                placeholder="Enter vendor name"
                                                id='vendor_name'
                                            />
                                            {errors?.vendor_name?.type === "required" && <span className="error">This field is required</span>}

                                        </div>
                                        <div className="col-md-3 mb-3">
                                            <label className="form-label" htmlFor="vendor_no">Mobile-no</label>
                                            <input
                                                {...register('vendor_no', { required: "true" })}
                                                className="form-control form-control-sm"
                                                type='text'
                                                minLength={10}
                                                maxLength={10}
                                                placeholder="Enter mobile number"
                                                id='vendor_no'

                                            />
                                            {errors?.vendor_no?.type === "required" && <span className="error">This field is required</span>}
                                            {errors?.vendor_no?.type === "pattern" && <span className="error">Enetr valid Number</span>}

                                        </div>
                                        <div className="col-md-3 mb-3">
                                            <label className="form-label" htmlFor="vendor_address">Address:</label>
                                            <textarea
                                                {...register('vendor_address', { required: true })}
                                                className="form-control form-control-sm"
                                                id='vendor_address'
                                                placeholder="Enter address"


                                            />
                                            {errors?.vendor_address?.type === "required" && <span className="error">This field is required</span>}

                                        </div>
                                        <div className="col-md-3 mb-3">
                                            <label className="form-label" htmlFor="gst_no">Gst-no:</label>
                                            <input
                                                {...register("gst_no", {
                                                    required: true,
                                                    pattern: /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[0-9]{1}[A-Z]{1}[0-9A-Z]{1}$/
                                                })}
                                                className="form-control form-control-sm"
                                                type="text"
                                                placeholder="Enter Gst no."
                                            />
                                            {errors?.gst_no?.type === "required" && <span className="error">This field is required</span>}
                                            {errors?.gst_no?.type === "pattern" && <span className="error">Enetr GST valid Number</span>}

                                        </div>
                                    </div>
                                    <div className="col-md-12 mb-3" style={{ fontSize: "12px" }}>

                                        <label className="form-label">Vendor Type:</label>
                                        {errors?.vendor_type?.type === "required" && <span className="error" style={{ marginLeft: "5px" }}>This field is required</span>}

                                        <div className="d-flex flex-wrap">
                                            <div className="form-check form-check-sm me-3">
                                                <input
                                                    {...register('vendor_type', { required: true })}
                                                    className="form-check-input form-check-sm"
                                                    type="checkbox"
                                                    value="fire"
                                                    id="fire"
                                                />
                                                <label className="form-check-label form-check-label-sm" htmlFor="fire">
                                                    Fire Extingusher
                                                </label>
                                            </div>
                                            <div className="form-check form-check-sm me-3">
                                                <input
                                                    {...register('vendor_type')}
                                                    className="form-check-input form-check-sm"
                                                    type="checkbox"
                                                    value="ticket"
                                                    id="ticket"
                                                />
                                                <label className="form-check-label" htmlFor="ticket">
                                                    Ticket
                                                </label>
                                            </div>
                                            <div className="form-check me-3">
                                                <input
                                                    {...register('vendor_type')}
                                                    className="form-check-input"
                                                    type="checkbox"
                                                    value="parcel"
                                                    id="parcel"
                                                />
                                                <label className="form-check-label form-check-sm" htmlFor="parcel">
                                                    Parcel
                                                </label>
                                            </div>
                                            <div className="form-check">
                                                <input
                                                    {...register('vendor_type')}
                                                    className="form-check-input"
                                                    type="checkbox"
                                                    value="cab"
                                                    id="cab"
                                                />
                                                <label className="form-check-label" htmlFor="cab">
                                                    Cab
                                                </label>
                                            </div>

                                        </div>

                                    </div>
                                    <div className="row mb-1">
                                        <div className="col-md-12">
                                            <h6 style={{ fontSize: "13px" }}>Bank Detail:</h6>
                                        </div>
                                        <hr />
                                    </div>
                                    <div className="row mb-1">
                                        <div className="col-lg-3">
                                            <label className="form-label " htmlFor="bank_name">Bank Name</label>
                                            <input
                                                {...register('bank_name', { required: true })}
                                                className="form-control form-control-sm"
                                                type='text'
                                                id='bank_name'

                                                placeholder="Enter bank name"

                                            />
                                            {errors?.bank_name?.type === "required" && <span className="error">This field is required</span>}

                                        </div>
                                        <div className="col-md-4 mb-3">
                                            <label className="form-label" htmlFor="ac_no">A/c No:</label>
                                            <input
                                                {...register('ac_no', { required: true })}
                                                className="form-control form-control-sm"
                                                type='text'

                                                id='ac_no'
                                                placeholder="Enter account number"


                                            />
                                            {errors?.ac_no?.type === "required" && <span className="error">This field is required</span>}

                                        </div>
                                        <div className="col-md-3 mb-3">
                                            <label className="form-label" htmlFor="ac_type">A/c Type:</label>
                                            <input
                                                {...register('ac_type', { required: true })}
                                                className="form-control form-control-sm"
                                                type='text'
                                                id='ac_type'
                                                placeholder="Enter account type"
                                            />
                                            {errors?.ac_type?.type === "required" && <span className="error">This field is required</span>}

                                        </div>

                                    </div>
                                    <div className="row mb-3">
                                        <div className="col-md-4 mb-4">
                                            <label className="form-label" htmlFor="ifsc_code">IFSC code:</label>
                                            <input
                                                {...register('ifsc_code', { required: true })}
                                                className="form-control form-control-sm"
                                                type='text'

                                                id='ifsc_code'
                                                placeholder="Enter IFSC code"


                                            />
                                            {errors?.ifsc_code?.type === "required" && <span className="error">This field is required</span>}

                                        </div>
                                        <div className="col-lg-4">
                                            <label className="form-label " htmlFor="bank_branch">Bank Brance</label>
                                            <input
                                                {...register('bank_branch', { required: true })}
                                                className="form-control form-control-sm"
                                                type='text'
                                                id='bank_branch'
                                                placeholder="Enter bank branch"

                                            />
                                            {errors?.bank_branch?.type === "required" && <span className="error">This field is required</span>}

                                        </div>
                                        {fields.map((field, index) => (
                                            <div className="row" key={field.id}>
                                                <div className="col-lg-3">
                                                    <label className="form-label">Enter UPI Id</label>
                                                    <input
                                                        className="form-control form-control-sm qty_cnt"
                                                        type="text"
                                                        {...register(`transaction_id.${index}.upi_id`, {
                                                            required: "true",
                                                            pattern: /^[0-9A-Za-z.-]{2,256}@[A-Za-z]{2,64}$/
                                                        })

                                                        }
                                                        id={`Upi_${index}`}
                                                        placeholder="Enter UPI"
                                                    />
                                                    {errors?.transaction_id?.[index]?.upi_id?.type === "required" && <span className="error">This field is required</span>}
                                                    {errors?.transaction_id?.[index]?.upi_id?.type === "pattern" && <span className="error">Enetr valid Id</span>}
                                                </div>

                                                <div className="col-lg-1 col-sm-1 new" style={{ marginTop: "30px" }}>
                                                    <button
                                                        type="button"
                                                        className="btn btn-danger btn-sm"
                                                        onClick={() => handleRemove(index)}
                                                    >
                                                        <FontAwesomeIcon icon={faMinusCircle} />
                                                    </button>
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
                                    </div>
                                    <Modal.Footer>
                                        <Button type='submit'>Add</Button>
                                    </Modal.Footer>
                                </form>
                            </Modal.Body>
                        </Modal>

                        {/* Edit User Modal */}
                        <Modal show={editModalShow} onHide={() => setEditModalShow(false)} size="lg" centered>
                            <Modal.Header closeButton>
                                <Modal.Title>Edit Vendor details</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <form onSubmit={handleSubmit(handleEditSubmit)}>
                                    <div className="row mb-3">
                                        {editVendor && (
                                            <>
                                                <div className="row mb-1">
                                                    <div className="col-md-12">
                                                        <h6 style={{ fontSize: "13px" }}>Vendor Detail:</h6>
                                                    </div>
                                                    <hr />
                                                </div>
                                                <div className="row mb-1">
                                                    <div className="col-lg-3">
                                                        <label className="form-label " htmlFor="vendor_name">Vendor Name</label>
                                                        <input
                                                            {...register('vendor_name', { required: true })}
                                                            className="form-control form-control-sm"
                                                            type='text'
                                                            value={editVendor.vendor_name}
                                                            onChange={(e) => seteditVenodor({ ...editVendor, vendor_name: e.target.value })}
                                                            placeholder="Enter vendor name"
                                                            id='vendor_name'
                                                        />
                                                        {errors?.vendor_name?.type === "required" && <span className="error">This field is required</span>}

                                                    </div>
                                                    <div className="col-md-3 mb-3">
                                                        <label className="form-label" htmlFor="vendor_no">Mobile-no</label>
                                                        <input
                                                            {...register('vendor_no', { required: "true" })}
                                                            className="form-control form-control-sm"
                                                            type='text'
                                                            minLength={10}
                                                            maxLength={10}
                                                            value={editVendor.vendor_no}
                                                            onChange={(e) => seteditVenodor({ ...editVendor, vendor_no: e.target.value })}
                                                            placeholder="Enter mobile number"
                                                            id='vendor_no'

                                                        />
                                                        {errors?.vendor_no?.type === "required" && <span className="error">This field is required</span>}
                                                        {errors?.vendor_no?.type === "pattern" && <span className="error">Enetr GST valid Number</span>}

                                                    </div>
                                                    <div className="col-md-3 mb-3">
                                                        <label className="form-label" htmlFor="vendor_address">Address:</label>
                                                        <textarea
                                                            {...register('vendor_address', { required: true })}
                                                            className="form-control form-control-sm"
                                                            id='vendor_address'
                                                            placeholder="Enter address"
                                                            value={editVendor.vendor_address}
                                                            onChange={(e) => seteditVenodor({ ...editVendor, vendor_address: e.target.value })}

                                                        />
                                                        {errors?.vendor_address?.type === "required" && <span className="error">This field is required</span>}

                                                    </div>
                                                    <div className="col-md-3 mb-3">
                                                        <label className="form-label" htmlFor="gst_no">Gst-no:</label>
                                                        <input
                                                            {...register("gst_no", {
                                                                required: true,
                                                                pattern: /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[0-9]{1}[A-Z]{1}[0-9A-Z]{1}$/
                                                            })}
                                                            className="form-control form-control-sm"
                                                            type="text"
                                                            placeholder="Enter Gst no."
                                                            value={editVendor.gst_no}
                                                            onChange={(e) => seteditVenodor({ ...editVendor, gst_no: e.target.value })}
                                                        />
                                                        {errors?.gst_no?.type === "required" && <span className="error">This field is required</span>}
                                                        {errors?.gst_no?.type === "pattern" && <span className="error">Enetr GST valid Number</span>}

                                                    </div>
                                                </div>
                                                <div className="col-md-12 mb-3" style={{ fontSize: "12px" }}>

                                                    <label className="form-label">Vendor Type:</label>
                                                    {errors?.vendor_type?.type === "required" && <span className="error" style={{ marginLeft: "5px" }}>This field is required</span>}

                                                    <div className="d-flex flex-wrap">
                                                        <div className="form-check form-check-sm me-3">
                                                            <input
                                                                {...register('vendor_type', { required: true })}
                                                                className="form-check-input form-check-sm"
                                                                type="checkbox"
                                                                value="fire"
                                                                id="fire"
                                                                checked={editVendor.vendor_type?.includes('fire')}
                                                                onChange={handleVendorTypeChange}



                                                            />
                                                            <label className="form-check-label form-check-label-sm" htmlFor="fire">
                                                                Fire Extingusher
                                                            </label>
                                                        </div>
                                                        <div className="form-check form-check-sm me-3">
                                                            <input
                                                                {...register('vendor_type')}
                                                                className="form-check-input form-check-sm"
                                                                type="checkbox"
                                                                value="ticket"
                                                                id="ticket"
                                                                checked={editVendor.vendor_type?.includes('ticket')}
                                                                onChange={handleVendorTypeChange}


                                                            />
                                                            <label className="form-check-label" htmlFor="ticket">
                                                                Ticket
                                                            </label>
                                                        </div>
                                                        <div className="form-check me-3">
                                                            <input
                                                                {...register('vendor_type')}
                                                                className="form-check-input"
                                                                type="checkbox"
                                                                value="parcel"
                                                                id="parcel"
                                                                checked={editVendor.vendor_type?.includes('parcel')}
                                                                onChange={handleVendorTypeChange}

                                                            />
                                                            <label className="form-check-label form-check-sm" htmlFor="parcel">
                                                                Parcel
                                                            </label>
                                                        </div>
                                                        <div className="form-check">
                                                            <input
                                                                {...register('vendor_type')}
                                                                className="form-check-input"
                                                                type="checkbox"
                                                                value="cab"
                                                                id="cab"
                                                                checked={editVendor.vendor_type?.includes('cab')}
                                                                onChange={handleVendorTypeChange}

                                                            />
                                                            <label className="form-check-label" htmlFor="cab">
                                                                Cab
                                                            </label>
                                                        </div>

                                                    </div>

                                                </div>
                                                <div className="row mb-1">
                                                    <div className="col-md-12">
                                                        <h6 style={{ fontSize: "13px" }}>Bank Detail:</h6>
                                                    </div>
                                                    <hr />
                                                </div>
                                                <div className="row mb-1">
                                                    <div className="col-lg-3">
                                                        <label className="form-label " htmlFor="bank_name">Bank Name</label>
                                                        <input
                                                            {...register('bank_name', { required: true })}
                                                            className="form-control form-control-sm"
                                                            type='text'
                                                            id='bank_name'
                                                            value={editVendor.bank_name}
                                                            onChange={(e) => seteditVenodor({ ...editVendor, bank_name: e.target.value })}
                                                            placeholder="Enter bank name"

                                                        />
                                                        {errors?.bank_name?.type === "required" && <span className="error">This field is required</span>}

                                                    </div>
                                                    <div className="col-md-4 mb-3">
                                                        <label className="form-label" htmlFor="ac_no">A/c No:</label>
                                                        <input
                                                            {...register('ac_no', { required: true })}
                                                            className="form-control form-control-sm"
                                                            type='text'
                                                            value={editVendor.ac_no}
                                                            onChange={(e) => seteditVenodor({ ...editVendor, ac_no: e.target.value })}
                                                            id='ac_no'
                                                            placeholder="Enter account number"


                                                        />
                                                        {errors?.ac_no?.type === "required" && <span className="error">This field is required</span>}

                                                    </div>
                                                    <div className="col-md-3 mb-3">
                                                        <label className="form-label" htmlFor="ac_type">A/c Type:</label>
                                                        <input
                                                            {...register('ac_type', { required: true })}
                                                            className="form-control form-control-sm"
                                                            type='text'
                                                            id='ac_type'
                                                            value={editVendor.ac_type}
                                                            onChange={(e) => seteditVenodor({ ...editVendor, ac_type: e.target.value })}
                                                            placeholder="Enter account type"
                                                        />
                                                        {errors?.ac_type?.type === "required" && <span className="error">This field is required</span>}

                                                    </div>

                                                </div>
                                                <div className="row mb-3">
                                                    <div className="col-md-4 mb-4">
                                                        <label className="form-label" htmlFor="ifsc_code">IFSC code:</label>
                                                        <input
                                                            {...register('ifsc_code', { required: true })}
                                                            className="form-control form-control-sm"
                                                            type='text'
                                                            value={editVendor.ifsc_code}
                                                            onChange={(e) => seteditVenodor({ ...editVendor, ifsc_code: e.target.value })}
                                                            id='ifsc_code'
                                                            placeholder="Enter IFSC code"


                                                        />
                                                        {errors?.ifsc_code?.type === "required" && <span className="error">This field is required</span>}

                                                    </div>
                                                    <div className="col-lg-4">
                                                        <label className="form-label " htmlFor="bank_branch">Bank Brance</label>
                                                        <input
                                                            {...register('bank_branch', { required: true })}
                                                            className="form-control form-control-sm"
                                                            type='text'
                                                            id='bank_branch'
                                                            value={editVendor.bank_branch}
                                                            onChange={(e) => seteditVenodor({ ...editVendor, bank_branch: e.target.value })}
                                                            placeholder="Enter bank branch"

                                                        />
                                                        {errors?.bank_branch?.type === "required" && <span className="error">This field is required</span>}

                                                    </div>
                                                    {fields.map((field, index) => (
                                                        <div className="row" key={field.id}>
                                                            <div className="col-lg-3">
                                                                <label className="form-label">Enter UPI Id</label>
                                                                <input
                                                                    className="form-control form-control-sm qty_cnt"
                                                                    type="text"
                                                                    {...register(`transaction_id.${index}.upi_id`, {
                                                                        required: "true",
                                                                        pattern: /^[0-9A-Za-z.-]{2,256}@[A-Za-z]{2,64}$/
                                                                    })

                                                                    }

                                                                    placeholder="Enter UPI"

                                                                />
                                                                {errors?.transaction_id?.[index]?.upi_id?.type === "required" && <span className="error">This field is required</span>}
                                                                {errors?.transaction_id?.[index]?.upi_id?.type === "pattern" && <span className="error">Enetr valid Id</span>}
                                                            </div>

                                                            <div className="col-lg-1 col-sm-1 new" style={{ marginTop: "30px" }}>
                                                                <button
                                                                    type="button"
                                                                    className="btn btn-danger btn-sm"
                                                                    onClick={() => handleRemove(index)}
                                                                >
                                                                    <FontAwesomeIcon icon={faMinusCircle} />
                                                                </button>
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
                                                </div>
                                            </>
                                        )}
                                    </div>
                                    <Modal.Footer>
                                        <Button type='submit'>Update</Button>
                                    </Modal.Footer>
                                </form>
                            </Modal.Body>
                        </Modal>


                        {/* User List */}
                        <div className="row mb-3">
                            <div className="col-lg-12">
                                <table className="table table-striped">
                                    <thead>
                                        <tr>
                                            <th scope="col">ID</th>
                                            <th scope="col">Vendor Name</th>
                                            <th scope="col">Vendor Address</th>
                                            <th scope="col">Vendor Mobile No</th>
                                            <th scope="col">GST No</th>
                                            <th scope="col">Bank Name</th>
                                            <th scope="col">A/C Type</th>
                                            <th scope="col">Bank Branch</th>
                                            <th scope="col">Created By</th>
                                            <th scope="col">Options</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {Vendors && Vendors.length > 0 && Vendors.map((Vendors, index) => (
                                            <tr key={index}>
                                                <td>{index + 1}</td>
                                                <td>{Vendors.vendor_name}</td>
                                                <td>{Vendors.vendor_address}</td>
                                                <td>{Vendors.vendor_no}</td>
                                                <td>{Vendors.gst_no}</td>
                                                <td>{Vendors.bank_name}</td>

                                                <td>{Vendors.ac_type}</td>
                                                <td>{Vendors.bank_branch}</td>
                                                <td>{Vendors.created_by_name}</td>


                                                <td style={{ fontSize: "12px", width: "220px" }} >

                                                    <Link href={`/Vendor/vendorview?id=${Vendors.id}`} className="btn btn-sm ms-1 btn-warning" >
                                                        <FontAwesomeIcon icon={faEye} />
                                                    </Link>
                                                    <button type="button" className="btn btn-primary btn-sm ms-1" onClick={() => handleEdit(Vendors.id)} >Edit</button>
                                                    <button type="button" className="btn btn-danger btn-sm ms-1" onClick={() => handleDeleteClick(Vendors.id)} >Delete</button>

                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </Card.Body>
                </Card>
            </div >
        </>
    )
}

export default VendorList


