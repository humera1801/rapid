// hoc/withRoleProtection.js
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const withRoleProtection = (WrappedComponent:any, requiredRole:any) => {
  return (props:any) => {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [hasAccess, setHasAccess] = useState(false);

    useEffect(() => {
      const storedData = localStorage.getItem('userData');
      if (storedData) {
        const userData = JSON.parse(storedData);
        const userRoles = userData.roles || []; // Ensure roles exist

        if (userRoles.includes(requiredRole)) {
          setHasAccess(true);
        } else {
          router.push('/403'); // Redirect to a "Forbidden" page
        }
      } else {
        router.push('/403'); // Redirect if no user data is found
      }

      setLoading(false);
    }, [requiredRole, router]);

    if (loading) {
      return <div>Loading...</div>; // Loading state
    }

    return hasAccess ? <WrappedComponent {...props} /> : null;
  };
};

export default withRoleProtection;
