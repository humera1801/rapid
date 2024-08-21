// api.ts (or wherever you handle API calls)
import axios from 'axios';

const getUserProfile = async (userId: number) => {
  try {
    const response = await axios.post('http://192.168.0.100:3001/auth/user_profile_detail', {
      user_id: userId.toString(), // Assuming userId is the e_id obtained after login
    });

    if (response.data.status === '1') {
      
      return response.data.data[0];
     
       // Return user profile data if successful
    } 
    else {
      throw new Error(response.data.message);
    }
  } catch (error) {
    console.error('Failed to fetch user profile:', error);
    throw error;
  }
};

export default getUserProfile;
