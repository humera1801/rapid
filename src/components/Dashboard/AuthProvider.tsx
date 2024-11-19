
import { useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

interface AuthProviderProps {
  children: ReactNode;
}

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {

  const router = useRouter();
  const userData = localStorage.getItem('userData');

  useEffect(() => {
    if (!userData) {

      router.push('/');

    }

  }, []);

  return <>{children}</>;
};

export default AuthProvider;
