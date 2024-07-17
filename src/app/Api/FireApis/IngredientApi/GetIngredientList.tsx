import axios, { AxiosResponse } from 'axios';

// Dev URL
const baseURL = 'http://192.168.0.111:3001';

interface ingredient {
    feit_name: string;
    feit_hsn_code: string;
    feit_rate: number;
    feit_sgst:string;
    feit_cgst:string;
    feit_created_by: any
}

export default {
    async getIngrediant(): Promise<any> {
        try {
            const response: AxiosResponse = await axios.get(baseURL + '/ingredient/get_fire_extinguisher_ingredient_list', {
                headers: {
                    'Accept': 'application/json',
                    // Optionally, you can add Content-Type if needed
                    // 'Content-Type': 'application/json',
                },
            });

            if (response.data.status === 1) {
                // Assuming data is an array of brands
                const brands: ingredient[] = response.data.data;
                return brands;
            } else {
                throw new Error('Response status is not 1');
            }
        } catch (error) {
            console.error('Error in getAddBrand:', error);
            throw error;
        }
    },
};
