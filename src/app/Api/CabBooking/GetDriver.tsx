import axios, { AxiosResponse } from 'axios';
import { baseURL } from '../FireApis/BrandApi/DeleteBrand';



interface Driver {
    d_id: number;
    d_name: string;
}

interface DriverDetailsResponse {
  status: string;
  data: any;
}

export default {
  async getAddDriver(): Promise<DriverDetailsResponse> {
    try {
      const response: AxiosResponse = await axios.get(baseURL + '/cabbooking/get_driver_list', {
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
      console.error('Error in getAdddriver:', error);
      throw error;
    }
  },
};
