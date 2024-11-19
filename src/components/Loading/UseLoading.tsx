import { useState, useEffect } from 'react';

const useLoading = (initialState = true, delay = 1000) => {
  const [loading, setLoading] = useState(initialState);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  return loading;
};

export default useLoading;
