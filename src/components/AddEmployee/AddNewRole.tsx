"use client";
import { useEffect, useState } from 'react';
import Card from 'react-bootstrap/esm/Card';
import "../RoleAssign/CreateRole.css";
import { useForm } from 'react-hook-form';
import EmployeeList from '@/app/Api/Employee/EmployeeList';
import axios from 'axios';

type BookingTypes =
  | 'Employee'
  | 'ticketBooking'
  | 'parcelBooking'
  | 'cabBooking'
  | 'fireExtinguisherBooking'
  | 'fireQuotation'
  | 'fireDeliveryChallan'
  | 'fireReceiverChallan'
  | 'Client';

type ActionTypes = 'create' | 'update' | 'delete' | 'view' | 'payment' | 'Print' | 'Share';
type EmployeeActionTypes = 'create' | 'update'  | 'delete' | 'change_password';

interface RoleFormProps {
  initialValues?: Record<string, boolean>;
}

interface FormData {
  role_id: any;
  e_id: string;
  roleName: string; // New field for role name
}

const RoleForm: React.FC<RoleFormProps> = () => {
  const [fireData, setFireData] = useState<FormData | null>(null);
  const [error, setError] = useState<string>('');
  const [roleName, setRoleName] = useState<string>(''); // New state for role name
  const [formValues, setFormValues] = useState<Record<string, boolean>>({});
  
  const { register, control, handleSubmit, formState: { errors }, watch, reset, setValue, getValues } = useForm<FormData>({
    defaultValues: {
      role_id: "",
    }
  });

  const bookingTypes: BookingTypes[] = [
    'Employee',
    'ticketBooking',
    'parcelBooking',
    'cabBooking',
    'fireExtinguisherBooking',
    'fireQuotation',
    'fireDeliveryChallan',
    'fireReceiverChallan',
    'Client'
  ];

  const actionTypes: ActionTypes[] = ['create', 'update', 'delete', 'view', 'payment', 'Print', 'Share'];
  const employeeActionTypes: EmployeeActionTypes[] = ['create', 'update', 'delete', 'change_password'];
  const clientActionTypes = ['update', 'view', 'Print'];

  const capitalizeFirstLetter = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1).replace(/([A-Z])/g, ' $1');
  };

  const handleSelectAll = () => {
    const newState = { ...formValues };
    const allChecked = Object.values(formValues).every((value) => value);

    bookingTypes.forEach((booking) => {
      newState[`${booking}`] = !allChecked;
      const actionsToUse = booking === 'Employee' ? employeeActionTypes : actionTypes;
      actionsToUse.forEach((action) => {
        newState[`${booking}_${action}`] = !allChecked;
      });
    });

    setFormValues(newState);
  };

  const handleClearAll = () => {
    const newState = bookingTypes.reduce((acc, booking) => {
      acc[booking] = false; // Set main checkbox to unchecked
      actionTypes.forEach(action => {
        acc[`${booking}_${action}`] = false; // Set all sub-checkboxes to unchecked
      });
      return acc;
    }, {} as Record<string, boolean>);

    setFormValues(newState);
  };

  const handleMainCheckboxChange = (booking: BookingTypes) => {
    const newState = { ...formValues };
    const newValue = !formValues[`${booking}`]; 
    newState[`${booking}`] = newValue;
  
    const actionsToUse = booking === 'Employee' ? employeeActionTypes : actionTypes;
    actionsToUse.forEach(action => {
      newState[`${booking}_${action}`] = newValue; 
    });
  
    setFormValues(newState);
  };
  
  const handleSubCheckboxChange = (booking: BookingTypes, action: string) => {
    const newState = { ...formValues };
    newState[`${booking}_${action}`] = !formValues[`${booking}_${action}`]; 
  
    const actionsToUse = (booking === 'fireQuotation' || booking === 'fireDeliveryChallan' || booking === 'fireReceiverChallan')
      ? actionTypes.filter(act => act !== 'payment') 
      : actionTypes;
  
    const isAnySubSelected = actionsToUse.some((act) => newState[`${booking}_${act}`]);
  
    newState[`${booking}`] = isAnySubSelected;
  
    if (booking === 'Employee' && action === 'change_password') {
      newState['Employee'] = true; 
    }
  
    setFormValues(newState);
  };
  
  

  const onSubmit = async (data: FormData) => {
    const selectedCheckboxes = Object.entries(formValues)
      .filter(([_, isChecked]) => isChecked)
      .map(([key]) => key);

    const formData = {
      role_id: "",
      role_task: selectedCheckboxes,
      role_title: roleName, // Include role name in the submitted data
    };

    console.log('Form submitted:', formData);

    try {
      const response = await axios.post('http://192.168.0.105:3001/employee/create_role', formData);
      console.log('Data submitted successfully:', response.data);
      window.location.reload();
    } catch (error) {
      console.error('Error updating data:', error);
    }
  };

  return (
    <div className="container">
      <br />
      <Card className="role-card">
        <Card.Header className="role-header">
          <h3>Create Role</h3>
        </Card.Header>
        <Card.Body>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className='row mb-3'>
              <div className="col-lg-3">
                <label className="form-label" htmlFor="roleName">Role Name:</label>
                <input
                  id="roleName"
                  type="text"
                  className="form-control form-control-sm"
                  value={roleName}
                  onChange={(e) => setRoleName(e.target.value)} // Handle input change
                  required
                />
              </div>
            </div>

            <button className="btn btn-sm btn-primary" type="button" onClick={handleSelectAll}>
              Select All
            </button>
            <button className="btn btn-sm btn-secondary" type="button" onClick={handleClearAll} style={{ marginLeft: '10px' }}>
              Clear All
            </button>
            <br />
            <br />
            <div className="row mb-3">
              {bookingTypes.map((booking) => (
                <div className="col-md-3" key={booking} style={{ marginBottom: '20px' }}>
                  <div className="form-check role-checkbox">
                    <label className="form-check-label">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        checked={formValues[`${booking}`] || false}
                        onChange={() => handleMainCheckboxChange(booking)}
                      />
                      {capitalizeFirstLetter(booking)}
                    </label>
                  </div>
                  <div className="sub-checkboxes">
                    <div className="form-check role-checkbox1">
                      {(booking === 'Client' ? clientActionTypes : (booking === 'Employee' ? employeeActionTypes : actionTypes)).map((action) => (
                        !(booking === 'fireQuotation' || booking === 'fireDeliveryChallan' || booking === 'fireReceiverChallan') || action !== 'payment' ? (
                          <label
                            className="form-check-label"
                            key={`${booking}_${action}`}
                            style={{ display: 'block', marginBottom: '5px' }}
                          >
                            <input
                              className="form-check-input"
                              type="checkbox"
                              checked={formValues[`${booking}_${action}`] || false}
                              onChange={() => handleSubCheckboxChange(booking, action)}
                            />
                            {action.charAt(0).toUpperCase() + action.slice(1)}
                          </label>
                        ) : null // Don't render payment option
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button type="submit" className="btn btn-md btn-primary">
              Submit
            </button>
          </form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default RoleForm;
