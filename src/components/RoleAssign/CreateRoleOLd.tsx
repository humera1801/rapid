import React, { useState } from 'react';
import { Card } from 'react-bootstrap';
import { SubmitHandler, useForm } from 'react-hook-form';
import './CreateRole.css'; // Import the custom CSS
import axios from 'axios';

interface FormData {
    role_title: string;
    form_type: { role_type: string; tasks: Record<string, number> }[];
}

const CreateRole: React.FC = () => {
    const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
    const [ticketChecked, setTicketChecked] = useState(false);
    const [parcelChecked, setParcelChecked] = useState(false);
    const [cabChecked, setCabChecked] = useState(false);
    const [fireChecked, setFireChecked] = useState(false);
    const [quotationChecked, setQuotationChecked] = useState(false);
    const [deliverChallanChecked, setDeliverChallanChecked] = useState(false);
    const [receiverChallanChecked, setReceiverChallanChecked] = useState(false);

    const [ticketSubCheckboxes, setTicketSubCheckboxes] = useState<Record<string, boolean>>({ sub1: false, sub2: false, sub3: false, sub4: false, sub5: false });
    const [parcelSubCheckboxes, setParcelSubCheckboxes] = useState<Record<string, boolean>>({ sub1: false, sub2: false, sub3: false, sub4: false, sub5: false });
    const [cabSubCheckboxes, setCabSubCheckboxes] = useState<Record<string, boolean>>({ sub1: false, sub2: false, sub3: false, sub4: false, sub5: false });
    const [fireSubCheckboxes, setFireSubCheckboxes] = useState<Record<string, boolean>>({ sub1: false, sub2: false, sub3: false, sub4: false, sub5: false });
    const [quotationSubCheckboxes, setQuotationSubCheckboxes] = useState<Record<string, boolean>>({ sub1: false, sub2: false, sub3: false, sub4: false, sub5: false });
    const [deliverChallanSubCheckboxes, setDeliverChallanSubCheckboxes] = useState<Record<string, boolean>>({ sub1: false, sub2: false, sub3: false, sub4: false, sub5: false });
    const [receiverChallanSubCheckboxes, setReceiverChallanSubCheckboxes] = useState<Record<string, boolean>>({ sub1: false, sub2: false, sub3: false, sub4: false, sub5: false });

    const handleMainCheckboxChange = (type: 'ticket' | 'parcel' | 'cab' | 'fire' | 'quotation' | 'deliverChallan' | 'receiverChallan', isChecked: boolean) => {
        if (type === 'ticket') {
            setTicketChecked(isChecked);
            if (!isChecked) setTicketSubCheckboxes({ sub1: false, sub2: false, sub3: false, sub4: false, sub5: false });
        } else if (type === 'parcel') {
            setParcelChecked(isChecked);
            if (!isChecked) setParcelSubCheckboxes({ sub1: false, sub2: false, sub3: false, sub4: false, sub5: false });
        } else if (type === 'cab') {
            setCabChecked(isChecked);
            if (!isChecked) setCabSubCheckboxes({ sub1: false, sub2: false, sub3: false, sub4: false, sub5: false });
        } else if (type === 'fire') {
            setFireChecked(isChecked);
            if (!isChecked) setFireSubCheckboxes({ sub1: false, sub2: false, sub3: false, sub4: false, sub5: false });
        } else if (type === 'quotation') {
            setQuotationChecked(isChecked);
            if (!isChecked) setQuotationSubCheckboxes({ sub1: false, sub2: false, sub3: false, sub4: false, sub5: false });
        } else if (type === 'deliverChallan') {
            setDeliverChallanChecked(isChecked);
            if (!isChecked) setDeliverChallanSubCheckboxes({ sub1: false, sub2: false, sub3: false, sub4: false, sub5: false });
        } else {
            setReceiverChallanChecked(isChecked);
            if (!isChecked) setReceiverChallanSubCheckboxes({ sub1: false, sub2: false, sub3: false, sub4: false, sub5: false });
        }
    };

    const handleSubCheckboxChange = (type: 'ticket' | 'parcel' | 'cab' | 'fire' | 'quotation' | 'deliverChallan' | 'receiverChallan', name: string, isChecked: boolean) => {
        let newSubCheckboxes;
        if (type === 'ticket') {
            newSubCheckboxes = { ...ticketSubCheckboxes, [name]: isChecked };
            setTicketSubCheckboxes(newSubCheckboxes);
            setTicketChecked(Object.values(newSubCheckboxes).some(Boolean));
        } else if (type === 'parcel') {
            newSubCheckboxes = { ...parcelSubCheckboxes, [name]: isChecked };
            setParcelSubCheckboxes(newSubCheckboxes);
            setParcelChecked(Object.values(newSubCheckboxes).some(Boolean));
        } else if (type === 'cab') {
            newSubCheckboxes = { ...cabSubCheckboxes, [name]: isChecked };
            setCabSubCheckboxes(newSubCheckboxes);
            setCabChecked(Object.values(newSubCheckboxes).some(Boolean));
        } else if (type === 'fire') {
            newSubCheckboxes = { ...fireSubCheckboxes, [name]: isChecked };
            setFireSubCheckboxes(newSubCheckboxes);
            setFireChecked(Object.values(newSubCheckboxes).some(Boolean));
        } else if (type === 'quotation') {
            newSubCheckboxes = { ...quotationSubCheckboxes, [name]: isChecked };
            setQuotationSubCheckboxes(newSubCheckboxes);
            setQuotationChecked(Object.values(newSubCheckboxes).some(Boolean));
        } else if (type === 'deliverChallan') {
            newSubCheckboxes = { ...deliverChallanSubCheckboxes, [name]: isChecked };
            setDeliverChallanSubCheckboxes(newSubCheckboxes);
            setDeliverChallanChecked(Object.values(newSubCheckboxes).some(Boolean));
        } else {
            newSubCheckboxes = { ...receiverChallanSubCheckboxes, [name]: isChecked };
            setReceiverChallanSubCheckboxes(newSubCheckboxes);
            setReceiverChallanChecked(Object.values(newSubCheckboxes).some(Boolean));
        }
    };

    const onSubmit: SubmitHandler<FormData> = async (data: FormData) => {
        const form_type = [];

        // Ticket Booking
        if (ticketChecked) {
            const ticketTasks = {
                create: ticketSubCheckboxes.sub1 ? 1 : 0,
                update: ticketSubCheckboxes.sub2 ? 1 : 0,
                delete: ticketSubCheckboxes.sub3 ? 1 : 0,
                view: ticketSubCheckboxes.sub4 ? 1 : 0,
                payment: ticketSubCheckboxes.sub5 ? 1 : 0,
            };
            form_type.push({ role_type: 'Ticket Booking', tasks: ticketTasks });
        }

        // Parcel Booking
        if (parcelChecked) {
            const parcelTasks = {
                create: parcelSubCheckboxes.sub1 ? 1 : 0,
                update: parcelSubCheckboxes.sub2 ? 1 : 0,
                delete: parcelSubCheckboxes.sub3 ? 1 : 0,
                view: parcelSubCheckboxes.sub4 ? 1 : 0,
                payment: parcelSubCheckboxes.sub5 ? 1 : 0,
            };
            form_type.push({ role_type: 'Parcel Booking', tasks: parcelTasks });
        }

        // Cab Booking
        if (cabChecked) {
            const cabTasks = {
                create: cabSubCheckboxes.sub1 ? 1 : 0,
                update: cabSubCheckboxes.sub2 ? 1 : 0,
                delete: cabSubCheckboxes.sub3 ? 1 : 0,
                view: cabSubCheckboxes.sub4 ? 1 : 0,
                payment: cabSubCheckboxes.sub5 ? 1 : 0,
            };
            form_type.push({ role_type: 'Cab Booking', tasks: cabTasks });
        }

        // Fire Booking
        if (fireChecked) {
            const fireTasks = {
                create: fireSubCheckboxes.sub1 ? 1 : 0,
                update: fireSubCheckboxes.sub2 ? 1 : 0,
                delete: fireSubCheckboxes.sub3 ? 1 : 0,
                view: fireSubCheckboxes.sub4 ? 1 : 0,
                payment: fireSubCheckboxes.sub5 ? 1 : 0,
            };
            form_type.push({ role_type: 'Fire Booking', tasks: fireTasks });
        }

        // Quotation
        if (quotationChecked) {
            const quotationTasks = {
                create: quotationSubCheckboxes.sub1 ? 1 : 0,
                update: quotationSubCheckboxes.sub2 ? 1 : 0,
                delete: quotationSubCheckboxes.sub3 ? 1 : 0,
                view: quotationSubCheckboxes.sub4 ? 1 : 0,
                payment: quotationSubCheckboxes.sub5 ? 1 : 0,
            };
            form_type.push({ role_type: 'Quotation', tasks: quotationTasks });
        }

        // Deliver Challan
        if (deliverChallanChecked) {
            const deliverChallanTasks = {
                create: deliverChallanSubCheckboxes.sub1 ? 1 : 0,
                update: deliverChallanSubCheckboxes.sub2 ? 1 : 0,
                delete: deliverChallanSubCheckboxes.sub3 ? 1 : 0,
                view: deliverChallanSubCheckboxes.sub4 ? 1 : 0,
                payment: deliverChallanSubCheckboxes.sub5 ? 1 : 0,
            };
            form_type.push({ role_type: 'Deliver Challan', tasks: deliverChallanTasks });
        }

        // Receiver Challan
        if (receiverChallanChecked) {
            const receiverChallanTasks = {
                create: receiverChallanSubCheckboxes.sub1 ? 1 : 0,
                update: receiverChallanSubCheckboxes.sub2 ? 1 : 0,
                delete: receiverChallanSubCheckboxes.sub3 ? 1 : 0,
                view: receiverChallanSubCheckboxes.sub4 ? 1 : 0,
                payment: receiverChallanSubCheckboxes.sub5 ? 1 : 0,
            };
            form_type.push({ role_type: 'Receiver Challan', tasks: receiverChallanTasks });
        }

        const finalData = { ...data, form_type };
        console.log(finalData);

        try {
            const response = await axios.post('http://192.168.0.106:3001/employee/create_employee_role', finalData);
            console.log('Data submitted successfully:', response.data);
            // window.location.reload();
        } catch (error) {
            console.error('Error updating data:', error);
        }
    };

    return (
        <div className='container'>
            <br />
            <Card className="role-card">
                <Card.Header className="role-header"><h3>Add New Role</h3></Card.Header>
                <Card.Body>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="row mb-3">
                            <div className="col-lg-3 col-sm-6 mb-3">
                                <label className="form-label" htmlFor="name">Name</label>
                                <input
                                    type="text"
                                    className="form-control form-control-sm"
                                    id="name"
                                    placeholder="Enter Name"
                                    {...register("role_title", { required: true })}
                                />
                            </div>
                            {errors.role_title && <span className="text-danger">This field is required</span>}
                        </div>
                        <div className="row mt-4">
                            <div className="col-md-12"><h5>Assign Role:</h5></div>
                            <hr />
                        </div>

                        <div className="row mb-3">
                            {/* Ticket Booking */}
                            <div className="col-md-3">
                                <div className="form-check role-checkbox">
                                    <label className="form-check-label">
                                        <input
                                            className='form-check-input'
                                            type="checkbox"
                                            checked={ticketChecked}
                                            onChange={(e) => handleMainCheckboxChange('ticket', e.target.checked)}
                                        />
                                        <h5>Ticket Booking</h5>
                                    </label>
                                </div>
                                <div className="sub-checkboxes">
                                    {(['sub1', 'sub2', 'sub3', 'sub4', 'sub5'] as Array<string>).map((sub, index) => (
                                        <div className="form-check role-checkbox1" key={sub}>
                                            <label className="form-check-label">
                                                <input
                                                    className='form-check-input'
                                                    type="checkbox"
                                                    checked={ticketSubCheckboxes[sub]}
                                                    onChange={(e) => handleSubCheckboxChange('ticket', sub, e.target.checked)}
                                                />
                                                {['Create', 'Update', 'Delete', 'View', 'Payment'][index]}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Parcel Booking */}
                            <div className="col-md-3">
                                <div className="form-check role-checkbox">
                                    <label className="form-check-label">
                                        <input
                                            className='form-check-input'
                                            type="checkbox"
                                            checked={parcelChecked}
                                            onChange={(e) => handleMainCheckboxChange('parcel', e.target.checked)}
                                        />
                                        <h5>Parcel Booking</h5>
                                    </label>
                                </div>
                                <div className="sub-checkboxes">
                                    {(['sub1', 'sub2', 'sub3', 'sub4', 'sub5'] as Array<string>).map((sub, index) => (
                                        <div className="form-check role-checkbox1" key={`parcel-${sub}`}>
                                            <label className="form-check-label">
                                                <input
                                                    className='form-check-input'
                                                    type="checkbox"
                                                    checked={parcelSubCheckboxes[sub]}
                                                    onChange={(e) => handleSubCheckboxChange('parcel', sub, e.target.checked)}
                                                />
                                                {['Create', 'Update', 'Delete', 'View', 'Payment'][index]}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Cab Booking */}
                            <div className="col-md-3">
                                <div className="form-check role-checkbox">
                                    <label className="form-check-label">
                                        <input
                                            className='form-check-input'
                                            type="checkbox"
                                            checked={cabChecked}
                                            onChange={(e) => handleMainCheckboxChange('cab', e.target.checked)}
                                        />
                                        <h5>Cab Booking</h5>
                                    </label>
                                </div>
                                <div className="sub-checkboxes">
                                    {(['sub1', 'sub2', 'sub3', 'sub4', 'sub5'] as Array<string>).map((sub, index) => (
                                        <div className="form-check role-checkbox1" key={`cab-${sub}`}>
                                            <label className="form-check-label">
                                                <input
                                                    className='form-check-input'
                                                    type="checkbox"
                                                    checked={cabSubCheckboxes[sub]}
                                                    onChange={(e) => handleSubCheckboxChange('cab', sub, e.target.checked)}
                                                />
                                                {['Create', 'Update', 'Delete', 'View', 'Payment'][index]}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Fire Booking */}
                            <div className="col-md-3">
                                <div className="form-check role-checkbox">
                                    <label className="form-check-label">
                                        <input
                                            className='form-check-input'
                                            type="checkbox"
                                            checked={fireChecked}
                                            onChange={(e) => handleMainCheckboxChange('fire', e.target.checked)}
                                        />
                                        <h5>Fire Extinguisher Booking</h5>
                                    </label>
                                </div>
                                <div className="sub-checkboxes">
                                    {(['sub1', 'sub2', 'sub3', 'sub4', 'sub5'] as Array<string>).map((sub, index) => (
                                        <div className="form-check role-checkbox1" key={`fire-${sub}`}>
                                            <label className="form-check-label">
                                                <input
                                                    className='form-check-input'
                                                    type="checkbox"
                                                    checked={fireSubCheckboxes[sub]}
                                                    onChange={(e) => handleSubCheckboxChange('fire', sub, e.target.checked)}
                                                />
                                                {['Create', 'Update', 'Delete', 'View', 'Payment'][index]}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Quotation */}
                            <div className="col-md-3">
                                <div className="form-check role-checkbox">
                                    <label className="form-check-label">
                                        <input
                                            className='form-check-input'
                                            type="checkbox"
                                            checked={quotationChecked}
                                            onChange={(e) => handleMainCheckboxChange('quotation', e.target.checked)}
                                        />
                                        <h5>Fire Quotation</h5>
                                    </label>
                                </div>
                                <div className="sub-checkboxes">
                                    {(['sub1', 'sub2', 'sub3', 'sub4', 'sub5'] as Array<string>).map((sub, index) => (
                                        <div className="form-check role-checkbox1" key={`quotation-${sub}`}>
                                            <label className="form-check-label">
                                                <input
                                                    className='form-check-input'
                                                    type="checkbox"
                                                    checked={quotationSubCheckboxes[sub]}
                                                    onChange={(e) => handleSubCheckboxChange('quotation', sub, e.target.checked)}
                                                />
                                                {['Create', 'Update', 'Delete', 'View', 'Payment'][index]}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Deliver Challan */}
                            <div className="col-md-3">
                                <div className="form-check role-checkbox">
                                    <label className="form-check-label">
                                        <input
                                            className='form-check-input'
                                            type="checkbox"
                                            checked={deliverChallanChecked}
                                            onChange={(e) => handleMainCheckboxChange('deliverChallan', e.target.checked)}
                                        />
                                        <h5>Fire Delivery Challan</h5>
                                    </label>
                                </div>
                                <div className="sub-checkboxes">
                                    {(['sub1', 'sub2', 'sub3', 'sub4', 'sub5'] as Array<string>).map((sub, index) => (
                                        <div className="form-check role-checkbox1" key={`deliverChallan-${sub}`}>
                                            <label className="form-check-label">
                                                <input
                                                    className='form-check-input'
                                                    type="checkbox"
                                                    checked={deliverChallanSubCheckboxes[sub]}
                                                    onChange={(e) => handleSubCheckboxChange('deliverChallan', sub, e.target.checked)}
                                                />
                                                {['Create', 'Update', 'Delete', 'View', 'Payment'][index]}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Receiver Challan */}
                            <div className="col-md-3">
                                <div className="form-check role-checkbox">
                                    <label className="form-check-label">
                                        <input
                                            className='form-check-input'
                                            type="checkbox"
                                            checked={receiverChallanChecked}
                                            onChange={(e) => handleMainCheckboxChange('receiverChallan', e.target.checked)}
                                        />
                                        <h5>Fire Receiver Challan</h5>
                                    </label>
                                </div>
                                <div className="sub-checkboxes">
                                    {(['sub1', 'sub2', 'sub3', 'sub4', 'sub5'] as Array<string>).map((sub, index) => (
                                        <div className="form-check role-checkbox1" key={`receiverChallan-${sub}`}>
                                            <label className="form-check-label">
                                                <input
                                                    className='form-check-input'
                                                    type="checkbox"
                                                    checked={receiverChallanSubCheckboxes[sub]}
                                                    onChange={(e) => handleSubCheckboxChange('receiverChallan', sub, e.target.checked)}
                                                />
                                                {['Create', 'Update', 'Delete', 'View', 'Payment'][index]}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="row mb-3">
                            <div className="col-md-12 text-center">
                                <button type="submit" className="btn btn-primary btn-sm">Create Role</button>
                            </div>
                        </div>
                    </form>
                </Card.Body>
            </Card>
        </div>
    );
};

export default CreateRole;
