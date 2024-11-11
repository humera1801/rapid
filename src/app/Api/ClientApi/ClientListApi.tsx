import axios, { AxiosResponse } from 'axios';
import { baseURL } from '../FireApis/BrandApi/DeleteBrand';

interface clientDetailsResponse {
    status: string;
    data: any;
  }

export default {
    async getclientFilterdate(startdate?: string, enddate?: string): Promise<clientDetailsResponse> {
        try {
            const response: AxiosResponse = await axios.post(baseURL + '/client/get_client_list', {
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
  
    async getclientdataView(client_id?: string, ): Promise<clientDetailsResponse> {
        try {
            const response: AxiosResponse = await axios.post(baseURL + '/client/get_client_details', {
                client_id: client_id || '',  
                  
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
    
    async getTransactionFilterdate(client_id?: string, startdate?: string, enddate?: string): Promise<clientDetailsResponse> {
        try {
            const response: AxiosResponse = await axios.post(baseURL + '/payment/get_client_payment_list', {
                client_id: client_id || '',  
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
    async getCabBookingData(client_id?: string, ): Promise<clientDetailsResponse> {
        try {
            const response: AxiosResponse = await axios.post(baseURL + '/cabbooking/get_cab_booking_list_of_client', {
                client_id: client_id || '',  
                  
            }, {
                headers: {
                    'Accept': 'application/json',
                },
            });
    
            if (response.data.status === 1) {
                return response.data.data;
            } else {
                throw new Error('Response status is not 1');
            }
        } catch (error) {
            console.error('Error in fetching payment data:', error);
            throw error;
        }
    },
    async getFireBookingData(client_id?: string, ): Promise<clientDetailsResponse> {
        try {
            const response: AxiosResponse = await axios.post(baseURL + '/booking/get_fire_extingusher_booking_list_of_client', {
                client_id: client_id || '',  
                  
            }, {
                headers: {
                    'Accept': 'application/json',
                },
            });
    
            if (response.data.status === 1) {
                return response.data.data;
            } else {
                throw new Error('Response status is not 1');
            }
        } catch (error) {
            console.error('Error in fetching payment data:', error);
            throw error;
        }
    },
    async getTicketBookingData(client_id?: string, ): Promise<clientDetailsResponse> {
        try {
            const response: AxiosResponse = await axios.post(baseURL + '/ticket/get_client_booking_list_data', {
                client_id: client_id || '',  
                  
            }, {
                headers: {
                    'Accept': 'application/json',
                },
            });
    
            if (response.data.status === '1') {
                return response.data.data;
            } else {
                throw new Error('Response status is not 1');
            }
        } catch (error) {
            console.error('Error in fetching payment data:', error);
            throw error;
        }
    },
    async getParcelBookingData(client_id?: string, ): Promise<clientDetailsResponse> {
        try {
            const response: AxiosResponse = await axios.post(baseURL + '/parcel/get_client_parcel_list_data', {
                client_id: client_id || '',  
                  
            }, {
                headers: {
                    'Accept': 'application/json',
                },
            });
    
            if (response.data.status === '1') {
                return response.data.data;
            } else {
                throw new Error('Response status is not 1');
            }
        } catch (error) {
            console.error('Error in fetching payment data:', error);
            throw error;
        }
    },
    async getTranSactionPrint(receipt_no?: string, ): Promise<any> {
        try {
            const response: AxiosResponse = await axios.post(baseURL + '/payment/get_payment_details_by_receipt', {
                receipt_no: receipt_no || '',  
                  
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
};
