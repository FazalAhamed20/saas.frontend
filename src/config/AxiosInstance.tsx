// src/config/AxiosInstance.ts
import axios, {
    AxiosInstance,
    InternalAxiosRequestConfig,
    AxiosResponse,
    AxiosError,
  } from 'axios';
  
  
  interface ErrorResponse {
    message: string;
  }
  
   const Url = import.meta.env.VITE_BASE_URL as string 

  console.log('Base URL:', Url);
  
  const createAxiosInstance = (baseURL: string): AxiosInstance => {
    const instance = axios.create({
      baseURL,
      withCredentials: true,
    });
  
    instance.interceptors.request.use(
      (request: InternalAxiosRequestConfig) => {
       
        return request;
      },
      (error: AxiosError) => {
        
        return Promise.reject(error);
      }
    );
  
    instance.interceptors.response.use(
      (response: AxiosResponse) => {
        
        return response;
      },
      async (error: AxiosError<ErrorResponse>) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & {
          _retry?: boolean;
        };
  
        if (error.response?.status === 500) {
          console.error('Internal Server Error (500):', error.response.data.message);
          return Promise.reject(error);
        }
  
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          
        }
  
        return Promise.reject(error);
      }
    );
  
    return instance;
  };
  
  const baseAxios = createAxiosInstance(Url);
  
  export default baseAxios;