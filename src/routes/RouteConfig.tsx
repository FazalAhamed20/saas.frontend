import  { lazy } from 'react';
import { Route, Routes } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import PrivateRoute from './PrivateRoute';
import PublicRoute from './PublicRoute';



const SignupPage = lazy(() => import('../pages/SignupPage'));
const LoginPage = lazy(() => import('../pages/LoginPage'));

const RouteConfig = () => {
  return (
    <Routes>
     <Route path="/" element={<PublicRoute element={<SignupPage />} />} />
     <Route path="/login" element={<PublicRoute element={<LoginPage />} />} />
      
      <Route path="/home" element={<PrivateRoute element={<HomePage />} />} />
     
    
    </Routes>
  );
};

export default RouteConfig;
