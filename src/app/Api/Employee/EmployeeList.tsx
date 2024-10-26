import axios, { AxiosResponse } from 'axios';

// Dev URL
const baseURL = 'http://192.168.0.105:3001';



export default {
  async GetEmpList(): Promise<any>{
    try {
      const response: AxiosResponse = await axios.get(baseURL + '/employee/get_employee_list', {
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
      console.error('Error in getAllStateListApi:', error);
      throw error;
    }
  },


  async GetEmpId(id: string): Promise<any> {
    try {
      const response: AxiosResponse = await axios.post(baseURL + '/employee/get_employee_details', {
        e_id: id,
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
      console.error('Error in emp:', error);
      throw error;
    }
  },


  async GetRoleId(id: string): Promise<any> {
    try {
      const response: AxiosResponse = await axios.post(baseURL + '/employee/get_role_employee', {
        e_id: id,
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
      console.error('Error in emp:', error);
      throw error;
    }
  },

}