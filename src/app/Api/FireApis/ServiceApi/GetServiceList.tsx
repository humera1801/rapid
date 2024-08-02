import axios, { AxiosResponse } from 'axios';
import { baseURL } from '../BrandApi/DeleteBrand';

// Dev URL
// const baseURL = 'http://192.168.0.114:3001';

interface service {
    fest_id: string,
    fest_name: string
}

export default {
    async getService(): Promise<any> {
        try {
            const response: AxiosResponse = await axios.get(baseURL + '/service/get_fire_extinguisher_service_type_list ', {
                headers: {
                    'Accept': 'application/json',
                    
                },
            });

            if (response.data.status === 1) {
                
                const brands: service[] = response.data.data;
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
