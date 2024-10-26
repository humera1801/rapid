import axios, { AxiosResponse } from 'axios';
import { baseURL } from './DeleteBrand';



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
          
        },
      });

      if (response.data.status === 1) {
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
