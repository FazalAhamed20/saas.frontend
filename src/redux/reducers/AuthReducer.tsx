import {
    SignUp,
    Verify,
    login,
    logout
 
  } from '../actions/AuthActions';
  import { createSlice ,PayloadAction } from '@reduxjs/toolkit';
  import { toast } from 'react-toastify';



  interface AuthState {
    user: any; 
    loading: boolean;
    error: string | null;
    message:string | null
  }
  const initialState: AuthState = {
    user: null,
    loading: false,
    error: null,
    message:null
  };

  const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
     
    },
    extraReducers: (builder) => {
      builder
        .addCase(SignUp.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(SignUp.fulfilled, (state, action: PayloadAction<any>) => {
          state.loading = false;
          state.user = action.payload;
          console.log(state.user);
          
        
          state.error = null;
        })
        .addCase(SignUp.rejected, (state, action: PayloadAction<any>) => {
          state.loading = false;
          state.error = action.payload?.message;
          toast.error(state.error)
          console.log(state.error);
          
          
        })
        .addCase(Verify.pending, (state) => {
            state.loading = true;
            state.error = null;
          })
          .addCase(Verify.fulfilled, (state, action: PayloadAction<any>) => {
            state.loading = false;
            state.user = action.payload;
          
            state.error = null;
          })
          .addCase(Verify.rejected, (state, action: PayloadAction<any>) => {
            state.loading = false;
            state.error = action.payload?.message;
            toast.error(state.error)
            console.log(state.error);
            
            
          })
          .addCase(login.pending, (state) => {
            state.loading = true;
            state.error = null;
          })
          .addCase(login.fulfilled, (state, action: PayloadAction<any>) => {
            state.loading = false;
            state.user = action.payload;
            console.log(action);
            
          
            state.error = null;
          })
          .addCase(login.rejected, (state, action: PayloadAction<any>) => {
            state.loading = false;
            state.error = action.payload?.message;
            toast.error(state.error)
            console.log(state.error);
            
            
          })
          .addCase(logout.pending, (state) => {
            state.loading = true;
            state.error = null;
          })
          .addCase(logout.fulfilled, (state) => {
            state.loading = false;
            state.user = null
          
          
            state.error = null;
          })
          .addCase(logout.rejected, (state, action: PayloadAction<any>) => {
            state.loading = false;
            state.error = action.payload?.message;
            toast.error(state.error)
            console.log(state.error);
            
            
          })
    },
});
export const authReducer = authSlice.reducer;