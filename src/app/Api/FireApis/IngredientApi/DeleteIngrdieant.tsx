import axios, { AxiosResponse } from 'axios';
import { baseURL } from '../BrandApi/DeleteBrand';

// Dev URL
// const baseURL = 'http://192.168.0.114:3001';



export default {
    async deleteIngredient(id: string): Promise<any> {
        try {
          const response: AxiosResponse = await axios.post(baseURL + '/ingredient/delete_fire_ingredient', {
            feit_id: id,
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
    

