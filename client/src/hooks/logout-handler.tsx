import react from 'react';
import { useLocation } from 'wouter';

const useLogoutHandler = () => {
  const [, setLocation] = useLocation();
  const [error, setError] = react.useState<string | null>(null);

  const logout = async () => {
    setError(null);
    try {
      const res = await fetch('/api/user/logout', {
        method: 'POST',
        credentials: 'include',
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || 'Logout failed');
        return false;
      }
      setLocation('/auth');
      return true;
    } catch (_err) {
      setError('Network error');
      return false;
    }
  };

  return { logout, error };
};

export default useLogoutHandler;
