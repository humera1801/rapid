// hooks/useUser.ts
import { useEffect, useState } from 'react';
import getUserProfile from '@/app/Api/UserProfile';
import axios from 'axios';

const useUser = () => {
  const [userName, setUserName] = useState('');
  const [userRoles, setUserRoles] = useState<string[]>([]);

  useEffect(() => {
    const storedData = localStorage.getItem('userData');
    if (storedData) {
      const e_id = parseInt(storedData, 10);
      getUserProfile(e_id)
        .then((userData) => {
          setUserName(userData.e_name);
          return axios.post('http://192.168.0.105:3001/employee/get_role_employee', { e_id });
        })
        .then((roleResponse) => {
          const rolesData = roleResponse.data.data;
          if (rolesData && rolesData.length > 0) {
                        const roles = rolesData[0].e_task;

            setUserRoles(rolesData[0].e_task);
            localStorage.setItem('userData', JSON.stringify({ ...JSON.parse(storedData), roles }));

          }
        })
        .catch((error) => {
          console.error('Failed to fetch user profile or roles:', error);
        });
    }
  }, []);

  return { userName, userRoles };
};

export default useUser;
