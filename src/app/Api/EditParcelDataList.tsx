import axios, { AxiosResponse } from 'axios';

// Dev URL
const baseURL = 'http://localhost:3000';



export default {
  async getEditParcelData(parceltoken: string): Promise<any> {
   
    
    try {
      const response: AxiosResponse = await axios.post(baseURL + '/parcel/get_parcel_detail_data', {
        parcel_token: parceltoken,
        headers: {
          'Accept': 'application/json',
          // 'Content-Type': 'application/json',
        },
      });

      if (response.data.status === '1') {
        return response.data;
      } else {
        throw new Error('Response status is not 1');
      }
    } catch (error) {
      console.error('Error in getAllparcelListApi:', error);
      throw error;
    }
  },
}

