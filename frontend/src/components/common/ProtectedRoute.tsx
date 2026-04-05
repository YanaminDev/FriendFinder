import { ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../zustand/useAuthStore';

interface ProtectedRouteProps {
  children: ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const navigate = useNavigate();
  const { isAuthenticated, checkAuth } = useAuthStore();

  useEffect(() => {
    // Check if user is logged in from localStorage
    checkAuth();
    
    // If not authenticated, redirect to login
    if (!isAuthenticated) {
      navigate('/login', { replace: true });
    }
  }, [isAuthenticated, navigate, checkAuth]);

  if (!isAuthenticated) {
    return null; // Or return a loading spinner
  }

  return <>{children}</>;
};
