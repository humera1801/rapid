import axios, { AxiosResponse } from 'axios';
import { baseURL } from './BrandApi/DeleteBrand';

// Dev URL
// const baseURL = 'http://192.168.0.114:3001';

interface employee {
    e_id: string,
    e_name: string
}

export default {
    async getemployee(): Promise<any> {
        try {
            const response: AxiosResponse = await axios.get(baseURL + '/employee/get_employee_list ', {
                headers: {
                    'Accept': 'application/json',
                    
                },
            });

            if (response.data.status === 1) {
                
                const brands: employee[] = response.data.data;
                return brands;
            } else {
                throw new Error('Response status is not 1');
            }
        } catch (error) {
            console.error('Error in Service List:', error);
            throw error;
        }
    },
};
