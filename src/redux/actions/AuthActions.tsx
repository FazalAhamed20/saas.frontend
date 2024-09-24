import { createAsyncThunk } from '@reduxjs/toolkit';
import { handleErrors } from '../../helper/HandleErrors';
import baseAxios from '../../config/AxiosInstance';


interface VerifyResponse {
    success: any;
    data: string;
    message: string;
    status?: number;
    isAdmin?: boolean;
    
  }
  interface ErrorPayload {
    message: string;
    status?: number;
    success?: boolean;
    data?: string;
  }
  export type Signup = {
    name?: string;
    email: string;
    password: string;
    otp?: string;
  };
  export type AddItem = {
    id?: string;
    name: string;
    description: string;
    quantity?: Number;
  };


export const SignUp = createAsyncThunk<
  VerifyResponse,
  String,
  { rejectValue: ErrorPayload }
>('user/userSignup', async (userData: String, { rejectWithValue }) => {
  try {
    (userData);

    const { data } = await baseAxios.post<VerifyResponse>('/signup', {
      email: userData,
    });
    

    return data;
  } catch (error: any) {
    (error);

    return rejectWithValue(handleErrors(error));
  }
});

export const Verify = createAsyncThunk<
  VerifyResponse,
  Signup,
  { rejectValue: ErrorPayload }
>('user/userVerify', async (userData: Signup, { rejectWithValue }) => {
  

  try {
    const { data } = await baseAxios.post<VerifyResponse>('/verify', userData);
    return data;
  } catch (error) {
    return rejectWithValue(handleErrors(error));
  }
});

export const login = createAsyncThunk(
    'auth/login',
    async (data:Signup, { rejectWithValue }) => {
      try {
        console.log(data);
        
        const response = await baseAxios.post('/login', data,);
        return response.data; 
      } catch (error: any) {
        return rejectWithValue(error.response.data); 
      }
    }
  );
  export const logout = createAsyncThunk(
    'auth/logout',
    async (_, { rejectWithValue }) => {
      try {
     
        console.log(baseAxios);
        
        const response = await baseAxios.post('/logout');
        return response.data; 
      } catch (error: any) {
        return rejectWithValue(error.response.data); 
      }
    }
  );

  