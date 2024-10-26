import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from '@/components/Dashboard/Header';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import EmployeeList from '@/app/Api/Employee/EmployeeList';

interface FormData {
  e_id: any;
  e_name: string;
  e_email: string;
  e_password: string;
  e_mobile_no: string;
  e_address: string;
}

const EmpPasswordChange = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [changePasswordError, setChangePasswordError] = useState<string | null>(null);
  const [fireData, setFireData] = useState<any>("");
  const [error, setError] = useState<string>('');
  
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<FormData>();
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const e_id = new URLSearchParams(window.location.search).get("id");
      if (e_id) {
        try {
          const response = await EmployeeList.GetEmpId(e_id);
          if (response.data) {
            setFireData(response.data);
            setValue("e_id", response.data.e_id);
            setValue("e_password", response.data.e_password);
            setError('');
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

  const onSubmit = async () => {
    if (newPassword !== confirmPassword) {
      setChangePasswordError('Passwords do not match.');
      return;
    }
    
    try {
      const e_id = fireData.e_id; // Assuming fireData contains employee info
      await axios.post('http://192.168.0.105:3001/employee/change_password_employee', {
        e_id,
        e_password: newPassword
      });
     alert("password change succesfully")
     window.location.reload();
      
    } catch (error) {
      setChangePasswordError('Error changing password.');
      console.error('Error changing password:', error);
    }
  };

  return (
    <>
      <br />
      <div className="container">
        <section className="panel">
          <div className="row">
            <div className="col-md-12">
              <header className="panel-heading">
                <h4>Change Password</h4>
              </header>
            </div>
          </div>

          <div className="row align-items-start">
            <div className="col-md-12">
              <form className="mt-5" onSubmit={handleSubmit(onSubmit)}>
                <br />
                <div className="row">
                  <div className="col-md-3">
                    <label>New Password</label>
                  </div>
                  <div className="col-md-8">
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="form-control"
                      placeholder="Enter New Password"
                      required
                    />
                  </div>
                </div>
                <br />
                <div className="row">
                  <div className="col-md-3">
                    <label>Confirm Password</label>
                  </div>
                  <div className="col-md-8">
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="form-control"
                      placeholder="Enter Confirm Password"
                      required
                    />
                  </div>
                </div>
                <br />
                <div className="row">
                  <div className="col-md-3"></div>
                  <div className="col-md-8">
                    <button type="submit" className="btn btn-success btn-sm" >
                      Submit
                    </button>
                    {changePasswordError && <div className="text-danger mt-2">{changePasswordError}</div>}
                  </div>
                </div>
              </form>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default EmpPasswordChange;
