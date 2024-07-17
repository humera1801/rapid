import axios, { AxiosResponse } from 'axios';

// Dev URL
const baseURL = 'http://192.168.0.111:3001';

interface FireListResponse {
  status: number;
  message: string;
  data: any[]; // You can define a more specific type for 'data' based on your API response structure
}

export default {
  async getclientListData(value: string): Promise<any> {
    try {
      const response: AxiosResponse<FireListResponse> = await axios.get(
        `${baseURL}/booking/get_all_client_data_autocomplete`,
        {
          params: {
            search: value  // Pass the 'value' as a query parameter named 'search'
          },
          headers: {
            'Accept': 'application/json',
            // 'Content-Type': 'application/json', // You typically don't need to set Content-Type for GET requests
          },
        }
      );

      if (response.data.status === 1) {
        return response.data.data; // Return the 'data' array from the response
      } else {
        throw new Error(response.data.message); // Throw an error with the API message
      }
    } catch (error) {
      console.error('Error in data fetch:', error);
      throw error; // Rethrow the error to propagate it up the call stack
    }
  },
};
