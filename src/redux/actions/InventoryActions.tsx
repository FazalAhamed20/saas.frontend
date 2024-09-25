import { createAsyncThunk } from '@reduxjs/toolkit';

import baseAxios from '../../config/AxiosInstance';



  export type AddItem = {
    id?: string;
    name: string;
    description: string;
    quantity?: Number;
  };
  export type AddProduct = {
    id?: string;
    name: string;
    category: string;
    image: string;
  };



  export const addItem = createAsyncThunk(
    'inventory/addItem',
    async (data:AddItem, { rejectWithValue }) => {
      try {
        console.log(data);
        
        const response = await baseAxios.post('/add-item', data,);
        return response.data; 
      } catch (error: any) {
        console.log(error);
        
        return rejectWithValue(error.response.data); 
      }
    }
  );
  export const fetchAllItem = createAsyncThunk(
    'inventory/fetchAllProducts',
    async (data:any, { rejectWithValue }) => {
      try {
        console.log(data);
        
       
        
        const response = await baseAxios.post('/fetchAll-items',data);
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

  export const addProduct = createAsyncThunk(
    'inventory/add-product',
    async (data:any, { rejectWithValue }) => {
      try {
        console.log(data);
        
       
        
        const response = await baseAxios.post('/add-product',data);
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

  

  export const fetchItem = createAsyncThunk(
    'inventory/fetchItem',
    async (__, { rejectWithValue }) => {
      try {
       
        
        const response = await baseAxios.get('/fetchAll-categories');
        return response.data; 
      } catch (error: any) {
        return rejectWithValue(error.response.data); 
      }
    }
  );

  export const deleteProduct = createAsyncThunk(
    "inventory/deleteProduct",
    async (productId: string, { rejectWithValue }) => {
        try {
            const response = await baseAxios.delete(`/delete-products/${productId}`);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response.data);
        }
    }
);