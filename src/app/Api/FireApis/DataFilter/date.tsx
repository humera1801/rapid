import axios, { AxiosResponse } from 'axios';
import { baseURL } from '../BrandApi/DeleteBrand';



export default {
    async getFilterdate(startdate?: string, enddate?: string): Promise<any> {
        try {
            const response: AxiosResponse = await axios.post(baseURL + '/booking/get__date_filter_fire_extingusher_booking_data', {
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
    async getTotalticketbooking(startdate?: string, enddate?: string): Promise<any> {
        try {
            const response: AxiosResponse = await axios.post(baseURL + '/data/date_filter_ticket_data', {
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
    async getTotalfirebooking(startdate?: string, enddate?: string): Promise<any> {
        try {
            const response: AxiosResponse = await axios.post(baseURL + '/data/date_filter_fire_data_number', {
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
    async getTotalparcelbooking(startdate?: string, enddate?: string): Promise<any> {
        try {
            const response: AxiosResponse = await axios.post(baseURL + '/data/date_filter_parcel_data_number', {
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
    async getTotalcabbooking(startdate?: string, enddate?: string): Promise<any> {
        try {
            const response: AxiosResponse = await axios.post(baseURL + '/data/date_filter_cab_data_number', {
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

    async getTotalbookingdetails(startdate?: string, enddate?: string): Promise<any> {
        try {
            const response: AxiosResponse = await axios.post(baseURL + '/data/date_filter_all_booking_number', {
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

    async getPieChartdata(startdate?: string, enddate?: string): Promise<any> {

        try {
            const response: AxiosResponse = await axios.post(baseURL + '/data/get_total_payment', {
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
    async getLineChartdata(): Promise<any> {

        try {
            const response: AxiosResponse = await axios.get(baseURL + '/data/get_monthly_booking_number');

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
};
