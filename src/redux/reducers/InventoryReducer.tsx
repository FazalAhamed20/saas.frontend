import {
    addItem,
    updateItem
 
  } from '../actions/InventoryActions';
  import { createSlice ,PayloadAction } from '@reduxjs/toolkit';
  import { toast } from 'react-toastify';



  interface InventorySatate {
    data: any; 
    loading: boolean;
    error: string | null;
    message:string | null
  }
  const initialState: InventorySatate = {
    data: null,
    loading: false,
    error: null,
    message:null
  };

  const inventorySlice = createSlice({
    name: 'inventory',
    initialState,
    reducers: {
     
    },
    extraReducers: (builder) => {
      builder
        
        
          .addCase(addItem.pending, (state) => {
            state.loading = true;
            state.error = null;
          })
          .addCase(addItem.fulfilled, (state,action: PayloadAction<any>) => {
            state.loading = false;
            state.data = null
            console.log(action.payload?.message);
            
          
          
            state.error = null;
          })
          .addCase(addItem.rejected, (state, action: PayloadAction<any>) => {
            state.loading = false;
            state.error = action.payload?.message;
            toast.error(state.error)
            console.log(state.error);
            
            
          })
          .addCase(updateItem.pending, (state) => {
            state.loading = true;
            state.error = null;
          })
          .addCase(updateItem.fulfilled, (state,action: PayloadAction<any>) => {
            state.loading = false;
            state.data = null
            console.log(action.payload?.message);
            
          
          
            state.error = null;
          })
          .addCase(updateItem.rejected, (state, action: PayloadAction<any>) => {
            state.loading = false;
            state.error = action.payload?.message;
            toast.error(state.error)
            console.log(state.error);
            
            
          })
          
    },
});
export const inventoryReducer = inventorySlice.reducer;