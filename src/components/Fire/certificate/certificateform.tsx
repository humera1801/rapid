"use client";
import GetNewBrand from '@/app/Api/FireApis/BrandApi/GetNewBrand';
import GetClientList from '@/app/Api/FireApis/FireExtinghsherList/GetClientList';
import getFireBookingId from '@/app/Api/FireApis/FireExtinghsherList/getFireBookingId';
import GetIngredientList from '@/app/Api/FireApis/IngredientApi/GetIngredientList';
import GetServiceList from '@/app/Api/FireApis/ServiceApi/GetServiceList';
import { faMinusCircle, faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import { debounce } from 'lodash';
import React, { useEffect, useState } from 'react';
import { SubmitHandler, useFieldArray, useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import Select from 'react-select';
// import { generateUpdatePDF } from './Invoice/EditPdf.js'
import GetEmployeeList from '@/app/Api/FireApis/GetEmployeeList';
import Link from 'next/link.js';
import GetChallanList from '@/app/Api/FireApis/ReceiverChallan/GetChallanList';
import QuotationFilterList from '@/app/Api/FireApis/Quotation/QuotationFilterList';
import GetListData from '@/app/Api/FireApis/DeliveryChallan/GetListData';
import { handlecertificateprint } from './certificatedata';
// import { generateUpdatePDF } from '../Fire/Invoice/EditPdf';

export interface FormData {
  febking_id: any;
  febking_created_by: any;
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
  service_data: Record<any, ProductData[]>;
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
  feqd_sr_no: any;
  qty: any;
  rate: any;
  totalAmount: any;
  hsnCode: string;
  feit_hsn_code: string;
  capacity: string;
  feit_id: any;
  fest_name: any;
  feqd_cgst: any;
  feqd_sgst: any;
  feqd_sgst_amount: any;
  feqd_cgst_amount: any;
  feb_id: string;

}

interface ingredient {
  feit_id: any;
  feit_name: string;
  feit_hsn_code: string;
  feit_rate: string;
  capacity: string[];
  feit_sgst: any;
  feit_cgst: any;
  feit_created_by: any;
}

interface Brand {
  feb_id: number;
  feb_name: string;
}


interface Service {
  selected: boolean | undefined;
  fest_id: any,
  fest_name: string,
  fest_created_by: any

}

interface ClientData {
  client_id: number;
  client_firstName: string;
  client_address: string;
  client_email: string;
  client_gstNo: string;
  client_mobileNo: string;
  client_city: string;
  client_state: string;
  client_pincode: string;
  poNo: string;
  vendorCode: string;


}

interface Client {
  client_id: any,
  firstName: string;
  address: string;
  email: string;
  gstNo: string;
  mobileNo: string;
  vendorCode: string;
  poNo: string;
  city: string;
  state: string;
  pincode: string;
}

// interface Employee {
//     value: string;
//     label: string;
// }


interface employee {
  e_id: string,
  e_name: string
}

interface CapacityData {
  feit_id: number;
  fec_capacity: string;
}

const Certificate = () => {

  //-------------------------------------------------------------------------------------------------------------------------------------

  //---------------------------------------get id data --------------------------------------------------------------------------


  const [formData, setFormData] = useState<Client>({
    client_id: "",
    firstName: '',
    address: '',
    email: '',
    gstNo: '',
    vendorCode: '',
    poNo: '',
    mobileNo: '',
    city: "",
    state: "",
    pincode: "",
  });









  const [showSrNo, setShowSrNo] = useState<boolean>(false);

  const [fireData, setFireData] = useState<any>("");
  const [error, setError] = useState<string>('');
  const [imageName, setImageName] = useState<string>('');

  useEffect(() => {


    const fetchData = async () => {
      try {
        const q_quotation_no = new URLSearchParams(window.location.search).get("id");

        if (q_quotation_no) {
          const response = await getFireBookingId.GetFireBookingId(q_quotation_no.toString());
          console.log("delivery data:", response.data[0]);
          setFireData(response.data[0]);
          if (response.data) {
            console.log("aa1:");


            setValue("febking_id", response.data[0].febking_id);
            setValue("client_id", response.data[0].client_id)
            setValue("firstName", response.data[0].client_firstName);
            setValue("address", response.data[0].client_address);
            setValue("email", response.data[0].client_email);
            setValue("gstNo", response.data[0].client_gstNo);
            setValue("vendorCode", response.data[0].vendorCode);
            setValue("poNo", response.data[0].poNo);
            setValue("mobileNo", response.data[0].client_mobileNo);
            setValue("client_city", response.data[0].client_city);
            setValue("client_state", response.data[0].client_state);
            setValue("client_pincode", response.data[0].client_pincode);
            setValue("febking_certificate_no", fireData.febking_certificate_no)
            setValue("febking_invoice_no", fireData.febking_invoice_no)
            setValue("fest_name", fireData.fest_name)
            setValue("date", fireData.febking_created_at)



          }




          Object.entries(response.data[0].service_data).forEach(([fest_id, items]) => {
            setValue(`service_data.${fest_id}`, items as ProductData[]);
        });

        const fetchedVisibleFields = new Set(Object.keys(response.data[0].service_data).map(id => parseInt(id)));
        setVisibleFields(fetchedVisibleFields);


        const isNewSupplyChecked = Array.from(fetchedVisibleFields).some(id =>
            services.find(service => service.fest_id === id)?.fest_name === 'New Supply'
        );
        setShowSrNo(isNewSupplyChecked);


        }
        else {
          console.error("q_quotation_no is not available.");
        }





        setError('');

      }
      catch (error) {

        console.error('Error fetching fire data:', error);
      }
    };
    const handleURLChange = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const q_id = urlParams.get("id");
      if (q_id) {
        getTicketDetail(q_id);
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

  const [visibleFields, setVisibleFields] = useState<Set<any>>(new Set());
  const [services, setServices] = useState<Service[]>([]);


  const getTicketDetail = async (q_quotation_no: string) => {
    try {
      const getTDetail = await getFireBookingId.GetFireBookingId(q_quotation_no);
      setFireData(getTDetail.data[0]);
      setError("");
      console.log("Fire details", getTDetail.data);
      console.log("aa2:");


    } catch (error) {
      setError("Error fetching fire data. Please try again later.");
      console.error("Error fetching fire data:", error);
      console.log("aa3:");
    }
  };


















  //-------------------------------------------------------------------------------------------------------------------------------------
  const storedData = localStorage.getItem('userData');


  const { register, control, handleSubmit, formState: { errors }, watch, setValue, getValues } = useForm<FormData>({
    defaultValues: {
      // febking_id: fireData.febking_id || '',
      febking_created_by: storedData,
      febking_entry_type: 1,
      service_data: {},
      febking_total_amount: '0.00',
      febking_final_amount: '0.00',
      client_id: "",
      firstName: '',
      address: '',
      email: '',
      gstNo: '',
      vendorCode: '',
      poNo: '',
      mobileNo: '',


    }
  });


  //-----------------------------------------get data ----------------------------------------------------------------------------














  //-----------------------------------------------get Client list -----------------------------------------------------------------



















  const currentDate = new Date().toISOString().split('T')[0];

  const router = useRouter();


  const onSubmit: SubmitHandler<FormData> = async (data) => {


    const updatedData = { 
      ...data, 
      date: fireData.febking_created_at, 
      febking_certificate_no: fireData.febking_certificate_no, 
      febking_invoice_no: fireData.febking_invoice_no,
       
     };
    console.log(updatedData);


    handlecertificateprint(updatedData)




  };









  return (
    <div className='container' style={{ width: "900px", margin: "40px auto", padding: "20px", borderRadius: "10px" }}>
      <h4>CERTIFICATE </h4>
      <br />
      <div className='card cardbox' >
        <div className="card-body">

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
              <input type="text" {...register('firstName')} value={fireData.client_firstName} onChange={(e) => setFireData({ ...fireData, firstName: e.target.value })} className="form-control" id="inputPassword4" />
            </div>

            <div className="col-3">
              <label htmlFor="inputAddress" className="form-label">Address</label>
              <textarea {...register('address')} onChange={(e) => setFireData({ ...fireData, address: e.target.value })} className="form-control" value={fireData.client_address} id="inputAddress" placeholder="1234 Main St" />
            </div>
            <div className="col-3">
              <label htmlFor="inputAddress2" className="form-label">Mobile-No</label>
              <input type="text" {...register('mobileNo',
                {
                  minLength: 10,
                }
              )} maxLength={10} minLength={10} className="form-control" id="inputAddress2" placeholder="Apartment, studio, or floor" />
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
          

           

            {/* {fields.map((field, index) => (
              <tbody style={{ display: "none" }}>
                <tr key={index}>

                  <td>{field.qty}</td>

                </tr>
              </tbody>
            ))} */}
            <div className="text-center">
              <button className="btn btn-success btn-sm"  type="submit" id="save_ticket" name="save_form" >
                Create certificate
              </button>
            </div>





          </form>
        </div>
      </div>

    </div>
  );
};

export default Certificate;

