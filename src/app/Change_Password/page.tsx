"use client";
import React, { useState } from 'react';
import axios from 'axios';
import Header from '@/components/Dashboard/Header';
import { useRouter } from 'next/navigation';

const Page: React.FC = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [changePasswordError, setChangePasswordError] = useState<string | null>(null);

  const storedData = localStorage.getItem('userData');
  console.log("data", storedData);
  const router = useRouter();


  const handleChangePassword = async () => {
    try {
      if (newPassword !== confirmPassword) {
        setChangePasswordError('Passwords do not match.');
        return;

      }

      if (!storedData) {
        throw new Error('User data not found in local storage');
      }

      //   const userData: { user_id: number } = JSON.parse(storedData); // Define type for userData

      const response = await axios.post<{ status: number; message: string }>(
        'http://192.168.0.106:3001/auth/user_change_password',
        {
          user_id: storedData,
          // old_password:'',
          new_password: newPassword,
        }
      );

      const { status, message } = response.data;

      if (status === 1) {
        setChangePasswordError(null);
        alert('Password changed successfully!');

        router.push('/Home')
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setChangePasswordError('Old password and New Password should not be same.');
      }
    } catch (error) {
      console.error('Change Password Error:', error);
      setChangePasswordError('Error changing password. Please try again.');
    }
  };

  return (
    <>
      <Header />
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
              <form className="mt-5">
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
                    />
                  </div>
                </div>
                <br />
                <div className="row">
                  <div className="col-md-3"></div>
                  <div className="col-md-8">
                    <button type="button" onClick={handleChangePassword} className="btn btn-success btn-sm" >
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

export default Page;
