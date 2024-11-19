import axios, { AxiosResponse } from 'axios';
import { DetailsResponse } from './FireApis/DataFilter/date';

// Dev URL
const baseURL = 'http://192.168.0.106:3001';



export default {
  async getEditTicktetData(tickettoken: string): Promise<any> {
   
    
    try {
      const response: AxiosResponse = await axios.post(baseURL + '/ticket/get_ticket_booking_detail_data', {
        ticket_token: tickettoken || '',
        id:tickettoken || '',
        headers: {
          'Accept': 'application/json',
        },
      });
      console.log(response);
      
      if (response.data.status === '1') {
        return response.data;
      } else {
        throw new Error('Response status is not 1');
      }
    } catch (error) {
      console.error('Error in list:', error);
      throw error;
    }
  },
}

