import axios, { AxiosResponse } from 'axios';
import { baseURL } from '../BrandApi/DeleteBrand';



interface FireListResponse {
  status: number;
  message: string;
  data: any[]; 
}

export default {
  async getclientListData(value: string): Promise<any> {
    try {
      const response: AxiosResponse<FireListResponse> = await axios.get(
        `${baseURL}/booking/get_all_client_data_autocomplete`,
        {
          params: {
            search: value  
          },
          headers: {
            'Accept': 'application/json',
          },
        }
      );

      if (response.data.status === 1) {
        return response.data.data;
      } else {
        throw new Error(response.data.message); 
      }
    } catch (error) {
      console.error('Error in data fetch:', error);
      throw error;
    }
  },
};
