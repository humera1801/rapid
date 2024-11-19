import axios, { AxiosResponse } from 'axios';
import { baseURL } from '../FireApis/BrandApi/DeleteBrand';


export default {
    async getCabFilterdate(startdate?: string, enddate?: string): Promise<any> {

        try {
            const response: AxiosResponse = await axios.post(baseURL + '/cabbooking/get_cab_booking_list', {
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

    async GetcabBookingId(id: string ): Promise<any> {
        try {
          const response: AxiosResponse = await axios.post(baseURL + '/cabbooking/get_single_cab_booking_details', {
            cb_id: id,
            
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
//------------------------------------------------------------------------------------------------------------------------------
      async getVehicleList(): Promise<any> {
        try {
          const response: AxiosResponse = await axios.get(baseURL + '/cabbooking/get_vehicle_list', {
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
          console.error('Error in getVehicleList:', error);
          throw error;
        }
      },

      async getVehicleIdData(id: string): Promise<any> {
        try {
          const response: AxiosResponse = await axios.post(baseURL + '/cabbooking/get_vehicle_data', {
            v_id: id,
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
          console.error('Error in getVehicleIdData:', error);
          throw error;
        }
      },
      
      async deleteVehicle(id: string): Promise<any> {
        try {
          const response: AxiosResponse = await axios.post(baseURL + '/cabbooking/delete_vehicle_data', {
            v_id: id,
          }, {
            headers: {
              'Accept': 'application/json',
             
            },
          });
    
        

        console.log("data",response.data);
        
        } catch (error) {
          console.error('Error in delete Vehicle:', error);
          throw error;
        }
      },


//--------------------------------------------------------------------------------------------------------------------------
      async getvendorList(): Promise<any> {
        try {
          const response: AxiosResponse = await axios.get(baseURL + '/vendor/get_vendor_list', {
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
          console.error('Error in getvendorList:', error);
          throw error;
        }
      },

      async getvendorIdData(id: string): Promise<any> {
        try {
          const response: AxiosResponse = await axios.post(baseURL + '/vendor/get_vendor_details', {
            id: id,
          }, {
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
          console.error('Error in getVehicleIdData:', error);
          throw error;
        }
      },
      
      async deleteVendor(id: string): Promise<any> {
        try {
          const response: AxiosResponse = await axios.post(baseURL + '/vendor/delete_vendor', {
            id: id,
          }, {
            headers: {
              'Accept': 'application/json',
             
            },
          });
    
        

        console.log("data",response.data);
        
        } catch (error) {
          console.error('Error in delete Vehicle:', error);
          throw error;
        }
      },

};
