import axios, { AxiosResponse } from 'axios';
import { baseURL } from '../BrandApi/DeleteBrand';

export default {
    async getReceiverChallanFilterdate(startdate?: string, enddate?: string): Promise<any> {
        try {
            const response: AxiosResponse = await axios.post(baseURL + '/challan/get_date_filter_fire_extingusher_receiver_challan_data', {
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

    async GetReceiverChallanBookingId(id: string): Promise<any> {
        try {
          const response: AxiosResponse = await axios.post(baseURL + '/challan/get_single_fire_extingusher_receiver_challan_data', {
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
      async GetSingleService(id: string): Promise<any> {
        try {
          const response: AxiosResponse = await axios.post(baseURL + '/challan/get_quotationdata_for_delivery', {
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
