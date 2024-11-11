import axios, { AxiosResponse } from 'axios';
import { DetailsResponse } from '../FireApis/DataFilter/date';

// Dev URL
const baseURL = 'http://192.168.0.106:3001';



export default {
  async GetRoleBooking(): Promise<DetailsResponse>{
    try {
      const response: AxiosResponse = await axios.get(baseURL + '/employee/get_role_list', {
        headers: {
          'Accept': 'application/json',
        },
      });

      if (response.data.status === 1) {
        
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