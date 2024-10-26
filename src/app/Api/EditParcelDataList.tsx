import axios, { AxiosResponse } from 'axios';

// Dev URL
const baseURL = 'http://192.168.0.105:3001';



export default {
  async getEditParcelData(parceltoken: string): Promise<any> {
   
    
    try {
      const response: AxiosResponse = await axios.post(baseURL + '/parcel/get_parcel_detail_data', {
        parcel_token: parceltoken,
        id:parceltoken,
        headers: {
          'Accept': 'application/json',
        },
      });

      if (response.data.status === '1') {
        return response.data;
      } else {
        throw new Error('Response status is not 1');
      }
    } catch (error) {
      console.error('Error in :', error);
      throw error;
    }
  },
  
  async getstatusParcelData(id: string , parcel_status: any): Promise<any> {
   
    
    try {
      const response: AxiosResponse = await axios.post(baseURL + '/parcel/update_parcel_status', {
        parcel_id: id,
        parcel_status:parcel_status,
        headers: {
          'Accept': 'application/json',
        },
      });

      if (response.data.status === '1') {
        return response.data;
      } else {
        throw new Error('Response status is not 1');
      }
    } catch (error) {
      console.error('Error in :', error);
      throw error;
    }
  },
}

