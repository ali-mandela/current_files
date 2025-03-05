import { Navigate, Outlet  } from 'react-router-dom';
import { useEffect } from 'react';

export const ProtectedRoute = ({ children }) => { 
  const token = JSON.parse(localStorage.getItem('token'));

  useEffect(() => {
    if (!token) { 
      console.log("No token found, redirecting...");
    }
  }, [token]);

  if (!token) {
    return <Navigate to="/login" />;  
  }
 
  return children ? children : <Outlet />;
};
