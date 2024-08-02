"use client";
import React, { useEffect, useState } from 'react'
import "../certificate/certificate.css"
import GetCertificateData from '@/app/Api/FireApis/GetCertificateData';
import { SubmitHandler, useFieldArray, useForm } from 'react-hook-form';
import handleclientPrint from './certificate';


export interface FormData {
  febking_id: any;
  febking_created_by: any;
  fest_id: any;
  firstName: string;
  address: string;
  mobileNo: string;
  client_city: string;
  client_state: string;
  client_pincode: string;
  certificateNo: string;
  Total_extingusher: string;
  febking_certificate_no: string;
  febking_invoice_no: string;
  date: string;
  fest_name: string
  duedate: string;
  Sr_no: string;
  product_data: ProductData[];
  febking_total_sgst: any;
  febking_total_cgst: any;
  febking_entry_type: 1;
  febking_final_amount: any;
  febking_total_amount: string;
  email: string;
  gstNo: string;
  vendorCode: string;
  client_id: any,
  invNo: string;
  poNo: string;



}

interface ProductData {
  id: any;
  qty: any;
  rate: any;
  totalAmount: any;
  hsnCode: string;
  capacity: string;
  feit_id: any;
  feit_name: any;
  feb_name: any
  febd_sgst: any;
  febd_cgst: any;
  febd_sgst_amount: any;
  febd_cgst_amount: any;
  feb_id: string;
}

export const Certificate = () => {


  const [fireData, setFireData] = useState<any>("");
  const [error, setError] = useState<string>('');

  useEffect(() => {



    const fetchData = async () => {
      try {
        const febking_id = new URLSearchParams(window.location.search).get("id");
        if (febking_id) {
          const response = await GetCertificateData.GetCertificateId(febking_id);
          setFireData(response.data[0]);


        }
      }
      catch (error) {

        console.error('Error fetching fire data:', error);
      }
    };
    const handleURLChange = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const febking_id = urlParams.get("id");
      if (febking_id) {
        getTicketDetail(febking_id);
      } else {
        setFireData(null);
      }
    };
    fetchData();
    window.addEventListener('popstate', handleURLChange);
    handleURLChange();
    return () => {
      window.removeEventListener('popstate', handleURLChange);
    };
  }, []);


  const getTicketDetail = async (febking_id: string) => {
    try {
      const getTDetail = await GetCertificateData.GetCertificateId(febking_id);
      setFireData(getTDetail.data[0]);
      setError("");
      console.log("Fire details", getTDetail.data[0]);


    } catch (error) {
      setError("Error fetching fire data. Please try again later.");
      console.error("Error fetching fire data:", error);
    }
  };




  const storedData = localStorage.getItem('userData');


  const { register, control, handleSubmit, formState: { errors }, watch, setValue, getValues } = useForm<FormData>({
    defaultValues: {

      febking_created_by: storedData,
      fest_name: "",
      febking_certificate_no: "",
      Total_extingusher: "",
      client_city: "",
      febking_invoice_no: "",
      firstName: '',
      address: '',
      mobileNo: '',
      duedate: "",
      Sr_no: "",
      client_pincode: "",
      client_state: "",
      date: "",
    }
  });

  setValue("firstName", fireData.firstName)
  setValue("febking_certificate_no", fireData.febking_certificate_no)
  setValue("febking_invoice_no", fireData.febking_invoice_no)
  setValue("fest_name", fireData.fest_name)
  setValue("address", fireData.address)
  setValue("client_state", fireData.client_state)
  setValue("date", fireData.febking_created_at)
  setValue("client_city", fireData.client_city)
  setValue("mobileNo", fireData.mobileNo)


  setValue("client_pincode", fireData.client_pincode)


  //-----------------------------------------get data ----------------------------------------------------------------------------
  useEffect(() => {
    // Populate form fields when fireData changes
    if (fireData && fireData.product_data && fireData.product_data.length > 0) {
      const initialProductData = fireData.product_data.map((product: any) => ({
        id: product.id,
        qty: product.qty,
        rate: product.rate,
        totalAmount: product.totalAmount,
        hsnCode: product.feit_hsn_code,
        capacity: product.capacity,
        feit_id: product.feit_id,
        feb_name: product.feb_name,
        feit_name: product.feit_name,
        febd_sgst: product.febd_sgst,
        febd_cgst: product.febd_cgst,
        febd_sgst_amount: product.febd_sgst_amount,
        febd_cgst_amount: product.febd_cgst_amount,
        feb_id: product.feb_id,
      }));



      setValue('product_data', initialProductData);

    }
  }, [fireData, setValue]);




  //----------------------------------  ADD or Remove produtct data ---------------------------------------------------------
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'product_data',
  });

  const calculateTotalQty = () => {
    return fields.reduce((total, current) => total + parseInt(current.qty), 0);

  };
  useEffect(() => {
    if (fireData) {
      // Calculate total quantity from product_data
      const totalQty = calculateTotalQty();
      
      // Set value in form
      setValue('Total_extingusher', `${totalQty} NOS`);
    }
  }, [fireData, setValue, fields]);
  
  //--------------------------------------------------------------------------------------------------------------------------------------- 
  const handlePhoneChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.replace(/\D/g, '').slice(0, 10);

    setFireData({ ...fireData, mobileNo: value });
  };

  const currentDate = new Date().toISOString().split('T')[0];

  // const onSubmit: SubmitHandler<FormData> = async (detail: any) => {
  //   console.log(detail)
  //    handleclientPrint(detail);
  // }

  // function handlecertificate(febking_id: any): void {
  //   throw new Error('Function not implemented.');
  // }
  const onSubmit: SubmitHandler<FormData> = async (data) => {
    try {

      const totalQty = calculateTotalQty();     
      const updatedData = { ...data, Total_extingusher: `${totalQty} NOS` };
      console.log(data);


      handleclientPrint(updatedData);
      

    } catch (error) {
      console.error("Error submitting form:", error);

    }
  };


  return (
    <>

      <div className="container">

        <div className='card-header' >
          <h1>CERTIFICATE Detail</h1>
        </div>
        <div className="separator"></div>
        <form className="row g-3" onSubmit={handleSubmit(onSubmit)} >
          <div className="col-md-3">
            <label htmlFor="inputEmail4" className="form-label">Certificate No:</label>
            <input type="text"    {...register('febking_certificate_no')} readOnly disabled value={fireData.febking_certificate_no} className="form-control" id="inputEmail4" />
          </div>
          <div className="col-md-3">
            <label htmlFor="inputPassword4" className="form-label">Invoice No</label>
            <input type="text" {...register('febking_invoice_no')} readOnly disabled value={fireData.febking_invoice_no} className="form-control" id="inputPassword4" />
          </div>
          <div className="col-md-3">
            <label htmlFor="inputPassword4" className="form-label">Name</label>
            <input type="text" {...register('firstName')} value={fireData.firstName} onChange={(e) => setFireData({ ...fireData, firstName: e.target.value })} className="form-control" id="inputPassword4" />
          </div>
          <div className="col-md-3">
            <label htmlFor="inputPassword4" className="form-label">Service Type</label>
            <input type="text" {...register('fest_name')} value={fireData.fest_name} readOnly disabled className="form-control" id="inputPassword4" />
          </div>
          <div className="col-12">
            <label htmlFor="inputAddress" className="form-label">Address</label>
            <textarea {...register('address')} onChange={(e) => setFireData({ ...fireData, address: e.target.value })} className="form-control" value={fireData.address} id="inputAddress" placeholder="1234 Main St" />
          </div>
          <div className="col-3">
            <label htmlFor="inputAddress2" className="form-label">Mobile-No</label>
            <input type="text" {...register('mobileNo',
              {
                minLength: 10,
              }
            )} maxLength={10} minLength={10} onChange={handlePhoneChange} className="form-control" id="inputAddress2" placeholder="Apartment, studio, or floor" />
            {errors.mobileNo?.type === "required" && <span id="show_mobile_err" className="error">Enter 10 Digits Mobile Number.</span>}
            {errors?.mobileNo?.type === "minLength" && <span id="show_mobile_err" className="error">Enter 10 Digits Mobile Number.</span>}
          </div>
          <div className="col-3">
            <label htmlFor="inputAddress2" className="form-label">City</label>
            <input type="text" {...register('client_city')} onChange={(e) => setFireData({ ...fireData, client_city: e.target.value })} value={fireData.client_city} className="form-control" id="inputAddress2" placeholder="Apartment, studio, or floor" />
          </div>
          <div className="col-md-3">
            <label htmlFor="inputCity" className="form-label">State</label>
            <input type="text" {...register('client_state')} onChange={(e) => setFireData({ ...fireData, client_state: e.target.value })} value={fireData.client_state} className="form-control" id="inputCity" />
          </div>

          <div className="col-md-3">
            <label htmlFor="inputZip" className="form-label">Zip</label>
            <input type="text" {...register('client_pincode')} onChange={(e) => setFireData({ ...fireData, client_pincode: e.target.value })} value={fireData.client_pincode} className="form-control" id="inputZip" />
          </div>
          <div className="col-3">
            <label htmlFor="inputEmail4" className="form-label">Total No of Extingusher:</label>
            <input
              type="text"
              {...register('Total_extingusher')}
              className="form-control"
              id="inputEmail4"
              readOnly
            />
          </div>

          <div className="col-3">
            <label htmlFor="inputEmail4" className="form-label">Date</label>
            <input type="text" {...register('date')} readOnly disabled value={fireData.febking_created_at} className="form-control" id="inputEmail4" />
          </div>
          <div className="col-3">
            <label htmlFor="inputEmail4" className="form-label">Next Due Date:</label>
            <input type="date" {...register('duedate', {
              required: "true",
            })} defaultValue={currentDate} min={currentDate} className="form-control" id="inputEmail4" />
            {errors.duedate?.type === "required" && <span id="show_mobile_err" className="error">This field is required</span>}

          </div>
          <div className="col-3">
            <label htmlFor="inputEmail4" className="form-label">Extingusher Sr.No:</label>
            <input type="text" {...register('Sr_no', {
              required: "true",
            })} className="form-control" id="inputEmail4" />
            {errors.Sr_no?.type === "required" && <span id="show_mobile_err" className="error">This field is required</span>}
          </div>
          {fields.map((field, index) => (
            <tbody style={{ display: "none" }}>
              <tr key={index}>

                <td>{field.qty}</td>

              </tr>
            </tbody>
          ))}
          <div className="text-center">
            <button  className="btn btn-primary" type="submit" id="save_ticket" name="save_form" >
              Create certificate
            </button>
          </div>

         



        </form>



      </div>
    </>
  );
};


