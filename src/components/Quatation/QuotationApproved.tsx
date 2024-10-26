"use client";

import CabbookingList from '@/app/Api/CabBooking/CabbookingList';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { generateCabPaymentReceiptPrint } from '../CabBooking/CabbookingPdf/cabpaymentreceipt'
import QuotationFilterList from '@/app/Api/FireApis/Quotation/QuotationFilterList';

interface FormData {
    id: any;
    q_id?: number;
    po_no: string;
    po_no_date: string;
}

interface QuotationApprovedProps {
    QuotationData?: any;
    QuotationId: number | null;
}

const QuotationApproved: React.FC<QuotationApprovedProps> = ({ QuotationData, QuotationId }) => {
    const [fireData, setFireData] = useState<any>("");
    const [error, setError] = useState<string>('');
    const [hasPaymentDetails, setHasPaymentDetails] = useState(false);

    const { register, handleSubmit, watch, setValue } = useForm<FormData>({
        defaultValues: {

        }
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const q_id = new URLSearchParams(window.location.search).get("id");
                if (q_id) {
                    const response = await QuotationFilterList.GetQuotationBookingId(q_id);
                    const data = response.data[0];
                    setFireData(data);

                    setError('');
                } else {
                    setError('Id not found.');
                }
            } catch (error) {
                console.error('Error fetching fire data:', error);
                setError('An error occurred while fetching data.');
            }
        };

        fetchData();
    }, []);

    const currentDate = new Date().toISOString().split('T')[0];













    const onSubmit: SubmitHandler<FormData> = async (formData) => {
        const q_id = new URLSearchParams(window.location.search).get("id");
        const dataToSubmit = {
            ...formData,
            q_id: q_id,
            created_by: localStorage.getItem('userData'),
        };

        console.log("Form Data:", dataToSubmit);
        try {
            const response = await axios.post('http://192.168.0.105:3001/quotation/approve_quatation', dataToSubmit);
            console.log('Data submitted successfully:', response.data);
            window.location.reload()
        } catch (error) {
            console.error('Error updating data:', error);
        }
    };

    return (
        <div className='container'>

            <br />

            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="row mb-3">
                    <div className="col-lg-5 col-sm-4">
                        <label className="form-label" htmlFor="po_no">Po.No</label>
                        <input {...register("po_no")} type="text" className="form-control form-control-sm"  placeholder="Enter Po.no" />
                    </div>

                    <div className="col-lg-3 col-sm-4">
                        <label className="form-label" htmlFor="journeyStartDate">Date</label>
                        <input defaultValue={currentDate}  {...register("po_no_date")} className="form-control form-control-sm" type="date" id="journeyStartDate" placeholder="Enter Starting Date" />
                    </div>
                </div>




                <button type="submit" className="btn btn-success btn-sm" >Submit</button>
            </form>
        </div>
    );
}

export default QuotationApproved;
