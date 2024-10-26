import axios, { AxiosResponse } from 'axios';
import { baseURL } from '../BrandApi/DeleteBrand';

export default {
    async getparcelFilterdate(startdate?: string, enddate?: string): Promise<any> {
        try {
            const response: AxiosResponse = await axios.post(baseURL + '/parcel/get_date_filter_parcel_list_data', {
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
