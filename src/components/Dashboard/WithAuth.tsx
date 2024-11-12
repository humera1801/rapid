import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const withRoleProtection = (WrappedComponent: any, requiredRole: any) => {
  const WithRoleProtection = (props: any) => {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [hasAccess, setHasAccess] = useState(false);

    useEffect(() => {
      const storedData = localStorage.getItem('userData');
      if (storedData) {
        const userData = JSON.parse(storedData);
        const userRoles = userData.roles || []; 

        if (userRoles.includes(requiredRole)) {
          setHasAccess(true);
        } else {
          router.push('/403'); 
        }
      } else {
        router.push('/403'); 
      }

      setLoading(false);
    }, [router]);

    if (loading) {
      return <div>Loading...</div>;
    }

    return hasAccess ? <WrappedComponent {...props} /> : null;
  };

  WithRoleProtection.displayName = `WithRoleProtection(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;

  return WithRoleProtection;
};

export default withRoleProtection;
