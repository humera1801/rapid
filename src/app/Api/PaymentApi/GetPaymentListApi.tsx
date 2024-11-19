import axios, { AxiosResponse } from 'axios';
import { baseURL } from '../FireApis/BrandApi/DeleteBrand';

export default {
    async getpaymentFilterdate(startdate?: string, enddate?: string, page?: number, limit?: number): Promise<any> {
        try {
            const response: AxiosResponse = await axios.post(baseURL + '/payment/get_payment_list', {
                startdate: startdate || '',  
                enddate: enddate || '',      
            }, {
                headers: {
                    'Accept': 'application/json',
                },
            });

            if (response.data.status === 1) {
                return response.data;
            } else {
                throw new Error('Response status is not 1');
            }
        } catch (error) {
            console.error('Error in date:', error);
            throw error;
        }
    },
    async getpaymentdataView(booking_type?: string, id?: string): Promise<any> {
        try {
            const response: AxiosResponse = await axios.post(baseURL + '/payment/get_payment_details', {
                booking_type: booking_type || '',  
                id: id || '',      
            }, {
                headers: {
                    'Accept': 'application/json',
                },
            });
    
            if (response.data.status === 1) {
                return response.data;
            } else {
                throw new Error('Response status is not 1');
            }
        } catch (error) {
            console.error('Error in fetching payment data:', error);
            throw error;
        }
    },
    async getreceiptpaymentdataView(receipt_no?: string, ): Promise<any> {
        try {
            const response: AxiosResponse = await axios.post(baseURL + '/payment/get_payment_details_by_receipt', {
                receipt_no: receipt_no || '',  
                  
            }, {
                headers: {
                    'Accept': 'application/json',
                },
            });
    
            if (response.data.status === 1) {
                return response.data[0];
            } else {
                throw new Error('Response status is not 1');
            }
        } catch (error) {
            console.error('Error in fetching payment data:', error);
            throw error;
        }
    },


    async getVandorPaymentList(startdate?: string, enddate?: string): Promise<any> {
        try {
            const response: AxiosResponse = await axios.post(baseURL + '/vendor/vendor_payment_list', {
                startdate: startdate || '',  
                enddate: enddate || '',      
            }, {
                headers: {
                    'Accept': 'application/json',
                },
            });

            if (response.data.status == '1') {
                return response.data;
            } else {
                throw new Error('Response status is not 1');
            }
        } catch (error) {
            console.error('Error in date:', error);
            throw error;
        }
    },
};
