import axios, { AxiosResponse } from 'axios';
import { baseURL } from '../BrandApi/DeleteBrand';

// Dev URL
// const baseURL = 'http://192.168.0.114:3001';



export default {
    async deleteservice(id: string): Promise<any> {
        try {
          const response: AxiosResponse = await axios.post(baseURL + '/service/delete_fire_extinguisher_service_type', {
            fest_id: id,
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
    

