import axios, { AxiosResponse } from 'axios';

// Dev URL
const baseURL = 'http://localhost:3000';



export default {
  async getEditTicktetData(tickettoken: string): Promise<any> {
   
    
    try {
      const response: AxiosResponse = await axios.post(baseURL + '/ticket/get_ticket_booking_detail_data', {
        ticket_token: tickettoken,
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

