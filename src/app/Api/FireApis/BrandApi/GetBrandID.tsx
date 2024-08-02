import axios, { AxiosResponse } from 'axios';
import { baseURL } from './DeleteBrand';

// Dev URL
// const baseURL = 'http://192.168.0.114:3001';



export default {
    async getFireBrandIdData(id: string): Promise<any> {
        try {
          const response: AxiosResponse = await axios.post(baseURL + '/brand/get_fire_brand_detail', {
            feb_id: id,
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
          console.error('Error in getFireBrandIdData:', error);
          throw error;
        }
      },
    };
    

