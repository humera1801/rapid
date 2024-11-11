"use client";

import { useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import "../../public/css/style.css"

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
        'http://192.168.0.106:3001/auth/user_login',
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
  
        console.log('localStorage:', localStorage.userData);
        const storedData = localStorage.getItem('userData');
        console.log("datdata",storedData);
        
        
  
     
        router.push('/Home');
      } else {
        setError('Error logging in. Please try again.');
      }
    } catch (error) {
      setError('Error logging in. Please try again.');
      console.error('Login Error:', error);
    }
  };
  
  
  

  return (
    
    <div className="container-fluid first-page-con" >
      <section className="section register min-vh-100 d-flex flex-column align-items-center justify-content-center py-4">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-4 col-md-6 d-flex flex-column align-items-center justify-content-center">
            
              
                  <img src="\img\logo_page-0001-removebg-preview.png" alt="" height={"30%"} width={"50%"}  />
               
               {/* <h1 style={{color:"#51781f",fontSize:"50px",fontWeight:"800"}}>RAPID GROUP</h1> */}
          
              <div className="mb-3" style={{width:"100%"}}>
                <div className="card-body">
                  <div className="pt-2 pb-2"  style={{background:"#d05a36",color:"white"}}>
                    <h5 className="card-title text-center pb-0 fs-4">Admin Login</h5>
                  </div>
                 <div style={{background:"rgba(132, 132, 132, 0.46)",padding:"4%"}}>
                 
                 <form className="row" onSubmit={handleSubmit(onSubmit)}>
                 <div style={{background:"white",padding:"2%"}}>
                    <div className="col-12 mt-2">
                      <label htmlFor="yourUsername" className="form-label">Username</label>
                      <input
                        type="text"
                        className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                        placeholder="Enter Email"
                        {...register('email', { required: 'Email is required' })}
                      />
                      {errors.email && <div className="invalid-feedback">{errors.email.message}</div>}
                    </div>
                    <div className="col-12 mt-3">
                      <label htmlFor="yourPassword" className="form-label">Password</label>
                      <input
                        type="password"
                        className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                        placeholder="Enter Password"
                        {...register('password', { required: 'Password is required' })}
                      />
                      {errors.password && <div className="invalid-feedback">{errors.password.message}</div>}
                    </div>
                    </div>
                    <div className="col-12 mt-3" style={{padding:"0px"}}>
                      <button type="submit" className="btn btn-primary w-100" style={{background:"#51781f",border:"0px",borderRadius:"0px",padding:"2.5% 2%",fontWeight:"500"}}>LOGIN</button>
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
        </div>
      </section>
    </div>
  );
};

export default Page;
