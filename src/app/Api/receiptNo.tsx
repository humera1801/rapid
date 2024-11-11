import axios, { AxiosResponse } from 'axios';
import { DetailsResponse } from './FireApis/DataFilter/date';

// Dev URL
const baseURL = 'http://192.168.0.106:3001';


export default {
  async getRecieptNo(): Promise<DetailsResponse> {
    try {
      const response: AxiosResponse = await axios.get(baseURL + '/parcel/generate_reciept_no', {
        headers: {
          'Accept': 'application/json',
          // 'Content-Type': 'application/json',
        },
      });

      if (response.data.status === '1') {
        
        return response.data;
      } else {
        throw new Error('Response status is not 1');
      }
    } catch (error) {
      console.error('Error in getAllStateListApi:', error);
      throw error;
    }
  },
}
