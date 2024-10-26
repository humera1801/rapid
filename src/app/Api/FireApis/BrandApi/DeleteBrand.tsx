import axios, { AxiosResponse } from 'axios';

// Dev URL
export const baseURL = 'http://192.168.0.105:3001';



export default {
    async deleteBrand(id: string): Promise<any> {
        try {
          const response: AxiosResponse = await axios.post(baseURL + '/brand/delete_fire_brand', {
            feb_id: id,
          }, {
            headers: {
              'Accept': 'application/json',
             
            },
          });
    
        

        console.log("data",response.data);
        
        } catch (error) {
          console.error('Error in delete brand:', error);
          throw error;
        }
      },
    };
    

