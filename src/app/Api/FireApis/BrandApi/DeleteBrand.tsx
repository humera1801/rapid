import axios, { AxiosResponse } from 'axios';

// Dev URL
const baseURL = 'http://192.168.0.111:3001';



export default {
    async deleteBrand(id: string): Promise<any> {
        try {
          const response: AxiosResponse = await axios.post(baseURL + '/brand/delete_fire_brand', {
            feb_id: id,
          }, {
            headers: {
              'Accept': 'application/json',
              // Optionally add Content-Type if needed
              // 'Content-Type': 'application/json',
            },
          });
    
          // Check response status
        //   if (response.status === 1) {
        //     return response;
        //   } else {
        //     throw new Error('Response status is not 1');
        //   }

        console.log("data",response.data);
        
        } catch (error) {
          console.error('Error in delete brand:', error);
          throw error;
        }
      },
    };
    

