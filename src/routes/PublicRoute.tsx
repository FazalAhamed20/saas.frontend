import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';

interface PublicRouteProps {
  element: React.ReactElement;
}

const PublicRoute: React.FC<PublicRouteProps> = ({ element }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await axios.get('https://saasbackend-production.up.railway.app/api/authenticate', { withCredentials: true });
        console.log(response.data);
        
        setIsAuthenticated(response.data.isAuthenticated);
      } catch (error) {
        setIsAuthenticated(false);
      }
    };

    checkAuthStatus();
  }, []);

  if (isAuthenticated === null) {
  
    return <div>Loading...</div>;
  }

  if (isAuthenticated) {
    return <Navigate to='/dashboard' />;
  }

  return element;
};

export default PublicRoute;