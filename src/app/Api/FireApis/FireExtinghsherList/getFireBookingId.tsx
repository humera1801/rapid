import axios, { AxiosResponse } from 'axios';

// Dev URL
const baseURL = 'http://192.168.0.111:3001';



export default {
    async GetFireBookingId(id: string): Promise<any> {
        try {
          const response: AxiosResponse = await axios.post(baseURL + '/booking/get_fire_extingusher_booking_detail', {
            febking_id: id,
          }, {
            headers: {
              'Accept': 'application/json',
              // Optionally add Content-Type if needed
              // 'Content-Type': 'application/json',
            },
          });
    
          // Check response status
          if (response.data.status === 1) {
            return response.data;
          } else {
            throw new Error('Response status is not 1');
          }
        } catch (error) {
          console.error('Error in Fire:', error);
          throw error;
        }
      },
    };
    

