"use client";
import { useEffect, useState } from 'react';
import Card from 'react-bootstrap/esm/Card';
import './CreateRole.css';
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


type ActionTypes = 'create' | 'update' | 'delete' | 'view' | 'payment';
type EmployeeActionTypes = 'create' | 'edit' | 'assignRole' | 'delete' | 'change-password';

interface RoleFormProps {
  initialValues?: Record<string, boolean>;
}

interface FormData {
  e_id: string;
}

const RoleForm: React.FC<RoleFormProps> = () => {
  const [fireData, setFireData] = useState<FormData | null>(null);
  const [error, setError] = useState<string>('');
  const { register, setValue, handleSubmit, formState: { errors } } = useForm<FormData>();

  useEffect(() => {
    const fetchData = async () => {
      const e_id = new URLSearchParams(window.location.search).get("id");
      if (e_id) {
        try {
          const response = await EmployeeList.GetEmpId(e_id);
          if (response.data) {
            setFireData(response.data);
            setValue("e_id", response.data.e_id);
            setError('');
            const roleResponse = await axios.post('http://192.168.0.105:3001/employee/get_role_employee', { e_id });
            const rolesData = roleResponse.data.data;

            if (rolesData.length > 0) {
              const tasks = rolesData[0].e_task;
              const newFormValues = { ...formValues };

              tasks.forEach((task: string) => {
                const [booking, action] = task.split('_');
                if (action) {
                  newFormValues[`${booking}`] = true;
                  newFormValues[`${task}`] = true;
                } else {
                  newFormValues[task] = true;
                }
              });
              setFormValues(newFormValues);
            }
          } else {
            setError('No employee data found.');
          }
        } catch (error) {
          setError('Error fetching employee data.');
          console.error('Error fetching data:', error);
        }
      } else {
        setError('Id not found.');
      }
    };

    fetchData();
  }, [setValue]);

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

  const actionTypes: ActionTypes[] = ['create', 'update', 'delete', 'view', 'payment'];
  const employeeActionTypes: EmployeeActionTypes[] = ['create', 'edit', 'assignRole', 'delete' , 'change-password'];
  const clientActionTypes = ['update', 'view'];

  const [formValues, setFormValues] = useState<Record<string, boolean>>({});

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

  const handleMainCheckboxChange = (booking: BookingTypes) => {
    const newState = { ...formValues };
    newState[`${booking}`] = !formValues[`${booking}`];
    setFormValues(newState);
  };

  const handleSubCheckboxChange = (booking: BookingTypes, action: string) => {
    const newState = { ...formValues };
    newState[`${booking}_${action}`] = !formValues[`${booking}_${action}`];

    const isAnySubSelected = (booking === 'Employee' ? employeeActionTypes : actionTypes)
      .some((act) => newState[`${booking}_${act}`]);
    newState[`${booking}`] = isAnySubSelected;

    setFormValues(newState);
  };

  const onSubmit = async (data: FormData) => {
    const selectedCheckboxes = Object.entries(formValues)
      .filter(([_, isChecked]) => isChecked)
      .map(([key]) => key);

    const formData = {
      e_id: fireData?.e_id,
      e_task: selectedCheckboxes,
    };

    console.log('Form submitted:', formData);

    try {
      const response = await axios.post('http://192.168.0.105:3001/employee/assign_role_to_employee', formData);
      console.log('Data submitted successfully:', response.data);
      window.location.reload();
    } catch (error) {
      console.error('Error updating data:', error);
    }
  };

  return (
    <>
      <div className="container">
        <br />
        <Card className="role-card">
          <Card.Header className="role-header">
            <h3>Assign Role</h3>
          </Card.Header>
          <Card.Body>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div>
                <button className="btn btn-sm btn-primary" type="button" onClick={handleSelectAll}>
                  Select All
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
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <button type="submit" className="btn btn-md btn-primary">
                Submit
              </button>
            </form>
          </Card.Body>
        </Card>
      </div>
    </>
  );
};

export default RoleForm;
