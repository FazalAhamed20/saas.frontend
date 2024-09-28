import  { lazy } from 'react';
import { Route, Routes } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import PrivateRoute from './PrivateRoute';
import PublicRoute from './PublicRoute';
import LangingPage from '../pages/LangingPage';
import ShopKeeperHomePage from '../pages/ShopKeeperHomePage';
import AdminTablePage from '../pages/AdminTablePage';



const SignupPage = lazy(() => import('../pages/SignupPage'));
const LoginPage = lazy(() => import('../pages/LoginPage'));

const RouteConfig = () => {
  return (
    <Routes>
     <Route path="/" element={<PublicRoute element={<LangingPage />} />} />
     <Route path="/signup" element={<PublicRoute element={<SignupPage />} />} />
     <Route path="/login" element={<PublicRoute element={<LoginPage />} />} />
      
      <Route path="/home" element={<PrivateRoute element={<HomePage />} />} />
      <Route path="/dashboard" element={<PrivateRoute element={<ShopKeeperHomePage />} />} />
      <Route path="/admintable" element={<PrivateRoute element={<AdminTablePage />} />} />
     
    
    </Routes>
  );
};

export default RouteConfig;
