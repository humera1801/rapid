import axios, { AxiosResponse } from 'axios';
import { baseURL } from '../BrandApi/DeleteBrand';

export default {
  async getquotationFilterdate(startdate?: string, enddate?: string): Promise<any> {
    try {
      const response: AxiosResponse = await axios.post(baseURL + '/quotation/get__date_filter_fire_extingusher_quotation_data', {
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

  async GetQuotationBookingId(id: string): Promise<any> {
    try {
      const response: AxiosResponse = await axios.post(baseURL + '/quotation/get_fire_extingusher_quotation_detail', {
        q_id: id,
      }, {
        headers: {
          'Accept': 'application/json',
          // Optionally add Content-Type if needed
          // 'Content-Type': 'application/json',
        },
      });

      // Check response status
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
  async GetQuotationReceivedId(id: string): Promise<any> {
    try {
      const response: AxiosResponse = await axios.post(baseURL + '/quotation/get_fire_extingusher_quotation_detail', {
        q_id: id,
      }, {
        headers: {
          'Accept': 'application/json',
          // Optionally add Content-Type if needed
          // 'Content-Type': 'application/json',
        },
      });

      // Check response status
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
