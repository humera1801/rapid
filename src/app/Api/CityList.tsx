import axios, { AxiosResponse } from 'axios';

// Dev URL
const baseURL = 'http://192.168.0.105:3001';

interface StateListResponse {
  status: string;
  data: any; // You might want to replace 'any' with the actual type of your data
}

export default {
  async getStateCityList(stateId: string): Promise<StateListResponse> {
    try {
      const response: AxiosResponse<StateListResponse> = await axios.post<StateListResponse>(baseURL + '/ticket/get_state_city_list', {
        state_id: stateId,
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
      console.error('Error in getAllStateListApi:', error);
      throw error;
    }
  },
}

