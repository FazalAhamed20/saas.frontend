import { createAsyncThunk } from '@reduxjs/toolkit';

import baseAxios from '../../config/AxiosInstance';



  export type AddItem = {
    id?: string;
    name: string;
    description: string;
    quantity?: Number;
  };



  export const addItem = createAsyncThunk(
    'inventory/addItem',
    async (data:AddItem, { rejectWithValue }) => {
      try {
        console.log(data);
        
        const response = await baseAxios.post('/add-item', data,);
        return response.data; 
      } catch (error: any) {
        return rejectWithValue(error.response.data); 
      }
    }
  );
  export const fetchAllProducts = createAsyncThunk(
    'inventory/fetchAllProducts',
    async (__, { rejectWithValue }) => {
      try {
       
        
        const response = await baseAxios.get('/fetchAll-products');
        return response.data; 
      } catch (error: any) {
        return rejectWithValue(error.response.data); 
      }
    }
  );

  export const updateItem = createAsyncThunk(
    'inventory/editedItem',
    async (data:AddItem, { rejectWithValue }) => {
      try {
       
        
        const response = await baseAxios.post('/edit-item',data);
        return response.data; 
      } catch (error: any) {
        return rejectWithValue(error.response.data); 
      }
    }
  );

  export const deleteItem = createAsyncThunk(
    'inventory/deleteItem',
    async (data:any, { rejectWithValue }) => {
      try {
        console.log(data);
        
       
        
        const response = await baseAxios.post('/delete-item',data);
        return response.data; 
      } catch (error: any) {
        return rejectWithValue(error.response.data); 
      }
    }
  );