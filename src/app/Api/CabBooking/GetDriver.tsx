import axios, { AxiosResponse } from 'axios';
import { baseURL } from '../FireApis/BrandApi/DeleteBrand';



interface Driver {
    d_id: number;
    d_name: string;
}

export default {
  async getAddDriver(): Promise<any> {
    try {
      const response: AxiosResponse = await axios.get(baseURL + '/cabbooking/get_driver_list', {
        headers: {
          'Accept': 'application/json',
          
        },
      });

      if (response.data.status === 1) {
        const driver: Driver[] = response.data.data;
        return driver;
      } else {
        throw new Error('Response status is not 1');
      }
    } catch (error) {
      console.error('Error in getAdddriver:', error);
      throw error;
    }
  },
};
