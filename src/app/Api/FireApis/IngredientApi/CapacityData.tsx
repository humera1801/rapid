import axios, { AxiosResponse } from 'axios';
import { baseURL } from '../BrandApi/DeleteBrand';

// Dev URL
// const baseURL = 'http://192.168.0.114:3001';



export default {
    async getcapacityData(): Promise<any> {
        try {
          const response: AxiosResponse = await axios.post(baseURL + '/capacity/get_fire_extingusher_capacity_data', {
          
          }, {
            headers: {
              'Accept': 'application/json',
              // Optionally add Content-Type if needed
              // 'Content-Type': 'application/json',
            },
          });
    
          // Check response status
          if (response.data.status === 1) {
            console.log("data",response.data);
            return response.data;
          
            
          } else {
            throw new Error('Response status is not 1');
          }
           
        } catch (error) {
          console.error('Error in getIngredientsIdData:', error);
          throw error;
        }
      },
    };
    

