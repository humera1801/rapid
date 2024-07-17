import axios, { AxiosResponse } from 'axios';

// Dev URL
const baseURL = 'http://192.168.0.111:3001';



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
    

