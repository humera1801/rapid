import axios, { AxiosResponse } from 'axios';

// Dev URL
const baseURL = 'http://192.168.0.111:3001';

interface Unit {
  unit_id: number;
  unit_type: string;
}

export default {
  async getunitdata(): Promise<any> {
    try {
      const response: AxiosResponse = await axios.get(baseURL + '/capacity/get_unit_data', {
        headers: {
          'Accept': 'application/json',
          // Optionally, you can add Content-Type if needed
          // 'Content-Type': 'application/json',
        },
      });

      if (response.data.status === 1) {
        // Assuming data is an array of brands
        const brands: Unit[] = response.data.data;
        return brands;
      } else {
        throw new Error('Response status is not 1');
      }
    } catch (error) {
      console.error('Error in getAddBrand:', error);
      throw error;
    }
  },
};
