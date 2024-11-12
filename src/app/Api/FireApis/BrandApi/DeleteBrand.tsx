import axios, { AxiosResponse } from 'axios';

// Dev URL
export const baseURL = 'http://192.168.0.106:3001';

interface BrandDetailsResponse {
  status: string;
  data: any;
}

export default {
  async deleteBrand(id: string): Promise<any> {
    try {
      const response: AxiosResponse = await axios.post(baseURL + '/brand/delete_fire_brand', {
        feb_id: id,
      }, {
        headers: {
          'Accept': 'application/json',

        },
      });
      if (response.data.status == 1) {

        return response.data;
      } else {
        throw new Error('Response status is not 1');
      }


      console.log("data", response.data);

    } catch (error) {
      console.error('Error in delete brand:', error);
      throw error;
    }
  },
};


