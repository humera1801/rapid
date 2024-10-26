import React, { useState } from 'react';
import { Card } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import './CreateRole.css'; // Import the custom CSS

interface FormData {
    name: string;
}

type CheckboxName = 'sub1' | 'sub2' | 'sub3' | 'sub4' | 'sub5';

const CreateRole: React.FC = () => {
    const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
    const [ticketChecked, setTicketChecked] = useState(false);
    const [parcelChecked, setParcelChecked] = useState(false);
    const [cabChecked, setCabChecked] = useState(false); // New state for Cab Booking
    const [ticketSubCheckboxes, setTicketSubCheckboxes] = useState<Record<CheckboxName, boolean>>({ sub1: false, sub2: false, sub3: false, sub4: false, sub5: false });
    const [parcelSubCheckboxes, setParcelSubCheckboxes] = useState<Record<CheckboxName, boolean>>({ sub1: false, sub2: false, sub3: false, sub4: false, sub5: false });
    const [cabSubCheckboxes, setCabSubCheckboxes] = useState<Record<CheckboxName, boolean>>({ sub1: false, sub2: false, sub3: false, sub4: false, sub5: false }); // New state for Cab Booking

    const handleMainCheckboxChange = (type: 'ticket' | 'parcel' | 'cab', isChecked: boolean) => {
        const subCheckboxes = { sub1: false, sub2: false, sub3: false, sub4: false, sub5: false };
    
        if (type === 'ticket') {
            setTicketChecked(isChecked);
            if (!isChecked) setTicketSubCheckboxes(subCheckboxes);
        } else if (type === 'parcel') {
            setParcelChecked(isChecked);
            if (!isChecked) setParcelSubCheckboxes(subCheckboxes);
        } else {
            setCabChecked(isChecked);
            if (!isChecked) setCabSubCheckboxes(subCheckboxes); // Reset cab sub-checkboxes
        }
    };
    
    const handleSubCheckboxChange = (type: 'ticket' | 'parcel' | 'cab', name: CheckboxName, isChecked: boolean) => {
        if (type === 'ticket') {
            const newSubCheckboxes = { ...ticketSubCheckboxes, [name]: isChecked };
            setTicketSubCheckboxes(newSubCheckboxes);
            setTicketChecked(Object.values(newSubCheckboxes).some(Boolean));
        } else if (type === 'parcel') {
            const newSubCheckboxes = { ...parcelSubCheckboxes, [name]: isChecked };
            setParcelSubCheckboxes(newSubCheckboxes);
            setParcelChecked(Object.values(newSubCheckboxes).some(Boolean));
        } else {
            const newSubCheckboxes = { ...cabSubCheckboxes, [name]: isChecked };
            setCabSubCheckboxes(newSubCheckboxes);
            setCabChecked(Object.values(newSubCheckboxes).some(Boolean));
        }
    };
    

    const onSubmit = (data: FormData) => {
        console.log(data);
        console.log("Ticket Sub Checkboxes: ", ticketSubCheckboxes);
        console.log("Parcel Sub Checkboxes: ", parcelSubCheckboxes);
        console.log("Cab Sub Checkboxes: ", cabSubCheckboxes); // Log cab checkboxes
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
                                    {...register("name", { required: true })}
                                />
                            </div>
                            {errors.name && <span className="text-danger">This field is required</span>}

                        </div>
                        <div className="row mt-4">
                            <div className="col-md-12"><h5>Assign Role:</h5></div>
                            <hr />
                        </div>

                        <div className="row mb-3">
                            <div className="col-md-4">
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
                                    {(['sub1', 'sub2', 'sub3', 'sub4', 'sub5'] as CheckboxName[]).map((sub, index) => (
                                        <div className="form-check role-checkbox" key={sub}>
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

                            <div className="col-md-4">
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
                                    {(['sub1', 'sub2', 'sub3', 'sub4', 'sub5'] as CheckboxName[]).map((sub, index) => (
                                        <div className="form-check role-checkbox" key={`parcel-${sub}`}>
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

                            <div className="col-md-4">
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
                                    {(['sub1', 'sub2', 'sub3', 'sub4', 'sub5'] as CheckboxName[]).map((sub, index) => (
                                        <div className="form-check role-checkbox" key={`cab-${sub}`}>
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
                        </div>

                        <button type="submit" className="btn btn-success btn-sm" >Submit</button>
                    </form>
                </Card.Body>
            </Card>
        </div>
    );
};

export default CreateRole;
