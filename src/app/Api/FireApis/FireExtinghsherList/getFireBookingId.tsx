import axios, { AxiosResponse } from 'axios';
import { baseURL } from '../BrandApi/DeleteBrand';
import { DetailsResponse } from '../DataFilter/date';

;



export default {
    async GetFireBookingId(id: string): Promise<DetailsResponse> {
        try {
          const response: AxiosResponse = await axios.post(baseURL + '/booking/get_fire_extingusher_booking_detail', {
            q_quotation_no: id,
            id:id, 
          }, {
            headers: {
              'Accept': 'application/json',
            
            },
          });
    
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
    

