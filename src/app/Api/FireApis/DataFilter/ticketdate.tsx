import axios, { AxiosResponse } from 'axios';
import { baseURL } from '../BrandApi/DeleteBrand';
import { DetailsResponse } from './date';

export default {
    async getticketFilterdate(startdate?: string, enddate?: string): Promise<DetailsResponse> {
        try {
            const response: AxiosResponse = await axios.post(baseURL + '/ticket/get_date_filter_booking_list_data', {
                startdate: startdate || '',  
                enddate: enddate || '',      
            }, {
                headers: {
                    'Accept': 'application/json',
                },
            });

            if (response.data.status === "1") {
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
