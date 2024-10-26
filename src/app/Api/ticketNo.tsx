import axios, { AxiosResponse } from 'axios';

// Dev URL
const baseURL = 'http://192.168.0.105:3001';



export default {
  async getTicketNo(): Promise<any> {
    try {
      const response: AxiosResponse = await axios.get(baseURL + '/ticket/generate_ticket_no', {
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
