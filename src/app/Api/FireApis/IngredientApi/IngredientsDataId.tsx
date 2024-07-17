import axios, { AxiosResponse } from 'axios';

// Dev URL
const baseURL = 'http://192.168.0.111:3001';



export default {
    async getIngredientsIdData(id: string): Promise<any> {
        try {
          const response: AxiosResponse = await axios.post(baseURL + '/capacity/get_fire_extingusher_capacity_data', {
            feit_id: id,
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
            console.log("data",);
        } catch (error) {
          console.error('Error in getIngredientsIdData:', error);
          throw error;
        }
      },
    };
    

