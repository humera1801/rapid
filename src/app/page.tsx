"use client";

import { useState } from 'react';
import axios from 'axios';
import Link from 'next/link';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import router from 'next/router';

interface FormData {
  email: string;
  password: string;
  device_id: string;
  device_type:string;
  fcm_token:string;
}

const Page: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();


  
  const onSubmit = async (formData: FormData): Promise<void> => {
    try {
      const { email, password, device_id, device_type, fcm_token } = formData;
  
      const response = await axios.post<{ status: number; message: string; data: any }>(
        'http://localhost:3000/auth/user_login',
        {
          email,
          password,
          device_id,
          device_type,
          fcm_token
        }
      );
  
      console.log('API Response:', response.data);
  
      const { status, message, data } = response.data;
  
      if (status === 1) {
        console.log(message);
        console.log('User ID:', data); // Assuming data is the user ID
  
        // Store entire response data in localStorage
        localStorage.setItem('userData', JSON.stringify(response.data.data));
        // const userId = localStorage.getItem('userData');
  
        // Log localStorage contents to check
        console.log('localStorage:', localStorage.userData);
        const storedData = localStorage.getItem('userData');
        console.log("datdata",storedData);
        
        
  
        // Redirect to Home page or wherever needed
        // Replace with your router logic
        router.push('/Home/Ticket');
      } else {
        setError('Error logging in. Please try again.');
      }
    } catch (error) {
      setError('Error logging in. Please try again.');
      console.error('Login Error:', error);
    }
  };
  
  
  

  return (
    
    <div className="container">
      <section className="section register min-vh-100 d-flex flex-column align-items-center justify-content-center py-4">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-4 col-md-6 d-flex flex-column align-items-center justify-content-center">
              <div className="d-flex justify-content-center py-4">
                <a href="index.html" className="logo d-flex align-items-center w-auto">
                  <img src="" alt="" />
                </a>
              </div>
              <div className="card mb-3">
                <div className="card-body">
                  <div className="pt-4 pb-2">
                    <h5 className="card-title text-center pb-0 fs-4">Admin Login</h5>
                  </div>
                  <form className="row g-3" onSubmit={handleSubmit(onSubmit)}>
                    <div className="col-12">
                      <label htmlFor="yourUsername" className="form-label">Username</label>
                      <input
                        type="text"
                        className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                        placeholder="Enter Email"
                        {...register('email', { required: 'Email is required' })}
                      />
                      {errors.email && <div className="invalid-feedback">{errors.email.message}</div>}
                    </div>
                    <div className="col-12">
                      <label htmlFor="yourPassword" className="form-label">Password</label>
                      <input
                        type="password"
                        className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                        placeholder="Enter Password"
                        {...register('password', { required: 'Password is required' })}
                      />
                      {errors.password && <div className="invalid-feedback">{errors.password.message}</div>}
                    </div>
                    <div className="col-12">
                      <button type="submit" className="btn btn-primary w-100">LOGIN</button>
                    </div>
                    {error && (
                      <div className="col-12 text-danger mt-2">
                        {error}
                      </div>
                    )}
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Page;
