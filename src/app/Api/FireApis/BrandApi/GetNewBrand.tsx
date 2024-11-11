import axios, { AxiosResponse } from 'axios';
import { baseURL } from './DeleteBrand';

interface BrandDetailsResponse {
  status: string;
  data: any;
}


interface Brand {
  feb_id: number;
  feb_name: string;
}

export default {
  async getAddBrand(): Promise<BrandDetailsResponse> {
    try {
      const response: AxiosResponse = await axios.get(baseURL + '/brand/get_fire_extinguisher_brand_list', {
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
      console.error('Error in getAddBrand:', error);
      throw error;
    }
  },
};
