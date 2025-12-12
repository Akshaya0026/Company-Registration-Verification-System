import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:3000/api/companies';

// Config
const getConfig = (token) => ({
  headers: { Authorization: `Bearer ${token}` }
});

// Register/Update Company
export const registerCompany = createAsyncThunk(
  'company/register',
  async (companyData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token;
      const response = await axios.post(`${API_URL}/`, companyData, getConfig(token));
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

// Upload Logo
export const uploadLogo = createAsyncThunk(
  'company/uploadLogo',
  async (file, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token;
      const formData = new FormData();
      formData.append('logo', file);

      const response = await axios.post(`${API_URL}/logo`, formData, getConfig(token));
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

// Get My Company
export const getMyCompany = createAsyncThunk(
  'company/getMyCompany',
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token;
      const response = await axios.get(`${API_URL}/me`, getConfig(token));
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

const initialState = {
  company: null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
};

export const companySlice = createSlice({
  name: 'company',
  initialState,
  reducers: {
    resetCompanyState: (state) => {
      state.isError = false;
      state.isSuccess = false;
      state.isLoading = false;
      state.message = '';
    }
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(registerCompany.pending, (state) => { state.isLoading = true; })
      .addCase(registerCompany.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.company = action.payload.company;
      })
      .addCase(registerCompany.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload?.message || action.payload?.error || 'Error occurred';
      })
      // Upload Logo
      .addCase(uploadLogo.pending, (state) => { state.isLoading = true; })
      .addCase(uploadLogo.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.company = action.payload.company;
      })
      // Get Company
      .addCase(getMyCompany.fulfilled, (state, action) => {
        state.company = action.payload; // might be message if not found, but controller returns object usually
      });
  }
});

export const { resetCompanyState } = companySlice.actions;
export default companySlice.reducer;
