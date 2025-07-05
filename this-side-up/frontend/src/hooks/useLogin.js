import { useState } from 'react';
import { useAuthContext } from './useAuthContext';

export const useLogin = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuthContext();

  const loginUser = async (email, password) => {
    setIsLoading(true);
    setError(null);

    const res = await fetch('/api/user/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    let data;
    try {
      data = await res.json();
    } catch (err) {
      const text = await res.text();
      console.error('Non-JSON response:', text);
      setError('Server error. Check console.');
      setIsLoading(false);
      return;
    }

    if (!res.ok) {
      setError(data.error);
    } else {
      login(data.user, data.token);
    }

    setIsLoading(false);
  };

  return { loginUser, isLoading, error };
};
