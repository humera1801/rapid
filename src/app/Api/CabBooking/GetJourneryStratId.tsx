import axios, { AxiosResponse } from 'axios';
import { baseURL } from '../FireApis/BrandApi/DeleteBrand';

// Dev URL
// const baseURL = 'http://192.168.0.114:3001';



export default {
    async getJourneyStrat(id: string): Promise<any> {
        try {
          const response: AxiosResponse = await axios.post(baseURL + '/cabbooking/get_start_journey_details', {
            cb_id: id,
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
          console.error('Error in getJourneyStrat:', error);
          throw error;
        }
      },
      async getJourneyEnd(id: string): Promise<any> {
        try {
          const response: AxiosResponse = await axios.post(baseURL + '/cabbooking/get_end_journey_details', {
            cb_id: id,
          }, {
            headers: {
              'Accept': 'application/json',
              // Optionally add Content-Type if needed
              // 'Content-Type': 'application/json',
            },
          });
    
          // Check response status
          if (response.data.status === 1) {
            console.log("data",response.data.data);
            return response.data;
          
            
          } else {
            throw new Error('Response status is not 1');
          }
            console.log("data",);
        } catch (error) {
          console.error('Error in getJourneyStrat:', error);
          throw error;
        }
      },
    };
    

