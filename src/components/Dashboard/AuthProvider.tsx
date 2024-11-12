
import { useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

interface AuthProviderProps {
  children: ReactNode;
}

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {

    const router = useRouter();

  useEffect(() => {
    const userData = localStorage.getItem('userData');
    if (!userData) {
     
      router.push('/');
    
    }
   
  }, []);

  return <>{children}</>;
};

export default AuthProvider;
