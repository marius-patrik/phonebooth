import react from 'react';
import useSWR from 'swr';
import { useLocation } from 'wouter';
import { fetcher } from '../api/fetcher';
import type { UserItem } from '../api/types';

const useAuthHandler = () => {
  const { data: user, error: userError } = useSWR<UserItem>(
    '/api/user',
    fetcher,
  );
  const [_location, setLocation] = useLocation();
  // Redirect to register if not authenticated
  react.useEffect(() => {
    if (userError) {
      setLocation('/auth');
      window.location.reload();
    }
  }, [userError, setLocation]);
  if (userError) {
    return null; // Redirecting to login
  }
  return user;
};

export default useAuthHandler;
