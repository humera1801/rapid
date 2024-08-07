import axios, { AxiosResponse } from 'axios';
import { baseURL } from './DeleteBrand';

// Dev URL
// const baseURL = 'http://192.168.0.114:3001';

interface Brand {
  feb_id: number;
  feb_name: string;
}

export default {
  async getAddBrand(): Promise<any> {
    try {
      const response: AxiosResponse = await axios.get(baseURL + '/brand/get_fire_extinguisher_brand_list', {
        headers: {
          'Accept': 'application/json',
          // Optionally, you can add Content-Type if needed
          // 'Content-Type': 'application/json',
        },
      });

      if (response.data.status === 1) {
        // Assuming data is an array of brands
        const brands: Brand[] = response.data.data;
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
