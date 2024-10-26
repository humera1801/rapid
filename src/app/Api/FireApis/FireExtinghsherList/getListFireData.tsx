import axios, { AxiosResponse } from 'axios';
import { baseURL } from '../BrandApi/DeleteBrand';



interface FireListResponse {
  status: number;
  message: string;
  data: any[]; 
}

export default {
  async getFireListData(): Promise<any> {
    try {
      const response: AxiosResponse<FireListResponse> = await axios.get(
        `${baseURL}/booking/get_all_fire_extingusher_booking_data`,
        {
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
