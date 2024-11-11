import axios, { AxiosResponse } from 'axios';
import { baseURL } from '../BrandApi/DeleteBrand';
import { DetailsResponse } from '../DataFilter/date';

export default {
    async getDeliveryChallanFilterdate(startdate?: string, enddate?: string): Promise<DetailsResponse> {
        try {
            const response: AxiosResponse = await axios.post(baseURL + '/challan/get_date_filter_fire_extingusher_delivery_challan_data', {
                startdate: startdate || '',  
                enddate: enddate || '',      
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
            console.error('Error in date:', error);
            throw error;
        }
    },

    async GetChallanBookingId(id: string): Promise<DetailsResponse> {
        try {
          const response: AxiosResponse = await axios.post(baseURL + '/challan/get_single_fire_extingusher_delivery_challan_data', {
            q_quotation_no: id,
          }, {
            headers: {
              'Accept': 'application/json',
             
            },
          });
    
          // Check response status
          if (response.data.status === 1) {
            return response.data;
          } else {
            throw new Error('Response status is not 1');
          }
        } catch (error) {
          console.error('Error in GetChallanBookingId:', error);
          throw error;
        }
      },
};
