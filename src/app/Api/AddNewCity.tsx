import axios, { AxiosResponse } from 'axios';

const baseURL = 'http://192.168.0.106:3001';

interface StateListResponse {
  status: string;
  data: any; 
}

export default {
  async addNewCity(stateId: string): Promise<StateListResponse> {
    try {
      const response: AxiosResponse<StateListResponse> = await axios.post<StateListResponse>(baseURL + '/ticket/add_new_city_from_state', {
        state_id: stateId,
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
      console.error('Error in getAllStateListApi:', error);
      throw error;
    }
  },
}


// const api = {
//   async addNewCity(stateId: string): Promise<StateListResponse> {
//     try {
//       const response: AxiosResponse<StateListResponse> = await axios.post<StateListResponse>(baseURL + '/ticket/add_new_city_from_state', {
//         state_id: stateId,
//         headers: {
//           'Accept': 'application/json',
//         },
//       });

//       if (response.data.status === '1') {
//         return response.data;
//       } else {
//         throw new Error('Response status is not 1');
//       }
//     } catch (error) {
//       console.error('Error in getAllStateListApi:', error);
//       throw error;
//     }
//   },
// };

// // Export the api object as default
// export default api;
